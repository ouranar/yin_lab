# Lab Showcase

## 给别人压缩包后怎么打开

1. 先安装 `Node.js`
2. 解压项目压缩包
3. 进入项目目录
4. 执行下面命令

```powershell
cd D:\html2023_2
npm.cmd install
npm.cmd run dev
```

5. 在浏览器打开 `http://localhost:3000`

说明：

- 这是 `Next.js` 项目，不是直接双击 `html` 就能打开的静态文件
- 第一次运行必须先执行 `npm.cmd install`
- 开发模式下，默认后台密码是 `lab-admin`

## 本机开发

如果你自己要在本机长期维护，建议先复制环境变量文件：

```powershell
Copy-Item .env.example .env.local
```

然后在 `.env.local` 中配置：

```text
LAB_ADMIN_PASSWORD=your-password
LAB_SESSION_SECRET=your-session-secret
```

再启动：

```powershell
npm.cmd run dev
```

## 生产运行

如果你要放到服务器上正式运行：

```powershell
npm.cmd install
npm.cmd run build
npm.cmd start
```

浏览器访问：

```text
http://localhost:3000
```

生产环境必须配置：

```text
LAB_ADMIN_PASSWORD
LAB_SESSION_SECRET
```

## 内容文件

- 站点内容：`content/site-content.json`
- 新闻归档：`content/archives/`
- 上传图片：`public/uploads/`
- 后台登录：`/admin/login`
- 后台管理：`/admin`

## 密码： 

Lab-admin
