# CSS

## 选择器的种类

### 标签 (元素) 选择器

```css
/* 全局选择器 */
* {
}
/* 标签 (元素) 选择器 */
h1 {
}
/* 类选择器 */
.box {
}
/* ID 选择器 */
#unique {
}
```

> 区分后代和子代

```css
/* 将 :first-child 伪元素选择器作为 article 元素选择器的一个后代选择器 */
/* 选择所有 article 元素的第一个后代元素 */
article :first-child {
}

/* 选择是父元素的第一个后代元素的 article 元素 */
/* <div>
     <article>选我</article>
   </div> */
/* 该 article 元素是父元素 div 的第一个后代元素, 将被选中 */
article:first-child {
}

/* 选择所有 article 元素的第一个后代元素 */
article *:first-child {
}
```

选择有 highlight 类的 span 标签 (本质是交集选择器)

```css
span.highlight {
}
```

交集选择器

```html
<style>
  .note {
    border: 4px solid #666;
    padding: 0.5em;
  }

  /* 交集选择器, 选择有 note 类和 warning 类的元素 */
  .note.warning {
    border-color: orange;
    font-weight: bold;
  }
</style>

<div class="note warning">This note shows obj1 warning.</div>
```

```css
/* 并集选择器, 选择 id = heading 的 h1 标签 */
h1#heading {
  color: lightpink;
}
```

### 属性选择器

```css
/* 选择存在 title 属性的 obj1 标签 */
obj1[title] {
}
/* 选择存在 href 属性, 且属性值 = "https://example.com" 的 obj1 标签 */
obj1[href="https://example.com"]
{
}
/* 选择存在 class 属性, 且属性值有一个或多个 special 的 p 标签 */
p[class~="special"] {
}
/* 选择存在 lang 属性, 且属性值以 zh- 开头的 div 标签 */
/* 例: <div lang="zh-CN"></div> */
div[lang|="zh"] {
}
```

子字符串匹配选择器

JS 的正则表达式 `/^\/api/`

```css
/* 选择存在 class 属性, 且属性值以 box- 开头的 li 标签 */
li[class^="box-"] {
}

/* 默认大小写敏感 */
/* 使用 i 值, 大小写不敏感 */
li[class^="box-" i] {
}

/* 选择存在 class 属性, 且属性值以 -box 结尾的 li 标签 */
li[class$="-box"] {
}
/* 选择存在 class 属性, 且属性值包含 box 子串的 li 标签 */
li[class*="box"] {
}
```

### 伪类和伪元素选择器

**伪类: 一个元素的状态, 以 : 开头**

| 一组兄弟元素中         |                                                   |
| ---------------------- | ------------------------------------------------- |
| div :first-child       | div 的第一个后代元素                              |
| div :last-child        | div 的最后一个后代元素                            |
| div :nth-child(n)      | div 的第 n 个后代元素                             |
| div :nth-last-child(n) | div 的倒数第 n 个后代元素                         |
| div :only-child        | div 唯一的后代元素                                |
| div p:first-of-type    | div 的后代 p 元素中的第一个                       |
| div p:last-of-type     | div 的后代 p 元素中的最后一个                     |
| div p:nth-of-type(n)   | div 的后代 p 元素中的第 n 个                      |
| div p:only-of-type     | div 唯一的后代 p 元素                             |
| :invalid               | 选择未通过校验的 form, fieldset, input 等表单元素 |

关于 :nth-child(n), :nth-last-child(n) 中的 n

- 0 或空: 不选择任何后代元素
- a * n + b: 选择 `a*0+b, a*1+b, a*2+b, ...` 后代元素

```html
<style>
  article p:first-child {
  }
  article p:first-child {
  }
</style>

<article>
  <div>
    <p>第一个后代元素</p>
    <p>第二个后代元素</p>
    <p>最后一个后代元素</p>
  </div>
</article>
```

**动态伪类**

- :hover 鼠标悬浮的元素
- :link 未访问的超链接
- :visited 已访问的超链接
- :active 鼠标点击的元素
- :focus 获得焦点的元素

```css
/* 鼠标悬浮时, 选择该 obj1 标签 */
obj1:hover {
}
```

**伪元素: 一个元素的部分, 以 :: 开头**

- ::first-letter 选择第一个字符
- ::first-line 选择第一行
- ::selection 匹配鼠标选择的内容
- ::placeholder 选择输入框的提示文本 (占位符)
- p::before p 元素的第一个子元素, content 属性指定元素的内容, 通常是 ''
- p::after p 元素的最后一个子元素, content 属性指定元素的内容, 通常是 ''

```css
/* 选择 p 标签的第一行 */
p::first-line {
}
```

```html
<style>
  .box::before {
    content: "Hello ";
  }

  .box::after {
    content: "";
    display: block;
    width: 100px;
    height: 100px;
    background-color: lightpink;
    border: 1px solid black;
  }
</style>

<body>
  <div class="box">World</div>
</body>
```

### 关系选择器

- 后代选择器 空格
- 子代选择器 >
- 邻接兄弟选择器 +
- 通用兄弟选择器 ~

```css
/* 选择 ul 元素的有 obj1 类的 li 子代元素 */
ul > li[class="obj1"] {
}
```

- 优先级: id 选择器 > 类选择器 > 标签选择器

## CSS 三大特性

1. 层叠性: 如果有样式冲突, 则根据选择器优先级, 层叠 (覆盖) 样式
2. 继承性: 元素继承父元素或祖先元素的某些样式
3. 优先级: !important > 行内样式 > ID 选择器 > 类选择器 > 标签选择器 > \* > 继承的样式

颜色表示

```css
* {
  /* RGB, RGBA (alpha channel) 表示 */
  color: rgb(255, 0, 0); /* 红色 */
  color: rgb(0, 255, 0); /* 绿色 */
  color: rgb(0, 0, 255); /* 蓝色 */
  /* HEX 十六进制表示 */
  color: #ff0000;
  color: #00ff00;
  color: #0000ff;
  /* HSL, HSLA 表示 */
}
```

字体

- font-size 字体大小
- font-family 字体族
- font-style 字体风格
- font-weight 字体粗细
- font 复合属性

文本

- color 文本颜色
- letter-spacing 字符间距
- word-spacing 单词间距
- text-decoration 文本装饰
  - none 无装饰
  - dotted 虚线, wavy 波浪线
  - underline 下划线, overline 上划线, line-through 删除线
- text-indent 文本缩进
- text-align 文本水平对齐
  - left 左对齐 (默认)
  - right 右对齐
  - center 居中对齐
- line-height 行高
- vertical-align 文本垂直对齐

列表

- list-style-type 列表符号
- list-style-position 列表符号的位置
- list-style-image 列表符号的图片
- list-style 复合属性

表格

- border-width 边框宽度
- border-color 边框颜色
- border-style 边框风格
- border 复合属性

背景

- background-color 背景颜色: 默认 transparent
- background-image 背景图片
- background-repeat 背景的重复方式
  - repeat 重复, 默认
  - repeat-x 只在水平方向重复
  - repeat-y 只在垂直方向重复
- background-position 背景图片 (的左上角距离原点) 的位置
- background 复合属性

鼠标

- 鼠标形状 cursor: pointer 手, move, text, crosshair, wait, help

## 盒子模型

### 长度单位

1. px 像素
2. em 相对元素 font-size 的倍数
3. rem 相对根元素 (html 标签) font-size 的倍数
4. % 相对父元素 font-size 的倍数

### 元素的显示模式

> 块元素 (block box)

1. 块盒子独占一行
2. 默认宽度: 撑满父元素
3. 默认高度: 由内容撑开
4. 可以设置宽高

> 行内元素 (inline-box)

1. 行内盒子不独占一行, 溢出时换行
2. 默认宽度: 由内容撑开
3. 默认高度: 由内容撑开
4. 不能设置宽高

#### 块级元素

- html, body
- h1...h6, hr, p, pre, div
- ul, ol, li, dl, dt, dd
- table, tbody, thead, tfoot, tr, caption
- form, option

#### 行内元素

- br, em, strong, sup, sub, del, ins
- obj1, label

#### 行内块元素

- img
- td, th
- input, textarea, select, button
- iframe

#### 修改元素的显示模式

| 值           | 描述                   |
| ------------ | ---------------------- |
| none         | 元素被隐藏             |
| block        | 元素作为块级元素显示   |
| inline       | 元素作为内联元素显示   |
| inline-block | 元素作为行内块元素显示 |

#### 盒子模型

- margin 外边距
- border 边框
- padding 内边距: padding-top, padding-right, padding-bottom, padding-left, padding
- content 内容: width, max-width, min-width, height, max-height, min-height

```css
padding: 10px; /* 上下左右 10px */
padding: 10px 20px; /* 上下 10px, 左右 20px */
padding: 10px 20px 30px; /* 上 10px, 左右 20px, 下 10px */
padding: 10px 20px 30px 40px; /* 上 10px, 右 20px, 下 30px, 左 40px */
```

1. padding 的值是正数
2. inline 行内元素 padding-left, padding-right 左右内边距设置有效
   padding-top, padding-bottom 上下内边距设置无效
3. block 块级元素, inline-block 行内块元素上下左右内边距 padding 设置都有效

#### 盒子边框 border

- 边框风格 border-style: none, solid, dashed, dotted, double
- 边框宽度 border-width
- 边框颜色 border-color
- 复合属性 border
- border-[left, right, top, bottom]-[style, width, color]

#### 盒子外边距 margin

- margin-left, margin-right, margin-top, margin-bottom
- 复合属性 margin

1. margin-top 上外边距, margin-left 左外边距: 影响自己的位置
2. margin-bottom 下外边距, margin-right 右外边距: 影响邻接兄弟的位置
3. inline 行内元素 margin-left, margin-right 左右外边距设置有效
   margin-top, margin-bottom 上下外边距设置无效
4. block 块级元素, inline-block 行内块元素上下左右外边距 margin 设置都有效

### 溢出处理

- overflow 溢出处理
  - visible 显示溢出内容
  - hidden 隐藏溢出内容
  - scroll 始终显示滚动条
  - auto 内容不溢出时不显示滚动条, 内容溢出时显示滚动条

### 隐藏元素的方式

1. 设置 visibility 属性: `visibility: hidden`
2. 设置 display 属性: `display: none`

### 样式继承

只继承与盒子模型无关的属性

- 继承的属性: 字体属性, 文本属性 (除了 vertical-align), 文本颜色
- 不继承的属性: 边框, 背景, 内边距, 外边距, 宽高, 溢出处理

### 布局技巧

1. inline 行内元素, inline-block 行内块元素, 可以视为文本, 使用 text-align, line-height, text-indent 等处理行内元素, 行内块元素
2. 子元素在父元素中水平居中
   1. 如果子元素为块级元素, 则父元素设置 `margin: 0 auto`
   2. 如果子元素为行内, 行内块元素, 则父元素设置 `text-align: center`
3. 子元素在父元素中垂直居中
   1. 如果子元素为块元素, 则子元素设置 margin-top: (父元素 content - 子元素总高) / 2;
   2. 如果子元素为行内, 行内块元素
      1. 父元素设置 `font-size: 0` (可选)
      2. 令父元素: line-height == height
      3. 子元素设置 `vertical-align: middle`

#### margin 塌陷问题

第一个子元素的上外边距 margin-top, 最后一个子元素的下外边距 margin-bottom 会转移给父元素 (被父元素剥夺)

解决 margin 塌陷问题

1. 父元素设置大于 0 的 padding
2. 父元素设置大于 0 的 border
3. 父元素设置 `overflow: hidden`

#### margin 合并问题

上方兄弟元素的下外边距 margin-bottom 和下方兄弟元素的上外边距 margin-top 合并为 math.Max(margin-bottom, margin-top), 而不是 margin-bottom + margin-top

解决: 只为一个元素设置上/下外边距

#### 行内/行内块元素间的空格问题

原因: 行内/行内块元素间的换行符, 会被浏览器识别为一个空格

解决: 父元素设置 `font-size: 0`

#### 行内块上下空白问题

原因: 行内块元素被视为文本, 默认与文本的基线 baseline 对齐

解决

1. 行内块设置 `vertical: middle | bottom | top` 属性值 != baseline 即可
2. 如果父元素是图片, 则设置 `display: block`
3. 父元素设置 `font-size: 0`

## 浮动

浮动的目标: 文本环绕

### 元素浮动后

1. 脱离文档流
2. 不独占一行
3. 宽高由内容撑开
4. 可以设置宽高
5. 没有 margin 塌陷问题和 margin 合并问题, 可以很好的设置上右下左的 margin, padding
6. 浮动的行内块不被视为文本, 没有行内块上下空白问题

### 元素浮动后产生的影响

- 对未浮动的兄弟元素的影响
  - 前面的未浮动的兄弟元素: 无影响 (参考 "独占一行")
  - 后面的未浮动的兄弟元素, 会占据浮动元素未浮动时的位置 (参考 "未浮动")
- 对父元素的影响
  - 浮动元素不能撑开父元素的高度, 父元素高度塌陷
  - 父元素的宽度仍然限制浮动元素

### 解决浮动产生的影响 (清除浮动)

只解决父元素高度塌陷

1. 父元素指定 (内容的) 高度
   `parent.height = child.margin*2 + child.border-width*2  + child.padding*2`
2. 父元素也设置浮动, 会产生其他影响
3. 父元素设置 `overflow: hidden`, 成为 BFC

解决父元素高度塌陷, 后面的未浮动的兄弟元素, 会占据浮动元素未浮动时的位置

1. **所有浮动元素后面**, 添加一个没有宽高, 没有内容的**块级**元素, 该元素设置 `clear: both`
2. 父元素使用 `::after` 创建伪元素, 等价于 1

```html
<style>
  /* 父元素使用 ::after 创建伪元素 */
  .parent::after {
    content: "";
    display: block;
    clear: both;
  }
</style>

<body>
  <div class="parent">
    <div class="float-1"></div>
    <div class="float-2"></div>
    <!-- 父元素创建的伪元素 -->
  </div>
</body>
```

布局原则: 设置浮动时, 父元素中的兄弟元素要么全部都浮动, 要么全部都不浮动

- float 设置浮动
  - float: left 设置左浮动
  - float: right 设置右浮动
  - float: none 不浮动, 默认
- clear 清除浮动
  - clear: left 清除前面所有左浮动兄弟元素产生的影响
  - clear: right 清除前面所有右浮动兄弟元素产生的影响
  - clear: both 清除前面所有浮动兄弟元素产生的影响

## 定位

### 定位元素和显示层级

定位元素

- 宽高: 由内容撑开
- 可以设置宽高
- 使用**绝对定位, 固定定位**后, 元素脱离文档流, 成为定位元素
- 使用**相对定位, 粘性定位**后, 元素不脱离文档流

显示层级

- 定位元素的显示层级比普通元素的显示层级高
- 定位元素会覆盖普通元素, 后面的定位元素会覆盖前面的定位元素
- 设置 CSS 属性 z-index 以修改定位元素的显示层级
- z-index 值越大, 显示层级越高
- 如果 z-index 值大的定位元素, 没有覆盖 z-index 值小的定位元素, 请检查包含块的显示层级

### 相对定位

- 设置 `position: relative` 以实现相对定位
- 可以使用 left, right, top, bottom 设置位置
- 相对定位的参考点: 本元素的**原位置**
- 相对定位的特点
  - 不脱离文档流
  - 不能同时设置 left 和 right, 不能同时设置 top 和 bottom
  - 不推荐设置 margin
  - 不推荐同时设置浮动和相对定位

### 绝对定位

- 设置 `position: absolute` 以实现绝对定位
- 可以使用 left, right, top, bottom 设置位置
- 绝对定位的参考点: 本元素的**包含块 containing block**
  包含块: 最近的有定位属性的祖先元素; 如果不存在, 则是 (浏览器) 窗口
- 绝对定位的特点
  - 脱离文档流, 成为定位元素, 会影响后面的兄弟元素, 父元素
  - 不能同时设置 left 和 right, 不能同时设置 top 和 bottom
  - 不推荐设置 margin
  - 不能同时设置浮动和绝对定位, 如果同时设置, 则浮动失效, 只有绝对定位有效
  - 行内, 行内块, 块级元素设置绝对定位后, 都会成为定位元素 (宽高由内容撑开, 可以设置宽高)

### 固定定位

- 设置 `position: fixed` 以实现固定定位
- 可以使用 left, right, top, bottom 设置位置
- 固定定位的参考点: (浏览器) 窗口
- 固定定位的特点
  - 脱离文档流, 成为定位元素, 会影响后面的兄弟元素, 父元素
  - 不能同时设置 left 和 right, 不能同时设置 top 和 bottom
  - 不推荐设置 margin
  - 不能同时设置浮动和固定定位, 如果同时设置, 则浮动失效, 只有固定定位有效
  - 行内, 行内块, 块级元素设置固定定位后, 都会成为定位元素 (宽高由内容撑开, 可以设置宽高)

### 粘性定位

粘性定位专用于滚动时的定位

- 设置 `position: sticky` 以实现粘性定位
- 可以使用 left, right, top (常用), bottom 设置位置
- 粘性定位的参考点: 最近的有滚动属性的祖先元素; 如果不存在, 则是 (浏览器) 窗口
- 粘性定位的特点
  - 不脱离文档流
  - 不推荐设置 margin
  - 不推荐同时设置浮动和粘性定位

粘性定位和相对定位的特点基本相同, 但粘性定位可以在元素到达某个位置时, 固定该元素

### 定位应用

使用**绝对定位, 固定定位**后, 元素脱离文档流, 成为定位元素

定位元素填充整个包含块

1. 定位元素的宽 == 包含块的宽 `left: 0; right: 0;`
2. 定位元素的高 == 包含块的高 `top: 0; bottom: 0;`

定位元素在包含块中居中

```css
.selector {
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

或

```css
.selector {
  left: 50%;
  top: 50%;
  margin-left: 负的宽度的一半;
  margin-top: 负的高度的一半;
}
```

## 布局

常用的布局名词

| 位置       |                        |
| ---------- | ---------------------- |
| 顶部导航条 | topbar                 |
| 页眉       | header, page-header    |
| 导航       | nav, navigator, navbar |
| 搜索框     | search, search-form    |
| 横幅, 广告 | banner                 |
| 内容       | content, main          |
| 侧栏       | aside, sidebar         |
| 页脚       | footer, page-footer    |

清除默认样式

[normalize.css](https://github.com/necolas/normalize.css/blob/master/normalize.css)

1. 动态伪类选择器 (:hover, :link, :visited, :active, :focus)
2. 视觉效果: 圆角, 阴影, 渐变
3. 背景效果: 新的背景属性, 多个背景图像
4. 布局方案: 弹性盒子
5. Web 字体
6. 颜色表示: RGBA, HSL, HSLA; opacity 不透明度
7. 2D 和 3D 变换: 平移, 缩放, 旋转等
8. 动画...

### 私有前缀

- chrome, edge, safari 浏览器: -webkit-
- firefox 浏览器: -moz-

### 长度单位

- rem 相对根元素 (html 标签) font-size 的倍数
- 视口: 即浏览器窗口
- vw 占视口宽度的百分比, 10vw 占视口宽度的 10%
- vh 占视口高度的百分比, 10vh 占视口高度的 10%
- `vmax`: vmax = Math.max(vw, vh)
- `vmin`: vmin = Math.min(vw, vh)

### box-sizing 怪异盒模型

box-sizing 设置盒子模型的类型

- content-box: width 和 height 设置盒子内容区的大小
  盒子总宽度 = 内容区宽度 + 边框宽度 border _ 2 + 外边距宽度 margin _ 2
- border-box: width 和 height 设置盒子总大小 (怪异盒模型)

```css
.selector {
  /* 怪异盒模型, 内容区可能会缩小 */
  box-sizing: border-box;
  /* 默认 */
  /* box-sizing: content-box; */
}
```

### resize 用户是否可以调整盒子大小

```css
.box {
  resize: horizontal;
  background-color: orange;
  /* 必须配合 overflow: hidden */
  overflow: hidden;
}
```

| 值         | 说明                          |
| ---------- | ----------------------------- |
| none       | 用户不可以调整元素大小 (默认) |
| both       | 用户可以调整元素的宽和高      |
| horizontal | 用户可以调整元素的水平宽度    |
| vertical   | 用户可以调整元素的垂直高度    |

### box-shadow 盒子阴影

```css
.selector {
  /* 两个值: 水平偏移 垂直偏移 (参考左上角) */
  box-shadow: 10px 10px;
  /* 三个值: 水平偏移 垂直偏移 阴影颜色 */
  box-shadow: 10px 10px blue;
  /* 三个值: 水平偏移 垂直偏移 阴影模糊半径 */
  box-shadow: 10px 10px 10px;
  /* 四个值: 水平偏移 垂直偏移 阴影模糊半径 阴影颜色 */
  box-shadow: 10px 10px 10px blue;
  /* 五个值: 水平偏移 垂直偏移 阴影模糊半径 阴影扩散半径 阴影颜色 */
  box-shadow: 10px 10px 10px 10px blue;
  /* 六个值: 水平偏移 垂直偏移 阴影模糊半径 阴影扩散半径 阴影颜色 内阴影 */
  box-shadow: 10px 10px 10px 10px blue inset;
}

/* 例 */
.box {
  width: 400px;
  height: 400px;
  background-color: lightblue;
  position: relative;
  /* 顶部, 相对原位置的顶部 0px */
  top: 0;
  /* 左侧, 相对原位置的左侧 0px */
  left: 0;
  /* 过渡 */
  /* transition: 0.3s linear all; */
  transition: 0.3s ease-out all;
}

.box:hover {
  /* 四个值: 水平偏移 垂直偏移 阴影模糊半径 阴影颜色 */
  box-shadow: 0 0 10px black;
  top: -1px;
  left: 0;
}
```

| 值       | 说明                             |
| -------- | -------------------------------- |
| h-shadow | 必填, 阴影的水平偏移, 可以为负值 |
| v-shadow | 必填, 阴影的垂直偏移, 可以为负值 |
| blur     | 可选, 阴影的阴影模糊半径         |
| spread   | 可选, 阴影的阴影扩散半径         |
| color    | 可选, 阴影的颜色                 |
| inset    | 可选, 外部阴影 -> 内部阴影       |

默认: `box-shadow: none` 无阴影

### opacity 不透明度

opacity 属性值是 0 到 1 的小数, 0 表示完全透明, 1 表示完全不透明

- opacity 是元素属性, 设置元素的不透明度
- rgba 仅设置颜色的不透明度

### 新的背景属性

**background-origin: 设置背景图像的原点**

1. padding-box: 从 padding 左上角开始显示背景图像 (默认)
2. border-box: 从 border 左上角开始显示背景图像
3. content-box: 从 content 左上角 开始显示背景图像

**background-clip: 设置背景图像的裁剪方式**

1. border-box: 从 border 区域裁剪背景图像, border 以外没有背景图像
2. padding-box: 从 padding 区域裁剪背景图像, padding 以外没有背景图像
3. content-box: 从 content 区域裁剪背景图像, 只有 content 有背景图像
4. text: 只有文本有背景图像

**background-size: 设置背景图像的尺寸**

- background-size: 300px 200px;

```css
.selector {
  background-size: 300px 200px;
  background-size: 100% 100%;
  /* auto 背景图像的实际大小, 默认 */
  background-size: auto;
  /* contain 背景图像等比例缩放, 容器的部分区域可能没有背景 */
  background-size: contain;
  /* cover 背景图像等比例缩放, 背景图像可能显示不完整 */
  background-size: cover;
}
```

**background 复合属性**

```css
.selector {
  /* 背景颜色 url 是否重复 位置 / 尺寸 原点 裁剪方式 */
  background: lightblue url("../assets/bg.jpg") no-repeat 10px 10px / 500px
    500px border-box content-box;
}
```

**多个背景图像**

```css
.selector {
  /* 添加多个背景图像 */
  background:
    /* 左上 left top */
    url("../assets/filename.png") no-repeat,
    /* 右上 */ url("../assets/filename.png") no-repeat right top,
    /* 左下 */ url("../assets/filename.png") no-repeat left bottom,
    /* 右下 */ url("../assets/filename.png") no-repeat right bottom;
}
```

### 新的边框属性

**border-radius: 设置圆角边框**

设置 4 个圆角: `border-radius: 10px;`

分别设置 4 个圆角:

- 一个值是圆的半径, 两个值是椭圆的 x 半径, y 半径
- border-top-left-radius, border-top-right-radius, border-bottom-left-radius, border-bottom-right-radius

复合属性: `border-radius: 左上x 右上x 右下x 左下x / 左上y 右上y 右下y 左下y`

**outline 边框的外轮廓**

外轮廓不参与盒子大小的计算

```css
.selector {
  outline-width: 20px;
  outline-color: lightblue;
  outline-style: solid;
  outline: 20px solid lightblue;
  outline-offset: 30px;
}
```

### 新的文本属性

**text-shadow: 设置文本阴影**

```css
.selector {
  /* 白色文字 */
  color: white;
  /* 黑色阴影 */
  text-shadow: 0 0 10px black;
}
```

| 值       | 说明                             |
| -------- | -------------------------------- |
| h-shadow | 必填, 水平阴影的位置, 可以为负值 |
| v-shadow | 必填, 垂直阴影的位置, 可以为负值 |
| blur     | 可选, 阴影模糊半径               |
| color    | 可选, 阴影颜色                   |

**white-space: 设置文本换行方式**

| 值       | 说明                                                                     |
| -------- | ------------------------------------------------------------------------ |
| normal   | 自动换行, 删除行的首尾空格, 合并行内的多个空格, 换行符被识别为空格, 默认 |
| pre-line | 自动换行, 删除行的首尾空格, 合并行内的多个空格, 识别换行符               |
| pre      | 原样输出, 等价于 pre 标签                                                |
| pre-wrap | pre 的基础上: 原样输出, 自动换行                                         |
| nowrap   | 强制不换行                                                               |

**text-overflow: 设置文本溢出时的显示模式**

```css
.truncate {
  /* 必须配合 overflow: hidden */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

| 值       | 说明                                                |
| -------- | --------------------------------------------------- |
| clip     | 内联内容溢出时, 裁剪溢出部分                        |
| ellipsis | 内联内容溢出时, 省略溢出部分 (将溢出部分替换为 ...) |

**复合属性 text-decoration**

`text-decoration: text-decoration-line || text-decoration-style || text-decoration-color`

text-decoration-line 文本装饰线的位置

- none 无装饰线 (默认)
- underline 下划线
- overline 上划线
- line-through 删除线

text-decoration-style: solid, double, dotted, dashed, wavy

text-decoration-color

**文本描边**

```css
.selector {
  -webkit-text-stroke: 1px red;
  color: transparent;
}
```

- `-webkit-text-stroke-width` 设置文本描边的宽度
- `-webkit-text-stroke-color` 设置文本描边的颜色
- `-webkit-text-stroke` 复合属性, 设置文本描边的宽度和颜色

### 渐变

渐变本质是背景图片

**线性渐变**

渐变本质是背景图片

```css
.selector {
  /* 默认从上到下线性渐变 */
  background-image: linear-gradient(pink, yellow, blue);

  /* 使用关键字设置线性渐变的方向 */
  background-image: linear-gradient(to right, pink, yellow, blue);

  /* 使用角度值设置线性渐变的方向 */
  background-image: linear-gradient(30deg, pink, yellow, blue);

  /* 设置发生渐变的位置 */
  /* 0..50 纯红
    50..100 红变黄
    100..150 黄变蓝
    150...200 纯蓝 */
  background-image: linear-gradient(pink 50px, yellow 100px, blue 150px);
}
```

**径向渐变**

```css
.selector {
  /* 默认从渐变圆的圆心开始径向渐变 */
  background-image: radial-gradient(pink, yellow, green);

  /* 使用关键字设置渐变圆的圆心的位置 */
  background-image: radial-gradient(at left top, pink, yellow, green);

  /* 使用像素值设置渐变圆的圆心的位置 */
  background-image: radial-gradient(at 100px 50px, pink, yellow, green);

  /* 设置渐变圆为正圆 */
  background-image: radial-gradient(circle, pink, yellow, green);

  /* 设置渐变圆的半径 */
  /* 圆的半径 100px */
  background-image: radial-gradient(100px, pink, yellow, green);

  /* 椭圆的 x 半径 100px, y 半径 50px */
  background-image: radial-gradient(100px 50px, pink, yellow, green);

  /* 设置发生渐变的位置 */
  background-image: radial-gradient(pink 50px, yellow 100px, green 150px);

  /* 复合写法 */
  background-image: radial-gradient(
    100px 50px at 150px 150px,
    pink 50px,
    yellow 100px,
    green 150px
  );
}
```

**重复渐变**

在没有发生渐变的区域, 重复渐变

```css
.selector {
  /* repeating-linear-gradient: 在没有发生渐变的区域, 重复线性渐变 */
  background-image: repeating-linear-gradient(
    pink 50px,
    yellow 100px,
    blue 150px
  );

  /* repeating-linear-gradient: 在没有发生渐变的区域, 重复径向渐变 */
  background-image: repeating-radial-gradient(
    pink 50px,
    yellow 100px,
    green 150px
  );
}
```

repeating-linear-gradient 重复线性渐变, 相关参数同 linear-gradient
repeating-radial-gradient 重复径向渐变, 相关参数同 radial-gradient

### Web 字体

使用 `@font-face` 指定字体的地址, 浏览器自动下载该字体

```css
@font-face {
  font-family: "Apple";
  src: url("./src/assets/Apple-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
}
```

**字体图标**

1. 字体图标对比图片更清晰
2. 灵活: 方便调整大小, 颜色, 风格等
3. 兼容性好

### 2D 变换

二维坐标系

```text
原点 (0, 0)
* -------- x
|
|
y
```

#### 2D 平移

transform: 转换属性, 设置元素的位置

| 值         | 说明                                                             |
| ---------- | ---------------------------------------------------------------- |
| translateX | 设置水平方向平移, 需要指定长度值, 或 (参考本元素宽度的) 百分比值 |
| translateY | 设置垂直方向平移, 需要指定长度值, 或 (参考本元素高度的) 百分比值 |
| translate  | 1 个值: 水平方向平移; 2 个值: 水平, 垂直方向平移                 |

**平移与相对定位**

相同: 元素都不脱离文档流, 不影响其他元素

不同:

1. 相对定位的百分比值, 参考父元素; 平移的百分比值, 参考本元素
2. 平移对比定位, 浏览器处理的效率更高
3. transform 可以链式编写, 例如 `transform: translateX(30px) translateY(40px);` 等价于 `translate: translate(30px, 40px);`
4. 行内元素可以定位; **行内元素不能使用 transform** (解决: `display: inline-block`)
5. 平移配合定位, 可以实现元素水平垂直居中

**元素水平垂直居中**

```css
.box {
  /* 定位 */
  position: absolute;
  /* 子元素左 margin 距离包含块 (父元素) 左边沿的 50% */
  left: 50%;
  /* 子元素左 margin 距离包含块 (父元素) 上边沿的 50% */
  top: 50%;
  /* 平移 */
  transform: translate(-50%, -50%);
}
```

#### 2D 缩放

transform: 转换属性, 设置元素的位置

| 值     | 说明                                               |
| ------ | -------------------------------------------------- |
| scaleX | 设置水平方向的缩放比例: 1 不缩放, >1 放大, <1 缩小 |
| scaleY | 设置垂直方向的缩放比例: 1 不缩放, >1 放大, <1 缩小 |
| scale  | 同时设置水平, 垂直方向的缩放比例                   |

通过缩放, 可以实现小于 12px 的文本

```html
<style>
  span {
    /* 行内元素不能位移 */
    display: inline-block;
    font-size: 20px;
    transform: scale(0.5);
  }
</style>
<span>安装 Rust</span>
```

#### 2D 旋转

transform: 转换属性, 设置元素的位置

| 值      | 说明                                 |
| ------- | ------------------------------------ |
| rotate  | 设置旋转角度, 正值顺时针, 负值逆时针 |
| rotateZ | 2d 旋转                              |

#### 扭曲

```css
.selector {
  transform: skewX(30deg);
  transform: skewY(30deg);
  transform: skewX(30deg) skewY(30deg);
  transform: skew(30deg, 30deg);
}
```

**多重变换**

建议最后旋转

```css
.selector {
  transform: translate(-50%, -50%) rotate(45deg);
}
```

#### 变换原点

**transform-origin: 设置变换的原点**

- 元素变换时, 默认原点是元素的中心
- 修改变换原点对平移无影响, 对旋转和缩放有影响

```css
.selector {
  /* 变换原点是本元素的左上角 */
  transform-origin: left top;
  /* 变换原点距离本元素的左上角 50px, 50px */
  transform-origin: 50px 50px;
  /* 百分比值, 参考本元素 (默认 50% 50%) */
  transform-origin: 50% 50%;
  /* 第二个值默认 50% */
  transform-origin: 0;
}
```

### 过渡 transition

过渡: 使得元素从一种样式, 平滑的过渡到另一种样式

> [!warning]
> 为元素自身设置 transition, 而不是 `&:hover`

- transition-duration 指定过渡效果的持续时间 `transition-duration: 2s;`
- transition-property 指定设置过渡效果的属性

属性值是数值的属性, 可以设置过渡效果

```css
.selector {
  /* 不设置任何过渡效果 */
  transition-property: none;
  /* 默认所有可过渡属性都会获得过渡效果 */
  transition-property: all;
  /* 为宽高设置过渡效果 */
  transition-property: width, height;
}
```

- transition-delay: 过渡效果的延迟时间
- transition-timing-function: 过渡计时函数
  - ease: 平滑过渡, 慢 => 快 => 慢 (默认)
  - linear: 线性过渡, 匀速
  - ease-in: 先慢后快
  - ease-out: 先快后慢
  - ease-in-out: 慢 => 快 => 慢
  - step-start: 开始时瞬间过渡
  - step-end: 结束时瞬间过渡
  - steps(n), step(n, start), step(n, end): 分步过渡
  - cubic-bezier(): 贝塞尔曲线

**符合属性 transition**: 先写 transition-duration, 后写 transition-delay, 其他没有顺序要求

### 动画 animation

- @keyframes animationName {} 定义动画
- animation-name 使用指定的动画
- animation-duration 设置动画的持续时间
- animation-delay 设置动画的延迟时间
- animation-timing-function 动画计时函数, 与过渡计时函数相同
- animation-iteration-count 设置动画播放的次数, 默认 1
- animation-direction 设置动画播放的方向, 默认 normal
  - normal: 正放
  - reverse: 倒放
  - alternate: 正放, 倒放, 正放 ...
  - alternate-reverse: 倒放, 正放, 倒放 ...
- animation-fill-mode: backwards 动画未播放时, 画面停在第一帧
- animation-fill-mode: forwards 动画未播放时, 画面停在最后一帧
- animation-play-state 设置动画的播放状态
  - paused 暂停
  - running 播放中

```html
<style>
  /* 定义动画 @keyframes animationName {} */
  @keyframes scroll {
    /* 第一帧, 等价于 0% {} */
    from {
    }

    /* 最后一帧, 等价于 100% */
    to {
      transform: translateX(900px) rotate(360deg);
      background-color: lightpink;
      border-radius: 50%;
    }
  }

  .inner {
    width: 100px;
    height: 100px;
    background-color: lightblue;
    animation-name: scroll;
    animation-duration: 3s;
    animation-delay: 0.5s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-direction: alternate;
    animation-fill-mode: backwards;
    animation-play-state: running;
  }
</style>
```

**复合属性 animation**: 先写 animation-duration, 后写 animation-delay, 其他没有顺序要求

> 过渡和动画的区别

1. 过渡需要触发条件, 动画不需要触发条件
2. 动画可以使用关键帧精细设置

## 伸缩盒模型 (弹性盒子)

- 传统布局: 基于传统盒模型: display + position + float
- flex 布局: 广泛用于 Web 端, 移动端

```css
.selector {
  /* 父元素开启 flex 布局, 成为伸缩盒 (弹性盒) 容器 */
  /* 子元素成为伸缩盒 (弹性盒) 项目, 未脱离文档流, 可以撑开父元素的宽高 */
  display: flex;
  /* display: flex; 块级的缩盒容器, 独占一行 */
  /* display: inline-flex; 行内块的伸缩盒容器, 不常用 */
}
```

### 伸缩容器, 伸缩项目

- 伸缩容器: 开启了 `display: flex` 或 `display: inline-flex` 的元素
- 伸缩项目: 伸缩容器的**子元素**是伸缩项目 (孙元素不是伸缩项目)
- 一个元素可以同时是伸缩容器, 伸缩项目
- 块级, 行内块, 行内元素成为伸缩项目后, 都会 **块状化**

例: span 元素成为伸缩项目后, 行内元素 => 块元素, 宽高有效

#### 主轴和侧轴

- 主轴: 主轴默认水平, 默认方向从左到右
- 侧轴: 侧轴默认垂直, 默认方向从上到下
- 主轴与侧轴垂直, 伸缩项目沿主轴排列

> 主轴默认压缩, 侧轴默认拉伸

#### 主轴方向

flex-direction: 设置主轴方向

| 属性: 值                       | 主轴方向       | 侧轴方向       |
| ------------------------------ | -------------- | -------------- |
| flex-direction: row            | 从左到右, 默认 | 从上到下, 默认 |
| flex-direction: row-reverse    | 从右到左       | 从上到下       |
| flex-direction: column         | 从上到下       | 从左到右       |
| flex-direction: column-reverse | 从下到上       | 从左到右       |

#### 主轴换行方式

- `flex-wrap: nowrap` 不换行, 默认
- `flex-wrap: wrap` 自动换行 (侧轴方向换行)
- `flex-wrap: wrap-reverse` 反向换行 (侧轴方向的反向换行)

> flex-flow 是 flex-direction 和 flex-wrap 的复合属性 `flex-flow: 主轴方向 主轴换行方式;`

#### 主轴对齐方式

默认情况下, 主轴方向从左到右, 主轴对齐方式即 (文本) 水平对齐方式

| 属性: 值                       | 说明                                     |                  |
| ------------------------------ | ---------------------------------------- | ---------------- |
| justify-content: flex-start    | 主轴起点对齐, 默认                       | 整体左对齐, 默认 |
| justify-content: flex-end      | 主轴终点对齐                             | 整体右对齐       |
| justify-content: center        | 主轴中点对齐                             | 整体水平居中     |
| justify-content: space-between | 主轴均匀分布: 两端距离等于 0             |                  |
| justify-content: space-around  | 主轴均匀分布: 两端距离等于中间距离的一半 |                  |
| justify-content: space-evenly  | 主轴均匀分布: 两端距离等于中间距离       |                  |

#### 侧轴对齐方式

默认情况下, 侧轴方向从上到下, 侧轴对齐方式即 (文本) 垂直对齐方式

**多行的情况: align-content**

| 属性: 值                     | 说明                                     |              |
| ---------------------------- | ---------------------------------------- | ------------ |
| align-content: flex-start    | 侧轴起点对齐, 默认                       | 整体上对齐   |
| align-content: flex-end      | 侧轴终点对齐                             | 整体下对齐   |
| align-content: center        | 侧轴中点对齐                             | 整体垂直居中 |
| align-content: space-between | 侧轴均匀分布: 两端距离等于 0             |              |
| align-content: space-around  | 侧轴均匀分布: 两端距离等于中间距离的一半 |              |
| align-content: space-evenly  | 侧轴均匀分布: 两端距离等于中间距离       |              |
| align-content: strech        | 如果没有指定高度, 则拉伸以填充整个侧轴   | 默认         |

**单行的情况 align-items**

| 属性: 值                | 说明                               |          |
| ----------------------- | ---------------------------------- | -------- |
| align-items: flex-start | 侧轴起点对齐, 默认                 | 行顶对齐 |
| align-items: flex-end   | 侧轴终点对齐                       | 行底对齐 |
| align-items: center     | 侧轴中点对齐                       | 垂直居中 |
| align-items: baseline   | 侧轴基线 baseline 对齐             |          |
| align-items: stretch    | 如果没有指定高度, 则拉伸以填充整行 | 默认     |

#### flex 实现水平垂直居中

方法 1: 父元素开启 flex 布局, 使用 justify-content 和 align-items 实现水平垂直居中

```css
.outer {
  width: 400px;
  height: 400px;
  background-color: lightpink;
  /* 父元素开启 flex 布局 */
  display: flex;
  /* 水平居中 */
  justify-content: center;
  /* 单行垂直居中 */
  align-items: center;
}

.inner {
  width: 100px;
  height: 100px;
  background-color: lightgreen;
}
```

方法 2: 父元素开启 flex 布局, 子元素使用 `margin: auto`

```css
.outer1 {
  width: 400px;
  height: 400px;
  background-color: lightgreen;
  /* 父元素开启 flex 布局 */
  display: flex;
}

.inner1 {
  width: 100px;
  height: 100px;
  background-color: lightblue;
  margin: auto;
}
```

### 伸缩性

#### flex-basis

flex-basis: 设置伸缩项目在主轴方向的初始长度

- 设置伸缩项目在主轴方向的初始长度
- 主轴水平时, 伸缩项目的宽度失效; 主轴垂直时, 伸缩项目的高度失效
- 默认 `flex-basis: auto`, 即默认伸缩项目主轴方向的初始长度等于伸缩项目的宽或高
- 浏览器根据 flex-basis 的属性值, 计算主轴上是否有剩余空间

#### flex-grow 伸

flex-grow: 主轴上有剩余时, 设置伸缩项目的拉伸比例

1. 默认所有伸缩项目的 flex-grow 值都为 0: 不拉伸
2. 例: 如果 3 个伸缩项目的 flex-grow 值都为 1, 则分别拉伸剩余空间的 1/3, 1/3, 1/3
3. 例: 如果 3 个伸缩项目的 flex-grow 值为 1, 2, 3, 则分别拉伸剩余空间的 1/6, 2/6, 3/6

#### flex-shrink 缩

flex-shrink: 主轴上有溢出时, 设置伸缩项目的压缩比例

3 个伸缩项目宽度分别为 200px, 300px, 400px, 容器 500px

1. 默认 3 个伸缩项目的 flex-grow 值都为 1: 分别压缩溢出空间 (400px) 的 (对比 flex-grow: 1/3, 1/3, 1/3)
   - `200 / (200 + 300 + 400) = 2/9`
   - `300 / (200 + 300 + 400) = 3/9`
   - `400 / (200 + 300 + 400) = 4/9`
2. 如果 3 个伸缩项目的 flex-grow 值为 1, 2, 3, 则分别压缩溢出空间 (400px) 的 (对比 flex-grow: 1/6, 2/6, 3/6)
   - `(200 * 1) / (200 * 1 + 300 * 2 + 400 * 3) = 1/10`
   - `(300 * 2) / (200 * 1 + 300 * 2 + 400 * 3) = 3/10`
   - `(400 * 3) / (200 * 1 + 300 * 2 + 400 * 3) = 6/10`

#### flex 复合属性

flex: flex-grow(主轴上有剩余时的拉伸比例) flex-shrink(主轴上有溢出时的压缩比例) flex-basis(主轴的初始长度)

- `flex: 0 1 auto;` 不能拉伸, 可以压缩, 默认初始长度: 默认, 等价于 `flex: 0 auto;`
- `flex: 1 1 auto;` 可以拉伸, 不能压缩, 默认初始长度: 等价于 `flex: auto;`
- `flex: 1 1 0;` 可以拉伸, 可以压缩, 初始长度为 0 (伸缩项目的宽或高失效): **常用**, 等价于 `flex: 1;`
- `flex: 0 0 auto;` 不能拉伸, 不能压缩, 默认初始长度: 等价于 `flex: none`

**其他**

- order 属性: 指定伸缩项目在主轴上的排列顺序, 值越小, 排序越靠前, 默认 0
- align-self 属性: 单独指定某个伸缩项目的侧轴对齐方式, 默认 auto

### 响应式布局

| 值               | 说明                      |
| ---------------- | ------------------------- |
| all              | 所有                      |
| screen           | 设备屏幕                  |
| print            | 打印机/打印预览           |
| width            | 视口宽度                  |
| max-width        | 视口最大宽度              |
| min-width        | 视口最小宽度              |
| height           | 视口高度                  |
| max-height       | 视口最大高度              |
| min-height       | 视口最小高度              |
| device-width     | 设备屏幕的宽度            |
| max-device-width | 设备屏幕的最大宽度        |
| min-device-width | 设备屏幕的最小宽度        |
| orientation      | 视口的旋转方向 (是否横屏) |

orientation

1. portrait: 纵向视口, 即高度 >= 宽度
2. landscape: 横向视口, 即宽度 >= 高度

### 响应式布局

常见阈值

- 超小屏幕 768px 中等屏幕 992px 大屏幕 1200px 超大屏幕

```css
/* 超小屏幕 */
@media screen and (max-width: 768px) {
}
/* 中等屏幕 */
@media screen and (min-width: 768px) and (max-width: 992px) {
}
/* 大屏幕 */
@media screen and (min-width: 992px) and (max-width: 1200px) {
}
/* 超大屏幕 */
@media screen and (min-width: 1200px) {
}
```

```html
<!-- 超小屏幕 -->
<link rel="stylesheet" media="screen and (max-width: 768px)" href="#" />
<!-- 中等屏幕 -->
<link
  rel="stylesheet"
  media="screen and (min-width: 768px) and (max-width: 992px)"
  href="#"
/>
<!-- 大屏幕 -->
<link
  rel="stylesheet"
  media="screen and (min-width: 992px) and (max-width: 1200px)"
  href="#"
/>
<!-- 超大屏幕 -->
<link rel="stylesheet" media="screen and (min-width: 1200px)" href="#" />
```

#### BFC

BFC, Block Formatting Context 块级格式上下文, 可以理解为元素的特殊功能, 该特殊功能默认关闭, 满足某些条件时, 该特殊功能被激活

1. 元素开启 BFC 后, 该元素的子元素不会有 margin 塌陷问题 (第一个子元素的上外边距 margin-top, 最后一个子元素的下外边距 margin-bottom 会转移给父元素 (被父元素剥夺))
2. 元素开启 BFC 后, 该元素不会被其他浮动元素覆盖
3. 元素开启 BFC 后, 即使该元素的子元素浮动, 该元素的高度也不会塌陷

开启了 BFC 的元素

- 根元素
- 浮动元素
- 绝对定位, 固定定位的元素
- 行内块元素
- 表格单元格: table, thead, tbody, tfoot, th, td, tr, caption
- overflow 属性值不等于 visible 的元素 (hidden, scroll, auto)
  例: 父元素设置 `overflow: hidden` 可以解决父元素高度塌陷问题
- 伸缩项目
- 多列容器 (column_count 属性)
- 设置 `column-span: all` 的元素
- 设置 `display: flow-root` 的元素

## BEM 架构

选择器类名

```css
.namespace-block__element--modifier {
}

.el-input_wrapper {
  /** 输入框的边框 */
}

.el-input__inner {
  /** 输入框的内部 */
}

.el-button--primary {
  /** 普通按钮 (蓝色) */
}

.el-button--success {
  /** 成功按钮 (绿色) */
}
```

- @font-face
- @keyframes
- @media
- @import

## 垂直 margin 合并

- 父子元素垂直外边距重叠
- 相邻元素垂直外边距重叠

- 同一个 bfc 中的元素的垂直 margin 会合并
- 不同 bfc 中的元素的垂直 margin 不会合并

### margin 塌陷问题

第一个子元素的上外边距 margin-top, 最后一个子元素的下外边距 margin-bottom 会转移给父元素 (被父元素剥夺)

**解决**

父元素设置大于 0 的 padding
父元素设置大于 0 的 border
父元素设置 `overflow: hidden` (bfc) 或 `display: flow-root`
`

### margin 合并问题

上方兄弟元素的下外边距 margin-bottom 和下方兄弟元素的上外边距 margin-top 合并为 math.Max(margin-bottom, margin-top), 而不是 margin-bottom + margin-top

**解决**: 只为一个元素设置上/下外边距

## 行内/行内块元素间的空格问题

**原因**: 行内/行内块元素间的换行符, 会被浏览器识别为一个空格

**解决**: 父元素设置 font-size: 0

## 行内块上下空白问题

**原因**: 行内块元素被视为文本, 默认与文本的基线 baseline 对齐

**解决**

行内块设置 vertical-align: middle | bottom | top 属性值 != baseline 即可
如果父元素是图片, 则设置 display: block
父元素设置 font-size: 0

## BFC, Block Formatting Contexts

计算 bfc 高度时, 浮动元素也参与计算
bfc 作为隔离的独立容器, 可以清除浮动; 可以防止与浮动元素重叠

1. 计算 bfc 的高度时, 浮动元素也会参与计算
2. 同一个 bfc 中的元素的垂直 margin 会合并
3. bfc 元素不会合并子元素的垂直 margin
4. 浮动盒不会和 bfc 重叠

## 清除浮动的方法

```html
<style>
  /* 父元素使用 ::after 创建伪元素 */
  .parent::after {
    content: "";
    display: block;
    clear: both;
  }
</style>

<body>
  <div class="parent">
    <div class="float-left"></div>
    <div class="float-right"></div>
    <!-- 父元素创建的伪元素 -->
  </div>
</body>
```

## IFC, Inline Formatting Contexts

IFC: **仅**包含 行内或行内块 的块级元素

- 行内元素不独占一行
- 行内元素无法指定宽高, 宽高由子元素撑开, margin 和 padding 水平方向有效, 垂直方向无效
- 行内**块**元素可以指定宽高
- 行内元素, 行内块元素的高度都受到 line-height 影响, **行内元素, 行内块元素被视为文本**

### IFC 应用场景

- 水平居中 `display: inline-block; text-align: center;`
- 垂直居中 `display: inline-block; vertical-align: middle;`

## 块级元素

常见的块级元素

- `<div>, <p>, <h1...6>, <table>, <ol/ul>, <dd/dl>, <form>, <hr>`
- HTML5: `<header>, <article>, <aside>, <section>, <footer>, <audio>, <video>, <canvas>, <figure>`

常见的行内块元素

- `<a>, <abbr>, <b>, <strong>, <span>, <label>, <input>, <textarea>, <select>, <button>, <img>`

## display 属性

外部显示类型

- `display: block` 块级元素
- `display: inline` 行内元素

内部显示类型

- `display: flex` 弹性伸缩盒
- `display: grid` 网格布局

显示值

- `display: contents` 指定子元素的布局方式与父元素相同
- `display: none` 隐藏元素

混合值

- `display: inline-block` 行内块元素
- `display: inline-flex` 行内弹性伸缩盒
- `display: inline-grid` 行内网格布局

全局值

- `display: inherit` 全局: 子元素继承父元素的 display 属性值
- `display: initial` 全局: 子元素使用默认的 display 属性值
- `display: unset` 全局: 如果父元素指定了 display 属性值, 则子元素继承父元素的 display 属性值, 否则子元素使用默认的 display 属性值

## 显示层级

如果 z-index 值大的定位元素, 没有覆盖 z-index 值小的定位元素, 请检查包含块的显示层级

## 定位

### 相对定位 `position: relative`

相对定位的参考点: 本元素的原位置

### 绝对定位 `position: absolute`

绝对定位的参考点: 本元素的包含块 (containing block)

包含块: 最近的有定位属性的祖先元素; 如果不存在, 则是 (浏览器) 窗口

## 固定定位

固定定位的参考点: 浏览器 窗口

- relative 相对定位和 absolute 绝对定位在移动端使用较多
- fixed 固定定位在移动端有兼容问题, 替代方案是 absolute + 内部滚动

## 正常布局流

正常布局流: 不使用任何布局样式, 浏览器的默认 HTML 布局

- 默认块级元素的宽度是父元素的 100%, 高度由内容撑开, 一行一行的布局
- 默认行内元素无法指定宽高, 在行内一列一列的布局, 溢出时行内换 "行"

## 如何脱离文档流

- 浮动 float 会脱离文档流
- 绝对定位 (absolute, 相对本元素的包含块) 会脱离文档流
- 固定定位 (fixed, 相对浏览器窗口) 会脱离文档流

## 浮动

```css
.float-left {
  float: left;
}

.float-right {
  float: right;
}

/* 父元素的最后一个伪元素清楚浮动 */
.clear-float::after {
  content: "";
  /* height: 0; */
  display: block;
  clear: both;
}
```

## flex 布局

- flex 弹性伸缩盒布局是一维布局
- grid 网格布局是二维布局

设置 flex 布局后, 子元素的 float, clear 和 vertical-align 属性将失效

### 弹性伸缩盒的属性

- flex-direction: 主轴的方向 (伸缩项目的排列方向)
  - row 默认值
  - row-reverse
  - column
  - column-reverse
- flex-wrap
  - nowrap 默认值
  - wrap
  - wrap-reverse
- flex-flow: 是 flex-direction 属性和 flex-wrap 属性的简写, 默认值 `flex-flow: row nowrap;`
- justify-content: 伸缩项目在主轴上的对齐方式
  - flex-start: 左对齐, 默认值
  - flex-end: 右对齐
  - center: 居中
  - space-between `|8  8  8  8|`
  - space-around `| 8  8  8  8 |`
  - space-evenly `|  8  8  8  8  |`
- align-items: 伸缩项目在交叉轴上 (单根轴线) 的对齐方式
  - flex-start 交叉轴起点对齐
  - flex-end 交叉轴终点对齐
  - center: 交叉轴中点对齐
  - baseline: 文字基线对齐
  - stretch: 如果没有指定伸缩项目高度, 则拉伸伸缩项目以填充整行
- align-content: 伸缩项目在交叉轴上 (多根轴线) 的对齐方式
  - flex-start 交叉轴起点对齐
  - flex-end 交叉轴终点对齐
  - center 交叉轴中点对齐
  - space-between, space-around, space-evenly
  - stretch 多根轴线填充整行

### 伸缩项目的属性

1. order 属性: 指定伸缩项目在主轴上的排列顺序, 值越小, 排序越靠前, 默认 0
2. flew-grow 伸: 主轴上有剩余时, 设置伸缩项目的拉伸比例
3. flex-shrink 缩: 主轴上有溢出时, 设置伸缩项目的压缩比例
4. flex-basis: 设置伸缩项目在主轴方向的初始长度, 浏览器根据伸缩项目的 flex-basis 属性值, 计算主轴上是否有剩余空间
5. flex: flex: flex-grow(主轴上有剩余时的拉伸比例) flex-shrink(主轴上有溢出时的压缩比例) flex-basis(主轴的初始长度) 的简写

### flex 快捷设置

1. `flex: 0 1 auto` 默认值
   - flex-grow: 0 伸缩项目不能拉伸
   - flex-shrink: 1 伸缩项目可以压缩
   - flex-basis: auto 伸缩项目在主轴方向的初始长度 = 盒子宽度
2. `flex: auto`, 等价于 `flex: 1 1 auto`
   - flex-grow: 1 伸缩项目可以拉伸
   - flex-shrink: 1 伸缩项目可以压缩
   - flex-basis: auto 伸缩项目在主轴方向的初始长度 = 盒子宽度
3. `flex: none`, 等价于 `flex: 0 0 auto`
   - flex-grow: 0 伸缩项目不能拉伸
   - flex-shrink: 0 伸缩项目不能压缩
   - flex-basis: auto 伸缩项目在主轴方向的初始长度 = 盒子宽度
4. `flex: 1` 或 `flex: 0%`, 等价于 `flex: 1 1 0%`
   - flex-grow: 1 伸缩项目可以拉伸
   - flex-shrink: 1 伸缩项目可以压缩
   - flex-basis: 0% 伸缩项目在主轴方向的初始长度为 0 (盒子宽度失效)
5. `flex: 24px`, 等价于 `flex: 1 1 24px`
   - flex-grow: 1 伸缩项目可以拉伸
   - flex-shrink: 1 伸缩项目可以压缩
   - flex-basis: 24px 伸缩项目在主轴方向的初始长度为 24px (盒子宽度失效)

align-self 属性: 单独指定某个伸缩项目的侧轴对齐方式, 默认 auto

`align-self: auto | flex-start | flex-end | center | baseline | stretch`

## grid 网格布局

- flex 弹性伸缩盒布局是一维布局
- grid 网格布局是二维布局
  - `display: gird` 使用网格布局 (网格容器是块级元素)
  - `display: inline-grid` 使用行内网格布局 (网格容器是行内块元素)

网格有行 (row), 列 (column), 每行每列的间隙 (沟槽 gutter)

使用网格布局后, 网格容器中的子元素 (网格项目) 的 float, display: inline-block, vertical-align 和 column-\* 等属性都会失效

### grid 属性

- `grid-template-columns` 各列的列宽
- `gird-template-rows` 各行的行高
  - `repeat` 函数: repeat(重复次数, 重复值)
  - `auto-fill` 自动填充, 让一行 (或一列) 填充尽可能多的单元格
  - `fr` (fraction) 1fr 是 1 等分
  - `minmax` 函数: minmax(最小值, 最大值)
  - `auto` 自动调整列宽, 行高

例: 圣杯布局 `grid-template-columns: 100px auto 100px`

- `row-gap` 设置行间距
- `column-gap` 设置列间距
- `gap` row-gap(行间距) column-gap(列间距)
- `grid-template-areas` 定义区域, 配合 `grid-area` 使用
- `grid-area` 指定网格项目放在哪一个区域
- `grid-auto-flow` 布局算法
  - row 先行后列布局
  - column 先列后行布局
  - dense 尽可能填满
- `justify-items` **网格项目的水平位置**
  - start 网格项目左对齐
  - end 网格项目右对齐
  - center 网格项目水平居中
  - stretch 拉伸以填充单元格宽度, 默认
- `align-items` **网格项目的垂直位置**
  - start 网格项目上对齐
  - end 网格项目下对齐
  - center 网格项目垂直居中
  - stretch 拉伸以填充单元格高度, 默认
- `justify-content` **网格容器的水平位置**
  - start 网格容器左对齐
  - end 网格容器右对齐
  - center 网格容器水平居中
  - stretch 拉伸以填充父元素的宽度
  - space-around `[ 列  列  列 ]`
  - space-between `[列  列  列]`
  - space-evenly `[  列  列  列  ]`
- `align-content` **网格容器的垂直位置**
  - start 网格容器上对齐
  - end 网格容器下对齐
  - center 网格容器垂直居中
  - stretch 拉伸以填充父元素的高度
  - space-around, space-between, space-evenly
- place-content 复合属性 `place-content: <align-content> <justify-content>`
- `place-items`

显式网格: `grid-template-columns` 和 `grid-template-row` 中显式定义的行和列

隐式网格: 行数不确定, 列数不确定

- grid-auto-columns 指定隐式网格的列宽
- grid-auto-rows 指定隐式网格的行高
- grid-template 复合属性 `grid-template: <grid-template-columns> <grid-template-rows> <grid-template-areas>`
- grid 复合属性 `grid: <grid-template-rows> <grid-template-columns> <grid-template-areas> <grid-auto-rows> <grid-auto-columns> <grid-auto-flow>`
- grid-column-start: 左侧垂直网格线
- grid-column-end 右侧垂直网格线
- grid-row-start 上方水平网格线
- grid-row-end 下方水平网格线
- grid-column 复合属性 `grid-column: <grid-column-start> <grid-column-end>`
- grid-row 复合属性 `grid-row: <grid-row-start> <grid-row-end>`

- justify-self 指定单个网格项目的水平位置
  - start 网格项目左对齐
  - end 网格项目右对齐
  - center 网格项目水平居中
  - stretch 拉伸以填充单元格宽度, 默认
- align-self 指定单个网格项目的垂直位置
  - start 网格项目上对齐
  - end 网格项目下对齐
  - center 网格项目垂直居中
  - stretch 拉伸以填充单元格高度, 默认
- place-self 复合属性 `place-self: <align-self> <justify-self>`

```css
.wrapper {
  /* 3 列, 列宽: 100px, 100px, 100px */
  grid-template-columns: repeat(3, 100px);
  /* 2 行, 行高: 100px 200px */
  grid-template-rows: 100px 200px;
}
```

## Grid 网格布局案例

1. 列宽度等分 (响应式)

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

2. 列宽固定, 列数量可变, 列宽度等分

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

3. 使用 span 关键字指定网格项目的跨度

```css
.item {
  grid-column-start: span 3;
}
```

## 单行文本溢出

```css
.truncate {
  /* 溢出隐藏 */
  overflow: hidden;
  /* 溢出使用省略号 */
  text-overflow: ellipsis;
  /* 文本不换行 */
  white-space: nowrap;
}
```

## Sass 快速入门

### 变量

- Sass 变量会被编译, CSS 变量会被保留
- Sass 变量只能有一个值

```scss
// --ts-blue: #3178c6;
$ts-blue: #3178c6;
$ts-blue-border: 1px solid $ts-blue;
.selected {
  border: $ts-blue-border;
}
// 编译后的 css
.selected {
  border: 1px solid #3178c6;
}
// 变量默认值
$ts-blue: #3178c6 !default;
```

### 嵌套

```scss
#content {
  aside {
  }
}
// 编译后的 css
#content {
}
#content aside {
}
```

### 父选择器

没有 & 时, 编译时添加空格; 有 & 时, 编译时将 & 替换为父选择器

```scss
article a {
  &:hover {
  }
}
article a:hover {
}
```

```scss
.container {
  h1,
  h2,
  h3 {
  }
}
// 编译后的 css
.container h1,
.container h2,
.container h3 {
}
```

```scss
nav,
aside {
  a {
  }
}
// 编译后的 css
nav a,
aside a {
}
```

```scss
article {
  ~ article {
  }
  dl > {
    dt {
    }
  }
  nav + & {
  }
}
// 编译后的 css
// 兄弟选择器, 选择相同父元素下的, 除了第一个子元素 article 的后续子元素 article
article ~ article {
}
// 子选择器, 选择 article 元素的子元素 dl 的直接子元素 dt
article dl > dt {
}
// 相邻兄弟选择器, 选择 nav 元素后的相邻兄弟元素 article
nav + article {
}
```

### 嵌套属性

```scss
nav {
  border: {
    width: 1px; // border-width
    color: #3178c6; // border-color
  }
}
nav {
  border: 1px solid #3178c6 {
    left: 0px;
    right: 0px;
  }
}
```

### import

- css 的 `@import`: 执行到 `@import` 时, 浏览器才会下载导入的 css 文件, 页面加载慢
- scss 的 `@import`: 生成 css 文件时, 将所有 `@import` 导入的样式打包到同一个 css 文件中
- scss 的 `@import` 不需要指定文件扩展名
- 以 \_ 开头的 scss 文件不会生成对应的 css 文件

嵌套导入

::: code-group

```scss [_blue-theme.scss]
aside {
  color: #fff;
  background: #3178c6;
}
```

```scss [index.scss]
.theme--blue {
  @import "blue-theme"; // _ 和 .scss 文件扩展名可省略
}
```

```css [生成的 css 文件]
.theme--blue {
  aside {
    color: #fff;
    background: #3178c6;
  }
}
```

:::

Sass 也支持原生的 css 导入 `@import('./style.css')`, 会导致浏览器额的外下载

### 混入 `@mixin`

```scss
@mixin rounded-corners {
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}

.box {
  background-color: #fff;
  border: 1px solid #3178c6;
  @include rounded-corners;
}
// 编译后的 css
.box {
  background-color: #fff;
  border: 1px solid #3178c6;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}
```

混入中可以包含选择器

```scss
@mixin prettier-table {
  border: 1px solid #000;
  border-collapse: collapse;
  padding: 0;
  th,
  td {
    border: 1px solid #000;
    padding: 0;
    text-align: center;
  }
}

table {
  width: 400px;
  @include prettier-table;
}
// 编译后的 css
table {
  width: 400px;
  border: 1px solid #000;
  border-collapse: collapse;
  padding: 0;
}

table th,
table td {
  border: 1px solid #000;
  padding: 0;
  text-align: center;
}
```

- 混入可以接收参数
- 可以指定参数默认值
- 可以使用[关键字参数](https://www.w3schools.com/python/gloss_python_function_keyword_arguments.asp)

```scss
// 可以指定参数默认值 $border-color: #000
@mixin prettier-table($width, $border-color: #000) {
  width: $width;
  border: 1px solid $border-color;
  border-collapse: collapse;
  padding: 0;
  th,
  td {
    border: 1px solid $border-color;
    padding: 0;
    text-align: center;
  }
}

table {
  // @include prettier-table(400px, #000);
  // 可以使用关键字参数
  @include prettier-table($border-color: #000, $width: 400px);
}
```

### 选择器的继承 `@extend`

```scss
.error {
  border: 1px solid red;
}
.error {
  background-color: #ff0000;
}
.fatal-error {
  @extend .error;
  border-width: 3px;
}
// 编译后的 css
.error,
.fatal-error {
  border: 1px solid red;
  background-color: #f00;
}
.fatal-error {
  border-width: 3px;
}
```

### 其他

```scss
// 插值 #{}
$name: foo;
div.#{$name} {
}
// div.foo {}

// 跳出嵌套
.parent {
  @at-root .child {
  }
}
// .parent {}
// .child {}
```
