---
title: "用 React Router 组织全栈产品工作流"
description: "让 loader 与 action 明确用户任务，同时避免把所有规则塞进路由。"
date: 2025-02-28
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["React Router", "Full Stack", "Product Engineering"]
draft: false
---

路由不只是 URL，在产品里，它往往代表用户要完成的任务。

这会改变代码设计。启动导入的设置页不只是一块屏幕，还包含当前状态、校验、权限检查、提交、跳转和失败状态。它们散落各处时，流程就难以理解。

[React Router](https://reactrouter.com/) 的 loader 与 action 提供了简单、明确的页面边界：

```ts
export async function loader() {
  return getImportStatus();
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const result = await startImportFromForm(formData);
  return redirect(`/settings/imports/${result.jobId}`);
}
```

loader 回答“展示页面前用户需要什么”，action 回答“提交表单后发生什么”。

路由不应包办所有决定。上传文件所需的校验、权限、幂等键和后台任务，应放入服务。路由协调 Web 边界，服务负责产品规则。

```ts
const result = await startImportFromForm(formData);
```

路由不必知道导入处理的所有细节，只需把用户请求变成下一个可见状态。

这也是产品设计：启动慢任务后，不要让用户停在冻结的表单上。跳转到状态页能明确告诉他请求已接受、有任务 ID，并展示排队、运行、完成或失败。

第一版把流程写进一个 action 是合理的快速交付方式。但如果规则只存在于 action，就会难以脱离浏览器测试，也难以从其他入口复用。

我通常区分这些边界：路由处理表单、响应、跳转和路由错误；schema 校验外部输入；服务决定工作流含义；repository 或数据库层持久化；界面以用户可操作的方式展示状态。

任务自然对应页面和表单时，React Router 很适合。高度实时、画布型或主要依赖本地状态的交互则不同，路由可能只是交互客户端的薄壳。

loader 和 action 太方便，容易诱使我们把一切放进去。清晰服务背后的薄路由，通常更容易测试和修改。

我的判断方式是：读路由就能解释用户任务，不渲染页面也能测试业务规则，边界大概就放对了。
