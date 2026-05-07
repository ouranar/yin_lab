# yin_lab

Yin Lab 实验室官网项目，基于 Next.js 开发，支持前台展示与本地内容管理后台。

## 本地开发

```powershell
npm.cmd install
npm.cmd run dev
```

浏览器打开：

```text
http://localhost:3000
```

## 生产构建

```powershell
npm.cmd install
npm.cmd run build
npm.cmd start
```

## 后台

- 登录页：`/admin/login`
- 管理页：`/admin`
- 开发环境默认密码：`lab-admin`

建议通过 `.env.local` 配置正式环境密码与会话密钥：

```text
LAB_ADMIN_PASSWORD=your-password
LAB_SESSION_SECRET=your-session-secret
```

## 内容文件

- 主数据：`content/site-content.json`
- 上传图片：`public/uploads/`
- 新闻归档：`content/archives/`

