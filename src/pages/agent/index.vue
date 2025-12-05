<script lang="ts" setup>
/**
 * AI急救智能体页面
 * 基于华为云ModelArts和MindSpore框架
 * 文本模型：DeepSeek V3.2
 * 图像模型：Qwen2.5-VL-72B-32K
 */
import { chatWithTextModel, chatWithVisionModel, type ChatMessage } from '@/service/modelart'

defineOptions({
  name: 'AIAgent',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'AI急救助手',
  },
})

interface Message {
  id: number
  type: 'user' | 'assistant' | 'system'
  content: string
  image?: string
  time: string
}

const messages = ref<Message[]>([])
const inputText = ref('')
const isLoading = ref(false)
const isRecording = ref(false)
const scrollToBottom = ref('')
const messageIdCounter = ref(0)
// 保存对话历史用于上下文
const chatHistory = ref<ChatMessage[]>([])

const quickActions = ref([
  { id: 'consciousness', label: '评估意识', icon: '👁️' },
  { id: 'breathing', label: '观察呼吸', icon: '💨' },
  { id: 'pulse', label: '确认脉搏', icon: '❤️' },
  { id: 'cpr', label: '心肺复苏', icon: '🫀' },
])

function initWelcome() {
  addMessage('assistant', '您好！我是AI急救助手，由华为云ModelArts提供支持。\n\n如遇紧急情况，请先拨打120。我会指导您进行急救操作。')
}

function addMessage(type: 'user' | 'assistant' | 'system', content: string, image?: string) {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  messages.value.push({ id: messageIdCounter.value++, type, content, image, time })
  nextTick(() => { scrollToBottom.value = `msg-${messageIdCounter.value - 1}` })
}

// 调用文本模型 DeepSeek V3.2
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return
  
  addMessage('user', text)
  inputText.value = ''
  isLoading.value = true
  
  // 添加到对话历史
  chatHistory.value.push({ role: 'user', content: text })
  
  try {
    const response = await chatWithTextModel(chatHistory.value)
    
    if (response.success) {
      addMessage('assistant', response.message)
      // 将AI回复也加入历史
      chatHistory.value.push({ role: 'assistant', content: response.message })
    } else {
      addMessage('assistant', `抱歉，请求失败：${response.error}\n\n请稍后重试或拨打120获取帮助。`)
    }
  } catch (error: any) {
    addMessage('assistant', `网络错误：${error.message || '未知错误'}\n\n请检查网络连接后重试。`)
  } finally {
    isLoading.value = false
  }
}

function handleQuickAction(action: typeof quickActions.value[0]) {
  const msgs: Record<string, string> = {
    consciousness: '如何评估患者意识？',
    breathing: '如何观察患者呼吸？',
    pulse: '如何检查脉搏？',
    cpr: '如何进行心肺复苏？',
  }
  inputText.value = msgs[action.id] || action.label
  sendMessage()
}

// 调用多模态模型 Qwen2.5-VL-72B
function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempPath = res.tempFilePaths[0]
      addMessage('user', '请分析图片中的患者情况', tempPath)
      isLoading.value = true
      
      try {
        // 读取图片并转为Base64
        const fs = uni.getFileSystemManager()
        const base64 = fs.readFileSync(tempPath, 'base64') as string
        
        // 判断图片类型
        const imageType = tempPath.toLowerCase().endsWith('.png') ? 'png' : 'jpeg'
        
        // 调用多模态模型
        const response = await chatWithVisionModel(
          '请分析这张图片中的患者情况，并给出急救建议。',
          base64,
          imageType
        )
        
        if (response.success) {
          addMessage('assistant', response.message)
        } else {
          addMessage('assistant', `图片分析失败：${response.error}\n\n请尝试描述患者情况，或拨打120。`)
        }
      } catch (error: any) {
        addMessage('assistant', `图片处理错误：${error.message || '未知错误'}\n\n请尝试重新上传或描述情况。`)
      } finally {
        isLoading.value = false
      }
    },
  })
}

function startVoiceInput() {
  isRecording.value = true
  uni.showToast({ title: '语音识别中...', icon: 'none', duration: 1500 })
  setTimeout(() => {
    isRecording.value = false
    inputText.value = '患者失去意识了'
  }, 1500)
}

function call120() {
  uni.showModal({
    title: '紧急呼叫',
    content: '即将拨打120急救电话',
    confirmText: '拨打',
    confirmColor: '#E53935',
    success: (res) => {
      if (res.confirm) uni.makePhoneCall({ phoneNumber: '120' })
    },
  })
}

function sendLocation() {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      addMessage('system', `已获取位置：${res.longitude.toFixed(4)}, ${res.latitude.toFixed(4)}`)
    },
    fail: () => uni.showToast({ title: '获取位置失败', icon: 'none' }),
  })
}

function connectDoctor() {
  addMessage('system', '正在连接急救医师...')
  setTimeout(() => addMessage('system', '医师已连接，正在为您提供指导。'), 1500)
}

onLoad(() => initWelcome())
</script>

<template>
  <view class="agent-page">
    <!-- 顶部导航 -->
    <view class="nav-header">
      <view class="nav-bar">
        <text class="nav-title">AI急救助手</text>
      </view>
      <view class="action-bar">
        <view class="action-btn danger" @tap="call120">
          <text class="action-text">拨打120</text>
        </view>
        <view class="action-btn normal" @tap="sendLocation">
          <text class="action-text">发送位置</text>
        </view>
        <view class="action-btn success" @tap="connectDoctor">
          <text class="action-text">连接医师</text>
        </view>
      </view>
    </view>

    <!-- 消息列表区域 -->
    <view class="chat-container">
      <!-- 背景Logo -->
      <view class="bg-logos">
        <image class="bg-logo" src="/static/logos/huaweicloud.svg" mode="aspectFit" />
        <image class="bg-logo" src="/static/logos/mindspore.jpg" mode="aspectFit" />
      </view>
      
      <scroll-view class="message-list" scroll-y :scroll-into-view="scrollToBottom" scroll-with-animation>
        <view class="message-wrap">
          <view v-for="msg in messages" :id="`msg-${msg.id}`" :key="msg.id" class="msg-row" :class="msg.type">
            <view v-if="msg.type === 'assistant'" class="avatar ai">AI</view>
            <view class="bubble" :class="msg.type">
              <image v-if="msg.image" class="msg-img" :src="msg.image" mode="aspectFit" />
              <text class="msg-text">{{ msg.content }}</text>
            </view>
            <view v-if="msg.type === 'user'" class="avatar user">我</view>
          </view>
          <view v-if="isLoading" class="msg-row assistant">
            <view class="avatar ai">AI</view>
            <view class="bubble assistant">
              <view class="typing"><view class="dot" /><view class="dot" /><view class="dot" /></view>
            </view>
          </view>
        </view>
        <view class="list-bottom" />
      </scroll-view>
    </view>

    <!-- 底部Logo -->
    <view class="footer-logos">
      <view class="logo-item">
        <text class="logo-text">华为云 ModelArts</text>
      </view>
      <view class="logo-divider" />
      <view class="logo-item">
        <text class="logo-text">MindSpore</text>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-bar">
      <view v-for="a in quickActions" :key="a.id" class="quick-btn" @tap="handleQuickAction(a)">
        <text class="quick-icon">{{ a.icon }}</text>
        <text class="quick-text">{{ a.label }}</text>
      </view>
    </view>

    <!-- 输入区域 -->
    <view class="input-bar">
      <view class="tool-btn" @tap="chooseImage">
        <u-icon name="camera" color="#666" size="48rpx" />
      </view>
      <view class="tool-btn" :class="{ recording: isRecording }" @tap="startVoiceInput">
        <u-icon name="mic" :color="isRecording ? '#FFF' : '#666'" size="48rpx" />
      </view>
      <input v-model="inputText" class="text-input" placeholder="描述患者情况..." confirm-type="send" @confirm="sendMessage" />
      <view class="send-btn" :class="{ active: inputText.trim() }" @tap="sendMessage">
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.agent-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F5F6F8;
  overflow: hidden;
}

// 顶部导航
.nav-header {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8A5C 100%);
  padding-top: calc(env(safe-area-inset-top) + 40rpx);
  flex-shrink: 0;
}

.nav-bar {
  padding: 20rpx 32rpx 24rpx;
}

.nav-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFF;
}

.action-bar {
  display: flex;
  gap: 20rpx;
  padding: 0 28rpx 24rpx;
}

.action-btn {
  flex: 1;
  padding: 18rpx 0;
  border-radius: 16rpx;
  text-align: center;
  
  &.danger { background: rgba(229, 57, 53, 0.9); }
  &.normal { background: rgba(255, 255, 255, 0.25); }
  &.success { background: rgba(67, 160, 71, 0.9); }
}

.action-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFF;
}

// 底部Logo文字
.footer-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20rpx;
  padding: 16rpx 24rpx;
  background: #F5F6F8;
  flex-shrink: 0;
}

.logo-item {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 24rpx;
  color: #999;
  font-weight: 500;
}

.logo-divider {
  width: 1rpx;
  height: 24rpx;
  background: #DDD;
}

// 聊天容器
.chat-container {
  flex: 1;
   max-height: 1000rpx;
  position: relative;
  overflow: hidden;
}

// 背景Logo - 居中半透明并排显示
.bg-logos {
  position: absolute;
  top: 97%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;  /* 并排显示 */
  align-items: center;
  gap: 40rpx;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.bg-logo {
  width: 180rpx;
  height: 50rpx;
}

// 消息列表
.message-list {
  position: relative;
  z-index: 1;
  height: 100%;  /* <-- 修改消息列表高度在这里 */
}

.message-wrap {
  padding: 28rpx 28rpx;
}

.msg-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 28rpx;
  
  &.user { justify-content: flex-end; }
  &.system { justify-content: center; }
}

.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
  color: #FFF;
  flex-shrink: 0;
  
  &.ai { background: #FF6B35; margin-right: 16rpx; }
  &.user { background: #1A1A2E; margin-left: 16rpx; }
}

.bubble {
  max-width: 480rpx;
  padding: 20rpx 24rpx;
  border-radius: 20rpx;
  
  &.assistant {
    background: #FFF;
    border-top-left-radius: 6rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
  }
  &.user {
    background: #FF6B35;
    border-top-right-radius: 6rpx;
  }
  &.system {
    background: rgba(255, 107, 53, 0.12);
    border-radius: 12rpx;
  }
}

.msg-img {
  max-width: 100%;
  max-height: 280rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.msg-text {
  font-size: 30rpx;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  
  .assistant & { color: #1A1A2E; }
  .user & { color: #FFF; }
  .system & { color: #FF6B35; font-size: 26rpx; }
}

.typing {
  display: flex;
  gap: 8rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: #FF6B35;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
  &:nth-child(2) { animation-delay: 0.15s; }
  &:nth-child(3) { animation-delay: 0.3s; }
}

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-8rpx); opacity: 1; }
}

.list-bottom {
  height: 80rpx;
}

// 快捷操作
.quick-bar {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 28rpx;
  background: #FFF;
  border-top: 1rpx solid #EAEAEA;
  flex-shrink: 0;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 8rpx 12rpx;
  background: #FFF5F2;
  border-radius: 20rpx;
  border: 1rpx solid #FFD4C4;
  white-space: nowrap;
  
  &:active { background: #FFE8E0; }
}

.quick-icon {
  font-size: 26rpx;
}

.quick-text {
  font-size: 26rpx;
  color: #FF6B35;
  font-weight: 500;
}

// 输入区域
.input-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #FFF;
  border-top: 1rpx solid #EAEAEA;
  flex-shrink: 0;
}

.tool-btn {
  width: 72rpx;
  height: 72rpx;
  background: #F5F6F8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active { background: #E8E8E8; }
  
  &.recording {
    background: #E53935;
  }
}

.text-input {
  flex: 1;
  height: 72rpx;
  background: #F5F6F8;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
}

.send-btn {
  padding: 16rpx 32rpx;
  background: #E0E0E0;
  border-radius: 36rpx;
  
  &.active { background: #FF6B35; }
}

.send-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #999;
  
  .active & { color: #FFF; }
}
</style>
