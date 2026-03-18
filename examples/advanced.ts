// Advanced usage with configuration and error handling
import { McpToolkit } from "../src/core.js";

async function main() {
  // Custom configuration
  const instance = new McpToolkit({
    timeout: 30000,
    retries: 3,
    debug: true,
    outputFormat: "json",
  });

  console.log("=== Advanced mcp-toolkit Example ===\n");

  // Batch processing
  const inputs = ["data_1", "data_2", "data_3", "data_4", "data_5"];
  const results = await Promise.all(
    inputs.map((input, i) => instance.generate({ input, index: i }))
  );

  console.log(`Processed ${results.length} items`);
  console.log(`Success rate: ${results.filter(r => r.ok).length}/${results.length}`);

  // Performance measurement
  const start = Date.now();
  for (let i = 0; i < 100; i++) {
    await instance.generate({ iteration: i });
  }
  const elapsed = Date.now() - start;
  console.log(`\n100 ops in ${elapsed}ms (${(elapsed/100).toFixed(1)}ms/op)`);

  // Final stats
  const stats = instance.getStats();
  console.log("\nFinal stats:", JSON.stringify(stats, null, 2));

  // Cleanup
  instance.reset();
  console.log("Reset complete");
}

main().catch(console.error);
