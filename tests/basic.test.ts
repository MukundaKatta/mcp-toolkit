import { describe, it, expect } from "vitest";
import { process, batchProcess, getStatus, VERSION } from "../src/index.js";

describe("mcp-toolkit", () => {
  it("has correct version", () => {
    expect(VERSION).toBe("0.1.0");
  });

  it("processes input", async () => {
    const result = await process("test input data");
    expect(result.success).toBe(true);
    expect(result.data.processed).toBe(true);
    expect(result.data.wordCount).toBe(3);
    expect(result.data.inputLength).toBe(15);
  });

  it("handles empty input", async () => {
    const result = await process("");
    expect(result.success).toBe(true);
    expect(result.data.wordCount).toBe(0);
  });

  it("applies options", async () => {
    const result = await process("test", { verbose: true, format: "json" });
    expect(result.data.optionsApplied).toContain("verbose");
    expect(result.data.optionsApplied).toContain("format");
  });

  it("batch processes", async () => {
    const results = await batchProcess(["one", "two", "three"]);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.success)).toBe(true);
  });

  it("returns status", () => {
    const status = getStatus();
    expect(status.ready).toBe(true);
    expect(status.version).toBe("0.1.0");
  });

  it("has processing time", async () => {
    const result = await process("timing test");
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
  });
});
