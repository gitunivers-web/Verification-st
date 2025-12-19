import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { NovaStats } from "@shared/schema";

const WS_RECONNECT_DELAY = 3000;

export function useNovaLiveStats() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  const { data: stats, isLoading } = useQuery<NovaStats>({
    queryKey: ["/api/nova/stats"],
    refetchInterval: false,
    staleTime: Infinity,
  });

  const connectWebSocket = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("[NOVA WS] Connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "nova_state") {
          queryClient.setQueryData(["/api/nova/stats"], message.data);
        }
      } catch (e) {
        console.error("[NOVA WS] Parse error:", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("[NOVA WS] Disconnected, reconnecting...");
      setTimeout(connectWebSocket, WS_RECONNECT_DELAY);
    };

    ws.onerror = (error) => {
      console.error("[NOVA WS] Error:", error);
      ws.close();
    };

    return ws;
  }, [queryClient]);

  useEffect(() => {
    const ws = connectWebSocket();
    return () => {
      ws.close();
    };
  }, [connectWebSocket]);

  return {
    codesAnalyzed: stats?.codesAnalyzed ?? 47832,
    fraudsDetected: stats?.fraudsDetected ?? 847,
    todayIncrement: stats?.todayIncrement ?? 0,
    processingPower: stats?.processingPower ?? 87,
    isLoading,
    isConnected,
  };
}
