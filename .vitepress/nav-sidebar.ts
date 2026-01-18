import { type DefaultTheme } from "vitepress";

const baseItems = [
  { text: "CSS", link: "/base/css" },
  { text: "Git", link: "/base/git" },
  { text: "JS/TS", link: "/base/js" },
  { text: "Linux", link: "/base/linux" },
  { text: "Network", link: "/base/network" },
];

const frontendItems = [
  { text: "Vite", link: "/frontend/vite" },
  { text: "Angular", link: "/frontend/angular" },
  { text: "Vue3", link: "/frontend/vue3" },
  { text: "Vue3 Pro", link: "/frontend/vue3-pro" },
  { text: "vue-router", link: "/frontend/vue-router" },
  { text: "Pinia", link: "/frontend/pinia" },
  { text: "React", link: "/frontend/react" },
  { text: "react-router", link: "/frontend/react-router" },
  { text: "Zustand", link: "/frontend/zustand" },
  { text: "Next.js", link: "/frontend/next" },
];

const backendItems = [
  { text: "MySQL", link: "/backend/mysql" },
  { text: "Nest.js", link: "/backend/nest" },
  { text: "Redis", link: "/backend/redis" },
];

const nav: DefaultTheme.NavItem[] = [
  { text: "homepage", link: "/" },
  { text: "base", items: baseItems, activeMatch: "^/base/" },
  { text: "frontend", items: frontendItems, activeMatch: "^/frontend/" },
  { text: "backend", items: backendItems, activeMatch: "^/backend/" },
];

const sidebar: DefaultTheme.Sidebar = {
  "/base/": [{ items: baseItems }],
  "/frontend/": [{ items: frontendItems }],
  "/backend/": [{ items: backendItems }],
};

export { nav, sidebar };
