# Yin-Lab Vue Site

这是 Yin-Lab 展示站的 Vue 版本仓库。

当前仓库已经清理为纯 Vue 项目，只保留这套站点真正需要的内容：

- `src/`
  Vue 页面、组件、路由、组合式逻辑
- `content/`
  站点内容数据
- `public/`
  静态资源与上传图片
- `index.html`
  Vite 入口
- `vite.config.ts`
  Vite 配置
- `package.json`
  项目依赖与脚本

## 启动项目

请先进入项目目录：

```powershell
cd "C:\Users\lvRui\Desktop\博士工作\6-华师项目&殷老师\殷老师展示页面\html2023_2"
```

首次启动或依赖被清理后，先安装依赖：

```powershell
npm.cmd install
```

启动开发环境：

```powershell
npm.cmd run dev
```

默认访问地址通常是：

```text
http://localhost:3000
```

如果 `3000` 端口已被占用，Vite 会自动切换到 `3001` 或其他可用端口，终端里会显示实际地址。

## 生产构建

```powershell
npm.cmd run build
npm.cmd run preview
```

## 内容维护

常用维护入口如下：

- `content/site-content.json`
  主内容数据，适合维护中文或基础内容
- `src/lib/localized-site-data.ts`
  英文、日文覆盖内容
- `src/lib/i18n.ts`
  导航、按钮、页眉页脚等界面文案
- `src/styles/globals.css`
  全局样式
- `public/uploads/`
  图片资源目录

更详细的说明请查看：

- `内容维护说明.md`
