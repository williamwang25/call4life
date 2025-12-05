# 📱 救驾先锋 Call for Life

<p align="center">
  <img src="src/static/logo.svg" alt="Call for Life Logo" width="120"/>
</p>

<p align="center">
  <b>基于华为云 ModelArts 与 MindSpore 的智能急救微信小程序</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/UniApp-Vue3-brightgreen" alt="UniApp"/>
  <img src="https://img.shields.io/badge/华为云-ModelArts-red" alt="ModelArts"/>
  <img src="https://img.shields.io/badge/MindSpore-AI-blue" alt="MindSpore"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License"/>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术架构">技术架构</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#页面展示">页面展示</a> •
  <a href="#华为技术">华为技术</a>
</p>

---

## 📖 项目简介

**救驾先锋 Call for Life** 是"AED极速投送系统"的用户端微信小程序，为公众提供一键呼救、实时追踪、AR急救引导等服务。

心脏骤停救援存在"黄金4分钟"法则，但传统急救面临两大痛点：
- **找不到**：目击者在恐慌中难以快速定位 AED 位置
- **不会用**：取到设备后缺乏专业指导

本小程序创新性地实现了 **"设备找人"** 的主动救援模式，用户只需一键呼救，搭载 AED 的机器狗"小援"便会极速赶来，并通过 AI 智能体实时指导急救操作。

## ✨ 功能特性

### 🏠 首页 - 一键呼救
- 系统状态实时监控
- 附近机器狗数量显示
- 大尺寸 SOS 紧急呼救按钮
- 快捷功能入口（急救指南、附近AED、历史记录）

### 🆘 呼救页面 - 精准定位
- 全屏地图显示，支持实时定位
- 显示附近可用机器狗位置
- 长按3秒发起呼救，防止误触
- 预估机器狗到达时间

### 🗺️ 响应页面 - 实时追踪
- 机器狗运动轨迹实时显示
- 距离与预计到达时间动态更新
- 状态进度可视化
- 紧急联系120支持

### 🤖 AI急救助手 - 智能问答
- 基于 **华为云 ModelArts** 的智能对话
- 文本对话：调用 **DeepSeek V3.2** 大模型
- 图像分析：调用 **Qwen2.5-VL-72B** 多模态模型
- CPR/AED 急救步骤语音引导
- 一键拨打120、发送位置、连接急救医师

### 🎯 AR救援引导
- 摄像头实时画面
- AR叠加电极片放置位置指引
- CPR按压频率视觉提示
- 分步骤急救操作引导

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        微信小程序前端                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   首页       │  │   呼救/追踪  │  │   AI急救助手         │  │
│  │   Home       │  │   SOS/Track  │  │   AI Agent           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                            │                                     │
│                    UniApp + Vue3 + TypeScript                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      华为云 ModelArts                            │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │  DeepSeek V3.2       │    │   Qwen2.5-VL-72B-32K         │  │
│  │  文本对话模型         │    │   多模态视觉模型             │  │
│  │  急救问答、步骤引导    │    │   场景分析、患者识别         │  │
│  └──────────────────────┘    └──────────────────────────────┘  │
│                         MindSpore 框架                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ 华为技术栈

| 技术 | 用途 | 说明 |
|------|------|------|
| **华为云 ModelArts** | AI 模型服务 | 提供大模型 API 推理服务 |
| **DeepSeek V3.2** | 文本对话 | 急救问答、步骤引导、智能推理 |
| **Qwen2.5-VL-72B** | 多模态理解 | 图像场景分析、患者状态识别 |
| **昇思 MindSpore** | 模型训练 | 急救场景识别模型训练框架 |

### API 调用示例

```typescript
// 文本对话 - DeepSeek V3.2
const response = await uni.request({
  url: 'https://api.modelarts-maas.com/v2/chat/completions',
  method: 'POST',
  header: {
    'Authorization': `Bearer ${API_KEY}`,
  },
  data: {
    model: 'deepseek-v3.2-exp',
    messages: [
      { role: 'system', content: '你是专业的急救AI助手...' },
      { role: 'user', content: '如何进行心肺复苏？' }
    ]
  }
})

// 图像分析 - Qwen2.5-VL-72B
const response = await uni.request({
  url: 'https://api.modelarts-maas.com/v1/chat/completions',
  data: {
    model: 'qwen2.5-vl-72b',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: '分析图片中的患者情况' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
      ]
    }]
  }
})
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+
- 微信开发者工具

### 安装运行

```bash
# 1. 克隆仓库
git clone https://github.com/your-repo/dogwechat.git
cd dogwechat

# 2. 安装依赖
pnpm install

# 3. 开发模式运行
pnpm dev:mp-weixin

# 4. 使用微信开发者工具打开 dist/dev/mp-weixin 目录
```

### 配置说明

API Key 配置位于 `src/service/modelart.ts`：

```typescript
const MODELART_CONFIG = {
  textModel: {
    url: 'https://api.modelarts-maas.com/v2/chat/completions',
    model: 'deepseek-v3.2-exp',
  },
  visionModel: {
    url: 'https://api.modelarts-maas.com/v1/chat/completions',
    model: 'qwen2.5-vl-72b',
  },
  apiKey: 'YOUR_API_KEY'
}
```

## 📁 项目结构

```
dogwechat/
├── src/
│   ├── pages/
│   │   ├── index/         # 首页
│   │   ├── sos/           # 呼救页面
│   │   ├── response/      # 响应追踪页面
│   │   ├── rescue/        # AR救援引导
│   │   ├── agent/         # AI急救助手
│   │   └── me/            # 个人中心
│   ├── service/
│   │   └── modelart.ts    # 华为云API服务
│   ├── static/
│   │   └── logos/         # 华为云/MindSpore Logo
│   └── style/
│       └── theme.scss     # 主题样式
├── docs/
│   └── modelart.md        # API文档
└── README.md
```

## 📊 性能指标

| 指标 | 数值 | 说明 |
|------|------|------|
| 首屏加载 | < 1.5s | 小程序启动到首页可交互 |
| API响应 | < 3s | 大模型问答平均响应时间 |
| 定位精度 | < 10m | GPS定位误差范围 |
| 页面流畅度 | 60 FPS | 地图与动画渲染帧率 |

## 📜 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

- [华为云 ModelArts](https://www.huaweicloud.com/product/modelarts.html) - AI 模型服务
- [昇思 MindSpore](https://www.mindspore.cn/) - 深度学习框架
- [Unibest](https://github.com/codercup/unibest) - UniApp 最佳实践模板
- [uView Pro](https://uview-plus.jiangruyi.com/) - UI 组件库

---

<p align="center">
  <b>🚑 救驾先锋 - 让急救触手可及</b>
  <br/>
  <i>Call for Life - Making First Aid Accessible</i>
</p>
