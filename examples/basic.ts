// Basic usage example for mcp-toolkit
import { McpToolkit } from "../src/core.js";

async function main() {
  const instance = new McpToolkit({ verbose: true });

  console.log("=== mcp-toolkit Example ===\n");

  // Run primary operation
  const result = await instance.generate({ input: "example data", mode: "demo" });
  console.log("Result:", JSON.stringify(result, null, 2));

  // Run multiple operations
  const ops = ["generate", "create", "validate];
  for (const op of ops) {
    const r = await (instance as any)[op]({ source: "example" });
    console.log(`${op}:`, r.ok ? "✓" : "✗");
  }

  // Check stats
  console.log("\nStats:", JSON.stringify(instance.getStats(), null, 2));
}

main().catch(console.error);
