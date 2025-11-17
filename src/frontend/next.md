# Next

- AI, 提供 AI SDK
- SSR, Server-Side Rendering 支持服务端渲染
- SSG, Static Site Generation 支持静态站点生成
- SEO, Search Engine Optimization 支持搜索引擎优化

## Turbopack

- 统一的依赖图: Next 支持多个输出环境 (例如客户端和服务器), 管理多个 compiler 和 bundler 很麻烦, turbopack 使用统一的依赖图覆盖所有的环境
- 打包 vs 原生 esm: 有些 bundler (例如 vite) 开发时跳过打包, 只适用于小型应用, 对于大型应用, 网络请求过多, 可能降低大型应用的速度; Next 开发时使用 turbopack 打包, 可以优化提高大型应用的速度
- 增量计算: turbopack 使用多核 CPU 并行化计算, 缓存计算结果到函数级
- 懒打包: turbopack 开发时只打包实际请求的模块, 懒打包可以减少编译时间和内存占用

```bash
npm create-next-app@latest

pnpm create next-app@latest
```

## React Compiler

React Compiler: 自动性能优化

```bash
pnpm add babel-plugin-react-compiler -D
```

next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
```

::: code-group

```tsx [memo, useMemo, useCallback]
// 如果没有 React Compiler，则需要手动 memo 缓存组件，useMemo 缓存值，useCallback 缓存函数以优化重新渲染
import { useMemo, useCallback, memo } from "react";

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback(
    (item) => {
      onClick(item.id);
    },
    [onClick],
  );

  return (
    <div>
      {processedData.map((item) => (
      {/* 每次组件更新时，都会创建新的 () => handleClick(item) 箭头函数，破坏记忆化 */}
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```

```tsx [React Compiler]
// React Compiler 可以自动优化，确保 Item 仅在 props.onClick 更新时重新渲染
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map((item) => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

:::
