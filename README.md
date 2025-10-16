# LLM JSON Stream Parser

一个轻量、高效且健壮的 TypeScript 库，用于从流中解析 JSON 数据。这在处理实时数据流、大型 JSON 文件或来自大型语言模型（LLM）的流式 JSON 响应时特别有用。

## ✨ 功能

-   **流式解析**: 在数据到达时增量解析 JSON，无需将整个 JSON 文档加载到内存中。
-   **健壮性**: 能正确处理在任意位置被切分的 JSON 数据块，包括在字符串、数字或多字节 Unicode 字符内部。
-   **高性能**: 为速度和低内存开销而优化。
-   **TypeScript 原生**: 完全使用 TypeScript 编写，提供强类型和出色的编辑器集成。

## 📦 安装

通过 npm 安装开发依赖项：

```bash
npm i  llm-json-stream-parser
```


## Example 
```typescript
import { tryParseJsonStreamAutoComplete } from "./index.js";
import { mockJsonStreamToCallback } from "./mock.js";


let content = "";
mockJsonStreamToCallback((chunk: string) => {
	content += chunk;
    tryParseJsonStreamAutoComplete(content, (obj) => {
        console.log("解析到完整 JSON对象:", JSON.stringify(obj || {}, null, 2));
    });
});

```

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。
