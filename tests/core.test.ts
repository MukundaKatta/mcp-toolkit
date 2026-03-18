import { describe, it, expect } from "vitest";
import { McpToolkit } from "../src/core.js";
describe("McpToolkit", () => {
  it("init", () => { expect(new McpToolkit().getStats().ops).toBe(0); });
  it("op", async () => { const c = new McpToolkit(); await c.generate(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new McpToolkit(); await c.generate(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
