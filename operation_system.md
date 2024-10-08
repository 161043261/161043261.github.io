# Operation System

## 第一章 操作系统的概念

### 1.1.1 操作系统的功能

操作系统作为系统资源的管理者，向上层提供方便易用的服务

1. cpu 管理
2. 存储器管理
3. 文件管理
4. 设备管理

操作系统作为用户与计算机硬件系统之间的接口

1. 命令接口：联机命令接口、脱机（批处理）命令接口
2. 程序接口（系统调用、广义指令）：系统调用类似函数调用，是应用程序请求操作系统服务的唯一方式

用户接口 = 命令接口 + 程序接口

操作系统实现了对计算机资源的扩充

### 1.1.2 操作系统的特征

并发和共享是操作系统最基本的特征

1. 并发（Concurrence）：宏观同时，微观交替（并行需要多 cpu 支持）
2. 共享（Sharing）
   - 互斥共享方式：一段时间内只允许一个进程访问该资源
   - 同时访问方式：一段时间内允许多个进程“同时”访问
3. 虚拟（Virtual）
4. 异步性 / 不确定性（Asynchronism）：多道系统允许多个程序并发发运行，但由于资源有限，进程的运行以不可预知的速度向前推进

### 1.2.1 操作系统发展历程

1. 手工操作阶段：用户独占全机、人机速度矛盾，资源利用率低
2. 批处理阶段
   - 单道批处理系统：自动性、顺序性、单道性
   - 多道批处理系统：多道、宏观上并行、微观上串行
     多道批处理系统 cpu 利用率高、系统吞吐量大、IO 设备利用率高
3. 分时操作系统：同时性、交互性、独立性、及时性
4. 实时操作系统：及时性、可靠性

### 1.2.2 操作系统运行环境

|           核心态（管态）           |           用户态（目态）           |
| :--------------------------------: | :--------------------------------: |
| 特权指令：不允许用户直接使用的指令 | 非特权指令：允许用户直接使用的指令 |

程序状态字寄存器 PSW：0 表示核心态、1 表示用户态

- 核心态 => 用户态：执行特权指令，修改 PSW 的标志位为 1，意味着操作系统将主动让出 cpu 使用权。核心态到用户态的切换发生在中断返回用户程序时
- 用户态 => 核心态：由“中断”触发，修改 PSW 的标志位为 0，硬件自动完成状态切换，意味着操作系统将强行夺回 cpu 使用权。中断是操作系统夺回 cpu 使用权的唯一途径，用户态到核心态的切换发生在中断产生时

操作系统内核

1. 时钟管理
2. 中断机制
3. 原语
   - 位于操作系统的最底层，是最接近硬件的部分
   - 程序的运行具有原子性，不可中断
   - 程序的运行时间短、调用频繁
4. 相关数据结构的管理：进程管理、存储器管理、设备管理

中断分为异常（内中断、软中断）、外中断（硬中断）

异常（内中断、软中断）：与当前运行的指令有关，中断信号来自 cpu 内部

- 自陷 Trap（访管中断）：软件中断。如断点调试
  用户进程通过运行 trap 指令（陷入指令、访管指令）发起系统调用，请求操作系统提供服务
- 故障 Fault：软件中断，由错误条件引起，可能被故障处理程序修复。如除 0、缺页中断
- 终止 Abort：硬件中断，不可修复的致命错误

外中断（硬中断）：与当前运行的指令无关，中断信号来自 cpu 外部硬件

系统调用

1. 系统调用是用户程序请求操作系统服务的唯一接口
2. 用户程序设计时，使用系统调用命令，该命令经过编译后，形成若干参数和陷入（trap）指令

中断处理的过程

1. 硬件（中断隐指令）关中断
2. 硬件保存断点
3. 硬件查询中断向量表，找到中断信号对应的中断向量（中断向量指明中断服务程序的入口地址）
4. 保存现场
5. 运行中断服务程序，操作系统保存中断屏蔽字和通用寄存器的值
6. 恢复现场、中断返回

### 1.2.3 操作系统结构

|                       宏内核                       |                     微内核                     |
| :------------------------------------------------: | :--------------------------------------------: |
| 将操作系统的主要功能模块作为一个整体，运行在核心态 |         只将最基本的功能模块保留在内核         |
|                       性能好                       |           占用内存小、方便扩展、可靠           |
|        复杂、占用内存大、不方便扩展、不可靠        | 性能差，需要频繁的在核心态和用户态之间进行切换 |

1. 进程（线程）间通信是微内核最频繁使用的功能

2. 微内核能有效支持多 cpu，适用于*分布式操作系统*

3. 操作系统的引导程序分为两种：
   - 位于 ROM 的自举装入程序
   - 位于外存启动块的引导程序

## 第二章 进程和线程（cpu 管理）

### 2.1.1 进程的特征

1. 当进程被创建时，操作系统为该进程分配一个唯一的进程 ID（PID）
2. PCB 是进程存在的唯一标志
3. 操作系统控制进程需要的信息都存放在 PCB 中
4. 进程是进程实体的运行过程，是操作系统资源分配的基本单位
5. 进程的基本特征
   - 动态性：进程有生命周期，是进程最基本的特征
   - 并发性
   - 独立性：进程实体是独立运行、独立获得资源的基本单位
   - 异步性（不确定性）：由于进程的相互制约，各进程以独立的、不可预知的速度向前推进。
   - 结构性：进程由程序段、数据段、PCB 组成。程序段、数据段供进程使用，PCB 供操作系统使用

### 2.1.2 进程的状态

基本状态（3 种）：运行态、就绪态、阻塞态（等待态）

创建态、终止态

1. 一个进程可运行 exit 系统调用，请求操作系统终止该进程
2. 一个进程从运行态变成阻塞态是主动行为（自我阻塞），从阻塞态变成就绪态是被动行为
3. 不能由阻塞态直接变成运行态（阻塞态 => 就绪态 => 运行态），也不能由就绪态直接变成阻塞态（就绪态 => 运行态 => 阻塞态）
4. 挂起态：就绪挂起、阻塞挂起

### 2.1.3 进程控制

进程的组织方式：链接方式（队列）、索引方式（索引表）

PCB 主要包含

- 进程描述信息
- 进程控制和管理信息
- 资源分配清单
- cpu 相关信息

原语：用于进程控制的程序段，原语的特点是运行期间不允许中断，是不可分割的基本单位

原语的运行具有原子性，即运行期间不允许被中断，可以使用关中断指令和开中断指令这两个特权指令实现原子性

cpu 运行了关中断指令后，就不再检查中断信号，直到运行开中断指令后才恢复检查

进程的创建：允许一个进程创建另一个进程，子进程可以继承父进程拥有的资源。当子进程被撤销时应将资源归还给父进程。撤销父进程时，通常同时撤销其所有的子进程

引起进程创建的事件：用户登录、作业调度...

- 创建原语：申请空白 PCB => 为新进程分配资源 => 初始化 PCB => 将 PCB 插入就绪队列

- 进程的终止：终止原语，引起进程终止的事件：正常结束、异常结束、外界干预

进程的阻塞和唤醒：阻塞原语 Block、唤醒原语 Wakeup 是一对作用相反的原语，必须成对使用

### 2.1.4 进程的通信

低级通信方式：PV 操作

高级通信方式：以较高效率传输大量数据的通信方式，主要有以下三类：

共享存储

- 为保证安全，一个进程不能直接访问另一个进程的地址空间，各进程拥有的地址空间相对独立
- 对共享空间进行读写操作时，需要使用同步互斥工具
- 共享存储分为两种
  - 基于数据结构的共享：低级、限制多、速度慢
    通过增加页表项、段表项，即可将同一片内存区域映射到
  - 基于存储区的共享：高级、限制少、速度快
    操作系统只负责为通信进程提供可共享使用的存储区和同步互斥工具，数据交换由用户调用读写指令完成

消息传递（应用最广泛）

进程通过操作系统提供的“发送消息 / 接收消息”两个原语进行数据交换。在消息传递系统中，进程间的数据交换以格式化的“消息”为单位

在微内核操作系统中，微内核与服务器使用了消息传递机制，该机制能很好的支持多 cpu 系统、分布式系统和计算机网络

1. 直接通信方式：发送进程直接将消息发送给接收进程，并将消息挂在接收进程的消息队列上，接收进程从消息缓冲队列上取得消息
   对于直接通信方式，发送进程需要指明接收进程 PID
1. 间接通信方式：发送进程将消息发送到中间实体（信箱），接收进程从中间实体取得消息。该通信方式广泛应用于计算机网络中

管道通信

管道：大小固定的内存缓冲区（pipe 文件）

1. 如果管道未满，写进程就可以往管道里写数据
   如果管理不空，读进程就可以从管道里读数据
2. 为了协调双方通信，管道机制提供三方面的协调能力：互斥、同步和确定对方存在。各进程需要互斥的访问管道（由操作系统实现）
3. 普通管道只允许单向通信（半双工通信），如果要实现双向同时通信（全双工通信），则需要设置两个管道

### 2.1.5 线程和多线程模型

引入进程的目的是：更好的实现多个程序并发运行，提高资源利用率和系统吞吐量

引入线程的目的是：减少程序在并发运行时的时空开销，提高操作系统的并发性能

进程与线程的比较

- 线程切换的代价远小于进程，同一进程中，线程切换不会引起进程切换；但是不同进程中，线程切换会引起进程切换
- 进程间可并发运行；线程间也可并发运行
- 线程不拥有系统资源，但线程可访问其隶属的进程的系统资源
- 某进程中的线程对其他进程不可见
- 操作系统创建、撤销进程的开销远大于线程。进程切换时进程上下文切换开销很大，而线程切换时只需要保存和设置很少的寄存器内容，开销很小
- 同一进程中的线程共享进程的地址空间，同一进程中的线程间通信无需操作系统干预
- 支持多处理机系统：对于传统单线程进程，一个进程只能运行在一个 cpu 上；对于多线程进程，进程的多个线程可以同时在多个 cpu 上运行

线程的属性

1. 线程是 cpu 调度的基本单位（进程是除 cpu 外的系统资源的分配单位）
2. 线程有唯一的线程 ID TID、线程控制块 TCB
3. 线程也有就绪、运行、阻塞三种基本状态
   - 就绪：线程已具备各种运行条件，只需要再获得 cpu 即可立刻运行
   - 运行：线程已获得 cpu，正在运行
   - 阻塞：线程在运行中因某事件被阻塞，处于暂停状态
4. 线程几乎不拥有系统资源

线程的实现方式

- 用户级线程（User-Level Thread, ULT）
  有关线程管理（创建、撤销和切换等）的所有工作都由用户程序在用户空间中完成，内核意识不到线程的存在
  优点

  - 用户级线程切换不需要从用户态变为内核态
  - 用户级线程的实现与操作系统无关，对线程管理的代码是属于用户程序的一部分

  缺点

  - 对于只有用户级线程的操作系统，cpu 调度的基本单位仍是进程
  - 进程中某个线程被阻塞，该进程内的所有线程都会被阻塞（整个进程都会被阻塞）
  - 不能发挥多 cpu 的优势：一个进程只能分配到一个 cpu，因此进程中仅有一个线程能运行

- 内核级线程（Kernel-Level Thread, KLT），又称“内核支持的线程”
  操作系统中，系统进程、用户进程、内核级线程，都是在内核的支持下运行的，线程管理的所有工作也是在内核空间中完成。内核空间为每个内核级线程设置一个线程控制块 TCB
  优点

  - 对于有内核级线程的操作系统，内核级线程是 cpu 调度的基本单位
  - 能发挥多 cpu 的优势：进程的多个线程可以同时在多个 cpu 上运行
  - 进程中某个线程被阻塞，该进程内的其他线程可占用 cpu

  缺点

  - 同一进程中的线程切换，需要从用户态变到核心态进行，开销大

不支持内核级线程的操作系统，cpu 调度的基本单位是进程
支持内核级线程的操作系统，cpu 调度的基本单位是内核级线程

多线程模型（内核级线程是 cpu 调度的基本单位）

- 多对一模型：将多个用户级线程映射到一个内核级线程
  优点：线程管理在用户空间进行（线程切换开销小）
  缺点：某个用户线程被阻塞，整个进程都会被阻塞；只有一个用户线程可以访问内核，多个用户线程不能同时在多个 cpu 上运行（无并发能力）
- 一对一模型：将每个用户级线程映射到一个内核级线程
  优点：某个用户线程被阻塞，允许调度另一个用户线程运行，多个用户线程可以同时在多个 cpu 上运行（并发能力强）
  缺点：每创建一个用户线程，相应的就需要创建一个内核线程（开销大）
- 多对多模型：将 n 个用户级线程映射到 m 个内核级线程上，要求 n>=m
  既克服了多对一模型无并发能力的缺点，又克服了一对一模型的一个用户进程占用过多内核线程开销大的缺点

1. 进程和程序的根本区别是：静态和动态特点
2. 进程的最大数目主要受到内存大小的限制（存放 PCB）
3. cpu 的效率与就绪进程的数量没有关系；只有就绪队列为空时 cpu 的效率下降
4. 用户登录、程序启动时会创建新进程
   设备分配不会创建新进程，只会在操作系统中设置相应的数据结构

处理机调度是操作系统设计的核心问题

### 2.2.1 三级调度

一个作业从提交开始到完成，一共要经历三级调度

用户向操作系统提交一个作业，即用户要求操作系统启动一个程序

高级调度（作业调度）：多个程序需要启动，先启动哪个？

内存与外存之间的调度，每个作业只调入一次，并创建进程（创建 PCB）；作业运行结束时调出一次，并撤销进程（撤销 PCB），作业调度次数最少

中级调度（内存调度）：按照某种算法，选择一个处于挂起状态的进程重新调入内存

1. 中级调度的目的是提高内存利用率和系统吞吐量
2. 内存不足时，可将暂时不能运行的进程调出外存（PCB 常驻内存，不调出外存）等具备运行条件且内存足够时再重新调入内存
3. 暂时调出外存的进程状态成为挂起态，挂起分为就绪挂起和阻塞挂起，被挂起的进程 PCB 会被组织成挂起队列
4. 中级调度实际上是存储器管理中的对换功能

低级调度（进程调度）：cpu 调度，按照某种算法，从就绪队列中选择一个进程分配 cpu。进程调度是最基本的调度，次数最多（cpu 是可剥夺资源）

### 2.2.2 调度的评价指标

- cpu 利用率：cpu 利用率 = cpu 工作时间 / （cpu 工作时间 + cpu 等待时间）
- 系统吞吐量：单位时间内 cpu 完成作业的数量
- 周转时间：从作业提交到作业完成（经历三级调度）的时间间隔
  周转时间 = 作业完成时间 - 作业提交时间
- 带权周转时间 = 周转时间 / 运行时间
  周转时间至少包含四个部分
  - 作业在外存后备队列上等待高级调度（作业调度）
  - 进程在就绪队列上等待低级调度（进程调度）
  - 进程在 cpu 上运行的时间
  - 进程阻塞等待的时间
- 等待时间：进程等待 cpu 的总时间，等待时间越长，用户满意度越低
  衡量一个调度算法的优劣，一般只需简单的考察等待时间
- 响应时间：从用户提交请求到操作系统首次响应所用的时间
  交互式系统中，使用响应时间衡量调度算法的优劣

### 2.2.3 调度的实现

用于调度和分派 cpu 的组件称为调度程序，通常由三部分组成：排队器、分派器、上下文切换器

不能进行进程的调度与切换的情况

1. 中断处理时
2. 进程在操作系统内核临界区中（在普通临界区中可以进程的调度与切换）
   临界区：访问临界资源的一段代码
   临界资源：一段时间内只允许一个进程使用的资源，各进程需要互斥的访问临界资源
3. 屏蔽中断的原子操作过程中

闲逛进程

进程切换时，如果没有就绪进程，就会调度闲逛进程（idle）运行，运行过程中测试中断。闲逛进程的优先级最低，只要有进程就绪，就会立刻让出 cpu。闲逛进程不需要 cpu 以外的资源，不会被阻塞

进程主动放弃 cpu

1. 进程正常终止
2. 进程运行中异常导致终止
3. 进程主动请求阻塞

进程被动放弃 cpu

1. 分给进程的时间片用完
2. 有更高优先级的事件需要处理（如 IO 中断）
3. 有更高优先级的进程进入就绪队列

过于频繁的进程调度与切换，会导致效率降低

进程调度方式

1. 非抢占调度方式（非剥夺方式）：只允许进程主动放弃 cpu
   优点：实现简单、开销小，可用于批处理系统，不能用于分时系统和实时系统
2. 抢占调度方式（剥夺方式）：抢占调度方式有利于提高响应速度和系统吞吐量

两种线程的调度

1. 用户级线程调度：内核意识不到用户线程的存在，由进程中的调度程序选择一个线程运行
2. 内核级线程调度：内核选择一个线程运行，通常不用考虑该线程属于哪个进程，赋予被选择的线程一个时间片，超过时间片会强制挂起该线程

进程切换的主要完成了：对原进程数据的保存、对新进程数据的恢复

### 2.2.4 调度算法

cpu 调度 / 进程切换的时机

1. 进程退出（exit）、终止
2. 进程自我阻塞
3. 优先级较高的新进程到达就绪队列
4. 时间片到

对于非抢占式，只有运行的进程退出自我阻塞才能触发进程调度
先有 cpu 调度，后有进程切换

1. 先来先服务调度算法（FCFS），非抢占式、不会饥饿
   关键字：公平

   饥饿：某进程/作业长期得不到服务

   - 简单、效率低、有利于长作业，不利于短作业
   - 有利于 cpu 繁忙型作业（cpu 繁忙型作业可视为长作业）
     不利于 IO 繁忙型作业（IO 繁忙型作业可视为短作业）
   - 既可用于作业调度，又可用于进程调度

2. 短作业优先/短进程优先调度算法（SJF / SPF），非抢占式、可能饥饿

   - 改良：最短剩余时间调度算法（SRTN、Shortest Remaining Time Next），抢占式、可能饥饿
   - 有利于短作业，不利于长作业
   - SJF / SPF 调度算法的平均等待时间、平均周转时间最少（实际上 SRTN 更少）

3. 优先级调度算法（HPF、Highest Priority First）：可能饥饿

   - 抢占式、非抢占式都有
   - 优先级静态、动态都有

   进程优先级的设置原则

   - 系统进程 > 用户进程
   - 交互型进程 > 非交互型进程（前台进程 > 后台进程）
   - IO 型进程 > 计算型进程

   默认优先数越大，优先级越高

   如果一个进程频繁的进行 IO 操作，则可适当提高其优先级

   操作系统偏好 IO 型进程（IO 繁忙型进程），优先级较高
   对应的计算型进程（cpu 繁忙型进程），优先级较低

4. 高响应比优先调度算法（HRRN）：非抢占式、不会饥饿
   响应比 = 1 + 等待时间 / 要求服务时间
   响应比 = 周转时间 / 运行时间

   - 等待时间相同时，要求服务时间越短，响应比越大，有利于短作业，类似于 SJF / SPF
   - 要求服务时间相同时，等待时间越长，响应比越大，类似于 FCFS
   - 对于长作业，长作业的响应比随等待时间的增加而增大，不会饥饿

5. 时间片轮转调度算法（RR、Round-Robin）：抢占式、不会饥饿
   关键字：及时响应
   - 若时间片过大，以至于所有进程都能在一个时间片内运行结束，则时间片轮转调度算法退化为先来先服务调度算法
   - 若时间片过小，则高频率的进程切换，使得开销增大
   - 适用于分时操作系统
   - 未区分任务的紧急程度
6. 多级反馈队列调度算法
   可以兼顾多方面的目标，优点：
   - 对各类进程相对公平（FCFS）
   - 新到达的进程可以很快得到响应（RR）
   - 短作业 / 进程优先（SJF / SPF）
   - 不用估计进程的运行时间（避免用户作弊）
   - 可灵活调整对各类进程的偏好程度

可能饥饿：短作业优先 / 短进程优先、优先级

不会饥饿：先来先服务、高响应比优先、时间片轮转

上下文切换：切换 cpu 到新进程时，需要保存旧进程的状态，并恢复新进程的状态

上下文：某一时刻 cpu 内，寄存器和 pc 的内容

进行上下文切换时，内核将旧进程的状态保存在其 PCB 中（PCB 常驻内存），并加载新进程的上下文

### 2.3.1 同步与互斥

临界资源：一次只允许一个进程使用的资源，对临界资源的访问必须互斥的进行，对临界资源的访问代码分为四个部分

- 进入区
- 临界区 // 访问临界区的代码
- 退出区
- 剩余区

同步（直接制约关系）：多个进程需要在某些位置上协调它们的工作次序而产生的制约关系，进程间的直接制约关系源于它们之间的相互合作

互斥（间接制约关系）

异步：各并发运行的进程以各自独立的、不可预知的速度向前推进

同步机制（临界区管理）应遵循的四个原则

1. 空闲让进
2. 忙则等待
3. 有限等待
4. 让权等待：进程不能进入临界区时，应立刻释放处理机，防止进程忙等

### 2.3.2 进程互斥的软硬件实现

软件实现

单标志法：违背空闲让进
单标志法要求两个进程必须交替进入临界区，若某个进程不再进入临界区（不再谦让），则另一个进程也无法再进入临界区

双标志先检查法：违背忙则等待

双标志后检查法：可能饥饿，违背空闲让进、有限等待

Peterson 算法（三标志）：使用 flag 解决临界资源的互斥访问，使用 turn 解决饥饿

互斥锁（Mutex Lock）

一个进程进入临界区时获得锁，退出临界区时释放锁

缺点：违背让权等待，进程获得锁失败时会被阻塞并忙等，轮询锁状态。适用于多 cpu 系统

硬件实现

1. 中断屏蔽方法
   缺点：多 cpu 环境不适用，用户进程不适用（开 / 关中断只能运行在内核态）
   优点：简单、只适用于单 cpu 系统、只适用于内核进程
2. 硬件指令方法：TestAndSet 指令（TSL）、Swap 指令
   优点：简单，适用于多 cpu 系统
   缺点：不满足让权等待

### 2.3.3 信号量

| P 操作  |  V 操作   |
| :-----: | :-------: |
| wait(s) | signal(s) |
|  消费   |   生产    |

- 整型信号量：表示资源数量
  整型信号量机制中的 wait 操作，信号量<=0 时会轮询。进程忙等，未遵循“让权等待”原则

```java
void wait(int s) {
    while (s <= 0); // 忙等，违背让权等待
    s = s - 1;
}

void signal(int s) {
    s = s + 1;
}
```

- 记录型信号量
  记录型信号量机制中的 wait 操作，信号量<0 时，进程调用 block 原语自我阻塞，放弃 cpu 并插入该类资源的等待队列，遵循“让权等待”原则

```java
class Semaphore {
    int value;          // 资源数量
    List<Process> list; // 等待队列
}
```

```java
void wait(Semaphore s) {
    s.value -= 1;
    if (s.value < 0) {
        add this process to s.list;
    }
}

void signal(Semaphore s) {
    s.value += 1;
    if (s.value <= 0) {
        remove a process from s.list;
    }
}
```

使用信号量实现同步

1. s = 0
2. 在“前操作”之后执行 V(s)
   在“后操作”之前执行 P(s)

使用信号量实现互斥

1. s = 允许同时访问的进程数量
2. PV 夹紧

信号量机制存在的问题：编程困难、容易出错

### 2.3.4 管程（高级进程同步机制）

管程由 4 部分组成

|             管程             |      类      |
| :--------------------------: | :----------: |
|            管程名            |     类名     |
|     管程内的共享数据说明     | private 数据 |
| 对共享数据进行操作的一组函数 | public 函数  |
|    对管程进行初始化的函数    |   构造函数   |

1. 管程将对共享资源的操作封装起来，管程内的共享数据只能被管程内的函数访问
2. 每次只允许一个进程进入管程，从而实现进程互斥

### 2.3.5 经典问题

生产者-消费者

- 如果缓冲区未满，生产者就可以放入产品
- 如果缓冲区不空，消费者就可以取出产品

缓冲区是临界资源，各进程互斥访问（互斥信号量 = 1）
在生产者-消费者问题中，如果缓冲区大小为 1，则不需要设置互斥信号量即可实现互斥访问
实现互斥的 P 操作一定要在实现同步的 P 操作之后，否则可能死锁

读者-写者

- 允许多个读者执行读操作
- 只允许一个写者执行写操作
- 不允许同时执行读、写操作

### 2.4.1 死锁

死锁：在并发环境下，各进程因为竞争资源而造成的一种互相等待对方占用的资源，都无法向前推进的僵局

- 死锁：至少有 >=2 个进程
  发生死锁的进程一定处于阻塞态
- 饥饿：可能只有 1 个进程
  发生饥饿的进程可能处于就绪态或阻塞态

死锁产生的原因

1. 竞争系统资源
2. 进程推进顺序非法
3. 信号量使用不当

死锁产生的 4 个必要条件

1. 互斥条件
2. 不剥夺条件
3. 请求和保持条件
4. 循环等待条件

死锁的处理策略

1. 死锁预防：破坏死锁产生的 4 个必要条件
2. 死锁避免：安全性算法（银行家算法）
3. 死锁的检测和解除

### 2.4.2 不允许死锁发生：死锁的预防和避免

1. 静态策略：死锁预防

   - 破坏互斥条件：使用 SPOOLing 技术（假脱机技术）将独占设备改造为共享设备
   - 破坏不剥夺条件：可剥夺
     缺点：复杂，常用于状态易于保存和恢复的资源，如 cpu 的寄存器、内存
   - 破坏请求并保持条件
     使用静态分配法（预先分配法）：一次性申请完、一次性分配完
     缺点：资源浪费，可能饥饿
   - 破坏循环等待条件
     使用顺序资源分配法，进程必须按编号递增的顺序申请资源，同类资源一次性申请完
     缺点：不方便增加新类型的设备、资源浪费、编程困难

2. 动态策略：死锁避免：银行家算法

   安全状态：一定不死锁；不安全状态：可能死锁

   ```java
   // Max; // 某进程声明的最大需求向量量
   // Allocation;
   // Request; Request + Allocation <= Max;
   // Need; Need = Max - Allocation;
   // Available;
   if (AllocaAvailable >= Need) { // Need = Max - Allocation;
       Available += Allocated;    // 易错：Available += Need
   }
   ```

### 2.4.3 允许死锁发生：死锁的检测和解除

资源分配图：圆代表一个进程，框代表一类资源

死锁定理

1. 若能消去资源分配图中所有的边，则称该图是可完全简化的
2. 若不能消去所有的边（不可完全简化），那么发生了死锁，最终连着边的进程为死锁进程

死锁一定有环
每类资源只有一个实例，则有环一定死锁
每类资源有多个实例，则有环不一定死锁

死锁解除

1. 资源剥夺法：挂起某些死锁进程，剥夺其资源分配给别的死锁进程，可能饥饿
2. 撤销进程法：强制撤销部分甚至全部死锁进程并剥夺其资源。简单、开销大
3. 进程回退法：让一（或多）个进程回退到足以避免死锁，进程回退时自愿释放资源而非被剥夺

## 第三章 内存管理

### 3.1.1 内存管理的概念

程序经过编译、链接后生成的指令中是逻辑地址，即相对于进程起始地址的地址

程序运行前需要先放入内存，才能被 cpu 处理：缓和 cpu 与外存间的速度矛盾

按字节编址：每个存储单元为 1 字节，每个地址对应一个存储单元

内存管理的主要功能

1. 内存空间的分配与回收
2. 地址转换：把逻辑地址转换为内存地址
3. 内存空间的扩充：使用虚拟存储技术或自动覆盖技术，从逻辑上扩充内存
4. 内存保护：保证各作业在各自的存储空间内运行，互不干扰
   - 在 cpu 中设置一对上、下限寄存器
   - 使用重定位寄存器（基址寄存器）和界地址寄存器（限长寄存器）

编译、链接、装入

1. 编译：由编译器将源代码编译为一组目标模块
2. 链接：由链接器将一组目标模块和库函数链接在一起，形成装入模块（可执行文件）
3. 装入：由装入程序将装入模块装入内存运行

三种链接方式

1. 静态链接：装入前链接
2. 装入时动态链接：边装入边链接。优点是便于修改和更新，便于目标模块的共享
3. 运行时动态链接：优点是加快装入速度，节省大量的内存空间

三种装入方式

1. 绝对装入：逻辑地址和内存地址完全相同，只适用于单道系统，灵活性差
2. 可重定位装入（静态重定位）：装入时将逻辑地址转换为内存地址，装入时起始地址为 A，则所有逻辑地址+A
   - 作业装入内存时，必须分配要求的全部内存空间，若内存不足则无法装入
   - 作业装入内存后，整个运行期间不能在内存中移动，也不能再申请内存空间
3. 动态运行时装入（动态重定位）：运行时才将逻辑地址转换为内存地址，动态重定位需要重定位寄存器的支持
   - 程序可以在内存中移动
   - 可以将程序分配到不连续的存储区
   - 程序运行前只装入部分代码即可运行
   - 程序运行期间可以申请内存空间
   - 方便程序段的共享
   - 可以提供一个比存储空间大得多的虚拟存储空间

进程的内存映像：程序段、数据段、进程控制块 PCB、堆、栈

内存共享：只有“只读”的内存空间才可以共享

可重入代码：允许多个进程同时访问，但不允许被修改的代码

### 3.1.2 覆盖和交换

覆盖和交换技术是在多道系统中，用于扩充内存的两种方法（解决程序大小超过内存大小）

覆盖：将内存划分为一个固定区和多个覆盖区，常用的段常驻固定区，不常用的段在需要时调入覆盖区

覆盖技术需要声明覆盖结构，操作系统自动完成覆盖（覆盖技术对用户和程序员不透明），增加编程负担

交换（对换）：中级调度

- 将就绪态的进程从内存换出外存（就绪挂起）
- 将阻塞态的进程从内存换出外存（阻塞挂起）

PCB 常驻内存，不会被唤出到外存

具有交换功能的操作系统，通常将外存划分为文件区和交换区

- 文件区主要追求外存的利用率，通常使用离散分配方式
- 对换区主要追求换入换出速度，通常使用连续分配方式

覆盖技术用于某一个进程；交换技术用于不同的进程

### 3.1.3 连续分配管理

单一连续分配

内存分为系统区和用户区，用户区只有一道用户程序（用户程序独占整个用户区）

- 优点：简单，无外部碎片，无需进行内存保护，可以使用覆盖技术扩充内存
- 缺点：只能用于单道系统，有内部碎片，内存利用率低

固定分区分配

操作系统使用空闲分区链/空闲分区表记录内存的使用情况

分区大小可以相等、可以不等

- 优点：可用于多道系统的最简单的分配管理方式，无外部碎片
- 缺点：有内部碎片，内存利用率低

动态分区分配

动态分区分配使用动态重定位、运行时装入。有外部碎片，外部碎片可以通过紧凑（拼接）技术解决。紧凑后可能需要修改进程的起始地址（进程的起始地址存放在 PCB 中）。进程上 cpu 运行前，需要将进程的起始地址存放到重定位寄存器（基址寄存器）中

分区分配策略

1. 首次适应（First Fit）：最简单、最好
2. 邻近适应（Next Fit）：又称“循环首次适应算法”
3. 最佳适应（Best Fit）：选择最小的空闲分区
4. 最坏适应（Worst Fit）：选择最大的空闲分区

### 3.1.4 基本分页内存管理

有内部碎片，无外部碎片

- 进程中的块称为页、页面
- 内存中的块称为页框、页帧、内存块
- 外存中的块称为磁盘块

基本地址变换机构

为了知道进程的每个页面在内存中的位置，操作系统为每个进程创建一张页表，页表通常存放在 PCB 中

逻辑地址结构：页号｜页内偏移
页表项：（页号）内存块号
内存地址结构：内存块号｜块内偏移
页表寄存器：页表起始地址｜页表长度 M

1. 页表记录“进程页面”与“页面存放的内存块”之间的映射关系
2. 页表项连续存放，因此页号是隐含的
3. 页表寄存器（PTR、Page Table
   Register）存放页表在内存的起始地址和页表长度。进程未运行时，页表始址和页表长度存放在 PCB 中；当进程被调度时，负责进程切换的内核程序恢复进程运行环境，将页表始址和页表长度装入页表寄存器中

分页管理地址变换中，若页号 >= 页表长度 M，则产生越界中断

具有快表的地址变换机构

对于基本地址变换机构，存取一个数据或一条指令至少要访问 2 次内存

- 访问页表（慢表），确定存取的数据或指令的内存地址
- 根据地址存取数据或指令

在地址变换机构中增设一个具有并行查找能力的高速缓冲存储器 CACHE：快表，又称相联存储器（TLB、Translation Look-aside
Buffer）用于存放最近访问的若干页表项（的副本），加速地址变换。快表命中只需一次访存，快表未命中需要两次访存

原理：时间 / 空间局部性

两级页表

单级页表存在的问题

1. 页表必须连续存放，当页表很大时，需要占用多个连续的内存块
2. 页表不必常驻内存

逻辑地址结构：一级页号｜二级页号｜页内偏移

地址变换

1. 按照逻辑地址结构划分逻辑地址
2. 从 PCB 中读出一级页表的起始地址，根据一级页号查询一级页表
3. 根据二级页号查询二级页表，找到内存块号
4. 结合内存块号和页内偏移，得到内存地址

访问的页面不在内存中时，产生“缺页中断”，缺页进程阻塞，请求操作系统将页面从外存调入内存

使用多级页表，各级页表大小不能超过一个页面
2 ^ 单级页号 bit 数 = 每页的页表项数量（页表长度） = 页面大小 / 页表项大小

不引入快表，n 级页表访问一个逻辑地址，需要 n+1 次访存

### 3.1.5 基本分段内存管理

有外部碎片，无内部碎片

- 分页管理：提高内存的利用率
- 分段管理：方便编程、信息的共享与保护、动态增长与链接，对用户不透明

逻辑地址结构：段号｜段内偏移
段表项：（段号）段长 C ｜本段在内存的起始地址
段表寄存器：段表起始地址｜段表长度 M

分段管理按照用户进程的逻辑模块划分逻辑空间，段号的位数决定每个进程最多可分多少段，段内偏移决定每个段的最大长度

- 分页管理中，逻辑地址的页号和页内偏移对用户透明，分页的逻辑地址是一维的（页内偏移的 bit 数确定）
- 分段管理中，逻辑地址的段号和段内偏移需要用户显式给出，分段的逻辑地址是二维的（段内偏移的 bit 数不确定）

分段管理，段名需要用户显式给出

分段管理地址变换时，若段号 >= 段表长度 M、段内偏移 >= 段长 C，则产生越界中断

### 3.1.6 段页式管理

逻辑地址结构：段号｜页号｜页内偏移

段页式管理中，逻辑地址的段号和段内偏移需要用户显式给出，操作系统根据段内偏移自动划分页号、页内偏移

顶级页表/顶级段表常驻内存

### 3.2.1 虚拟内存的概念（扩充内存）

基本内存管理的特点

1. 一次性：作业的页面必须一次性全部装入内存后才能运行
   - 作业很大，无法全部装入，无法运行
   - 多道系统的并发度下降
2. 驻留性：作业运行时常驻内存，直到运行结束

局部性原理

- 时间局部性：程序中的某指令被执行，不久后该指令可能再次被执行；某数据被访问，不久后该数据可能再次被访问
- 空间局部性：程序访问了某存储单元，不久后可能访问其附近的存储单元

虚拟存储器的特点

1. 多次性：作业的页面不是一次性全部装入内存，而是按需分多次装入内存
2. 对换性：作业运行时无需常驻内存，运行期间允许换入换出
3. 虚拟性：从逻辑上扩充内存容量
4. 离散性：虚拟内存基于离散分配的内存管理方式

虚拟内存最大容量 = 2 ^ cpu 寻址的 bit 数
虚拟内存实际容量 = 内存和外存容量之和

### 3.2.2 请求分页内存管理

操作系统需要提供请求调页（段）和页（段）置换的功能

访问的页面不在内存中时，产生“缺页中断”，缺页进程阻塞，请求操作系统将页面从外存调入内存，同时可通过置换功能将暂时不用的页面从内存换出外存

请求分页系统的页表项：页号｜内存块号｜状态位｜访问字段｜修改位｜外存地址

- 状态位：该页是否已调入内存
- 访问字段：该页一段时间内被访问的次数
- 修改位：该页调入内存后是否被修改

### 3.2.3 内存块分配

调页策略

- 预调页策略：进程的首次调入（运行前调入）
- 请求调页策略：运行期间缺页时调入

请求分页系统的外存分为两部分

- 用于存放文件的文件区：使用离散分配方式
- 用于存放对换页面的对换区：使用连续分配方式，对换区的读写速度比文件区快

驻留集：请求分页内存管理中，一段时间内分配给进程的内存块的集合

- 驻留集太小：缺页频繁
- 驻留集太大：多道系统并发度下降、资源利用率下降

固定分配：驻留集大小固定
可变分配：驻留集大小可变
局部置换：发生缺页时，只能从分配给该进程的内存块中选出一块换出、换入
全局置换：发生缺页时，操作系统从空闲内存块队列中取出一块分配给缺页进程，并将缺的页面从外存调入内存

内存分配策略：固定分配全局置换、可变分配局部置换、可变分配全局置换

抖动 / 颠簸：刚换出的页面又要换入，刚换入的页面又要换出的频繁的页面调度行为

抖动的原因：进程频繁访问的页面数大于可用的内存块数（分配给进程的内存块不足）

抖动的解决方法

1. 撤销部分进程
2. 增加内存
3. 更换页面置换算法

驻留集：分配给进程的内存块的集合

工作集：一段时间内进程访问的页面集合（向左看）。工作集大小可由时间和窗口尺寸确定（工作集大小 <= 窗口尺寸）

驻留集大小不能小于工作集大小，否则进程会频繁缺页

### 3.2.4 页面置换算法

1. 最佳置换算法（OPT、Optimal）：淘汰向右看最后一个，算法无法实现
2. 先入先出置换算法（FIFO）
   产生 Belady 异常：分配的内存块增多，缺页次数（页故障数）不减反增
3. 最近最久未使用置换算法（LRU、Least Recently Used）：淘汰向左看最后一个，算法开销大（堆栈类算法）
4. 时钟置换算法（CLOCK）

简单的时钟置换算法

1. 设置一位访问位，某页被装入或被访问时，访问位置 1
2. 换出时，访问位 = 0 则换出；访问位 = 1 则访问位置 0，最多扫描 2 次
3. 替换后，指针指向被替换页的下一页

改进的时钟置换算法

1. 设置两位（访问位 A，修改位 M）
   换出优先级：(0, 0) > (0, 1) > (1, 0) > (1, 1)

|  扫描  |                |     最多扫描 4 次      |
| :----: | :------------: | :--------------------: |
| 第一轮 | 换出(0, 0)的页 | 换出未访问、未修改的页 |
| 第二轮 | 换出(0, 1)的页 | 换出未访问、已修改的页 |
| 第三轮 | 换出(0, 0)的页 | 换出已访问、未修改的页 |
| 第四轮 | 换出(0, 1)的页 | 换出已访问、已修改的页 |

## 第四章 文件管理

操作系统文件管理，最基本的是“按名存取”

### 4.1.1 文件控制块

文件控制块 FCB：用于存放文件控制信息的数据结构

1. FCB 的有序集合 = 文件目录
2. FCB = 文件目录项

FCB 的改进

文件名｜文件控制信息 => 文件名｜索引结点指针（主部）

索引结点存放文件控制信息（次部）
找到文件名对应的 FCB 时，才将存放文件控制信息的索引结点调入内存，_提高查找速度_

文件保护

- 口令：需要存储口令，不安全
- 密码：安全
- 访问控制（在每个文件的 FCB 中增加访问控制列表 ACL、Access-Control List）

打开文件表：分为系统的打开文件表、进程的打开文件表

- 创建文件：分配外存空间、创建 FCB
- 删除文件：找到 FCB、回收外存空间、删除 FCB
- 打开文件：找到 FCB、将 FCB 复制到系统、进程的打开文件表中
- 关闭文件
  从进程的打开文件表中删除对应项
  回收内存空间等资源
  系统的打开文件表中，打开计数器 count 减 1。若 count 等于 0，则从系统的打开文件表中删除对应项

### 4.1.2 文件的逻辑结构

无结构文件（流式文件）

有结构文件（记录式文件）

- 顺序文件
  - 顺序结构：关键字顺序
    串结构：无序
  - 顺序存储：变长记录不可随机存取，定长记录可随机存取
    链式存储：不可随机存取
- 索引文件：一条记录对应一个索引项
- 索引顺序文件：一组记录对应一个索引项

### 4.1.3 文件的物理结构

连续分配：逻辑上相邻的块物理上也相邻，可随机存取

连续分配要求每个文件在磁盘上占用一组连续的磁盘块

优点：访问某个磁盘块时，需要移动磁头。访问的两个磁盘块距离越远，移动磁头时间越长。结论：_连续分配的读写速度最快_

缺点

1. 文件扩展不方便
2. 删除和插入记录时需要大量移动磁盘块
3. 磁盘利用率低，产生外部碎片（可以使用紧凑技术，有时间开销）
4. 只适用于长度固定的文件

链接分配：逻辑上相邻的块物理上用链接表示先后关系

隐式链接：不可随机存取

缺点：隐式链接只能顺序访问，解决方法是将若干个磁盘块组成簇（cluster），代价是增加了内部碎片

除了最后一个磁盘块，每个磁盘块都保存指向下一个磁盘块的指针，这些指针对用户透明。读入 i 号磁盘块（i 从 0 开始）需要 i+1 次磁盘 IO

显式链接：可随机存取

指针显式的存放在文件分配表（FAT、File Allocation Table）中，该表在整个磁盘中只有一张。操作系统启动时将 FAT 读入内存，查询内存中的文件分配表 FAT，无需读磁盘操作

FAT 的表项：（磁盘块号）下一块。FAT 的表项在物理上连续存放，磁盘块号是隐含的

索引分配：操作系统为每个文件维护一张索引表，存放逻辑块号到磁盘块号的映射关系。可随机存取

索引表存放的磁盘块称为索引块，文件数据存放的磁盘块称为数据块。索引分配可随机存取，文件扩展方便。缺点是索引块增大了磁盘空间的开销

显式链接中，一个磁盘对应一张文件分配表；索引分配中，一个文件对应一张索引表

索引表的表项：（逻辑块号）磁盘块号。逻辑块号是隐含的

索引表过长的解决方法

1. 链接：如果文件过大，索引表过长，可以链接多个磁盘块以存放索引表。访问第 i 号磁盘块的索引表需要顺序读入 0 到 i+1 号磁盘块，磁盘 IO 次数增加，查找效率降低
2. 多层索引：使用 k 层索引，且顶级索引表未调入内存。则访问目标数据块需要 k+1 次读磁盘
   - 各级索引表最大不超过一个磁盘块
   - FCB 中存有顶级索引块的指针，可通过 FCB 读入顶级索引块
     注意题目条件：顶级索引表是否已调入内存
3. 混合索引：结合多种索引分配方式
   - 直接地址（直接存放在 FCB 中）：对于小文件，访问目标数据块只需 1 次读磁盘
   - 一次间接地址：一级索引分配
   - 二次间接地址：二级索引分配

索引文件的索引表：用户创建，存放“关键字”到“记录的逻辑地址”的映射
索引分配的索引表：操作系统创建，存放“逻辑块号”到“磁盘块号”的映射

### 4.2.1 目录结构

单级目录结构：实现按名存取、文件不允许重名、不适用于多用户操作系统

两级目录结构：不同用户的文件允许重名，不能对文件分类、不方便文件共享

树形目录结构：可以对文件分类，不方便文件共享

无环图目录结构：方便文件共享
共享文件（对应无环图中的共享结点）：共享结点中有共享计数器 count，用户提出删除该共享结点时，计数器减 1，删除用户的共享链。只有 count 等于 0 时，才删除该共享结点

### 4.2.2 文件共享

基于索引结点的共享方式（硬链接）

FCB 的改进：文件名｜索引结点指针，FCB => 索引结点 => 文件

索引结点中有链接计数器 count，表示链接到本索引结点（共享文件）上的 FCB 的数量。用户提出删除该共享文件时，计数器减 1，删除用户的 FCB。只有 count 等于 0 时，才删除该共享文件

基于符号链接的共享方式（软链接，即快捷方式）

link 类型的文件，存放被链接文件的路径

### 4.3.1 外存空间管理

外存空间的划分：将磁盘划分为多个文件卷（volumn）

外存空间的初始化：将每个文件卷划分为文件区、目录区

文件区存放文件数据
目录区存放文件目录（FCB 的有序集合），用于外存空间管理

- 空闲表法：适用于连续分配方式

- 空闲链表法：适用于离散分配，为文件分配多个磁盘块时需要操作多次

- 位示图法：行（位号）列（字号）。连续分配、离散分配都适用

- 成组链接法：unix，最后一个空闲磁盘块（作为成组链块）用于保存下一组空闲磁盘块号

## 第五章 输入输出管理

### 5.1.1 IO 设备

按共享的属性分类，IO 设备可分为：独占设备、共享设备、虚拟设备

按信息交换的单位分类，IO 设备可分为

- 块设备：传输速率高、可寻址
- 字符设备：传输速率低、不可寻址

按传输速率分类，IO 设备可分为

- 低速设备：人机交互类设备
- 中速设备：通信设备
- 高速设备：存储设备

IO 接口（设备控制器）位于 cpu 和 IO 设备之间，按 cpu 的命令控制设备工作，由三部分组成

1. 设备控制器与 cpu 的接口
   - 三类信号线：地址线、控制线、数据线
   - 三类寄存器（IO 端口）：状态寄存器、控制寄存器、数据寄存器
     IO 端口指设备控制器中可被 cpu 直接访问的寄存器
     独立编址：需要设置专门的指令，实现 cpu 与 IO 端口的通信
     统一编址（内存映射 IO）：可以使用操作内存的指令实现 cpu 与 IO 端口的通信
2. 设备控制器与设备的接口：设备控制器中有一个或多个设备接口，可连接一个或多个设备
3. IO 逻辑：用于实现对设备的控制

### 5.1.2 IO 控制方式

|   IO 控制方式    | 数据传输单元 |      数据流向       |
| :--------------: | :----------: | :-----------------: |
| 程序直接控制方式 |      字      | 设备 -- cpu -- 内存 |
|   中断驱动方式   |      字      | 设备 -- cpu -- 内存 |
|     DMA 方式     |      块      |    设备 -- 内存     |
|   通道控制方式   |    一组块    |    设备 -- 内存     |

程序直接控制方式：简单、易实现；cpu 和 IO 设备串行工作，cpu 利用率很低（cpu 轮询检查、长期忙等）

中断驱动方式：cpu 在每个指令周期的末尾检查中断，每传输一个字都需要中断处理

DMA 方式：Direct Memory Access，只有传输开始和结束才需要 cpu（中断处理）

通道控制方式：IO 通道是专门负责输入输出的处理机

### 5.1.3 IO 软件层次结构

每层使用下层提供的服务，完成某些功能，并屏蔽实现细节，向上层提供服务（封装思想）

|                       |                     IO 层次结构                      |                                                                                                                   |
| :-------------------: | :--------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: |
|        用户态         |                    用户层 IO 软件                    |   实现与用户交互的接口，用户可直接调用在用户层提供的，与 IO 操作有关的库函数，对设备进行操作。例：SPOOLing 技术   |
| 核心态、IO 核心子系统 | 设备独立性软件（或设备无关性软件、系统调用处理程序） |  执行所有设备的公有操作，包括：设备分配、设备回收、将逻辑设备名映射为物理设备名、设备保护、缓冲区管理、差错控制   |
| 核心态、IO 核心子系统 |                     设备驱动程序                     |               与硬件直接相关，负责具体实现操作系统对设备发出的操作命令，驱动 IO 设备工作的驱动程序                |
| 核心态、IO 核心子系统 |                     中断处理程序                     | 用于保存被中断进程的 cpu 环境，转入相应的中断处理程序进行处理，处理完毕再恢复被中断进程的现场后，返回到被中断进程 |
|                       |                         硬件                         |                                                   执行 IO 操作                                                    |

### 5.2.1 缓冲区（Buffer）

引入缓冲区（内存中）的目的

1. 缓和 cpu 和 IO 设备间速度不匹配的矛盾
2. 减少 cpu 的中断次数，放宽对 cpu 中断响应时间的限制
3. 解决基本数据单元大小（即数据粒度）不匹配的问题
4. 提高 cpu 和 IO 设备之间的并行性

磁盘 => 缓冲区 => 用户区（工作区） => cpu

- T：一块数据从磁盘到缓冲区的时间
- M：一块数据从缓冲区到用户区的时间
- C：cpu 处理一块数据的时间

|          |         初始状态         | 处理 1 块数据的时间 | 处理 n 块数据的时间  |
| :------: | :----------------------: | :-----------------: | :------------------: |
| 单缓冲区 |    缓冲区空、用户区满    | Ti = max(C, T) + M  |   Tn = n \* Ti + C   |
| 双缓冲区 | 缓冲区一空一满，用户区空 | Ti = max(C + M, T)  | Tn = n \* Ti + (C+M) |

缓冲池

- 3 个队列
  - 空缓冲队列
  - 装满输入数据的缓冲队列（输入队列）
  - 装满输出数据的缓冲队列（输出队列）
- 4 种缓冲区
  - 用于收容输入数据的工作缓冲区
  - 用于提取输入数据的工作缓冲区
  - 用于收容输出数据的工作缓冲区
  - 用于提取输出数据的工作缓冲区

### 5.2.3 设备分配与回收

独占设备：独占式使用，只允许进程串行使用的设备，一段时间内只能满足一个进程的请求
共享设备：分时式共享使用，允许多个进程并发使用的设备
虚拟设备：通过 SPOOLing 技术将独占设备改造为共享设备（虚拟设备）

设备分配的步骤

1. 分配设备：查找系统设备表（SDT）
2. 分配控制器：SDT => 查找设备控制表（DCT）、DCT => 查找控制器控制表（CoCT）
3. 分配通道：CoCT => 查找通道控制表（ChCT）

一个操作系统中只有一张 SDT
一个通道可控制一个或多个控制器、一个控制器可控制一个或多个设备

设备分配时应考虑：设备的固有属性、设备分配算法、设备分配的安全性、设备的独立性

设备分配的方式

- 静态分配：用于独占设备的分配。用户作业运行前，操作系统一次性分配作业所需要的全部设备、控制器，运行结束才释放资源
  破坏了“请求和保持”条件，预防死锁
- 动态分配

设备分配的安全性

- 安全分配方式：为进程分配一个 IO 设备后，将进程阻塞，IO 结束后才将进程唤醒
  破坏了“请求并保持”条件，预防死锁。一段时间内，一个进程只能占用一个设备。对于一个进程，cpu 和 IO 设备只能并行工作
- 不安全分配方式：进程发出 IO 请求后继续运行，之后可继续发出新的 IO 请求。只有某个请求得不到满足时，才将进程阻塞
  计算任务和 IO 任务可并行，可能死锁

逻辑设备名到物理设备名的映射

为了提高设备分配的灵活性、设备的利用率、方便 IO 重定向，引入了设备独立性

IO 重定向：改变物理设备时，可以不改变用户程序

设备独立性：用户程序独立于物理设备

逻辑设备表（LUT、Logical Unit Table）：用于将逻辑设备名映射为物理设备名

当进程使用逻辑设备名请求分配设备时，操作系统分配物理设备，并在 LUT 中创建一个表项。进程再使用逻辑设备名请求 IO 操作时，操作系统查找 LUT，找到对应的物理设备和驱动程序

两种设置逻辑设备表的方案

1. 整个操作系统中只设置一张 LUT，LUT 中不能有相同的逻辑设备名，适用于单用户系统
2. 为每个用户设置一张 LUT，用户登录时，操作系统为用户创建新进程、创建一张 LUT，并将 LUT 存放到进程的 PCB 中。不同用户的逻辑设备名可重复，适用于多用户系统

### 5.2.4 SPOOLing 技术（假脱机技术）

Simultaneous Peripheral Operation On-Line（外部设备联机并行操作），空间换时间的技术

脱机：脱离主机的输入输出操作

为了缓和 cpu 的高速性与 IO 设备的低速性之间的矛盾，引入了脱机输入/输出技术

SPOOLing 技术是操作系统中将独占设备改造为共享设备的技术

SPOOLing 技术的组成

三个部分：预输入程序、井管理程序、缓输出程序

输入设备 => 输入缓冲区（内） => 输入井（外） => 输出井（外） => 输出缓冲区（内） => 输出设备

- 输入井（外存中）：模拟脱机输入时的磁盘，收容输入数据
- 输出井（外存中）：模拟脱机输出时的磁盘，收容输出数据
- 输入缓冲区（内存中）：用于暂存输入端口传递的数据，再传递给输入井
- 输出缓冲区（内存中）：用于暂存输出井传递的数据，再传递给输出端口
- 输入进程：模拟脱机输入时的外围控制机
- 输出进程：模拟脱机输出时的外围控制机

SPOOLIing 技术需要多道系统的支持，需要创建输入进程和输出进程

输入 / 输出进程：输入 / 输出进程用于模拟脱机输入/输出时的外围控制机

共享打印机
用户进程请求打印时，假脱机进程

1. 在外存中申请一个空闲外存块，暂存打印数据
2. 为用户进程创建一张请求打印表，挂到假脱机队列上

SPOOLing 技术特点

1. 提高了 IO 速度
2. 将独占设备改造为共享设备（虚拟设备）

### 5.3.1 磁盘

一个圆圈对应一个磁道，一个磁道被划分为多个扇区，每个扇区容量相同（一个扇区即一个磁盘块）。最内侧磁道上的扇区面积最小，数据密度最大

块号：（柱面号，盘面号，扇区号）
柱面号位于最高位：减少磁头臂的移动，减少磁盘寻块时间（寻道时间）

### 5.3.2 磁盘的管理

1. 磁盘初始化（低级格式化、物理格式化），将磁盘的每个磁道划分为扇区
2. 将磁盘分区（分 C、D、E、F 盘），每个分区由若干柱面组成
3. 高级格式化（逻辑格式化），创建文件系统。包括创建文件系统的根目录，初始化用于外存空间管理的数据结构（如位示图、空闲分区表）

引导块

自举程序：启动操作系统

在 ROM 中只存放很小的自举装入程序，在磁盘的启动块中存放完整的引导程序。启动块位于磁盘的固定位置，具有启动分区的磁盘称为启动磁盘或系统磁盘

开机时，计算机先运行自举装入程序，通过自举装入程序找到引导块，并将完整的自举程序读入内存

坏块

对于简单磁盘，坏块在文件分配表 FAT 上标明，坏块对操作系统不透明
对于复杂磁盘，使用“扇区备用”方案，坏块对操作系统透明

### 5.3.3 磁盘调度算法

磁盘寻块时间由寻道时间（寻找时间）、旋转延迟时间、传输时间组成

寻道时间与磁盘调度算法相关，而旋转延迟时间、传输时间与磁盘转速线性相关

磁盘调度算法

1. 先来先服务算法（FCFS）
   - 优点：公平、不会饥饿
   - 缺点：请求访问的磁道很分散时，FCFS 的性能很差，寻道时间很长。若有大量进程竞争使用磁盘，则 FCFS 性能上约等于随机调度
2. 最短寻找时间优先算法（SSTF、Shortest Seek Time First）：贪心、可能饥饿
3. 扫描算法/电梯调度算法（SCAN）
   - 对最近扫描过的区域不公平
   - 对各位置的磁道的响应频率不平均
   - 偏向于处理最里或最外的磁道的访问请求
4. 循环扫描算法（C-SCAN、Circular SCAN）

只有 FCFS 不会磁臂黏着，SSTF、SCAN、CSCAN 都可能磁臂黏着

减少旋转延迟时间：对同一盘面的扇区交替编号、对相邻盘面的扇区错位命名

提高磁盘 IO 速度：提前读、延迟写、虚拟盘（RAM 盘，易失性存储器，用于存放临时文件）
