# Next

```bash
npm create-next-app@latest

pnpm create next-app@latest
```

## React Compiler

自动优化

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

```tsx
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

:::
