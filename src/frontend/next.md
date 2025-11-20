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

React Compiler 自动优化性能

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
├── him
│   └── page.tsx
├── layout.tsx
├── loading.tsx
├── page.tsx
├── her
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
import { Component, ReactNode, Suspense } from "react";

interface IProps extends LayoutProps<"/about"> {
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
        <Suspense fallback={<>About loading...</>}>{children}</Suspense>
        <Link href="/about/him">/about/him</Link>
        <Link href="/about/her">/about/her</Link>
        <footer>AboutLayout footer</footer>
      </>
    );
  }
}

export default AboutLayout;
```

```tsx [template.tsx]
"use client"; // 有状态的组件必须是客户端组件

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

// him/page.tsx
export default function AboutHimPage() {
  return <>About Him</>;
}

// her/page.tsx
export default function AboutHerPage() {
  return <>About Her</>;
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
2. useRouter hook, 客户端组件使用
3. redirect, permanentRedirect 函数, 服务器组件使用
4. history API

### `<Link />` 组件

增强的 `<a />` 标签

```tsx
<Link
  href="/about/her"
  // prefetch 预获取目的页面, 默认 true, 生产环境有效
  prefetch
  // 禁止默认滚动行为: 滚动到顶部
  scroll={false}
  // 替换当前页面
  replace
>
  /about/her
</Link>
```

::: code-group

```tsx [about/page.tsx]
<Link href={{ pathname: "/about/him", query: { name: "lark", age: 24 } }}>
  /about/him?name=lark&age=24
</Link>
```

```tsx [about/him/page.tsx]
"use client";

import { useSearchParams } from "next/navigation";

export default function AboutHimPage() {
  const searchParams = useSearchParams();
  return (
    <>
      About Him
      <div>name: {searchParams.get("name") ?? "null"}</div>
      <div>
        age: {searchParams.has("age") ? searchParams.get("age") : "null"}
      </div>
    </>
  );
}
```

:::

### useRouter hook

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function HimPage() {
  const router = useRouter();
  return (
    <>
      <button onClick={() => router.push("/about")}>history.pushState()</button>
      <button onClick={() => router.replace("/about")}>
        history.replaceState()
      </button>
      <button onClick={() => router.back()}>history.back()</button>
      <button onClick={() => router.forward()}>history.forward()</button>
      <button onClick={() => router.refresh()}>refresh /about/him</button>
      <button onClick={() => router.prefetch("/about/her")}>
        prefetch /about/her
      </button>
    </>
  );
}
```

### redirect, permanentRedirect

对比 redirect, permanentRedirect: 状态码不同

- redirect: 307 Temporary Redirect
- permanentRedirect: 308 Permanent Redirect

```ts
redirect("/login");
```

## 动态路由, 平行路由, 路由组

### 动态路由

- `app/about/[id]` 捕获一个参数
- `app/about/[...idList]` 捕获多个参数
- `app/about-id/[[...optionalList]]` 捕获多个参数 (可选)

::: code-group

```tsx [app/about/[id]]
"use client";

import { useParams } from "next/navigation";

export default function AboutIdPage() {
  const params = useParams();
  const { id } = params;
  return <>AboutPage {id}</>;
}
```

```tsx [app/about/[...idList]]
"use client";

import { useParams } from "next/navigation";

export default function AboutIdListPage() {
  const params = useParams();
  const { idList } = params;
  return (
    <>
      {Array.isArray(idList) &&
        idList.map((item) => <div key={item}>{item}</div>)}
    </>
  );
}
```

```tsx [app/about-id/[[...optionalList]]]
"use client";

import { useParams } from "next/navigation";

export default function AboutIdOptionalListPage() {
  const params = useParams();
  const { optionalList } = params;
  return (
    <>
      <div>optionalList</div>
      {Array.isArray(optionalList) &&
        optionalList.map((item) => <div key={item}>{item}</div>)}
    </>
  );
}
```

:::

### 平行路由

```bash
./apps/next/src/app
├── @footer
│   ├── default.tsx  # FooterDefault
│   └── page.tsx     # FooterPage
├── @header
│   ├── default.tsx  # HeaderDefault
│   ├── error.tsx    # HeaderErrorComponent
│   ├── loading.tsx  # HeaderLoadingComponent
│   ├── page.tsx     # HeaderPage
│   └── switch
│       └── page.tsx # HeaderSwitchPage
├── default.tsx      # HomeDefault
├── layout.tsx       # RootLayout
└── page.tsx         # Home
```

```tsx
import type { Metadata } from "next";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  header,
  footer,
}: Readonly<{
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {header}
        {children}
        {footer}
        <Link href="/switch">Switch header</Link>
      </body>
    </html>
  );
}
```

### 路由组

```bash
./apps/next/src/app
├── (ieg)
│   └── honor-of-kings
│       └── page.tsx # http://localhost:3000/honor-of-kings
├── (wxg)
│   └── wechat
│       └── page.tsx # http://localhost:3000/wechat
├── layout.tsx
└── page.tsx
```

```bash
./apps/next/src/app
├── (ieg)
│   ├── honor-of-kings
│   │   └── page.tsx # HonorOfKingsPage
│   └── layout.tsx   # HonorOfKingsRootLayout
├── (wxg)
│   ├── wechat
│   │   └── page.tsx # WeChatPage
│   └── layout.tsx   # WeChatRootLayout
└── page.tsx
```

## 后端路由

### 查询参数, 请求体参数

app/api/user/route.ts

```ts
// route.ts
import { NextRequest, NextResponse } from "next/server";

// HEAD, GET, POST, PUT, DELETE, PATCH, OPTIONS
// Export the uppercase 'GET' method name
export async function GET(request: NextRequest) {
  const queryParams = request.nextUrl.searchParams;
  const name = queryParams.get("name");
  const age = queryParams.get("age");
  return NextResponse.json({
    message: `GET user OK: name=${name}, age=${age}`,
  });
}

interface IBody {
  name: string;
  age: number;
}

export async function POST(request: NextRequest) {
  // request.json()
  // request.formData()
  // request.text()
  // request.blob()
  // request.arrayBuffer()
  const body = (await request.json()) as IBody;
  const { name, age } = body;
  return NextResponse.json(
    {
      message: `POST user OK: name=${name}, age=${age}`,
    },
    { status: 201 }, // HTTP response status code: 201 Created
  );
}
```

### url 路径参数

```ts
import { NextRequest, NextResponse } from "next/server";

interface IParams {
  id: string;
}

// Export the uppercase 'GET' method name
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<IParams> },
) {
  const { id } = await params;
  return NextResponse.json({
    message: `GET user OK: id=${id}`,
  });
}
```
