# Tarot App

一个基于 `Next.js` 的在线塔罗占卜网站，前端负责抽牌体验，服务端通过 `/api/reading` 调用 Groq 生成解读。

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 复制环境变量模板

```bash
cp .env.example .env.local
```

3. 在 `.env.local` 中填写你自己的 `GROQ_API_KEY`

4. 启动开发环境

```bash
npm run dev
```

5. 打开 [http://localhost:3000](http://localhost:3000)

## 环境变量

项目使用以下环境变量：

- `GROQ_API_KEY`: 必填。服务端调用 Groq API 的密钥。
- `GROQ_MODEL`: 可选。默认是 `llama-3.3-70b-versatile`。

这些变量只应该放在服务端环境中，例如本地 `.env.local` 或部署平台的环境变量配置。

## 部署

推荐部署到 `Vercel`，因为项目包含 Next.js 的服务端路由 `/api/reading`，不适合继续使用 GitHub Pages 作为正式运行环境。

上线步骤：

1. 将最新代码合并到 `main`
2. 在 Vercel 导入本仓库
3. 配置环境变量：
   - `GROQ_API_KEY`
   - `GROQ_MODEL`（可选）
4. 触发部署
5. 部署完成后验证：
   - 首页可以访问
   - 抽牌流程可以完成
   - `/api/reading` 能返回解读结果

## 后端说明

`/api/reading` 当前已包含：

- 基础请求校验
- 轻量限流（单实例内存版）
- Groq 调用失败的错误处理
- 模型返回非标准 JSON 时的兜底解析

如果后续流量变大，建议把限流升级为 Redis / Upstash 这类共享存储方案。
