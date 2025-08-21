# 算法

## Node.js ACM 模式

```js
const readline = require("node:readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on("line", (line) => {
  console.log(line);
});
```

## 堆排序 (优先级队列)

::: code-group

```ts [堆排序 TS]
// 大/小根堆是满二叉树
// 大根堆: 父节点 >= 左右子节点; 小根堆: 父节点 <= 左右子节点
// 最后一个叶子节点的数组下标 const lastLeafIdx = heapSize - 1;
// 最后一个叶子节点的父节点是最后一个非叶节点
// 最后一个非叶节点的数组下标 const lastNotLeafIdx = Math.floor((lastLeafIdx - 1) / 2)
// 从最后一个非叶节点开始, 构造大/小根堆
function buildMaxHeap(nums: number[], heapSize: number) {
  const lastLeafIdx = heapSize - 1;
  const lastNotLeafIdx = Math.floor((lastLeafIdx - 1) / 2);
  for (let idx = lastNotLeafIdx; idx >= 0; idx--) {
    maxHeapify(nums, idx, heapSize);
  }
}

function buildMinHeap(nums: number[], heapSize: number) {
  const lastLeafIdx = heapSize - 1;
  const lastNotLeafIdx = Math.floor((lastLeafIdx - 1) / 2);
  for (let idx = lastNotLeafIdx; idx >= 0; idx--) {
    minHeapify(nums, idx, heapSize);
  }
}

/**
 *
 * @param nums nums.slice(0, heapSize) 大根堆节点数组
 * @param idx 当前调整的节点的数组下标
 * @param heapSize 大根堆的大小
 * @description 构造大根堆: 小节点不断下沉
 */
function maxHeapify(nums: number[], idx: number, heapSize: number) {
  let childIdx = idx;
  const left = 2 * idx + 1;
  const right = 2 * idx + 2;
  if (left < heapSize && nums[left] > nums[childIdx]) {
    childIdx = left;
  }
  if (right < heapSize && nums[right] > nums[childIdx]) {
    childIdx = right;
  }
  if (childIdx !== idx) {
    [nums[idx], nums[childIdx]] = [nums[childIdx], nums[idx]];
    maxHeapify(nums, childIdx, heapSize);
  }
}

/**
 *
 * @param nums nums.slice(0, heapSize) 小根堆节点数组
 * @param idx 当前调整的节点的数组下标
 * @param heapSize 小根堆的大小
 * @description 构造小根堆: 大节点不断下沉
 */
function minHeapify(nums: number[], idx: number, heapSize: number) {
  let childIdx = idx;
  const left = 2 * idx + 1;
  const right = 2 * idx + 2;
  if (left < heapSize && nums[left] < nums[childIdx]) {
    childIdx = left;
  }
  if (right < heapSize && nums[right] < nums[childIdx]) {
    childIdx = right;
  }
  if (childIdx !== idx) {
    [nums[idx], nums[childIdx]] = [nums[childIdx], nums[idx]];
    minHeapify(nums, childIdx, heapSize);
  }
}
```

```cpp [堆排序 Cpp]
#include <utility> // swap
#include <vector>

using namespace std;

void maxHeapify(vector<int> &nums, int idx, int heapSize) {
  auto childIdx = idx;
  auto left = idx * 2 + 1;
  auto right = idx * 2 + 2;
  if (left < heapSize && nums[left] > nums[childIdx]) {
    childIdx = left;
  }
  if (right < heapSize && nums[right] > nums[childIdx]) {
    childIdx = right;
  }
  if (childIdx != idx) {
    swap(nums[idx], nums[childIdx]);
    maxHeapify(nums, childIdx, heapSize);
  }
}

void minHeapify(vector<int> &nums, int idx, int heapSize) {
  auto childIdx = idx;
  auto left = idx * 2 + 1;
  auto right = idx * 2 + 2;
  if (left < heapSize && nums[left] < nums[childIdx]) {
    childIdx = left;
  }
  if (right < heapSize && nums[right] < nums[childIdx]) {
    childIdx = right;
  }
  if (childIdx != idx) {
    swap(nums[idx], nums[childIdx]);
    minHeapify(nums, childIdx, heapSize);
  }
}

void buildMaxHeap(vector<int> &nums, int heapSize) {
  auto lastLeafIdx = heapSize - 1;
  auto lastNotLeafIdx = (lastLeafIdx - 1) / 2;
  for (auto idx = lastNotLeafIdx; idx >= 0; idx--) {
    maxHeapify(nums, idx, heapSize);
  }
}

void buildMinHeap(vector<int> &nums, int heapSize) {
  auto lastLeafIdx = heapSize - 1;
  auto lastNotLeafIdx = (lastLeafIdx - 1) / 2;
  for (auto idx = lastNotLeafIdx; idx >= 0; idx--) {
    minHeapify(nums, idx, heapSize);
  }
}
```

:::

## 动态规划

### 背包问题

- 01 背包: n 种物品, 每种物品只有一个
- 多重背包: n 种物品, 每种物品有若干个
- 完全背包: n 种物品, 每种物品有无数个

#### 01 背包

| 物品 | 重量 w | 价值 v |
| ---- | ------ | ------ |
| 0    | 2      | 10     |
| 1    | 3      | 5      |
| 2    | 5      | 15     |
| 3    | 7      | 7      |
| 4    | 1      | 6      |
| 5    | 4      | 18     |
| 6    | 1      | 3      |

**考虑子问题**

> dp[i][j]: 下标 [0, i) 的物品, 放入容量为 j 的背包的最大价值

当前的价值 dp[i][j], 只取决于是否放入物品 i-1

```ts
dp[i][j] = // 下标 [0, i) 的物品, 放入容量为 j 的背包的最大价值
  Math.max(
    // 不放物品 i-1
    // 则 dp[i][j] = 下标 [0, i-1) 的物品, 放入容量为 j 的背包的最大价值
    dp[i - 1][j],
    // 放物品 i-1
    // 则 dp[i][j] = 下标 [0, i-1) 的物品, 放入容量为 j-w[i] 的背包的最大价值,
    // 再加上 物品 i-1 的价值
    dp[i - 1][j - w[i]] + v[i],
  );
```

**初始化 dp 数组**

- 只需要初始化第 0 行的所有元素, 和第 0 列的所有元素
- 第 0 行的元素表示下标 [0, 0) 空集的物品, 放入容量为 j 的背包的最大价值
  => `dp[0][j] = 0`
- 第 0 列的元素表示放入容量为 0 的背包 => `dp[i][0] = 0`

## prototype

- prototype 是 (构造) 函数的专有属性
- prototype 定义: 提供共享属性的对象
- 不是所有的函数都有 prototype 属性, 函数 bind() 方法返回的函数没有 prototype 属性

```js
function Demo() {}
Demo.prototype.name = "demo";

const demo = new Demo();
console.log(demo.name); // demo

Demo.prototype.name = "demo2";
console.log(demo.name); // demo2
```

### new 一个对象时做了什么

1. 创建一个空的新对象
2. 将新对象的 `__proto__` 属性指向构造函数的 prototype 属性
3. 将构造函数的 this 指向新对象
4. 如果构造函数没有返回值, 则实际构造的是新对象
5. 如果构造函数返回值是引用类型, 则实际构造的是返回值
6. 如果构造函数返回值是基本类型, 则忽略返回值, 实际构造的是新对象

### 实现 new 操作

```js
function myNew(constructor_, ...args) {
  const obj = Object.create(constructor_.prototype);
  const ret = constructor_.apply(obj /** this */, args);
  return typeof ret === "object" && ret !== null ? ret : obj;
}

function Demo(name, age) {
  this.name = name;
  this.age = age;
  this.say = function () {
    console.log(this.name, this.age);
  };
}

Demo.prototype.name2 = "aaa";
Demo.prototype.age2 = 22;
Demo.prototype.say2 = function () {
  console.log(this.__proto__.name2, this.__proto__.age2);
};

const demo = myNew(Demo /** constructor_ */, "bbb" /** name */, 23 /** age */);
console.log(demo.name, demo.name2); // bbb aaa
console.log(demo.age, demo.age2); // 23 22
demo.say(); // bbb 23
demo.say2(); // aaa 22

Demo.prototype.name2 = "ccc";
Demo.prototype.age2 = 24;
demo.say2(); // ccc 24

console.log(Demo.prototype === demo.__proto__); // true
console.log(demo.constructor === Demo); // true

console.log(Demo.prototype.constructor === Demo); // true
console.log(demo.__proto__.constructor === Demo); // true
```

## 并查集

- 集合: 树
- 并查集: 森林

| 集合                                | 树                             |
| ----------------------------------- | ------------------------------ |
| 并查集: 多个集合                    | 森林: 多个树                   |
| 合并 union: 合并两个元素所属的集合  | 合并两个节点所属的树           |
| 查询 find: 查询元素所属的集合的序号 | 查询节点所属的树的根节点的序号 |

查询 find 可以判断两个元素是否属于同一个集合 (两个元素是否属于同一个树)

```ts
const nodeNum: number = 3;

// 初始化
const parentIdx = Array.from({ length: nodeNum + 1 }, (_, idx) => idx);
// parentIdx [0, 1, 2, 3]

const sizes = Array.from({ length: nodeNum + 1 }, (_, idx) =>
  idx === 0 ? 0 : 1,
);
// sizes [0, 1, 1, 1]

export function union(idxA: number, idxB: number) {
  const rootA = find(idxA);
  const rootB = find(idxB);
  parentIdx[rootA] = rootB;
}

// 合并优化: 将节点数量较少的树合并到节点数量较多的树
export function perfUnion(idxA: number, idxB: number) {
  let rootA = find(idxA);
  let rootB = find(idxB);
  // 将节点数量较少的树合并到节点数量较多的树
  if (sizes[rootA] < sizes[rootB]) {
    [rootA, rootB] = [rootB, rootA];
  }

  // sizes[rootA] >= sizes[rootB]
  parentIdx[rootB] = rootA;
  sizes[rootA] += sizes[rootB];
}

export function find(idx: number): number {
  // 根节点的父节点 == 根节点
  const pIdx = parentIdx[idx];
  if (pIdx == idx) {
    return idx;
  }
  return find(pIdx);
}

// 查找时压缩
export function perfFind(idx: number): number {
  const pIdx = parentIdx[idx];
  if (pIdx == idx) {
    return idx;
  }
  // 路径压缩
  const root = perfFind(pIdx);
  parentIdx[idx] = root;
  return root;
}

// 删除叶子节点
export function deleteLeaf(idx: number) {
  const root = find(idx);
  sizes[root] -= 1;
  parentIdx[idx] = idx;
}

// 移动叶子节点: 将 idxA 移动到 idxB 所属的树
export function moveLeaf(idxA: number, idxB: number) {
  const rootA = find(idxA);
  const rootB = find(idxB);
  if (rootA == rootB) {
    return;
  }
  sizes[rootA] -= 1;
  sizes[rootB] += 1;
  parentIdx[idxA] = rootB;
}
```
