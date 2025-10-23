# Network

## 输入 URL 回车到页面加载完成, 发生了什么

1. 判断地址栏内容是搜索关键字, 还是请求 URL
   - 如果是搜索关键字, 则组合为携带搜索关键字的新 URL
   - 如果是请求 URL, 则按需加上 `https://` 协议字段, 组合为新 URL
2. beforeunload 事件: 用户回车后, 会触发 beforeunload 事件, beforeunload 事件允许页面卸载前, 执行数据清理等操作; 也可以询问用户是否离开当前页面, 用户可以通过 beforeunload 事件取消导航 (页面跳转)
3. 渲染进程通过进程间通信 (IPC) 将请求 URL 发送给网络进程
4. 网络进程先检查本地缓存是否缓存了请求资源, 如果有缓存, 则直接返回请求资源给渲染进程 (强制缓存); 如果没有缓存, 则发送网络请求
5. DNS 解析: 对 URL 进行 DNS 解析, 以获取服务器 IP 地址和端口号; HTTP 的默认端口号是 80, HTTPS 默认端口号是 443, 如果是 HTTPS 协议, 还需要建立 TLS 或 SSL 连接
6. 建立 TCP 连接: 进入 TCP 队列, 通过三次握手与服务器建立连接 (chrome 限制一个域名最多同时建立 6 个 TCP 连接)
7. 浏览器发送 HTTP 请求: 浏览器生成请求行 (get, post, ... 请求方法, URL, 协议), 请求头, 请求体等, 并将 cookie 等数据附加到请求头中, 发送 HTTP 请求给服务器
   - RESTful: get, post, put, delete, patch, ...
   - 应用层: 加 HTTP 头部, 包括请求方法, URL, 协议等
   - 传输层: 加 TCP 头部, 包括源端口号, 目的端口号等
   - 网络层: 加 IP 头部, 包括源 IP 地址, 目的 IP 地址等
8. 服务器收到 HTTP 请求: 服务器生成响应行, 响应头, 响应体等, 发送 HTTP 响应给浏览器网络进程
   1. 服务器网络层解析出 IP 头部, 将数据包向上交付给传输层
   2. 服务器传输层解析出 TCP 头部, 将数据包向上交付给应用层
   3. 服务器应用层解析出请求头和请求体
      - 如果不需要重定向, 服务器根据请求头中的 `If Not Match` 字段值判断请求资源是否被更新 (协商缓存), 如果没有更新, 则返回 304 状态码, 不返回请求资源; 如果有更新, 则同时返回 200 状态码和请求资源
      - 如果希望使用强缓存, 则设置响应头字段 `Cache-Control: max-age=2000`, 例如 Nginx 配置文件 `add_header Cache-Control "public, immutable";` 对应的响应头字段 `Cache-Control: public, immutable`
      - 如果需要重定向, 则服务器直接返回 301 或 302 状态码, 在响应头的 `Location` 字段中指定重定向地址, 浏览器根据状态码和 `Location` 字段进行重定向操作
   4. 关于是否断开连接: 数据传输完成, TCP 四次挥手断开连接, 如果浏览器或服务器在 HTTP 头部设置 `Connection: Keep-Alive` 字段, 则会建立持久的 TCP 连接, 节省下一次 HTTP 请求时建立连接的时间, 提高资源加载速度
   5. 关于重定向: 浏览器收到服务器返回的响应头后, 网络进程解析响应头, 如果状态码是 301 或 302, 则网络进程获取响应头的 `Location` 字段值 (重定向的地址), 发送新的 HTTP/HTTPS 请求
   6. 关于响应体的数据类型: 浏览器根据 HTTP 响应头的 `Content-Type` 字段值判断响应数据类型, 并根据响应数据类型决定如何处理响应体; 如果 `Content-Type` 字段值是二进制数据流类型: `Content-Type: application/octet-stream`, 则提交给浏览器的下载管理器, 同时该 URL 请求的导航 (页面跳转) 结束, 如果 `Content-Type` 字段值是 HTML 类型: `Content-Type: text/html; charset=utf-8`, 则网络进程通知浏览器进程分配一个渲染进程进行页面渲染
9. 分配渲染进程: 浏览器进程检查新 URL 和已打开 URL 的域名是否相同, 如果相同则复用已有的渲染进程, 如果不同则创建新的渲染进程
10. 渲染文档: 渲染进程解析文档; 将 HTML 解析为 DOM 树, 将 CSS 解析为 CSSOM 树, 将 DOM 树和 CSSOM 树合并为渲染树; 重绘、回流

## HTTP 超文本传输协议

HTTP: C/S 模型, 基于 TCP/IP, 是无状态协议: 两次请求间, 服务器不会保存任何数据

### HTTP/1.1

- HTTP/1.0 是短连接, 每次 HTTP 请求都需要建立 TCP 连接, 传输数据和断开 TCP 连接 3 个阶段; HTTP/1.1 新增**持久连接**, 特点是一个 TCP 连接上可以发送多次 HTTP 请求, 只要浏览器或服务器没有明确断开连接, 该 TCP 连接就会一直保活 `Connection: Keep-Alive`; HTTP/1.1 中持久连接默认开启, 如果不想使用持久连接, 可以在 HTTP 请求头中设置 `Connection: Close` 字段
- chrome 限制同一个域名最多同时建立 6 个 TCP 连接
- 使用 CDN 内容分发网络实现[域名分段](https://developer.mozilla.org/zh-CN/docs/Glossary/Domain_sharding)
- 不成熟的 HTTP 管线化: HTTP/1.1 的**管线化**是指使用一个 TCP连接, 将多个 HTTP 请求批量发送给服务器, 虽然可以批量发送请求, 但是服务器需要根据请求顺序依次响应; TCP 持久连接虽然可以减少连接建立和断开的次数, 但是需要等待当前请求完成后, 客户端才能发送下一个请求; 如果 TCP 通道中某个请求没有及时完成, 则会阻塞后续所有请求 (**队头阻塞问题**)
- **支持虚拟主机**: HTTP/1.0 中, 一个域名绑定一个唯一的 IP 地址, 一个服务器只能绑定一个域名; 随着虚拟主机技术的发展, 一个物理主机可以虚拟化为多个虚拟主机, 每个虚拟主机有单独的域名, 这些虚拟主机 (域名) 共用同一个 IP 地址; HTTP/1.1 的请求头中增加了 `Host` 字段, 表示域名 URL 地址, 服务器可以根据不同的 `Host` 字段, 进行不同的处理
- 支持动态大小的响应数据: HTTP/1.0 中, 需要在响应头中指定传输数据的大小, 例如 `Content-Length: 1024`, 这样浏览器可以根据指定的传输数据大小接收数据; HTTP/1.1 通过引入 **Chunk Transfer 分块传输机制**解决该问题, 服务器将传输数据分割为若干个任意大小的数据块, 每个数据块发送时, 附加上一个数据块的长度, 最后使用一个 0 长度的数据块作为数据发送结束的标志, 提供对动态大小的响应数据的支持
- **客户端 cookie**: HTTP/1.1 还引入了客户端 cookie

### HTTP/2.0

HTTP/1.1 对带宽的利用率不理想, 原因如下:

1. TCP 的慢启动: TCP 建立连接后开始发送数据, TCP 先使用较慢的发送速率, 并逐渐增加发送速率, 以探测网络带宽 (合适的发送速率), 直到稳态 (拥塞避免状态); CUBIC 使用慢启动, 导致页面首次渲染时间增加
2. 同时建立多条 TCP 连接时, 这些连接会竞争带宽, 影响关键资源的加载速度
3. HTTP/1.1 队头阻塞问题: HTTP/1.1 使用持久连接, 虽然多个 HTTP 请求可以共用一个 TCP 管道, 但是同一时刻只能处理一个请求, 当前请求完成前, 后续请求只能阻塞; 例如某个请求耗时 5s, 则后续所有请求都需要排队等待 5s
4. 协议开销大: header 携带的内容过多, 且不能压缩, 增加了传输成本

HTTP/2.0 实现思路: 一个域名只使用一个 TCP 长连接传输数据, 整个页面资源的加载只需要一次 TCP 慢启动, 同时避免了多个 TCP 连接竞争带宽的问题; HTTP/2.0 实现了资源的并行请求, 可以发送请求给服务器, 而不需要等待其他请求完成;

1. **HTTP 多路复用技术, 引入二进制分帧层, 并行处理请求**, 浏览器的请求数据包括请求行, 请求头, 如果是 POST 等方法, 还包括请求体; 请求数据传递给二进制分帧层后, 转换为若干个带有请求 ID 编号的帧, 通过 TCP/IP 协议栈发送给服务器, 服务器收到请求帧后, 将所有 ID 相同的帧合并为一个完整的请求, 并处理该请求; 类似的, 服务器的二进制分帧层将响应数据转换为若干个带有响应 ID 编号的帧, 通过 TCP/IP 协议栈发送给浏览器, 浏览器收到响应帧后, 将所有 ID 相同的帧合并为一个完整的响应
2. **请求优先级**: HTTP/2.0 支持请求优先级, 发送请求时, 标记该请求的优先级, 服务器收到请求后, 优先处理优先级高的请求
3. **服务器推送**: HTTP/2.0 服务器推送 (Server Push) 允许客户端请求某个资源 (例如 index.html) 时, 服务器推送其他资源 (例如 style.css, main.js), 不需要客户端再次请求; 可以提高页面加载速度
4. **头部压缩**: HTTP/2.0 对请求头和响应头进行 (gzip) 压缩
5. 可重置: HTTP/2.0 可以在不中断 TCP 连接的前提下, 取消当前的请求或响应

### HTTP/3.0

1. 随着丢包率的增加, HTTP/2.0 的传输效率降低, 2% 丢包率时, HTTP/2.0 的传输效率可能低于 HTTP/1.1
2. TCP 三次握手, TLS 一次握手, 浪费 3 到 4 个 RTT

HTTP/3.0 (QUIC, Quick UDP Internet Connection) 基于 UDP, 实现类似 TCP 的多路数据流, 可靠传输等特性

### 网络模型

- 应用层
  - 应用层 HTTP, FTP, DNS
  - 表示层 JPEG, PNG
  - 会话层 SSL, TLS
- 传输层 TCP, UDP
- 网络层 IP, ICMP, ARP, RIP
- 数据链路层
- 物理层

常见端口号

- 22: SSH
- 53: DNS
- 80: HTTP
- 443: HTTPS
- 3306: MySQL
- 5173: Vite
- 5432: PostgreSQL
- 6379: Redis
- 8080: Webpack
- 8888: Nginx
- 27017 MongoDB

### URL

```txt
协议 ://域名           /目录名 /文件名
https://www.example.com/path/to/index.html
```

## TCP, UDP

- TCP 是面向连接的, 可靠的, 基于字节流的传输层协议
- UDP 是无连接的, 不可靠的, 基于数据报的传输层协议

1. 数据分段: 数据在发送端分段, 在接收端重组
2. 到达确认: 接收端收到分段后, 向发送端返回一个 ACK 确认包, 确认号等于分段序号 +1
3. 流量控制, 拥塞控制
4. 失序处理: TCP 对收到的分段排序
5. 重复处理: TCP 丢弃重复的分段
6. 数据校验: TCP 使用首部校验和, 丢弃错误的分段

### TCP 三次握手

1. seq (sequence number) 序列号, 随机生成
2. ack (acknowledgement number) 确认号, ack = seq + 1
3. ACK, ACK = 1 确认
4. SYN (synchronous) SYN 默认 0, SYN = 1 表示请求同步连接
5. FIN (finish) FIN 默认 0, FIN = 1 表示请求终止连接

```bash
# SYN=1 seq=x
client ----- handshake1 ----> server
       ====> SYN1 = 1   ====> # 客户端向服务器请求同步
       ====> seq1       ====>

# SYN=1 ACK=1 seq=y ack=x+1
client <---- handshake2 <------- server
       <==== ACK1 = 1      <==== # 确认 SYN1, 客户端到服务器同步
       <==== SYN2 = 1      <==== # 服务器向客户端请求同步
       <==== ack1 = seq1+1 <==== # 确认收到 seq1
       <==== seq2          <====

# ACK=1 ack=y+1
# 客户端向服务器握手两次, 防止已失效的连接请求发送到服务器, 导致服务器资源的浪费
client ----- handshake3 -------> server
       ====> ACK2 = 1      ====> # 确认 SYN2, 服务器到客户端同步
       ====> ack2 = seq2+1 ====> # 确认收到 seq2
```

### 三次握手常见问题

1. 为什么要三次握手, 两次握手不可以吗

两次握手是最基本的; 三次握手中, 客户端向服务器握手两次, 可以防止已失效的连接请求发送到服务器, 导致服务器资源的浪费

2. 如果连接已建立, 客户端突然故障了怎么办

TCP 有一个保活计时器 (通常是 2h), 服务器每次收到客户端的请求后, 都会重置保活计时器; 如果 2h 内未收到客户端的请求, 服务器会每隔 75s 发送一个探测包, 如果连续发送 10 个探测包后仍未收到客户端的响应, 则服务器判断客户端故障, 关闭 TCP 连接

### TCP 四次挥手

```bash
# FIN=1 seq=x1
client ----- waving1 -------> server
       ====> FIN1 = 1   ====> # 客户端向服务器请求终止
       ====> seq1       ====>

FIN_WAIT_1 # 客户端等待服务器第 1 次确认 FIN1

# ACK=1 ack=x1+1 seq=y1
client <---- waving2 <---------- server
       <==== ACK1 = 1      <==== # 服务器第 1 次确认 FIN1
       <==== ack1 = seq1+1 <==== # 确认收到 seq1

FIN_WAIT_2 # 服务器发送剩余数据, 客户端等待服务器第 2 次确认 FIN1
# 和服务器向客户端请求终止的 FIN2

# ACK=1 FIN=1 ack=x1+1 seq=y2 (服务器剩余分段序号 y1-y2)
client <---- waving3 <---------- server
       <==== ACK1 = 1      <==== # 服务器第 2 次确认 FIN1, 客户端到服务器的单向连接关闭
       <==== FIN2 = 1      <==== # 服务器向客户端请求终止
       <==== ack1 = seq1+1 <==== # 确认收到 seq1
       <==== seq2          <====

# ACK=1 ack=y2+1 seq=x1+1
client ----- waving4 ----------> server
       ====> ACK2 = 1      ====> # 确认 FIN2, 服务器到客户端单向连接关闭, 服务器关闭 CLOSED
       ====> ack2 = seq2+1 ====> # 确认收到 seq2

TIME_WAIT # 客户端等待 2MSL 后, 客户端关闭 CLOSED
# MSL, Maximum Segment Lifetime 最长分段寿命, 大约 1-4 分钟
```

### 四次挥手常见问题

1. 为什么建立连接握手三次, 而断开连接挥手四次

建立连接时, 第二次握手时, 服务器将 ACK 和 SYN 合并发送给客户端, 可以少一次握手

断开连接时, 第一次挥手时, 服务器收到客户端的 FIN=1, 仅表示客户端不再发送数据, 但仍可以接收数据; 第二次挥手时, 服务器可能有剩余数据未发送, 需要 FIN_WAIT_2 发送剩余数据和第三次挥手, 通知客户端剩余数据发送完, 服务器将 ACK 和 FIN 分开发送给客户端

2. 为什么客户端第四次挥手后, 需要等待 TIME-WAIT (2MSL)
   1. MSL, Maximum Segment Lifetime 最大分段寿命, 是一个 TCP 分段在网络中的最长存活时间
   2. 第四次挥手时, 客户端确认的 ACK (对断开服务器到客户端的单向连接的 FIN 的确认) 可能丢失
   3. (服务器一个 MSL 后, 没有收到客户端确认的 ACK, 则会重传 FIN), 客户端可以在 2MSL 内收到服务器重传的 FIN, 并重新确认 ACK
   4. 确保网络中的旧 TCP 分段全部死亡

### TCP, UDP 对比

| TCP                | UDP                            |
| ------------------ | ------------------------------ |
| 面向连接           | 无连接                         |
| 点对点             | 一对一, 一对多, 多对一, 多对多 |
| 字节流             | 数据报                         |
| 有序               | 无序                           |
| 流量控制, 拥塞控制 | 无                             |
| 可靠               | 不可靠                         |
| 慢                 | 快                             |

## SSE, Server-Sent Events

SSE 是基于 HTTP 的服务器推送技术, 允许服务器主动向客户端推送实时数据

### SSE 工作原理

1. 客户端连接: 客户端使用 `window.EventSource` 创建 EventSource 对象, 指定服务器的 URL, 与服务器建立持久化的 HTTP 长连接 (使用 HTTP/HTTPS, 不需要升级协议, 请求头中包含 `Accept: text/event-stream` 指定事件流格式)
2. 服务器推送: 服务器设置 HTTP 响应头 `Content-Type: text/event-stream`, 向客户端推送事件, 每条事件包含 `event:` 事件名 `data:` 事件数据和 `id:` 事件 ID 等, 以 `\n\n` 分隔多条事件
3. 客户端接收: 客户端使用 onmessage 或 addEventListener 监听事件, 收到事件后, 触发对应的事件处理器, 处理事件数据
4. 连接关闭: 客户端关闭 EventSource 对象, 关闭与服务器的 HTTP 长连接

- SSE 特点: SSE 适用于服务器向客户端单向推送实时数据的场景
- 对比 SSE 和 WebSocket: SSE 更简单, 更轻量, 性能更好, 但 SSE 只支持服务器到客户端的单向数据流, WebSocket 支持全双工通信

::: code-group

```html [index.html]
<!DOCTYPE html>
<html>
  <head>
    <title>SSE</title>
  </head>
  <body>
    <div id="sse"></div>
    <script>
      const eventSource = new EventSource("http://localhost:5173/sse");
      eventSource.onmessage = (event) => {
        const data = event.data;
        document.getElementById("sse").innerHTML += `<p>${data}</p>`;
      };
      eventSource.onerror = (err) => {
        console.error(err);
        eventSource.close();
      };
    </script>
  </body>
</html>
```

```js [server.js]
import express from "express";
const app = express();
const port = 3000;

app.get("/sse", (req, res) => {
  console.log("Client connected to /sse");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "Keep-Alive");
  let counter = 0;
  const sendData = () => {
    counter++;
    const payload = {
      time: new Date().toISOString(),
      count: counter,
    };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    if (counter >= 100) {
      clearInterval(timer);
      res.end();
    }
  };
  const timer = setInterval(sendData, 1000);

  req.on("close", () => {
    console.log("Client disconnected");
    clearInterval(timer);
  });
});

app.listen(port, () => {
  console.log(`SSE server running at http://localhost:${port}`);
});
```

```js [vite.config.js]
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/sse": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // ws: true,
      },
    },
  },
});
```

:::

## WebSocket

WebSocket 前, 如果需要在服务器和客户端间双向通信, 则需要通过 HTTP 轮询实现, HTTP 轮询分为短轮询和长轮询

短轮询指浏览器使用 JavaScript 启动一个定时器, 以固定的间隔向服务器发送请求, 询问服务器有没有新消息, 缺点: 实时性差, 频繁的请求会增大服务器的压力

长轮询指浏览器发送请求后, 服务器保持连接, 等到有新消息时才返回, 减少了请求次数, 提高了实时性, 缺点:

1. 多线程服务器的 listener 线程长时间挂起, 等待新消息, 浪费 CPU 资源
2. 一个长时间无数据传输的 HTTP 连接, 链路上的任何一个网关都可能关闭该 HTTP 连接, 这是不可控的

HTML5 新增 WebSocket 协议, 可以在浏览器和服务器间建立不受限制的双向通信的通道

HTTP 判断 header 中是否包含 `Connection: Upgrade` 和 `Upgrade: websocket`, 以判断是否升级到 WebSocket 协议, 其他 header 字段

- `Sec-WebSocket-Key`: 浏览器随机生成的安全密钥
- `Sec-WebSocket-Version`: WebSocket 协议版本
- `Sec-WebSocket-Extensions`: 协商 WebSocket 连接使用的扩展
- `Sec-WebSocket-Protocol`: 协商 WebSocket 连接使用的子协议

### WebSocket 特点

- 支持双向通信, 实时性高
- 未加密的 WebSocket 协议标识符是 `ws://`, 端口号是 80, 对应 `http://`; 加密的 WebSocket 协议标识符是 `wss://`, 端口号是 443, 对应 `https://`
- 协议开销小, HTTP 每次通信都需要携带完整的 HTTP 头部, WebSocket 协议的头部较小, 减小了数据传输的开销
- 支持扩展: 用户可以扩展 WebSocket 协议, 也可以自定义子协议 (例如可以自定义压缩算法等)
- 没有跨域问题

### 对比 SSE 和 WebSocket

SSE, Server-Sent Events, 也称为事件流 Event Stream, 基于 HTTP, 利用 HTTP 的长连接特性, 在客户端和服务器间建立持久连接, 实现服务器向客户端的实时, 单向数据推送

WebSocket 基于握手协议 (Handshake Protocol), 使用 HTTP/HTTPS 握手以建立连接, 建立连接后, 在 TCP 连接上进行全双工通信. 在客户端和服务器间建立持久连接, 实现客户端和服务器间的实时, **全双工**通信

**SSE 和 WebSocket 的相同点**

SSE, Server-Sent Events 和 WebSocket 都减少了不必要的请求, 可以实现服务器向客户端的实时数据推送

**SSE 和 WebSocket 的不同点**

1. SSE 基于 HTTP, 利用 HTTP 的长连接特性, 在客户端和服务器间建立持久连接; WebSocket 基于 TCP
2. SSE 支持传输 text 文本字符串; WebSocket 支持传输 text 文本字符串和 blob 二进制数据
3. SSE 只支持单向数据流, 即只支持服务器向客户端推送数据; WebSocket 支持双向数据流, 没有消息大小限制
4. SSE 的 readyState:
   - CONNECTING 正在建立连接
   - OPEN 已建立连接, 正在接收服务器推送的数据
   - CLOSED 已关闭连接
5. SSE 不能手动关闭或重新连接; WebSocket 可以手动关闭和重新连接等

## HTTP 报文

HTTP 报文分为请求报文和响应报文

- 请求报文: 请求行, 请求头, 请求体
- 响应报文: 响应行 (状态行), 响应头, 响应体

### 请求报文

- 请求行: HTTP 请求报文的第一行, 包含请求方法 (GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH, CONNECT, TRACE), 请求 URL 和 HTTP 版本
- 请求头部的字段:
  - `Accept` 客户端支持的媒体类型, 例如 application/json, text/plain, text/html 等
  - `Accept-Encoding` 客户端支持的编码, 例如 gzip 等
  - `Accept-Language` 客户端的偏好语言
  - `Expect` 客户端询问服务器是否接受请求体
  - `If-Modified-Since` 字段值时间戳; 询问服务器指定时间戳后, 资源是否有修改
  - `If-None-Match` 字段值是 etag 版本号, 询问服务器 etag 版本号是否有更新, 即资源是否有修改
  - `Authorization` 字段值是 token
  - `Cookie`
  - `Host` 请求的主机名和端口号
  - `Range` 请求实体的字节范围, 用于范围请求 (分块传输, 断点续传)
  - `Referrer` 请求的源页面的 URL
  - `User-Agent` 用户代理, 即使用的浏览器和操作系统
  - `Origin` 预检请求或实际请求的源主机
  - `Access-Control-Request-Method` 用于预检请求, 告诉浏览器实际请求使用的请求方法
  - `Access-Control-Request-Headers` 用于预检请求, 告诉浏览器实际请求的请求头字段
  - `Connection` 当前会话结束后, 是否关闭 HTTP 连接, 例如 Close (关闭), Keep-Alive (持久连接, 不关闭), 默认 `Connection: Keep-Alive`
  - `Cache-Control` 缓存控制
  - `Content-Length` 请求体的长度
  - `Content-Type` 请求体的媒体类型
  - `Via` 代理服务器设置的请求头/响应头字段, 适用于正向/反向代理, 记录中间节点

### 响应报文

- `Access-Control-Allow-Credentials` 告诉浏览器, 服务器是否允许跨域请求携带凭据, 凭据包括 cookie, TLS 客户端证书等, 默认不允许跨域请求携带凭据, 以防止跨站请求伪造攻击
- `Access-Control-Expose-Headers` 可以通过 `xhr.getResponseHeader()` 获取响应头字段, 默认跨域响应仅暴露 CORS 白名单中的响应头字段, 可以在跨域响应的 `Access-Control-Expose-Headers` 响应头字段中, 指定暴露的其他响应头字段
- `Access-Control-Allow-Methods` 用于响应预检请求, 指定实际请求允许使用的请求方法
- `Access-Control-Allow-Origin` 指定允许 (跨域) 资源共享的源站
- `Access-Control-Allow-Headers` 用于响应预检请求, 指定实际请求允许使用的请求头字段
- `Access-Control-Max-Age` 指定缓存预检请求的响应头字段 `Access-Control-Allow-Methods` 和 `Access-Control-Allow-Headers` 的有效期, 单位是秒; 有效期内, 浏览器可以直接发送复杂请求的跨域请求, 不需要先发送预检请求
- `Age` 对象在代理缓存中停留的时间
- `Allow` 服务器响应状态码为 405 Method Not Allowed 时, 必须携带 `Allow` 响应头字段, 表示服务器允许哪些请求方法
- `Content-Disposition` 指定响应体以网页, 或以网页的一部分, 或以附件的形式下载到本地
- `Content-Encoding` 响应体的编码
- `Content-Language` 响应体的偏好语言
- `Content-Length` 响应体的长度
- `Content-Location` 响应体对应资源的 URL
- `Location` 3xx 重定向的 URL, 或 201 Created 新创建的资源的 URL
- `Content-Range` 响应体在整个资源中的字节范围
- `Content-Type` 响应体的媒体类型
- `Accept-Ranges` 表示服务器支持范围请求 (分块传输, 断点续传)
- `Vary` 使用内容协商时, 创建缓存键
- `Set-Cookie` 用于服务器将 cookie 发送到 User-Agent 用户代理, 用户代理在后续的请求中, 可以将 cookie 发送回服务器, 可以在一个响应中, 设置多个 Set-Cookie 字段以发送多个 cookie
- `WWW-Authentication` 定义 HTTP 身份验证方法: 质询, 用于获取资源的访问权限
- `ETag` 资源的版本号, 资源更新时, 必须生成新的 ETag 值
- `Expires` 资源的过期时间, 无效的日期 (例如 0) 也表示资源已过期
- `Last-Modified` 资源的上一次修改时间
- `Date` 消息创建的日期, 时间

## HTTP 状态码

### 1XX Informational 信息响应

- 100 Continue 客户端应该继续请求, 如果请求已完成则忽略
- 101 Switching Protocols

### 2XX Success 成功响应

- 200 OK 请求成功
- 204 No Content 请求成功, 响应体为空
- 206 Partial Content 范围请求成功 (分块传输, 断点续传)

### 3XX Redirection 重定向响应

- 301 Moved Permanently 永久重定向, 请求的资源永久移动到 Location 头部指定的 URL, 会将 POST 请求重定向为 GET 请求
- 302 Found 临时重定向, 请求的资源临时移动到 Location 头部指定的 URL, 会将 POST 请求重定向为 GET 请求
- 303 See Other 指定请求重定向的页面时, 必须使用 GET 方法
- 304 Not Modified 协商缓存
  - 请求强缓存的资源, 不会请求服务器
  - 请求协商缓存的资源, 仍会请求服务器
- 307 Temporary Redirect 临时重定向, 请求的资源临时移动到 Location 头部指定的 URL, 不会将 POST 请求重定向为 GET 请求
- 308 Permanent Redirect 永久重定向, 请求的资源永久移动到 Location 头部指定的 URL, 不会将 POST 请求重定向为 GET 请求

### 4XX Client Error 客户端错误响应

- 400 Bad Request 客户端错误
- 401 Unauthorized 客户端没有身份验证凭证, 无权访问资源
- 403 Forbidden 客户端 (可能) 有身份验证凭证, 但服务器拒绝客户端访问资源
- 404 Not Found 请求的资源不存在 (可能临时丢失或永久丢失)
- 405 Method Not Allowed 客户端使用的请求方法不被允许
- 408 Request Timeout 服务器决定关闭空闲连接, 而不是继续等待新请求
- 410 Gone 请求的资源已永久丢失

### 5XX Server Error 服务器端错误响应

- 500 Internal Server Error 泛指服务器端错误
- 502 Bad Gateway 作为网关或代理的服务器, 从上游服务器接收到无效的响应
- 503 Service Unavailable 服务器暂时无法处理请求, 可能是停机维护或过载
- 504 Gateway Timeout 作为网关或代理的服务器, 从上游服务器接收的响应超时

## 幂等和安全, RESTful

### 幂等和安全

- 安全: 无副作用, 例如 GET 安全, POST, PUT, DELETE 不安全
- 幂等: 请求一次和连续请求多次, 结果相同, 例如 GET, PUT, DELETE 幂等, POST 非幂等

### RESTful

- GET 安全, 幂等
- POST 不安全, 非幂等
- PUT/PATCH 不安全, 幂等
- DELETE 不安全, 幂等
- OPTIONS, CONNECT, HEAD, PATCH, TRACE

## 简单请求/复杂请求, 预检请求

### 简单请求

满足以下所有的是简单请求

- 请求方法是 GET/POST/HEAD (HTTP/1.0 提供的 3 种请求方法)
- Content-Type 字段值是 application/x-www-form-urlencoded, multipart/form-data 或 text/plain
- 请求头中没有自定义字段

### 复杂请求 (非简单请求)

浏览器每次发送复杂请求前, 都会先发送 OPTIONS 预检请求, 询问服务器允许哪些 HTTP 请求方法和请求头字段, 是否允许跨域请求等, OPTIONS 预检请求的目的是确保实际请求对服务器是安全的, OPTIONS 预检请求包含以下请求头字段

1. `Origin` 发送请求的域名
2. `Access-Control-Request-Method` 实际请求将使用的 HTTP 请求方法
3. `Access-Control-Request-Headers` 实际请求将携带的请求头字段

服务器通过请求头告诉浏览器: 允许发送跨域请求的域名, 允许哪些 HTTP 请求方法和请求头字段等

1. `Access-Control-Allow-Origin` 允许发送跨域请求的域名
2. `Access-Control-Allow-Methods` 允许哪些 HTTP 请求方法
3. `Access-Control-Allow-Headers` 允许哪些 HTTP 请求头字段

优化方案

1. 全部使用简单请求
2. 服务器设置 `Access-Control-Max-Age` 指定缓存预检请求的响应头字段 `Access-Control-Allow-Methods` 和 `Access-Control-Allow-Headers` 的有效期, 单位是秒; 有效期内, 浏览器可以直接发送复杂请求的跨域请求, 不需要先发送 OPTIONS 预检请求

## GET 和 POST 的区别

|                | GET                                      | POST                                                                                                |
| -------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 传输长度       | 有 URL 长度限制, 例如 64KB               | 没有限制                                                                                            |
| 参数的传输方式 | 请求行明文传输 (URL 查询字符串)          | 请求体传输 (例如 JSON, 表单)                                                                        |
| 场景           | 查询 (幂等)                              | 增删改 (非幂等)                                                                                     |
| 数据包数量     | 1 个数据包, 浏览器一并发送请求头和请求体 | 可能有 2 个数据包, 浏览器先发送请求头, 服务器响应 100 Continue 后, 浏览器再发送请求体, 耗时可能更长 |
| 缓存           | GET 请求的响应默认缓存                   | POST 请求的响应默认不缓存                                                                           |
| 历史记录       | 保存 GET 请求 的 URL, 查询参数           | 会保存 POST 请求的 URL, 不会保存 POST 请求的请求体                                                  |
| 参数类型       | 只支持 ASCII 字符                        | 无限制                                                                                              |
| 编码           | 只支持 URL 编码                          | 无限制                                                                                              |

## cookie

HTTP 是无状态协议, cookie 以键值对的形式存储状态, 每次向同一个域名发送请求时, 都会携带 cookie

### cookie 缺点

1. cookie 的 API 不友好
2. cookie 的大小限制 4KB
3. 不管同一个域名下的某个地址是否需要 cookie, 每次请求时, 请求头上都会携带 cookie, 增大网络流量
4. cookie 不安全, 可能被中间人截获

### cookie 参数

- key: 键名
- value: 键值
- expires: 过期时间, cookie 过期自动删除; 可以设置 `expires=Thu, 01 Jan 1970 00:00:00 UTC` 以手动删除 cookie, 如果不设置过期时间, 则 cookie 有效期是会话期, 页面关闭后自动删除
- path: 指定哪些 URL 路径可以携带该 cookie 发送回服务器, 设置 path 属性 `document.cookie = "key=value;path=/"`, 表示所有路径都可以携带该 cookie 发送回服务器; 设置 path 属性 `document.cookie = "key=value;path=/ys"`, 表示只有 /ys 路径和子路径可以携带该 cookie 发送回服务器
- domain 域名, `https://ys.mihoyo.com/` 和 `https://sr.mihoyo.com/` 是同一个域名下的不同子域名, 默认一个主机不允许访问另一个主机派发的 cookie, 可以设置 domain 属性 `document.cookie = "key=value;domain=.mihoyo.com"`, 允许 \*.mihoyo.com 域名下的所有主机访问派发的 cookie
- secure: `secure=true` 时, 只有使用 HTTPS 的 cookie 才会上传到服务器, 使用 HTTP 的 cookie 不会上传到服务器
- httponly: `httponly=true` 时, 服务器可以通过 Set-Cookie 响应头字段设置 cookie, 但客户端 JS 不能读写 cookie; 以防止 XSS 攻击截获 cookie

## localStorage, sessionStorage

- localStorage: 以键值对的形式存储, 不会过期, 每个域名限制 5M, 同一个域名的所有页面共享 localStorage, `https://ys.mihoyo.com/` 和 `https://sr.mihoyo.com/` 是同一个域名下的不同子域名, 不共享 localStorage
- sessionStorage: 页面关闭后自动删除
- Pinia, Zustand: 页面刷新后自动删除

IndexedDB 是一个 KV 存储的非关系型数据库

> [!tip]
>
> 同源: 协议, 域名 (包括子域名), 端口号都相同

### 对比

cookie, localStorage, sessionStorage 和 IndexedDB 都是客户端存储技术

| cookie                                                   | localStorage                      | sessionStorage                     | IndexedDB                         |
| -------------------------------------------------------- | --------------------------------- | ---------------------------------- | --------------------------------- |
| HTTP                                                     | HTML5                             | HTML5                              | HTML5                             |
| 每次请求时, 请求头上都会携带 cookie                      | 只在客户端存储                    | 只在客户端存储                     | 只在客户端存储                    |
| 4KB                                                      | 5MB                               | 5MB                                | 无限制                            |
| 可以设置过期时间, 默认有效期是会话期, 页面关闭后自动删除 | 不会过期                          | 有效期是会话期, 页面关闭后自动删除 | 不会过期                          |
| 同源窗口共享, 可以设置 domain 属性以跨子域名共享         | 同源窗口共享                      | 不共享                             | 同源窗口共享                      |
| 可以设置 httponly 属性, 以防止 XSS 攻击                  | 只在客户端存储, 容易受到 XSS 攻击 | 只在客户端存储, 容易受到 XSS 攻击  | 只在客户端存储, 容易受到 XSS 攻击 |

## 客户端存储跨域

### cookie 跨域共享

cookie 可以跨域共享, 服务器派发 cookie 时设置 domain 属性, 设置 path 属性 (通常是 /), 以跨子域名共享

### localStorage, sessionStorage, IndexedDB 跨域共享

1. 根据同源策略, localStorage, sessionStorage, IndexedDB 默认不允许跨域共享
2. 可以使用 iframe, 代理页面, 后端使用 CORS 中间件, postMessage 等方式实现跨域共享

```bash
pnpm add http-server -g

# pwd: /path/to/cors/2024
http-server -p 2024
# pwd: /path/to/cors/2025
http-server -p 2025
```

::: code-group

```html [cors/2024/index.html]
<!DOCTYPE html>
<html>
  <head>
    <title>数据源页面</title>
  </head>
  <body>
    数据源页面
    <script>
      window.addEventListener("message", function (event) {
        if (event.origin !== "http://127.0.0.1:2025") return;
        const { action, key, value } = event.data;
        if (action === "get") {
          const data = localStorage.getItem(key);
          event.source.postMessage(
            { action: "get", key, value: data },
            event.origin,
          );
        }
        if (action === "set") {
          localStorage.setItem(key, value);
          event.source.postMessage(
            { action: "set", key, success: true },
            event.origin,
          );
        }
      });
    </script>
  </body>
</html>
```

```html [cors/2025/index.html]
<!DOCTYPE html>
<html>
  <head>
    <title>主页面</title>
  </head>
  <body>
    <button onclick="setData()">写数据</button>
    <button onclick="getData()">读数据</button>
    <script>
      let iframe;
      (function () {
        iframe = document.createElement("iframe");
        iframe.src = "http://127.0.0.1:2024/index.html";
        // iframe.style.display = "none";
        document.body.appendChild(iframe);
      })();
      let age = 0;
      function setData() {
        const message = {
          action: "set",
          key: "user",
          value: JSON.stringify({ name: "米哈游发 offer", age: ++age }),
        };
        iframe.contentWindow.postMessage(message, "http://127.0.0.1:2024");
      }
      function getData() {
        const message = { action: "get", key: "user" };
        iframe.contentWindow.postMessage(message, "http://127.0.0.1:2024");
      }
      window.addEventListener("message", function (event) {
        if (event.origin !== "http://127.0.0.1:2024") return;
        const { action, key, value } = event.data;
        if (action === "get") {
          console.log("读数据成功:", JSON.parse(value));
        }
        if (action === "set") {
          console.log("写数据成功");
        }
      });
    </script>
  </body>
</html>
```

:::

## DNS 域名系统

DNS 域名系统是一个分布式数据库, 存储域名到 IP 地址的映射, 使用 UDP, 端口号 53

- 递归查询: 直接返回域名解析结果
- 迭代查询: 返回下一级 DNS 服务器地址

### DNS 解析过程

- 检查 DNS 缓存:
  - 浏览器 DNS 有没有? 有则 return
  - 操作系统 DNS 有没有? 有则 return
  - 本机 /etc/hosts 文件中有没有? 有则 return
- 客户端请求本地 DNS 服务器 (例如: 家庭路由器, 企业 DNS 服务器, 运营商提供的 DNS 服务器), 如果命中, 则返回; 如果未命中, 则本地服务器执行**迭代查询**:
  - 本地 DNS 服务器 -> 根 DNS 服务器
  - 本地 DNS 服务器 -> 顶级 DNS (TLD) 服务器 (例: .com)
  - 本地 DNS 服务器 -> 权威域名服务器 (例: 阿里云解析)
- 本地 DNS 服务器缓存结果, 并返回结果给客户端
- 浏览器到本地 DNS 服务器是**递归查询** (递归查询直接返回域名解析结果)

## 浏览器缓存

HTTP 缓存是保存资源副本的技术, 提高页面性能, 减少网络流量, 降低服务器压力; 浏览器或服务器判断请求的资源已被缓存时, 直接返回; HTTP 缓存分为私有缓存 (浏览器缓存) 和共享缓存 (CDN 缓存, 网关缓存, 代理缓存)

- 私有缓存: 浏览器缓存
- 共享缓存: CDN 缓存, 网关缓存, 代理缓存

浏览器缓存, 也称为客户端缓存; 浏览器缓存分为强缓存和协商缓存, 强缓存的优先级高于协商缓存

- 强缓存优先级高于协商缓存
- 强缓存中, `Cache-Control` 优先级高于 `Expires`
- 协商缓存中, `ETag` 优先级高于 `Last-Modified`

### 强缓存

1. 请求强缓存的资源, 不会发送请求到服务器, 直接从客户端缓存中获取资源, 浏览器直接返回 `200 From Memory Cache/From Disk Cache`
2. 服务器可以使用响应头中的 `Cache-Control` 或 `Expires` 字段设置强缓存, `Cache-Control` 的优先级高于 `Expires`, 表示资源在客户端的缓存有效期

- Cache-Control: max-age=30000000
- Expires: Mon, 01 Jan 2025 00:00:00 GMT

### 协商缓存 (对比缓存)

- 请求协商缓存的资源, 仍会请求服务器, 服务器根据请求头的 `Last-Modified/If-Modified-Since` 和 `ETag/If-None-Match` 两对字段判断协商缓存是否命中; 如果命中, 服务器返回 `304 Not Modified`, 响应体为空; 如果未命中, 服务器返回 `200 OK`, 响应体中携带更新的资源
- 服务器可以使用响应头中的 `ETag` 或 `Last-Modified` 字段设置协商缓存, 客户端请求时自动携带 `If-None-Match` (对应 `ETag`) 或 `If-Modified-Since` (对应 `Last-Modified`) 请求头, `ETag` 的优先级高于 `Last-Modified`

- 先试图命中强缓存, 再试图命中协商缓存

**强缓存和协商缓存的相同点**

如果命中, 都是从客户端缓存中加载资源, 不是从服务器加载资源

**强缓存和协商缓存的不同点**

- 强缓存不会发送请求到服务器, 协商缓存会发送请求到服务器; 协商缓存也未命中时, 才会从服务器加载资源
- 强缓存 `Cache-Control`: 指定存活时间, 例 `Cache-Control: max-age=30000000`
- 强缓存 `Expires`: 指定过期时间, 例 `Expires: Mon, 01 Jan 2025 00:00:00 GMT`
- 协商缓存 `If-Modified-Since`: 服务器使用响应头中的 `Last-Modified` 字段设置协商缓存, 客户端请求时自动携带 `If-Modified-Since` 比较值是否相同
- 协商缓存 `If-None-Match`: 服务器使用响应头中的 `ETag` 字段设置协商缓存, 客户端请求时自动携带 `If-None-Match` 请求头, 比较值是否相同
- 强缓存中, `Cache-Control` 优先级高于 `Expires`
- 协商缓存中, `ETag` 优先级高于 `Last-Modified`

### 缓存策略

1. index.html 使用协商缓存
2. \*.css, \*.js, 图片, 字体等使用强缓存, 并在文件名后加 hash 值

## 浏览器渲染

- 进程是资源分配的最小单位
- 线程是 cpu 调度的最小单位
- 多线程: 1 个进程中有多个线程

### chrome 多进程架构

- 浏览器主要包含: 浏览器主进程, **渲染进程**, 网络进程, GPU 进程, 插件进程
- chrome 为每一个页面创建一个渲染进程, 一个页面崩溃不会影响其他页面

### 渲染进程

**JS 是单线程的**: JS 的主要任务是处理用户交互, 操作 DOM; 如果 JS 是多线程的, 可能操作 DOM 冲突, 例如两个线程同时操作一个 DOM, 一个修改另一个删除

> [!tip]
>
> GUI 渲染线程和 JS 引擎线程是互斥执行的: GUI 渲染线程执行时, JS 引擎线程会被挂起; JS 引擎线程执行时, GUI 渲染线程会被挂起

chrome 为每一个页面创建一个渲染进程, 渲染进程是多线程的, 主要包含

- **GUI 渲染线程**: 负责渲染页面, 解析 HTML, CSS; 构建 DOM 树, CSSOM 树; 将 DOM 树和 CSSOM 树合并为渲染树 (Render Tree); 布局和绘制，回流和重绘等; 当页面需要回流 (reflow) 或重绘 (repaint) 时, 执行 GUI 渲染线程
- **JS 引擎线程 (主线程)**: 一个页面 (一个渲染进程) 中只有一个 JS 引擎线程 (例如 V8 引擎), 负责将同步任务加入同步任务栈 (函数调用栈), 执行所有同步代码, 宏任务和微任务
- **事件触发线程**: 将异步任务加入异步任务队列 (宏任务加入宏任务队列, 微任务加入微任务队列)
- **定时器触发线程**: 执行 setTimeout, setInterval 的线程
- **网络线程**: 执行 XMLHttpRequest, fetch, postMessage 的线程
- **I/O 线程**: 负责文件 I/O, IPC 进程间通信等

**单线程本质**: JS 引擎线程 (主线程) 负责执行所有同步代码, 宏任务和微任务, 宏任务触发可能依赖其他线程

- setTimeout/setInterval: 依赖定时器触发线程
- I/O 操作: XMLHttpRequest, fetch, postMessage 依赖网络线程 (node 环境依赖 libuv)
- requestAnimationFrame: 依赖 GUI 渲染线程

### 浏览器渲染过程

1. 解析 HTML, 深度优先遍历以构建 DOM 树
   - 遇到 `<style>` 标签时, 会同时构建 CSSOM 树
   - 遇到未使用 async 或 defer 或 `type="module"` 标记的 `<script>` 标签时, 会阻塞 DOM 树的构建, 并等待 CSSOM 树构建完成后, 转而执行后续的 JS 脚本
   - async 是**异步加载**, JS 脚本可用时立即执行, 执行 JS 脚本时可能阻塞 DOM 树的构建
   - defer 是**延迟执行**, 延迟到 DOM 树构建完成后执行 JS 脚本
   - 对于 type="module" 标记的 `<script>` 标签, 默认是 defer 延迟执行, 如果添加 async, 则会覆盖默认的 defer `<script type="module" src="/src/main.js" async></script>`
2. 将 DOM 树和 CSSOM 树合并为渲染树 (Render Tree)
3. 布局和绘制
4. 回流和重绘: 回流 reflow, 有关宽高等, 性能开销大; 重绘 repaint, 有关颜色等, 性能开销小

### 回流 (reflow) 和重绘 (repaint)

回流 (reflow) 是指元素的位置, 宽高等改变时, 渲染引擎重新计算**整个**页面布局, 回流后一定有重绘, 性能影响较大

重绘 (repaint) 是指元素的颜色等 CSS 属性改变时, 渲染引擎重新绘制**部分**元素, 重绘前不一定有回流, 性能影响较小

回流的触发条件

- 页面首次渲染
- 浏览器窗口的宽高 (视口 vw, vh) 改变
- 添加或删除可见的 DOM 元素
- DOM 元素的位置 (left, top, ...), 宽高 (weight, height, margin, padding, font-size, ...) 等改变
- DOM 元素的字体大小改变
- 激活 CSS 伪类 (例如 :hover)

重绘的触发条件: CSS 的 color, background, border, box-shadow, outline, visibility 等属性改变

## 关键渲染路径, 阻塞渲染

优化关键渲染路径, 可以缩短浏览器渲染页面的时间

### CSS 的阻塞

CSS 不会阻塞 DOM 树的构建, 会阻塞 DOM 树的渲染和后续 JS 脚本的执行

1. 构建 CSSOM 树, 不会阻塞 DOM 树的构建
2. 等待 CSSOM 树构建完成后, 才能将 DOM 树和 CSSOM 树合并为渲染树 (Render Tree)
3. 等待 CSSOM 树构建完成后, 才能执行后续的 JS 脚本

### JS 的阻塞

浏览器解析 HTML 时, 遇到未使用 async 或 defer 或 `type="module"` 标记的 `<script>` 标签时, 会阻塞 DOM 树的构建, 并等待 CSSOM 树构建完成后, 转而执行后续的 JS 脚本

- async 是**异步加载**, JS 脚本可用时立即执行, 执行 JS 脚本时可能阻塞 DOM 树的构建
- defer 是**延迟执行**, 延迟到 DOM 树构建完成后执行 JS 脚本
- 对于 type="module" 标记的 `<script>` 标签, 默认是 defer 延迟执行, 如果添加 async, 则会覆盖默认的 defer `<script type="module" src="/src/main.js" async></script>`

### rel="preload", rel="modulepreload"

- `<link rel="preload stylesheet" href="/style.css" as="style">` rel="preload" 预加载任意资源, as 指定资源类型 script, style, font, image, ...
- `<link rel="modulepreload" href="/src/main.js">`: rel="modulepreload" 预加载 esm 模块和依赖的子模块

## 浏览器安全机制

1. 同源策略 (Same-origin policy)
2. 内容安全策略 (Content Security Policy, CSP)
3. HTTPS
   - 非对称加密以传输密钥 (预主密钥), 对称加密以传输数据
   - 数字证书, 数字签名

### 同源策略、跨域

同源策略: 如果两个 URL 的协议, 域名 (IP) 和端口都相同, 则两个 URL 同源

- DOM 层面: 不同源则不允许相互操作 DOM, 但是引入了跨文档消息机制, 允许一个窗口使用另一个窗口的引用, `targetWindow.postMessage`, 和不同源的 DOM 进行通信
- 数据层面: 不同源则不允许相互访问 cookie, sessionStorage, localStorage, IndexedDB 等, 但是页面中可以嵌入第三方页面 (仍然有 CSP 内容安全策略限制)
- 网络层面: 不同源则不允许使用 fetch, XMLHttpRequest 发送数据给不同源的主机, 但是引入了 CORS 跨域资源共享

```js
// http://127.0.0.1:5173/index.html
const iframe = document.createElement("iframe");
iframe.src = "http://127.0.0.1:5174/index.html";
// iframe.style.display = "none";
document.body.appendChild(iframe);
function setData() {
  const message = "ping";
  iframe.contentWindow.postMessage(message, "http://127.0.0.1:5174");
}
```

### 解决跨域

1. 前后端协商 jsonp: `<script>` 标签的 src 不受同源策略的限制, 可以发送跨域请求, 但只能发送 GET 请求
2. 前端解决: 使用代理, 只在开发环境中使用
3. 后端解决: 设置请求头 `Access-Control-Allow-Credentials`, `Access-Control-Expose-Headers`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`
4. 使用 Nginx 代理

### CSP 内容安全策略

目的: 预防跨站脚本攻击 XSS, Cross-Site Scripting

- 可以通过设置 HTTP 响应头中的 Content-Security-Policy 字段定义内容安全策略
- 也可以通过设置 `<meta>` 标签定义内容安全策略

`<meta http-equiv="content-security-policy" content="default-src 'self'; script-src 'self' https://localhost:5174;">`

使用 `<meta>` 标签定义内容安全策略, `default-src 'self'` 只允许从同源加载未明确指定类型的资源, `script-sec: 'self' https://localhost:5174` 允许从同源和 `https://localhost:5174` 加载 JS 脚本

- script-src: 允许执行的 JS 脚本的来源
- style-src: 允许加载的样式表的来源
- img-src: 允许加载的图片的来源
- font-src: 允许加载的字体的来源
- connect-src: 允许建立 AJAX (XMLHttpRequest, fetch), WebSocket 连接的来源
- default-src: 为所有未明确指定类型的资源设置默认来源规则

### HTTPS

HTTP 明文传输不安全, 引入安全层: IP (网络层) -> TCP (传输层) -> SSL/TLS (安全层) -> HTTP (应用层)

- 对称加密: 加密和解密使用相同密钥, 例如 AES
  - 优点: 计算量小, 加密解密速度快
  - 缺点: 需要传输密钥, 不安全
- 非对称加密: 加密和解密使用不同密钥, 如果使用公钥 (public key) 加密, 则必须使用私钥 (private key) 解密; 如果使用私钥加密, 则必须使用公钥解密, 例如 RSA
  - 优点: 只需要传输公钥, 不需要传输私钥, 安全
  - 缺点: 计算量大, 加密解密速度慢

### SSL/TLS 握手

1. 客户端问候 (Client Hello): 客户端请求服务器, 发送 "客户端问候" 消息, 该消息包括客户端支持的 TLS 版本, 支持的密码套件, 和客户端随机数
2. 服务器问候 (Server Hello): 服务器响应客户端, 发送 "服务器问候" 消息, 该消息包括服务器选择的 TLS 版本, 选择的密码套件, 和服务器随机数
3. 服务器发送服务器的数字证书 (包含服务器的公钥)
4. 客户端通过数字证书验证服务器的身份合法性
5. 客户端生成一个随机的 "预主密钥", 使用服务器公钥加密 "预主密钥", 并发送给服务器
6. 服务器使用服务器私钥解密 "预主密钥"
7. 客户端和服务器使用客户端随机数, 服务器随机数和 "预主密钥" 共同生成一个会话密钥, 用于后续的对称加密
8. 客户端就绪 (Client Finished): 客户端发送一个 "已完成" 消息, 该消息使用会话密钥加密, 表示客户端已经准备好对称加密通信
9. 服务器就绪 (Server Finished): 服务器也发送一个 "已完成" 消息, 该消息也使用会话密钥加密, 表示服务器也已经准备好对称加密通信
10. 握手完成后, 客户端和服务器使用会话密钥进行安全的对称加密通信

### 数字证书

- 非对称加密中, 服务器需要将公钥发送给客户端, 公钥发送过程中, 可能被中间人拦截并替换, 中间人就可以取代服务器与客户端通信, 即中间人攻击
- 解决方法是, 服务器不是将公钥直接发送给客户端, 而是将公钥写入证书认证机构 (Certificate Authority, CA) 颁发的数字证书中, 服务器将数字证书 (包含服务器的公钥) 发送给客户端
- 通过数字证书, 服务器可以向浏览器证明身份合法性

### 数字签名

数字签名使用非对称加密, 保证数据的完整性

## 浏览器攻击

1. 跨站脚本攻击 (XSS, Cross-Site Scripting)
2. 跨站请求伪造 (CSRF, Cross-Site Request Forgery)
3. 中间人攻击 (MITM, Man-in-the-Middle)

### XSS 跨站脚本攻击

- 反射型 XSS: 非持久型 XSS, 反射型 XSS 的恶意代码在地址栏上 `http://127.0.0.1:5500/index.html?a=<script>alert(1)</script>`
- 存储型 XSS: 持久型 XSS, 存储型 XSS 的恶意代码存储在数据库中, **最严重**
- DOM 型 XSS: 例如 document.write(), eval(), innerHTML, location, v-html, dangerouslySetInnerHTML 等

### 预防 XSS

- 处理用户输入时, 对输入进行过滤; 输出到页面时, 对输出进行转义
- 设置响应头的 CSP 内容安全策略 `Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com;`
- 禁用 document.write(), eval(), innerHTML, location, v-html, dangerouslySetInnerHTML 等

## DOM 事件模型

事件传播阶段

- 捕获阶段 Capture Phase: 事件从根节点 (window) 逐层向下传递到目标元素 window -> document -> `<html>` -> `<body>` -> `<ul>` -> `<li>`
- 目标阶段 Target Phase: 事件到达目标元素 `<li>`
- 冒泡阶段 Bubble Phase: 事件从目标元素逐层向上冒泡到根节点 (window) `<li>` -> `<ul>` -> `<body>` -> `<html>` -> document -> window

### element.addEventListener(eventName, callback, useCapture)

- eventName: 事件名
- callback: 事件触发时执行的回调函数
- useCapture
  - true: 回调函数在捕获阶段执行
  - false: 回调函数在冒泡阶段执行, 默认

::: code-group

```html
<!-- 点击 child, 输出: Parent capture -> Child 2 -> Child 1 -> Child 3 -> Parent bubble -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="parent">
      <div id="child"></div>
    </div>
  </body>

  <script>
    const parent = document.getElementById("parent");
    const child = document.getElementById("child");
    parent.addEventListener("click", () => console.log("Parent capture"), true);
    parent.addEventListener("click", () => console.log("Parent bubble"), false);
    child.addEventListener("click", () => console.log("Child 1") /** false */);
    child.addEventListener("click", () => console.log("Child 2"), true);
    child.addEventListener("click", () => console.log("Child 3"), false);
  </script>
</html>
```

```html
<!-- 点击 child, 输出: Parent capture -> Child 2 -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="parent">
      <div id="child"></div>
    </div>
  </body>

  <script>
    const parent = document.getElementById("parent");
    const child = document.getElementById("child");
    parent.addEventListener("click", () => console.log("Parent Capture"), true);
    parent.addEventListener("click", () => console.log("Parent Bubble"), false);
    child.addEventListener("click", () => console.log("Child 1") /** false */);
    child.addEventListener(
      "click",
      (ev) => {
        console.log("Child 2");
        ev.stopPropagation(); // 阻止事件冒泡
      },
      true,
    );
    child.addEventListener("click", () => console.log("Child 3"), false);
  </script>
</html>
```

:::

- 阻止事件冒泡 `event.stopPropagation()`
- 阻止默认行为 `event.preventDefault()`

### 事件委托 (代理)

- 利用事件冒泡, 将目标元素的事件委托给父/祖先元素处理
- 例如 `<ul>`, 需要给每个 `<li>` 都绑定事件, 消耗内存; 插入新的 `<li>` 时, 需要给新的 `<li>` 绑定事件
- 使用事件委托, 只需要给父/祖先元素绑定事件, 节约内存; 插入新的 `<li>` 时, 不需要给新的 `<li>` 绑定事件
- event.target 是触发事件的元素, event.currentTarget 是绑定事件的元素, 使用事件委托时, event.currentTarget 是 event.target 的父/祖先元素

### Vue 事件修饰符

- .stop 阻止事件冒泡 `event.stopPropagation()`
- .prevent 阻止默认行为 `event.preventDefault()`
- .capture 回调函数在捕获阶段执行 `addEventListener("click", () => {}, true /** useCapture */);`

## AJAX

AJAX: Asynchronous JavaScript And XML

1. 创建 xhr 实例 `const xhr = new XMLHttpRequest();`
2. open 方法: 指定请求方法, 请求 URL, 是否异步 (默认 true)
3. send 方法: 发送请求
4. onreadystatechange: readyState 改变时, 调用的回调函数

- readyState 0: 已创建 xhr 实例, 未调用 open 方法
- readyState 1: 已调用 open 方法, 未调用 send 方法
- readyState 2: 已调用 send 方法, 已收到服务器返回的响应头
- readyState 3: 正在接收服务返回的数据
- readyState 4: 已收到服务器返回的全部数据

xhr 发送 GET 请求

```js
const xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:3000");
xhr.onload = function () {
  if (xhr.status === 200) {
    console.log(xhr.responseText);
  } else {
    console.log(xhr.status);
  }
};
xhr.send(/* params */);
```

## fetch

- text() 将响应体解析为文本字符串
- json() 将响应体解析为 JSON 并返回一个 JS 对象
- blob() 将响应体解析为二进制数据, 并返回一个 Blob 对象
- arrayBuffer() 将响应体解析为二进制数据, 并返回一个 ArrayBuffer 对象
- formData() 将响应体解析为表单数据, 并返回一个 FormData 对象

```js
fetch("http://localhost:3000")
  .then((resp) => resp.text())
  .then((resp) => {
    console.log(resp);
  });
```

## navigator.sendBeacon

`navigator.sendBeacon` 用于数据上报

XMLHttpRequest 或 fetch, 页面卸载可能导致数据丢失; `navigator.sendBeacon` 不会受到页面卸载的影响, 可以发送跨域请求

- `navigator.sendBeacon` 只能发送 GET 请求或 POST 请求
- 不能自定义请求头
- 只能传输少量数据 (<= 64KB)
- 只能传输 ArrayBuffer, ArrayBufferView, Blob, DOMString, FormData 或 URLSearchParams 类型的数据

```js
navigator.sendBeacon("http://localhost:3000");
```

## navigator.connection

1. 使用 online/offline 事件监听器, 监听网络连接状态的改变: 在线/离线
2. 使用 navigator.onLine 属性, 获取当前的网络连接状态

```js
// 使用 online/offline 事件监听器
window.addEventListener("online", () => {
  console.log("online");
});

window.addEventListener("offline", () => {
  console.log("offline");
});

// 使用 navigator.onLine 属性
if (navigator.onLine) {
  console.log("online");
} else {
  console.log("offline");
}
```

```js
const conn = navigator.connection;
// 当前网络连接的下载速率, 单位 Mbps
console.log("Network downlink:", conn.downlink);
// 当前网络连接的类型: slow-2g, 2g, 3g, 4g
console.log("Network effective type:", conn.effectiveType);
// 当前网络连接的 rtt, 单位 ms
console.log("Network round-trip time:", conn.rtt);
// 是否处于数据节省模式
console.log("Network data-saving mode:", conn.saveData);
```
