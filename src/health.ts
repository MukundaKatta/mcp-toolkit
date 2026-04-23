// mcp-toolkit — health check and metrics
import { VERSION } from "./core.js";

export interface HealthStatus {
  service: string;
  status: "ok" | "degraded" | "down";
  version: string;
  uptime: number;
  metrics: Record<string, number>;
}

const startTime = Date.now();

export function getHealth(metrics: Record<string, number> = {}): HealthStatus {
  return {
    service: "mcp-toolkit",
    status: "ok",
    version: VERSION,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    metrics,
  };
}
