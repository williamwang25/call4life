/**
 * 华为云 ModelArt API 服务
 * 基于 MindSpore 框架的急救AI智能体
 */

// API 配置
const MODELART_CONFIG = {
  // 文本模型 DeepSeek V3.2
  textModel: {
    url: 'https://api.modelarts-maas.com/v2/chat/completions',
    model: 'deepseek-v3.2-exp',
  },
  // 多模态模型 Qwen2.5-VL-72B
  visionModel: {
    url: 'https://api.modelarts-maas.com/v1/chat/completions',
    model: 'qwen2.5-vl-72b',
  },
  apiKey: 'jDJlFHvT3ZJVYWDTNqEJFDzIiNxFlmR3daNoeEstaRQj78pn40CatR3BRxZ6SA-pQlf_g3BuN8YmsYVSYUJOwA',
}

// 急救系统提示词
const EMERGENCY_SYSTEM_PROMPT = `你是一位专业的急救AI助手，由华为云ModelArts平台和MindSpore框架提供支持。你的职责是在紧急情况下指导用户进行急救操作。

你需要遵循以下急救流程：
1. 评估患者意识 - 轻拍患者肩膀并大声呼唤
2. 观察呼吸情况 - 观察胸廓起伏5-10秒
3. 确认脉搏 - 检查颈动脉搏动
4. 描述症状 - 帮助用户准确描述患者状况
5. 心肺复苏(CPR) - 按压频率100-120次/分钟，深度5-6厘米

回答要求：
- 语言简洁明了，使用短句
- 每个步骤给出具体可操作的指导
- 遇到危急情况立即建议拨打120
- 保持冷静专业的语气，给用户信心
- 如果用户发送图片，根据图片内容提供针对性指导`

// 消息接口
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | ContentItem[]
}

export interface ContentItem {
  type: 'text' | 'image_url'
  text?: string
  image_url?: {
    url: string
  }
}

export interface ChatResponse {
  success: boolean
  message: string
  thinking?: string
  error?: string
}

/**
 * 调用文本模型
 */
export async function chatWithTextModel(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    const response = await uni.request({
      url: MODELART_CONFIG.textModel.url,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MODELART_CONFIG.apiKey}`,
      },
      data: {
        model: MODELART_CONFIG.textModel.model,
        messages: [
          { role: 'system', content: EMERGENCY_SYSTEM_PROMPT },
          ...messages,
        ],
        chat_template_kwargs: {
          thinking: false,
        },
      },
    })

    if (response.statusCode === 200) {
      const data = response.data as any
      const content = data.choices?.[0]?.message?.content || ''
      return {
        success: true,
        message: content,
      }
    }
    else {
      return {
        success: false,
        message: '',
        error: `请求失败: ${response.statusCode}`,
      }
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: '',
      error: error.message || '网络请求失败',
    }
  }
}

/**
 * 调用多模态模型（图像+文本）
 */
export async function chatWithVisionModel(
  textContent: string,
  imageBase64?: string,
  imageType: 'png' | 'jpeg' | 'webp' = 'jpeg',
): Promise<ChatResponse> {
  try {
    const content: ContentItem[] = [
      { type: 'text', text: textContent },
    ]

    if (imageBase64) {
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:image/${imageType};base64,${imageBase64}`,
        },
      })
    }

    const response = await uni.request({
      url: MODELART_CONFIG.visionModel.url,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MODELART_CONFIG.apiKey}`,
      },
      data: {
        model: MODELART_CONFIG.visionModel.model,
        messages: [
          { role: 'system', content: EMERGENCY_SYSTEM_PROMPT },
          { role: 'user', content },
        ],
      },
    })

    if (response.statusCode === 200) {
      const data = response.data as any
      const messageContent = data.choices?.[0]?.message?.content || ''
      return {
        success: true,
        message: messageContent,
      }
    }
    else {
      return {
        success: false,
        message: '',
        error: `请求失败: ${response.statusCode}`,
      }
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: '',
      error: error.message || '网络请求失败',
    }
  }
}

/**
 * 模拟响应（用于开发测试）
 */
export function getMockResponse(userMessage: string, hasImage: boolean = false): string {
  const mockResponses: Record<string, string> = {
    default: '我是华为云ModelArts急救AI助手。请描述一下患者当前的情况，我会为您提供专业的急救指导。',
    greeting: '您好！我是急救AI助手，基于华为云ModelArts平台和MindSpore框架。请告诉我现场情况，我会一步步指导您进行急救操作。',
    consciousness: '【评估意识】\n1. 请轻拍患者双肩\n2. 大声呼唤"您能听到吗？"\n3. 观察患者是否有反应\n\n如果患者无反应，请立即告诉我。',
    breathing: '【观察呼吸】\n1. 将耳朵靠近患者口鼻\n2. 同时观察胸廓是否起伏\n3. 保持观察5-10秒\n\n正常呼吸：每分钟12-20次',
    pulse: '【检查脉搏】\n将食指和中指放在患者喉结旁凹陷处（颈动脉），感受5-10秒。\n\n如果没有脉搏，需要立即开始心肺复苏！',
    cpr: '【心肺复苏步骤】\n1. 让患者平躺在硬质平面上\n2. 双手叠放在胸骨中下1/3处\n3. 手臂伸直，垂直向下按压\n4. 按压深度：5-6厘米\n5. 频率：100-120次/分钟\n6. 每30次按压后，做2次人工呼吸',
    image: '根据图片分析：\n我已收到您上传的图片。从图中可以看到患者的情况。请您按照以下步骤操作：\n\n1. 首先确保现场安全\n2. 检查患者意识状态\n3. 如患者无反应，请立即拨打120\n\n请告诉我更多细节。',
  }

  const lowerMsg = userMessage.toLowerCase()

  if (hasImage) {
    return mockResponses.image
  }
  if (lowerMsg.includes('你好') || lowerMsg.includes('您好')) {
    return mockResponses.greeting
  }
  if (lowerMsg.includes('意识') || lowerMsg.includes('清醒')) {
    return mockResponses.consciousness
  }
  if (lowerMsg.includes('呼吸') || lowerMsg.includes('喘气')) {
    return mockResponses.breathing
  }
  if (lowerMsg.includes('脉搏') || lowerMsg.includes('心跳')) {
    return mockResponses.pulse
  }
  if (lowerMsg.includes('按压') || lowerMsg.includes('cpr') || lowerMsg.includes('心肺')) {
    return mockResponses.cpr
  }

  return mockResponses.default
}
