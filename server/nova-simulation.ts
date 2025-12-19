import { storage } from "./storage";
import type { NovaStats } from "@shared/schema";

type BroadcastFn = (type: string, payload: unknown) => void;

export class NovaSimulationService {
  private intervalId: NodeJS.Timeout | null = null;
  private broadcast: BroadcastFn | null = null;
  private codeCounter: number = 0;
  private nextFraudThreshold: number = this.getRandomThreshold();
  private pendingFrauds: number = 0;
  private ticksSinceLastFraudEmit: number = 0;

  constructor() {
    console.log("[NOVA] Simulation service initialized");
  }

  private getRandomThreshold(): number {
    return Math.floor(Math.random() * 6) + 10;
  }

  private getRandomFraudBatch(): number {
    return Math.floor(Math.random() * 3) + 1;
  }

  private getRandomIncrement(): number {
    // Always increment by 1 for realism
    return 1;
  }

  private getRandomInterval(): number {
    // 45-75 seconds between each code analysis (realistic pace)
    return Math.floor(Math.random() * 30001) + 45000;
  }

  private getRandomProcessingPower(): number {
    return Math.floor(Math.random() * 21) + 80;
  }

  setBroadcast(broadcastFn: BroadcastFn) {
    this.broadcast = broadcastFn;
  }

  start() {
    if (this.intervalId) return;

    console.log("[NOVA] Starting simulation loop");
    this.tick();
  }

  private tick() {
    const stats = storage.getNovaStats();
    const increment = this.getRandomIncrement();
    
    let newCodesAnalyzed = stats.codesAnalyzed + increment;
    let newTodayIncrement = stats.todayIncrement + increment;
    let newFraudsDetected = stats.fraudsDetected;
    
    this.codeCounter += increment;
    
    if (this.codeCounter >= this.nextFraudThreshold && this.pendingFrauds === 0) {
      this.pendingFrauds = this.getRandomFraudBatch();
      this.codeCounter = this.codeCounter - this.nextFraudThreshold;
      this.nextFraudThreshold = this.getRandomThreshold();
      newFraudsDetected += 1;
      this.pendingFrauds -= 1;
      this.ticksSinceLastFraudEmit = 0;
    } else if (this.pendingFrauds > 0) {
      this.ticksSinceLastFraudEmit++;
      if (this.ticksSinceLastFraudEmit >= 2) {
        newFraudsDetected += 1;
        this.pendingFrauds -= 1;
        this.ticksSinceLastFraudEmit = 0;
      }
    }
    
    const newProcessingPower = this.getRandomProcessingPower();
    
    const updatedStats = storage.updateNovaStats({
      codesAnalyzed: newCodesAnalyzed,
      fraudsDetected: newFraudsDetected,
      todayIncrement: newTodayIncrement,
      processingPower: newProcessingPower,
    });
    
    if (this.broadcast) {
      this.broadcast("nova_state", updatedStats);
    }
    
    this.intervalId = setTimeout(() => this.tick(), this.getRandomInterval());
  }

  stop() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
      console.log("[NOVA] Simulation stopped");
    }
  }

  getStats(): NovaStats {
    return storage.getNovaStats();
  }
}

export const novaSimulation = new NovaSimulationService();
