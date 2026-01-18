# JS/TS

## 错误处理方式

|                            | `try/catch` | `window.onerror` | `window.addEventListener('error')` | `window.addEventListener('unhandledrejection')` |
| -------------------------- | ----------- | ---------------- | ---------------------------------- | ----------------------------------------------- |
| 同步错误                   | Y           | Y                | Y                                  |                                                 |
| 异步回调错误               |             | Y                | Y                                  |                                                 |
| 未处理的 Promise rejection |             |                  |                                    | Y                                               |
| async/await 异步错误       | Y           |                  |                                    | Y (未 try/catch 的 async/await 异步错误 )       |
| 资源加载错误               |             |                  | Y                                  |                                                 |
| 语法错误                   |             | Y                | Y                                  |                                                 |

- `try/catch` 可以捕获同步错误, async/await 异步错误
- `window.onerror` 可以捕获同步错误, 异步回调错误, 语法错误; 不能捕获资源加载错误
- `window.addEventListener('error')` 资源加载失败时, 会触发 error 事件, 对比 `window.onerror`, `window.addEventListener('error')` 还可以捕获资源加载错误
- `window.addEventListener('unhandledrejection')` 可以捕获未处理的 Promise rejection, 和未 try/catch 的 async/await 异步错误

## 编译

| 阶段                                     |                                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 词法分析 (Lexical Analysis)              | tsx/vue 源代码字符流 => Lexer/Tokenizer 词法分析器 => token 流                                           |
| 语法分析 (Syntax Analysis)               | token 流 => Parser 语法分析器 => AST 抽象语法树                                                          |
| 语义分析 (Semantic Analysis)             | AST 抽象语法树 => TypeChecker 等 => 类型检查等                                                           |
| 转换, 优化 (Transformation/Optimization) | AST 抽象语法树 => Transformer/Optimizer => 新 AST, 例如 tsc 擦除类型注解, jsx 转换为 React.createElement |
| 代码生成 (Code Generation)               | 新 AST => CodeGenerator => js 代码                                                                       |

## npm 命令

```bash
npm config list

npm get registry
npm config set registry https://registry.npmmirror.com

npm config get script-shell
npm config set script-shell "C:/Program Files/Git/bin/bash.exe"
```

## Promise

| CN          | v       | adj                  | n             |
| ----------- | ------- | -------------------- | ------------- |
| 解决 (兑现) | resolve | resolved (fulfilled) | result, value |
| 拒绝        | reject  | rejected             | reason, error |

| 静态方法               | resolved                                                                                                                                | rejected                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `Promise.all()`        | 全部 resolved, 返回 aggregatedValues 数组                                                                                               | 第一个 reject                                     |
| `Promise.allSettled()` | 全部 settled (resolved 或 rejected), 返回 `({ status: "fulfilled", value: unknown } \| { status: "rejected", reason: unknown })[]` 数组 | 始终 resolved, 不存在 rejected                    |
| `Promise.any()`        | 第一个 resolved                                                                                                                         | 全部 rejected, 抛出 aggregatedErrors 数组         |
| `Promise.race()`       | 第一个 settled (resolved 或 rejected) 是 resolved                                                                                       | 第一个 settled (resolved 或 rejected) 是 rejected |
| `Promise.reject()`     | --                                                                                                                                      | 返回一个 rejected 的 Promise 对象                 |
| `Promise.resolve()`    | 返回一个已 resolved 的 Promise 对象                                                                                                     | --                                                |

- `Promise.try()` 接受一个回调函数和参数, 将回调函数的返回值或抛出的异常封装为一个 resolved/rejected 的 Promise; `Promise.try(func)` 不等价于 `Promise.resolve().then(func)`, 区别是传递给 `Promise.try(func)` 的回调函数 func 是同步调用的 (传递给 Promise 构造函数的 `executor` 执行器函数也是同步调用的), 传递给 `Promise.resolve().then(func)` 的回调函数 func 是异步调用的
- `Promise.withResolvers()` 返回一个 Promise 对象, 一个用于解决该 Promise 对象的 resolve 函数, 一个用于拒绝该 Promise 对象的 reject 函数

```js
const promise = Promise.try(func, arg1, arg2);
const { promise, resolve, reject } = Promise.withResolvers();
```

### 实现 Promise

::: details Promise

```js
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

class PromiseV2 {
  state = PENDING;
  value = null;
  resolvedCallbacks = [];
  rejectedCallbacks = [];

  constructor(executor) {
    const resolve = (value) => {
      if (this.state !== PENDING) {
        return;
      }
      this.state = RESOLVED;
      this.value = value;
      this.resolvedCallbacks.forEach((cb) => cb(value));
    };
    const reject = (value) => {
      if (this.state !== PENDING) {
        return;
      }
      this.state = REJECTED;
      this.value = value;
      this.rejectedCallbacks.forEach((cb) => cb(value));
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      this.reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function"
        ? onFulfilled
        : (result) => {
            return result;
          };
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    return new PromiseV2((resolve, reject) => {
      const handleFulFilled = (result) => {
        try {
          const value = onFulfilled(result);
          if (value instanceof PromiseV2) {
            value.then(resolve, reject);
          } else {
            resolve(value);
          }
        } catch (e) {
          reject(e);
        }
      };
      const handleRejected = (reason) => {
        try {
          const value = onRejected(reason);
          if (value instanceof PromiseV2) {
            value.then(resolve, reject);
          } else {
            resolve(value);
          }
        } catch (e) {
          reject(e);
        }
      };

      switch (this.state) {
        case PENDING: {
          this.resolvedCallbacks.push(handleFulFilled);
          this.rejectedCallbacks.push(handleRejected);
          break;
        }

        case RESOLVED: {
          handleFulFilled(this.value);
          break;
        }

        case REJECTED:
        default: {
          handleRejected(this.value);
          break;
        }
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => {
        callback();
        return value;
      },
      (reason) => {
        callback();
        throw reason;
      },
    );
  }

  static resolve(value) {
    if (value instanceof PromiseV2) {
      return value;
    }
    return new PromiseV2((resolve) => resolve(value));
  }

  static reject(value) {
    return new PromiseV2((_, reject) => reject(value));
  }
}
```

:::

## 模块化

`require('./cjs-module.js')` 时, Node.js 会将代码包裹到 IIFE 中

```bash
mkdir test && cd test && pnpm init
echo 'module.exports = { name: "lark" }; console.log(arguments);' > ./cjs-module.js && node ./cjs-module.js
```

```js
(function (exports, require, module, __filename, __dirname) {
  module.exports = { name: "lark" };
  console.log(arguments);
})({}, require, module, __filename, __dirname);
```

## 模板字符串

```ts
const twArg = "slate";
const twArg2 = 500;
// const templateStr = `text-${twArg}-${twArg2}`

// parser: 模板字符串的解析函数
function parser(
  templateStrArr: TemplateStringsArray,
  ...insertedValues: unknown[]
) {
  // templateStrArr: ['text-', '-', '']
  // insertedValues: ['slate', 500]
  console.log(templateStrArr, insertedValues);
  return `color: #62748e;`;
}

const parsedStr = parser`text-${twArg}-${twArg2}`;
console.log(parsedStr); // color: #62748e
```

## 事件循环

JS 是单线程的

- JS 的主要任务是处理用户交互, 操作 DOM; 如果 JS 是多线程的, 可能操作 DOM 冲突, 例如两个线程同时操作一个 DOM, 一个修改另一个删除
- 有多线程的 Web Worker, 但是 Web Worker 不允许操作 DOM (没有 GUI 渲染线程的访问权限)

chrome 为每一个页面创建一个渲染进程, 渲染进程是多线程的, 主要包含

- **GUI 渲染线程**: 负责渲染页面, 解析 HTML, CSS; 构建 DOM 树, CSSOM 树; 将 DOM 树和 CSSOM 树合并为渲染树 (Render Tree); 布局和绘制, 回流和重绘等
  - 当页面需要回流 (reflow) 或重绘 (repaint) 时, 执行 GUI 渲染线程
  - GUI 渲染线程和 JS 引擎线程是互斥执行的, GUI 渲染线程执行时, JS 引擎线程会被挂起; JS 引擎线程执行时, GUI 渲染线程会被挂起
  - requestAnimationFrame 依赖 GUI 渲染线程
- **JS 引擎线程 (主线程)**: 一个页面 (一个渲染进程) 中只有一个 JS 引擎线程, 负责将同步任务压入同步任务栈 (函数调用栈), 执行同步任务, 异步任务 (包括宏任务和微任务)
- **事件触发线程**: 负责将异步任务加入队列, 包括宏任务加入宏任务队列, 微任务加入微任务队列
- **定时器触发线程**: 执行 setTimeout, setInterval 的线程
- **网络线程**: 执行 XMLHttpRequest, fetch, postMessage 的线程
- **I/O 线程**: 负责文件 I/O, IPC 进程间通信等

单线程本质: JS 引擎线程 (主线程) 负责执行同步任务, 异步任务 (包括宏任务和微任务); 宏任务触发可能依赖其他线程

### 同步任务, 异步任务

- 同步任务: 同步任务即 `<script>` 整体代码
  - Promise 的构造函数是同步的 `new Promise((resolve, reject) => {/** 同步代码 */})`
- 同步任务栈: 同步任务压入同步任务栈 (函数调用栈)
- 异步任务: 包括宏任务和微任务
  - 宏任务
    - `setTimeout`, `setInterval` 定时器
    - `XMLHttpRequest`, `fetch`, `postMessage` I/O 操作
    - `requestAnimationFrame` 下一帧重绘回流前, 执行传递的回调函数
    - `setImmediate`
  - 微任务
    - `Promise[.then, .catch, .finally]`
    - `async/await`
    - `MutationObserver` 监听整个 DOM 树的改变
    - `process.nextTick` node 环境, 当前事件循环的所有的微任务执行前, 执行传递的回调函数
- 异步任务队列
  - 宏任务队列: 宏任务加入宏任务队列
  - 微任务队列: 微任务加入微任务队列

### 执行顺序

同步任务即 `<script>` 整体代码 -> 同步任务的微任务队列 -> 宏任务 1 -> 宏任务 1 的微任务队列 -> 宏任务 2 -> 宏任务 2 的微任务队列 -> ...

1. 执行同步任务即 `<script>` 整体代码, 将同步任务的所有微任务加入微任务队列
2. 清空微任务队列: 按序执行所有微任务, 如果微任务执行过程中产生新的微任务, 则一并执行
3. 从宏任务队列中取出并执行 1 个宏任务, 将该宏任务的所有微任务加入微任务队列
4. 重复 2,3

如果将同步任务即 `<script>` 整体代码也视为一个宏任务, 则执行顺序简化为: 每一个事件循环, 先执行 1 个宏任务, 再执行该宏任务的所有微任务, 再进入下一个事件循环

## 浏览器在 1 帧中做了什么

对于 60fps 的屏幕, 1 帧是 1000/60 = 16.7ms, 浏览器在 1 帧中:

1. 处理用户事件: 例如 change, click, input 等
2. 执行定时器回调函数
3. 执行 requestAnimationFrame 下一帧重绘回流前, 执行传递的回调函数
4. 重绘和回流: 重绘 repaint, 有关颜色等, 性能开销小; 回流 reflow, 有关宽高等, 性能开销大
5. 如果有空闲时间, 则执行 requestIdleCallback (例如 idle 浏览器空闲时懒加载 JS 脚本)

## 类型转换

hint (v8 引擎提供)

- number 数学运算触发, valueOf 优先
- string 字符串上下文触发, toString 优先, 例如 String(val); \`${obj}\`
- default 同 number

```ts
const isPrimitive = (val: unknown) =>
  (typeof val !== "object" && typeof val !== "function") || val === null;

function toPrimitive(obj: object, hint: "number" | "string" | "default") {
  if (
    obj[Symbol.toPrimitive] &&
    typeof obj[Symbol.toPrimitive] === "function"
  ) {
    const res = obj[Symbol.toPrimitive].call(obj, hint);
    if (!isPrimitive(res)) {
      throw new TypeError();
    }
    return res;
  }

  const methods: ["toString", "valueOf"] | ["valueOf", "toString"] =
    hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];

  for (const method of methods) {
    const fn = obj[method];
    if (typeof fn === "function") {
      const res = fn.call(obj);
      if (isPrimitive(res)) {
        return res;
      }
    }
  }
  throw new TypeError();
}
```

例

```js
const a = {
  val: 1,
  valueOf() {
    return this.val++;
  },
};

const b = {
  val: 1,
  [Symbol.toPrimitive](hint) {
    console.log(hint); // default
    switch (hint) {
      case "number":
      case "default": {
        return this.val++;
      }
      case "string":
      default: {
        throw new TypeError();
      }
    }
  },
};

if (a == 1 && a == 2 && a == 3) {
  // valueOf 优先
  console.log(true);
}

if (b == 1 && b == 2 && b == 3) {
  console.log(true);
}
```

Falsy: false, undefined, null, 0, -0, NaN, ""

## v8 中对象的结构

v8 中对象的结构: elements 排序属性 + properties 常规属性 + 隐藏类

### 排序属性, 常规属性

- elements 排序属性, 数字属性称为排序属性, 根据 ECMA 规范, 可索引的属性按照索引值的大小升序排列
- properties 常规属性, 字符串属性称为常规属性

```js
const obj = {
  24: "elements-24",
  1: "elements-1",
  228: "elements-228",
  name: "properties-name",
  age: "properties-age",
  gender: "properties-gender",
};

for (let key in obj) {
  console.log(`${key}: ${obj[key]}`);
}

// obj
// ├── elements 排序属性
// │   ├── element0
// │   ├── element1
// │   ├── element2
// │   └── ...
// ├── properties
// │   ├── property10 常规属性, 慢属性
// │   ├── property11
// │   ├── property12
// │   └── ...
// ├── property0 常规属性, 容量 10 个
// ├── property1
// ├── property2
// ├── ...
// └── property9
```

### 快属性, 慢属性

- v8 为了加快查找常规属性的速度, 将部分常规属性直接挂到对象自身, 称为对象内属性 (in-object properties)
- 查找快属性只需要 1 次
- 快属性的容量 10 个, 超过 10 个的常规属性称为慢属性

### 隐藏类

隐藏类是 v8 运行时自动生成和管理的数据结构, 用于跟踪对象的属性和方法; 隐藏类的编号 map_id 用于唯一标识该隐藏类

v8 自动生成两个隐藏类, 隐藏类 1 包含属性 name 和 age, 隐藏类 2 包含属性 name, age 和 gender, 其中属性 name 和 age 的过渡表指向隐藏类 1, 属性 gender 没有过渡表, 表示该属性是新增的

如果两个对象的属性顺序和类型都相同时, 则 v8 会自动生成一个共享的隐藏类, 可以节约内存空间

```js
const obj1 = { name: "lark", age: 2 };
const obj2 = { name: "lark", age: 2, gender: "male" };

// 隐藏类 1 包含属性 name 和 age
// HiddenClass_1
// ├── map_id: 1
// ├── property_names: ['name', 'age']
// ├── transitions: {}
// └── prototype: Object.prototype

// 隐藏类 2 包含属性 name, age 和 gender
// HiddenClass_2
// ├── map_id: 2
// ├── property_names: ['name', 'age', 'gender']
// ├── transitions:
// │   ├── a: HiddenClass_1
// │   ├── b: HiddenClass_1
// │   └── c: null
// └── prototype: Object.prototype
```

## v8 垃圾回收

v8 将堆内存分为新生代和老年代, 新生代中的对象存活时间较短, 老生代中的对象存活时间较长, 甚至常驻内存

代际假说认为, 大多数对象存活时间较短

### 新生代 gc

Scavenge 算法

1. Scavenge 算法将新生代的堆内存一分为二, 每个内存空间称为 semi-space
2. 两个 semi-space 中, 一个处于使用状态, 称为 from-space; 另一个处于闲置状态, 称为 to-space
3. 分配对象时, 先在 from-space 中分配
4. 垃圾回收时, 复制 from-space 中的存活对象到 to-space 中, 释放死亡对象占用的内存
5. 复制后, 交换 from-space 和 to-space

即新生代的 gc 是将存活对象在两个 semi-space 间复制

### 对象晋升 (新生代 => 老年代)

对象从新生代 from-space 晋升到老年代的条件: 对象至少经历过 1 次 gc, 或新生代 to-space 的内存占用率超过 25%

### 老年代 gc

- Mark-Sweep 标记-清除: 内存碎片化程度低时执行
- Mark-Compact 标记-紧凑: 内存碎片化程度高时执行

```js
// 引用计数不能解决循环引用问题
(() => {
  let a = {};
  let b = {};
  a.pb = b;
  b.pa = a;
})();
```

#### Mark-Sweep 标记-清除

内存碎片化程度低时执行

标记

- 构建一个根列表, 从根节点出发, 遍历所有可达对象, 标记为存活的; 不可达对象视为死亡的
- 根节点包括全局对象; 函数的参数, 局部变量; 闭包引用的对象; DOM 元素等...

清除: 清除阶段直接回收死亡对象占用的内存, 可能导致内存碎片化

#### Mark-Compact 标记-紧凑

内存碎片化程度高时执行

标记

- 构建一个根列表, 从根节点出发, 遍历所有可达对象, 标记为存活的; 不可达对象视为死亡的 (垃圾)
- 根节点包括全局对象; 函数的参数, 局部变量; 闭包引用的对象; DOM 元素等...

紧凑: 紧凑阶段先将存活的对象移动到连续内存区域, 以清除内存碎片; 再回收其他内存区域

### 如何避免内存泄漏

1. 少创建全局变量
2. 手动清除定时器 (clearTimeout, clearInterval)
3. 少使用闭包
4. 清除 DOM 引用
5. WeakMap 和 WeakSet 的键是弱引用, 不会增加引用计数

案例 1

```js
function foo() {
  let a = 1;
  return function () {
    return a;
  };
}

const bar = foo();
```

- 通常, 函数执行结束后, 该函数的内部变量会被释放
- foo 函数返回 bar 函数, bar 函数有对 foo 函数的内部变量 a 的引用, foo 函数执行结束后, foo 函数的内部变量不会被释放
- 需要手动 `bar = null`, foo 函数的内部变量才会被释放

案例 2

```js
const map = new Map([["btn", document.getElementById("btn")]]);
const obj = { btn: document.getElementById("btn") };

function remove() {
  document.body.removeChild(document.getElementById("btn"));
}
```

- 调用 remove 函数以移除 button 元素, 但是 map, obj 中仍有对该 button 元素的引用
- 需要手动 `map.delete('btn')` 和 `delete obj.btn` (或 `obj.btn = null`)

### WeakMap 实验

```js
// node --expose-gc # 允许手动 gc
global.gc();
// 查看当前内存占用
process.memoryUsage().heapUsed; // 5e6

const wm = new WeakMap();
let bigArray = new Array(1000000);
wm.set(bigArray /** key */, 1 /** value */);
process.memoryUsage().heapUsed; // 1e7

bigArray = null;
process.memoryUsage().heapUsed; // 1e7
global.gc();
process.memoryUsage().heapUsed; // 5e6
```

## Web Worker

### 概述

Web Worker 有以下限制

1. worker 线程执行的脚本与主线程执行的脚本必须同源
2. worker 线程不允许操作 DOM, 不能使用 window, document, parent (parent === window) 对象, 可以使用 navigator 和 location 对象
3. worker 线程不允许读取本地文件, 只允许加载网络文件

### 基本使用

::: code-group

```js [main 主线程]
// 主线程创建一个 worker 子线程
const worker = new Worker("./worker.js");

// 主线程向 worker 子线程发送消息
worker.postMessage({ send: "ping" });

// 主线程监听 worker 子线程抛出的错误
worker.onerror = function (e) {
  console.log("[main] error:", e);
};
// 等价于
worker.addEventListener("error", function (e) {
  console.log("[main] error2:", e);
});

// 主线程监听 worker 子线程发送的消息
worker.onmessage = function (e) {
  console.log("[main] message:", e.data); // { echo: "pong" }
  // 主线程终止子线程
  // worker.terminate();
};
```

```js [worker 子线程]
// worker 子线程监听主线程发送的消息
self.onmessage = function (e) {
  console.log("[worker] message:", e.data); // { send: 'ping' }
  self.postMessage({ echo: "pong" });
  // worker 子线程主动关闭
  // self.close();
};
// 等价于
self.addEventListener("message", function (e) {
  console.log("[worker] message2:", e.data); // { send: 'ping' }
  self.postMessage({ echo: "pong2" });
  // worker 子线程主动关闭
  // self.close();
});
```

:::

### 数据通信

- 主线程和 worker 线程的数据通信: 使用 window.structuredClone 结构化克隆算法, 深拷贝数据
- 对于可转移对象 Transferable Objects, 可以转移所有权, 避免深拷贝

```js
// 主线程
const arr = new Uint8Array(new ArrayBuffer(8));
worker.postMessage(arr); // 深拷贝
worker.postMessage(arr, [arr]); // 转移所有权

// worker 线程
self.onmessage = function (ev) {
  console.log(ev.data);
};
```

## TS 装饰器

::: code-group

```ts [类装饰器]
const ClassDecoratorInst: ClassDecorator = (target) => {
  // target: 类, 类是构造函数的语法糖
  console.log(target.name); // Sugar
  console.log(typeof target); // function
  target.prototype.name = "NewSugar";
};

@ClassDecoratorInst
class Sugar {}

const sugar: any = new Sugar();
console.log(sugar.name); // NewSugar
```

```ts [属性装饰器]
const PropDecoratorInst: PropertyDecorator = (target, propKey) => {
  // target: 原型对象
  // propKey: 属性名
  console.log(target, propKey);
};

class Sugar {
  @PropDecoratorInst
  public name: string = "sugarInst";

  @PropDecoratorInst
  add = function (a: number, b: number) {
    return a + b;
  };

  @PropDecoratorInst
  sub = (a: number, b: number) => a - b;
}

const sugar = new Sugar();
console.log(sugar.name); // sugarInst
console.log(sugar.add(1, 2)); // 3
console.log(sugar.sub(1, 2)); // -1
```

```ts [方法装饰器]
const MethodDecoratorInst: MethodDecorator = (
  target, // 原型对象
  propKey, // 属性名, 即方法名
  propDescriptor, // 属性描述对象
) => {
  console.log(target, propKey, propDescriptor);
};

class Sugar {
  private _name: string = "sugarInst";

  @MethodDecoratorInst
  foo(a: number, b: number) {
    return a + b;
  }

  @MethodDecoratorInst
  get name() {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
  }
}

const sugar = new Sugar();
console.log(sugar.name); // sugarInst
sugar.name = "newSugarInst";
console.log(sugar.name); // newSugarInst
```

```ts [参数装饰器]
const ParamDecoratorInst: ParameterDecorator = (
  target, // 原型对象
  propKey, // 属性名, 即方法名
  paramIndex, // 参数索引
) => {
  console.log(target, propKey, paramIndex);
};

class Sugar {
  private _name: string = "sugarInst";

  add(@ParamDecoratorInst a: number, @ParamDecoratorInst b: number) {
    return a + b;
  }

  get name() {
    return this._name;
  }

  set name(@ParamDecoratorInst newName: string) {
    this._name = newName;
  }
}

const sugar = new Sugar();
console.log(sugar.name); // sugarInst
sugar.name = "newSugarInst";
console.log(sugar.name); // newSugarInst
```

:::

装饰器案例

```ts
const Get: (config: { url: string }) => MethodDecorator = ({ url }) => {
  return (target, propKey, propDescriptor) => {
    const method: any = propDescriptor.value;
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        method({ data, code: 200, msg: "OK" });
      })
      .catch((err) => {
        method({ data: JSON.stringify(err), code: 404, msg: "Not Found" });
      });
  };
};

class Controller {
  constructor() {}

  @Get({ url: "https://161043261.github.io/homepage/" })
  getHomepage(res: { data: string; code: number; msg: string }) {
    const { data, code, msg } = res;
    console.log(data, code, msg);
  }
}
```

## TS 类型工具

- `keyof T` 获取 T 的所有键, 生成一个联合类型
- `Record<K, V>` 创建一个对象类型, 键为 K 类型, 值为 V 类型
- `Partial<T>` 将 T 中所有属性变为可选
- `Required<T>` 将 T 中所有属性变为必选
- `Readonly<T>` 将 T 中所有属性变为只读
- `Pick<T, "field" | "filed2">` 从 T 中选择一组属性 field, field2 构造新类型
- `Omit<T, "field" | "filed2">` 从 T 中忽略一组属性 field, field2 构造新类型
- `Exclude<T, U>` 从 T 中排除可以赋值给 U 的类型
- `Extract<T, U>` 从 T 中提取可以赋值给 U 的类型 (类型的交集)
- `NonNullable<T>` 从 T 中排除 null 和 undefined
- `Parameters<F>` 获取函数类型 F 的参数类型
- `ReturnType<F>` 获取函数类型 F 的返回值类型
- `ConstructorParameters<F>` 获取构造函数 F 的参数类型
- `InstanceType<C>` 获取类的实例类型
- `Awaited<Y>` 获取 Promise `resolve(value)` 的值类型 (也即 `onfulfilled` 的返回值类型)
- `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>`

```ts
interface User {
  name: string;
  age: number;
}

type OnChangeEvents = {
  [K in keyof User as `on${Capitalize<K>}Change`]: (value: User[K]) => void;
};

// type OnChangeEvents = {
//   onNameChange: (value: string) => void;
//   onAgeChange: (value: number) => void;
// }
```

### infer 泛型推断

```ts
// 泛型推断
interface IUser {
  name: string;
  age: number;
}

type PromisifiedUser = Promise<IUser>;

type TryInferGenericsType<T> =
  T extends Promise<infer UnknownGenericsType>
    ? UnknownGenericsType // infer succeed
    : T; // infer failed

// type InferredGenericsType = IUser
type InferredGenericsType = TryInferGenericsType<PromisifiedUser>;
const user: InferredGenericsType = { name: "lark", age: 1 };

// 递归的泛型推断
type DeepPromisifiedUser = Promise<Promise<Promise<IUser>>>;
type TryRecursivelyInferGenericsType<T> =
  T extends Promise<infer UnknownGenericsType>
    ? TryRecursivelyInferGenericsType<UnknownGenericsType>
    : T;
type RecursivelyInferredGenericsType =
  TryRecursivelyInferGenericsType<DeepPromisifiedUser>;

// type RecursivelyInferredGenericsType = IUser
const user2: RecursivelyInferredGenericsType = { name: "lark", age: 1 };
```

### infer 协变 (类型的并集), 逆变 (类型的交集)

```ts
const user = { name: "lark", age: 1 };
type TryInferType<T> = T extends {
  name: infer UnknownNameType;
  age: infer UnknownAgeType;
}
  ? [UnknownNameType, UnknownAgeType]
  : T;

type InferredType /** [string, number] */ = TryInferType<typeof user>;
const user2: InferredType = [user.name, user.age];

// 协变返回或类型
type TryInferType<T> = T extends {
  name: infer UnknownUnionType;
  age: infer UnknownUnionType;
}
  ? UnknownUnionType
  : T;
type InferredType /** string | number */ = TryInferType<typeof user>;
const str: InferredType = "lark";
const num: InferredType = 1;

// 逆变返回与类型
type TryInferType<T> = T extends {
  fn1: (arg: infer UnknownArgType) => void;
  fn2: (arg: infer UnknownArgType) => void;
}
  ? UnknownArgType
  : unknown;

type InferredType /** never (number & string === never) */ = TryInferType<{
  fn1: (arg: number) => void;
  fn2: (arg: string) => void;
}>;
type InferredType2 /** number */ = TryInferType<{
  fn1: (arg: number) => void;
  fn2: (arg: number) => void;
}>;
```

### Demo

::: code-group

```ts [Demo 1]
type Arr = ["a", "b", "c"];

type TryInferType<T extends unknown[]> = T extends [
  infer UnknownFirstElemType,
  infer UnknownSecondElemType,
  infer UnknownThirdElemType,
]
  ? {
      first: UnknownFirstElemType;
      second: UnknownSecondElemType;
      third: UnknownThirdElemType;
    }
  : unknown;

// { first: "a", second: "b", third: "c" }
type InferredType = TryInferType<Arr>;
```

```ts [Demo 2]
// FirstElemType
type TryInferType<T extends unknown[]> = T extends [
  infer UnknownFirstElemType,
  ...unknown[],
]
  ? UnknownFirstElemType
  : unknown;

type InferredType /** "a" */ = TryInferType<Arr>;

// PreRestType
type TryInferType<T extends unknown[]> = T extends [
  ...infer UnknownPreRestType,
  unknown,
]
  ? UnknownPreRestType
  : unknown;

type InferredType /** ["a", "b"] */ = TryInferType<Arr>;

// LastElemType
type TryInferType<T extends unknown[]> = T extends [
  ...unknown[],
  infer UnknownLastElemType,
]
  ? UnknownLastElemType
  : unknown;

type InferredType /** "c" */ = TryInferType<Arr>;

// RestType
type TryInferType<T extends unknown[]> = T extends [
  unknown,
  ...infer UnknownRestType,
]
  ? UnknownRestType
  : unknown;

type InferredType /** ["b", "c"] */ = TryInferType<Arr>;
```

```ts [Demo 3]
type Arr = [1, 2, 3, 4, 5];
type TryInferType<T extends unknown[]> = T extends [
  infer UnknownFirstElemType,
  ...infer UnknownRestType,
]
  ? [...TryInferType<UnknownRestType>, UnknownFirstElemType] // Recurse
  : T;

type InferredType /** [5, 4, 3, 2, 1] */ = TryInferType<Arr>;
type ReversedArr = InferredType;
```

:::
