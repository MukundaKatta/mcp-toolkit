// mcp-toolkit — health check and metrics
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
    version: "0.1.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    metrics,
  };
}
