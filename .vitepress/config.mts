import { defineConfig } from "vitepress";
import sidebar from "./sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    lineNumbers: true,
  },
  title: "lovelove",
  titleTemplate: "lovelove",
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
    nav: [
      { text: "Homepage", link: "/" },
      { text: "Network", link: "/base/network2" },
      { text: "Vue", link: "/frontend/vue" },
      { text: "MySQL", link: "/backend/mysql" },
    ],
    sidebar,
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
