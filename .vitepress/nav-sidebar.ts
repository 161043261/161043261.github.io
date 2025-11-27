import { type DefaultTheme } from "vitepress";

const baseItems = [
  { text: "Languages", link: "/base/languages" },
  { text: "CSS", link: "/base/css" },
  { text: "Linux", link: "/base/linux" },
  { text: "Network", link: "/base/network" },
  { text: "Git", link: "/base/git" },
];

const frontendItems = [
  { text: "Webpack. Vite, Rollup", link: "/frontend/webpack" },
  { text: "Vue3", link: "/frontend/vue3" },
  { text: "Vue3 Pro", link: "/frontend/vue3-pro" },
  { text: "vue-router", link: "/frontend/vue-router" },
  { text: "Pinia", link: "/frontend/pinia" },
  { text: "React", link: "/frontend/react" },
  { text: "react-router", link: "/frontend/react-router" },
  { text: "Zustand", link: "/frontend/zustand" },
  { text: "Next", link: "/frontend/next" },
];

const backendItems = [
  { text: "MongoDB", link: "/backend/mongodb" },
  { text: "MySQL", link: "/backend/mysql" },
  { text: "Express, Koa, Nest", link: "/backend/express" },
  { text: "Redis", link: "/backend/redis" },
];

const nav: DefaultTheme.NavItem[] = [
  { text: "Homepage", link: "/" },
  { text: "Base", items: backendItems, activeMatch: "^/base/" },
  { text: "Frontend", items: frontendItems, activeMatch: "^/frontend/" },
  { text: "Backend", items: backendItems, activeMatch: "^/backend/" },
];

const sidebar: DefaultTheme.Sidebar = {
  "/base/": [{ items: baseItems }],
  "/frontend/": [{ items: frontendItems }],
  "/backend/": [{ items: backendItems }],
};

export { nav, sidebar };
