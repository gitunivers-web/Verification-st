import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lock, Settings, Shield } from "lucide-react";
import { useNovaLiveStats } from "@/hooks/use-nova-live-stats";

export function NovaAIEngineHome() {
  const { codesAnalyzed, fraudsDetected, todayIncrement, processingPower: serverProcessingPower } = useNovaLiveStats();
  const [processingPower, setProcessingPower] = useState(87);
  const [neuralNodes, setNeuralNodes] = useState([85, 72, 90, 65, 88]);
  const [cryptoStream, setCryptoStream] = useState<string[]>([]);

  // Sync processing power from server
  useEffect(() => {
    setProcessingPower(serverProcessingPower);
  }, [serverProcessingPower]);

  useEffect(() => {
    const powerInterval = setInterval(() => {
      setProcessingPower(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(70, Math.min(98, prev + change));
      });
    }, 1500);

    return () => clearInterval(powerInterval);
  }, []);

  useEffect(() => {
    const nodesInterval = setInterval(() => {
      setNeuralNodes(prev => 
        prev.map(node => {
          const change = (Math.random() - 0.5) * 20;
          return Math.max(40, Math.min(100, node + change));
        })
      );
    }, 800);

    return () => clearInterval(nodesInterval);
  }, []);

  useEffect(() => {
    const generateCryptoLine = () => {
      const types = ['RSA-4096', 'HMAC-512', 'AES-256', 'SHA-384', 'ECDSA-P256'];
      const type = types[Math.floor(Math.random() * types.length)];
      const hash = Array.from({ length: 48 }, () => 
        Math.random().toString(16).charAt(2)
      ).join('');
      return `${type}: ${hash}...`;
    };

    setCryptoStream(Array.from({ length: 4 }, generateCryptoLine));

    const streamInterval = setInterval(() => {
      setCryptoStream(prev => {
        const newStream = [...prev.slice(1), generateCryptoLine()];
        return newStream;
      });
    }, 1200);

    return () => clearInterval(streamInterval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  return (
    <Card className="bg-slate-900/80 border-cyan-500/30 overflow-hidden relative" data-testid="nova-ai-engine-home">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 pointer-events-none" />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-cyan-400 font-bold tracking-wider">
              NOVA_AI_ENGINE v3.7
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono tracking-wider">LIVE ANALYSIS</span>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4" data-testid="stat-codes-analyzed">
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Codes Analyzed</p>
            <p className="text-3xl md:text-4xl font-bold text-white font-mono">
              {formatNumber(codesAnalyzed)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400 font-mono">+{formatNumber(todayIncrement)} today</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4" data-testid="stat-frauds-detected">
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Frauds Detected</p>
            <p className="text-3xl md:text-4xl font-bold text-red-400 font-mono">
              {formatNumber(fraudsDetected)}
            </p>
            <p className="text-sm text-slate-500 font-mono mt-2">99.97% accuracy</p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4" data-testid="neural-network-status">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Neural Network Status</span>
          </div>
          
          <div className="flex items-end justify-between gap-3 mb-4 h-20">
            {neuralNodes.map((node, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm transition-all duration-500"
                  style={{ height: `${node}%` }}
                />
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Processing Power</span>
              <span>{Math.round(processingPower)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${processingPower}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4" data-testid="crypto-validation-stream">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-4 w-4 text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Cryptographic Validation Stream</span>
          </div>
          
          <div className="space-y-1 font-mono text-[10px] md:text-xs text-slate-500 overflow-hidden">
            {cryptoStream.map((line, i) => (
              <div 
                key={i} 
                className={`truncate transition-all duration-300 ${i === 0 ? 'opacity-40' : i === cryptoStream.length - 1 ? 'opacity-100 text-cyan-400' : 'opacity-70'}`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-400 font-mono uppercase tracking-wider">Secure Connection</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">SSL/TLS 1.3 | AES-256-GCM</span>
        </div>
      </CardContent>
    </Card>
  );
}
