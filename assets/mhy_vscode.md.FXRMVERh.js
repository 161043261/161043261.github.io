import{_ as i,c as a,a0 as n,o as e}from"./chunks/framework.D5XSuxOt.js";const c=JSON.parse('{"title":"VScode","description":"","frontmatter":{},"headers":[],"relativePath":"mhy/vscode.md","filePath":"mhy/vscode.md","lastUpdated":1745025007000}'),l={name:"mhy/vscode.md"};function t(h,s,p,r,k,d){return e(),a("div",null,s[0]||(s[0]=[n(`<h1 id="vscode" tabindex="-1">VScode <a class="header-anchor" href="#vscode" aria-label="Permalink to &quot;VScode&quot;">​</a></h1><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//(?!.*\\..*\\.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # //</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/\\*(.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\r\\n</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\n</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*?</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/ </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># /**/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">^\\s*(?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">r?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$)</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # blank line</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">^(\\s*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)#.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           # #</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>导出 VScode 插件</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">code</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --list-extensions</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">code</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --list-extensions</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> xargs</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -n</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> code</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --install-extension</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>调试 Debug</p><ol><li>继续: 跳到下一个断点</li><li>逐过程: 逐行调试代码, 遇到函数调用时, 不跳入函数体内部, 放行 (运行函数) , 跳到函数调用的下一行.</li><li>单步调试: 逐行调试代码, 遇到函数调用时, 跳入函数体内部, 继续逐行调试代码.</li><li>单步跳出: 在函数体内部时, 放行 (运行函数的剩余代码) , 跳出函数体, 跳到函数调用的下一行.</li></ol><ul><li><strong>feat</strong>: 引入新功能</li><li><strong>fix</strong>: 错误修正</li><li><strong>style</strong>: 更新样式, 例如 clang-format, prettier</li><li><strong>refactor</strong>: 重构代码</li><li><strong>test</strong>: 创建/更新测试, 例如 jtest, vitest</li><li><strong>docs</strong>: 创建/更新文档, 例如 README.md</li><li><strong>perf</strong>: 性能优化</li><li><strong>chore</strong>: 定期代码维护</li><li>feat: Introduce new feature</li><li>fix: Bug fix</li><li>style: Update styling</li><li>refactor: Refactor code</li><li>test: Create/Update testing</li><li>docs: Create/Update docs</li><li>perf: Performance optimization</li><li>chore: Regular code maintenance</li></ul>`,7)]))}const g=i(l,[["render",t]]);export{c as __pageData,g as default};
