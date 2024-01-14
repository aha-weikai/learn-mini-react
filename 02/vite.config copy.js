// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    // 自动为文件注入jsx helper
    // 页面可以不用导入react
    // 没有显示导入react，代码会飘红
    jsxInject: `import React from '../core/react'`,
  },
});
