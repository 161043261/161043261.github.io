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

React Compiler: 自动优化性能

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
// 如果没有 React Compiler, 则需要手动 memo 缓存组件, useMemo 缓存值, useCallback 缓存函数以优化重新渲染
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
      {/* 每次组件更新时, 都会创建新的 () => handleClick(item) 箭头函数, 破坏记忆化 */}
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```

```tsx [React Compiler]
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map((item) => (
        {/* React Compiler 可以自动优化性能
        确保 Item 仅在 props.onClick 更新时重新渲染 */}
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

:::

## App Router

- Pages Router
- App Router: layout.tsx, page.tsx, template.tsx

```tsx
<Layout>
  <Template>
    <Page />
  </Template>
</Layout>
```

- 会缓存 `<Layout />` 组件, 只会挂载 1 次 (类似 vue `<KeepAlive />`)
- 不会缓存 `<Template />` 组件

### layout, template, page, loading, error

```txt
./src/app/about
├── error.tsx
├── he
│   └── page.tsx
├── layout.tsx
├── loading.tsx
├── page.tsx
├── she
│   └── page.tsx
└── template.tsx
```

- 类组件必须是客户端组件
- 有状态的组件必须是客户端组件
- Error 组件必须是客户端组件

::: code-group

```tsx [layout.tsx]
"use client"; // 类组件必须是客户端组件

import Link from "next/link";
import { Component, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}
interface IState {
  cnt: number;
}

class AboutLayout extends Component<IProps, IState> {
  state = {
    cnt: 0,
  };

  handleClick = () => {
    const { cnt } = this.state;
    this.setState(
      {
        cnt: cnt + 1,
      },
      () => console.log(this.state),
    );
  };

  render() {
    const { cnt } = this.state;
    const { children } = this.props;
    return (
      <>
        <div>cnt {cnt}</div>
        <button onClick={this.handleClick}>addCnt</button>
        <header>AboutLayout header</header>
        {children}
        <Link href="/about/he">/about/he</Link>
        <Link href="/about/she">/about/she</Link>
        <footer>AboutLayout footer</footer>
      </>
    );
  }
}

export default AboutLayout;
```

```tsx [template.tsx]
"use client"; // 有状态的组件必须是客户端组件

import Link from "next/link";
import { ReactNode, useState } from "react";

interface IProps {
  children: ReactNode;
}

const AboutTemplate = function (props: IProps) {
  const [cnt, setCnt] = useState(0);
  const handleClick = () => setCnt(cnt + 1);

  const { children } = props;

  return (
    <>
      <div>cnt: {cnt}</div>
      <button onClick={handleClick}>addCnt</button>
      <header>AboutTemplate header</header>
      {children}
      <Link href="/about/he">/about/he</Link>
      <Link href="/about/she">/about/she</Link>
      <footer>AboutTemplate footer</footer>
    </>
  );
};

export default AboutTemplate;
```

```tsx [**/page.tsx]
// page.tsx
"use server"; // 服务器组件

const getData = async (): Promise<{ timestamp: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timestamp: new Date().toISOString() });
    }, 5000);
  });
};

async function AboutPage() {
  const data = await getData();
  return <>About me {data.timestamp}</>;
}

export default AboutPage;

// he/page.tsx
export default function AboutHePage() {
  return <>About He</>;
}

// she/page.tsx
export default function AboutShePage() {
  return <>About She</>;
}
```

```tsx [loading.tsx]
function LoadingComponent() {
  return <>loading...</>;
}

export default LoadingComponent;
```

```tsx [error.tsx]
"use client"; // Error 组件必须是客户端组件

function ErrorComponent(props: unknown) {
  return <>error: {JSON.stringify(props)}</>;
}

export default ErrorComponent;
```

:::

### app/not-found.tsx

```tsx
export default function GlobalNotFound() {
  return <>404</>;
}
```

## 路由导航

路由导航的 4 种方式

1. `<Link />` 组件
2. useRouter hook, 客户端组件可以使用
3. redirect 函数, 服务器组件可以使用
4. history API

### `<Link />` 组件

增强的 `<a />` 标签
