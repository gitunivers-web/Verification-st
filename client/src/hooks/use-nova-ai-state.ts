import { useState, useEffect } from "react";

export interface NovaAIState {
  codesAnalyzed: number;
  fraudsDetected: number;
  todayIncrement: number;
  lastResetDate: string;
}

const STORAGE_KEY = "nova_ai_engine_state";
const DEFAULT_CODES = 10000;
const DEFAULT_FRAUDS = 800;

export function useNovaAIState(initialCodes = DEFAULT_CODES, initialFrauds = DEFAULT_FRAUDS) {
  const [codesAnalyzed, setCodesAnalyzed] = useState(initialCodes);
  const [fraudsDetected, setFraudsDetected] = useState(initialFrauds);
  const [todayIncrement, setTodayIncrement] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: NovaAIState = JSON.parse(stored);
        const today = new Date().toDateString();
        
        // If it's a new day, reset todayIncrement but keep other values
        if (data.lastResetDate !== today) {
          setCodesAnalyzed(data.codesAnalyzed);
          setFraudsDetected(data.fraudsDetected);
          setTodayIncrement(0);
          
          // Save the new reset date
          const newState: NovaAIState = {
            codesAnalyzed: data.codesAnalyzed,
            fraudsDetected: data.fraudsDetected,
            todayIncrement: 0,
            lastResetDate: today,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        } else {
          // Same day, restore everything
          setCodesAnalyzed(data.codesAnalyzed);
          setFraudsDetected(data.fraudsDetected);
          setTodayIncrement(data.todayIncrement);
        }
      }
    } catch (error) {
      console.error("Failed to load Nova AI state:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      const state: NovaAIState = {
        codesAnalyzed,
        fraudsDetected,
        todayIncrement,
        lastResetDate: new Date().toDateString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save Nova AI state:", error);
    }
  }, [codesAnalyzed, fraudsDetected, todayIncrement, isLoaded]);

  return {
    codesAnalyzed,
    setCodesAnalyzed,
    fraudsDetected,
    setFraudsDetected,
    todayIncrement,
    setTodayIncrement,
    isLoaded,
  };
}
