# mcp-toolkit

**Developer toolkit for building Model Context Protocol servers and clients**

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-proprietary-red)

## Install
```bash
npm install
```

## Quick Start
```typescript
import { McpToolkit } from "./mcp-toolkit";
const instance = new McpToolkit()
const r = await instance.generate({ input: 'test' })
```

## CLI
```bash
npx tsx src/cli.ts status
npx tsx src/cli.ts run --input "data"
```

## API
| Method | Description |
|--------|-------------|
| `generate()` | Generate |
| `create()` | Create |
| `validate()` | Validate |
| `preview()` | Preview |
| `export()` | Export |
| `get_templates()` | Get templates |

## Test
```bash
npx vitest
```

## License
(c) 2026 Officethree Technologies. All Rights Reserved.
