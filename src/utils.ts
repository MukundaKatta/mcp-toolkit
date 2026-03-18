// mcp-toolkit — utility functions
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function retry<T>(fn: () => Promise<T>, maxRetries = 3, delayMs = 100): Promise<T> {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await fn();
        return resolve(result);
      } catch (err) {
        if (i === maxRetries - 1) return reject(err);
        await new Promise(r => setTimeout(r, delayMs * Math.pow(2, i)));
      }
    }
  });
}

export function sanitizeInput(input: unknown): string {
  if (typeof input === "string") return input.trim().slice(0, 10000);
  if (input === null || input === undefined) return "";
  return JSON.stringify(input).slice(0, 10000);
}

export function elapsed(startMs: number): number {
  return Math.round((Date.now() - startMs) * 100) / 100;
}

export class SimpleCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();

  set(key: string, value: T, ttlMs = 60000): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  clear(): void { this.cache.clear(); }
  get size(): number { return this.cache.size; }
}
