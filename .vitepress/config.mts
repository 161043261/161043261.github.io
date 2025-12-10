import { defineConfig } from "vitepress";
import { nav, sidebar} from "./nav-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/", // repository name
  markdown: {
    lineNumbers: true,
  },
  title: "lovelove",
  titleTemplate: false,
  description: "lovelove",
  head: [
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
  ],
  lang: "zh-CN",
  cleanUrls: true,
  srcDir: "./src",
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: "local",
    },
    outline: [2, 3],
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,
    editLink: {
      pattern: "https://github.com/161043261/161043261.github.io/edit/main/src/:path",
      text: "Edit this page on GitHub",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/161043261" },
      { icon: "bilibili", link: "https://b23.tv/vCth43f" },
      { icon: "qq", link: "https://qm.qq.com/q/YDORema7As" },
      {
        icon: "linkedin",
        link: "https://www.linkedin.com/in/tiancheng-hang-bab533302/",
      },
      { icon: "twitter", link: "https://x.com/yukino161043261" },
      { icon: "youtube", link: "https://www.youtube.com/@yukino0228" },
    ],
  },
});
