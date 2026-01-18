import { defineConfig } from "vitepress";
import { nav, sidebar } from "./nav-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/homepage/", // repository name
  markdown: {
    lineNumbers: true,
  },
  title: "homepage",
  titleTemplate: false,
  description: "homepage",
  head: [
    [
      "link",
      { rel: "icon", href: "/homepage/index.svg", type: "image/svg+xml" },
    ],
  ],
  lang: "zh-CN",
  cleanUrls: true,
  srcDir: "./docs",
  lastUpdated: true,
  themeConfig: {
    logo: "/index.svg",
    search: {
      provider: "local",
    },
    outline: [2, 3],
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,
    editLink: {
      pattern:
        "https://github.com/161043261/161043261.github.io/homepage/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/161043261/homepage/" },
      { icon: "bilibili", link: "https://b23.tv/vCth43f" },
      { icon: "qq", link: "https://qm.qq.com/q/YDORema7As" },
      {
        icon: "linkedin",
        link: "https://www.linkedin.com/in/tiancheng-hang-bab533302",
      },
      { icon: "twitter", link: "https://x.com/yukino161043261" },
      { icon: "youtube", link: "https://www.youtube.com/@yukino0228" },
    ],
  },
});
