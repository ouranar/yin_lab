# Yin-Lab Vue Site

这是 Yin-Lab 展示站的 Vue 版本。

当前项目已经改为纯前端静态站点，核心特点如下：

- 使用 `Vue 3 + Vite + Vue Router`
- 不再依赖后台登录、数据库或服务端内容写入
- 页面内容主要来自本地 `JSON`
- 图片资源放在 `public/uploads/`
- 保留原有多语言结构，当前可继续维护中文、英文、日文内容

## 启动方式

Windows 下建议使用：

```powershell
npm.cmd install
npm.cmd run dev
```

默认访问：

```text
http://localhost:3000
```

## 生产构建

```powershell
npm.cmd run build
npm.cmd run preview
```

## 内容维护入口

常用内容文件如下：

- `content/site-content.json`
  主内容数据，适合作为中文或基础内容源
- `src/lib/localized-site-data.ts`
  英文、日文等多语言覆盖内容
- `src/lib/i18n.ts`
  导航、按钮、页眉页脚、界面文案
- `public/uploads/`
  图片资源目录

更详细的维护说明见：

- `内容维护说明.md`

## 目录说明

- `src/`
  当前 Vue 站点实际运行代码
- `content/`
  内容数据
- `public/`
  静态资源
- `app/`、`components/`、`lib/`、`types/`
  旧版本参考代码，当前 Vue 构建不会使用这些目录

## 当前说明

这个仓库现在的运行入口已经切换为 Vue。
如果后续你确认不再需要旧的 Next.js 参考代码，我可以再帮你做一次清理，把旧目录彻底归档或移除。
