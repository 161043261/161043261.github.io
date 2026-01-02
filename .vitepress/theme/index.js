import DefaultTheme from "vitepress/theme-without-fonts";
import "./style.css";

// Required Conditional Guard
if (import.meta.hot) {
  // Will be tree-shaken in production
  import.meta.hot.on("custom-hot-update", (data) => {
    console.log("[custom-hot-update]", data);
  });
}

export default DefaultTheme;
