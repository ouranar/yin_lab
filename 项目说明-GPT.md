# 项目说明（给 GPT 使用）

## 1. 项目定位

这是一个用于实验室官网展示的 `Next.js` 项目，核心形态是：

- 前台展示网站
- 后台登录与内容维护
- 内容保存在本地 JSON 文件中
- 图片上传到本地 `public/uploads/`
- 新闻支持自动归档

它不是传统静态 `html` 项目，也不是带数据库的后台系统，而是一个“文件驱动”的站点。

## 2. 技术栈

- 框架：`Next.js 16`
- React：`React 19`
- 语言：`TypeScript`
- 路由方式：`App Router`
- 数据存储：本地 JSON 文件
- 图片资源：本地文件目录
- 后端接口：`app/api/admin/*` 下的 Route Handlers

`package.json` 中可用命令：

```bash
npm.cmd run dev
npm.cmd run build
npm.cmd start
npm.cmd run typecheck
```

## 3. 项目核心特征

这个项目最重要的特点有 4 个：

1. 几乎所有页面内容都来自 `content/site-content.json`
2. 后台保存时会直接回写这个 JSON 文件
3. 新闻归档文件会输出到 `content/archives/`
4. 上传图片会保存到 `public/uploads/`，前台直接通过 `/uploads/...` 访问

也就是说，这个项目没有数据库、没有 Prisma、没有 MySQL、没有 CMS 服务端，只依赖项目目录本身的文件。

## 4. 关键目录

```text
app/                         页面与接口
app/api/admin/              后台接口（登录、退出、保存内容、上传）
components/admin/           后台管理界面
components/site/            前台展示组件
content/site-content.json   网站主数据文件
content/archives/           新闻归档导出目录
lib/auth.ts                 后台鉴权逻辑
lib/site-data.ts            读取/保存/归档核心逻辑
types/site.ts               站点数据类型定义
public/uploads/             上传图片目录
public/graphics/            站点静态占位图
```

补充说明：

- `components/admin/AdminDashboard.tsx` 是一个很大的后台编辑组件，约 `2356` 行
- `content/site-content.json` 约 `3008` 行，是整个站点的主要内容来源

## 5. 页面与路由

当前已确认存在并可构建的页面：

- `/` 首页
- `/about` 关于
- `/news` 新闻列表
- `/news/archive` 新闻归档
- `/news/[slug]` 新闻详情
- `/members` 成员列表
- `/members/[slug]` 成员详情
- `/research` 研究内容
- `/publications` 出版物
- `/recruitment` 招募
- `/contact` 联系方式
- `/admin/login` 后台登录
- `/admin` 后台管理

## 6. 重要现状与注意点

### 6.1 `services` 数据已存在，但页面缺失

`content/site-content.json` 中存在 `services` 区块，导航里也有 `/services` 链接，但当前仓库里没有：

```text
app/services/page.tsx
```

这意味着：

- 导航中的“服务”链接当前大概率会进入 `404`
- 后台 `AdminDashboard` 的标签页里也没有 `services`
- 如果后续要补这个模块，通常需要同时补页面和后台编辑入口

### 6.2 项目是文件型内容系统

如果要改网站内容，优先考虑修改：

- `content/site-content.json`

如果要改后台逻辑，优先看：

- `lib/site-data.ts`
- `components/admin/AdminDashboard.tsx`
- `app/api/admin/content/route.ts`
- `app/api/admin/upload/route.ts`

### 6.3 当前目录不是 Git 仓库

本地检查结果显示当前目录不是一个 Git 仓库，所以如果有人要基于这个目录做分支、提交、PR 等操作，需要先确认是否漏了 `.git` 目录，或者这是一个纯代码拷贝版本。

## 7. 数据结构总览

`types/site.ts` 中定义的主结构为 `SiteData`，顶层主要包含：

- `settings`
- `navigation`
- `home`
- `about`
- `news`
- `members`
- `research`
- `publications`
- `recruitment`
- `services`
- `contact`

### 常见数据含义

- `settings`：站点名称、页脚文案、后台显示名、新闻归档参数
- `navigation`：顶栏导航
- `home`：首页 hero、活动跑马灯、入口区块
- `about`：实验室介绍、发展时间线、目标
- `news`：新闻列表、归档标题、归档内容
- `members`：成员分组与个人资料
- `research`：研究方向与项目
- `publications`：出版物分组目录
- `recruitment`：招募卡片与说明
- `services`：服务信息，目前只有数据，没有页面
- `contact`：联系信息、地图、交通说明

## 8. 后台逻辑

### 登录逻辑

- 登录接口：`POST /api/admin/login`
- 退出接口：`POST /api/admin/logout`
- 会话 cookie：`lab_admin_session`
- 鉴权核心文件：`lib/auth.ts`

### 密码规则

- 如果设置了 `LAB_ADMIN_PASSWORD`，后台密码使用环境变量
- 如果没有设置，并且当前不是生产环境，则默认密码是 `lab-admin`

### 会话密钥

- 建议配置：`LAB_SESSION_SECRET`
- 代码里存在默认回退值，但正式环境仍然应该显式设置

### 保存逻辑

后台保存内容时会调用：

- `POST /api/admin/content`

该接口会做几件事：

1. 校验是否已登录
2. 接收整份站点数据
3. 规范化成员 slug，避免重复
4. 执行新闻归档逻辑
5. 回写 `content/site-content.json`

### 上传逻辑

- 上传接口：`POST /api/admin/upload`
- 上传目标目录：`public/uploads/<folder>/`
- 返回可直接访问的路径：`/uploads/...`

## 9. 新闻归档机制

新闻归档主要在 `lib/site-data.ts` 中实现。

归档规则依赖：

- `settings.newsArchiveMonths`
- `settings.minimumNewsItems`

处理逻辑大致是：

1. 先按日期排序新闻
2. 找出超过归档月数的可归档新闻
3. 但至少保留 `minimumNewsItems` 条最新新闻
4. 被归档的内容移动到 `news.archivedItems`
5. 同时导出一份归档文件到 `content/archives/news-archive-时间戳.json`

另外，进入 `/admin` 页面时会自动执行一次归档同步。

## 10. 环境变量

`.env.example` 中定义了两个变量：

```text
LAB_ADMIN_PASSWORD=change-this-password
LAB_SESSION_SECRET=change-this-session-secret
```

建议本地开发时复制为：

```powershell
Copy-Item .env.example .env.local
```

## 11. 本地启动与生产运行

### 本地开发

```powershell
cd D:\html2023_2
npm.cmd install
npm.cmd run dev
```

浏览器访问：

```text
http://localhost:3000
```

### 生产构建

```powershell
npm.cmd install
npm.cmd run build
npm.cmd start
```

## 12. 已验证状态

在当前目录下已经验证：

- `npm.cmd run build` 通过
- `npm.cmd run typecheck` 通过

构建时识别到的路由有：

- `/`
- `/about`
- `/admin`
- `/admin/login`
- `/api/admin/content`
- `/api/admin/login`
- `/api/admin/logout`
- `/api/admin/upload`
- `/contact`
- `/members`
- `/members/[slug]`
- `/news`
- `/news/[slug]`
- `/news/archive`
- `/publications`
- `/recruitment`
- `/research`

没有看到 `/services`，这和上面的“服务页面缺失”现状一致。

## 13. 如果你是 GPT，建议按这个思路协助

### 优先原则

- 优先小范围修改，不要无意义重构
- 如果只是改网站内容，优先改 `content/site-content.json`
- 如果只是补一个展示页，优先复用现有组件模式
- 如果只是改后台字段，优先在 `types/site.ts`、`content/site-content.json`、`AdminDashboard.tsx` 三处保持一致
- 不要假设项目有数据库
- 不要假设项目已经接入 Git

### 常见任务的入口位置

- 改首页：`app/page.tsx` 和 `content/site-content.json`
- 改关于页：`app/about/page.tsx`
- 改新闻：`app/news/*` 和 `content/site-content.json`
- 改成员：`app/members/*` 和 `content/site-content.json`
- 改后台登录：`lib/auth.ts`、`app/api/admin/login/route.ts`
- 改上传逻辑：`app/api/admin/upload/route.ts`
- 改新闻归档：`lib/site-data.ts`
- 补“服务”页面：新增 `app/services/page.tsx`，并视情况把后台编辑入口补进 `AdminDashboard.tsx`

## 14. 可直接问 GPT 的示例

下面这些问题，GPT 理论上都能基于本项目继续协助：

- “请帮我给这个项目补一个 `/services` 页面，风格参考 `/publications`。”
- “请帮我在后台里增加 `services` 的编辑标签页。”
- “请帮我新增一个成员分组，并在后台支持编辑。”
- “请帮我把新闻归档改成 3 个月后归档，但至少保留 8 条。”
- “请帮我把首页 Hero 文案改得更正式一些。”
- “请帮我把这个项目部署到 Linux 服务器，并告诉我 Nginx 该怎么配。”

## 15. 一句话总结

这是一个基于 `Next.js + 本地 JSON + 本地上传目录` 的实验室官网项目，前台内容和后台编辑都围绕 `content/site-content.json` 展开，当前最大已知缺口是 `services` 数据存在但展示页与后台入口未补齐。
