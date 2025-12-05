<script lang="ts" setup>
/**
 * 救驾先锋 - AR救援引导页
 */
defineOptions({ name: 'C4LRescue' })

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'AR救援引导',
  },
})

const cameraAuth = ref(false)
const aedUnlocked = ref(false)
const currentStep = ref(0)

const rescueSteps = ref([
  { id: 1, title: '贴电极片', desc: '将两个电极片分别贴在患者右锁骨下方和左侧腋下', icon: '1️⃣' },
  { id: 2, title: '插入插头', desc: '将电极片插头插入AED主机接口', icon: '2️⃣' },
  { id: 3, title: '听从语音', desc: 'AED会自动分析心律并给出语音提示', icon: '3️⃣' },
  { id: 4, title: '开始CPR', desc: '按压频率100-120次/分钟，深度5-6厘米', icon: '4️⃣' },
])

function checkCameraAuth() {
  uni.authorize({
    scope: 'scope.camera',
    success: () => { cameraAuth.value = true },
    fail: () => {
      uni.showModal({
        title: '需要相机权限',
        content: '请授权相机权限以使用AR引导功能',
        success: (res) => { if (res.confirm) uni.openSetting() },
      })
    },
  })
}

function unlockAED() {
  uni.showLoading({ title: '解锁中...' })
  setTimeout(() => {
    uni.hideLoading()
    aedUnlocked.value = true
    uni.showToast({ title: 'AED已解锁', icon: 'success' })
  }, 1500)
}

function nextStep() {
  if (currentStep.value < rescueSteps.value.length - 1) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}

function finishRescue() {
  uni.showModal({
    title: '救援完成',
    content: '感谢您的施救！专业救援人员即将到达。',
    showCancel: false,
    success: () => { uni.redirectTo({ url: '/pages/home/index' }) },
  })
}

function goBack() { uni.navigateBack() }

onLoad(() => { checkCameraAuth() })
</script>

<template>
  <view class="rescue-page">
    <!-- 摄像头区域 -->
    <view class="camera-section">
      <camera v-if="cameraAuth" class="camera" device-position="back" flash="auto" />
      <view v-else class="camera-placeholder">
        <text class="placeholder-icon">📷</text>
        <text class="placeholder-text">请授权相机权限</text>
        <view class="auth-btn" @tap="checkCameraAuth"><text>授权相机</text></view>
      </view>
      <!-- AR 叠加层 -->
      <view class="ar-overlay">
        <view class="ar-guide">
          <view class="body-outline" />
          <view class="electrode-left"><text class="electrode-text">左电极</text></view>
          <view class="electrode-right"><text class="electrode-text">右电极</text></view>
          <view class="cpr-point">
            <view class="cpr-ring" />
            <view class="cpr-ring delay-1" />
            <text class="cpr-text">按压点</text>
          </view>
        </view>
      </view>
      <!-- 返回按钮 -->
      <view class="back-btn" @tap="goBack"><text class="back-icon">←</text></view>
    </view>

    <!-- 操作面板 -->
    <view class="control-panel">
      <!-- 解锁AED -->
      <view v-if="!aedUnlocked" class="unlock-section">
        <view class="unlock-btn" @tap="unlockAED">
          <text class="unlock-icon">🔓</text>
          <text class="unlock-text">点击解锁AED</text>
        </view>
        <text class="unlock-hint">机器狗已到达，请解锁AED开始救援</text>
      </view>

      <!-- 步骤引导 -->
      <view v-else class="steps-section">
        <view class="step-header">
          <text class="step-title">救援步骤 {{ currentStep + 1 }}/{{ rescueSteps.length }}</text>
        </view>
        <view class="step-card">
          <view class="step-icon">{{ rescueSteps[currentStep].icon }}</view>
          <view class="step-content">
            <text class="step-name">{{ rescueSteps[currentStep].title }}</text>
            <text class="step-desc">{{ rescueSteps[currentStep].desc }}</text>
          </view>
        </view>
        <view class="step-progress">
          <view v-for="(step, index) in rescueSteps" :key="step.id" class="progress-dot" :class="{ active: index === currentStep, completed: index < currentStep }" />
        </view>
        <view class="step-actions">
          <view v-if="currentStep > 0" class="action-btn secondary" @tap="prevStep"><text>上一步</text></view>
          <view v-if="currentStep < rescueSteps.length - 1" class="action-btn primary" @tap="nextStep"><text>下一步</text></view>
          <view v-else class="action-btn success" @tap="finishRescue"><text>完成救援</text></view>
        </view>
      </view>

      <!-- 紧急联系 -->
      <view class="emergency-bar">
        <text class="emergency-text">专业救援正在赶来，预计3分钟到达</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.rescue-page { min-height: 100vh; display: flex; flex-direction: column; background: #000; width: 100%; box-sizing: border-box; overflow-x: hidden; }
.camera-section { position: relative; flex: 1; min-height: 50vh; }
.camera { width: 100%; height: 100%; }
.camera-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1A1A2E; }
.placeholder-icon { font-size: 80rpx; margin-bottom: 24rpx; }
.placeholder-text { color: #FFF; font-size: 28rpx; margin-bottom: 32rpx; }
.auth-btn { background: #FF6B35; padding: 20rpx 48rpx; border-radius: 40rpx; text { color: #FFF; font-size: 28rpx; font-weight: 600; } }
.ar-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
.ar-guide { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.body-outline { width: 300rpx; height: 400rpx; border: 4rpx dashed rgba(255,255,255,0.5); border-radius: 60rpx 60rpx 40rpx 40rpx; }
.electrode-left, .electrode-right { position: absolute; background: rgba(67,160,71,0.8); padding: 12rpx 20rpx; border-radius: 20rpx; }
.electrode-left { top: 35%; left: 15%; }
.electrode-right { top: 25%; right: 20%; }
.electrode-text { color: #FFF; font-size: 22rpx; font-weight: 600; }
.cpr-point { position: absolute; top: 40%; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
.cpr-ring { width: 80rpx; height: 80rpx; border: 4rpx solid #E53935; border-radius: 50%; animation: pulse-ring 1.5s infinite; &.delay-1 { animation-delay: 0.5s; position: absolute; } }
@keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
.cpr-text { color: #E53935; font-size: 24rpx; font-weight: 700; margin-top: 16rpx; background: rgba(0,0,0,0.6); padding: 8rpx 16rpx; border-radius: 12rpx; }
.back-btn { position: absolute; top: env(safe-area-inset-top); left: 24rpx; margin-top: 24rpx; width: 72rpx; height: 72rpx; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.back-icon { color: #FFF; font-size: 36rpx; }
.control-panel { background: #FFF; border-radius: 32rpx 32rpx 0 0; padding: 32rpx; padding-bottom: calc(32rpx + env(safe-area-inset-bottom)); width: 100%; box-sizing: border-box; }
.unlock-section { display: flex; flex-direction: column; align-items: center; }
.unlock-btn { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #FF6B35, #FF8A5C); padding: 32rpx 64rpx; border-radius: 48rpx; box-shadow: 0 8rpx 24rpx rgba(255,107,53,0.35); margin-bottom: 24rpx; }
.unlock-icon { font-size: 48rpx; margin-right: 16rpx; }
.unlock-text { color: #FFF; font-size: 34rpx; font-weight: 700; }
.unlock-hint { font-size: 26rpx; color: #6B7280; }
.steps-section { width: 100%; box-sizing: border-box; }
.step-header { margin-bottom: 20rpx; }
.step-title { font-size: 30rpx; font-weight: 700; color: #1A1A2E; }
.step-card { display: flex; align-items: flex-start; background: #F9FAFB; border-radius: 20rpx; padding: 24rpx; margin-bottom: 24rpx; width: 100%; box-sizing: border-box; }
.step-icon { font-size: 48rpx; margin-right: 20rpx; }
.step-content { flex: 1; }
.step-name { display: block; font-size: 32rpx; font-weight: 700; color: #1A1A2E; margin-bottom: 8rpx; }
.step-desc { font-size: 26rpx; color: #6B7280; line-height: 1.5; }
.step-progress { display: flex; justify-content: center; gap: 16rpx; margin-bottom: 24rpx; }
.progress-dot { width: 16rpx; height: 16rpx; border-radius: 50%; background: #E5E7EB; transition: all 0.3s; &.active { width: 48rpx; background: #FF6B35; border-radius: 8rpx; } &.completed { background: #43A047; } }
.step-actions { display: flex; gap: 20rpx; width: 100%; box-sizing: border-box; }
.action-btn { flex: 1; padding: 24rpx; border-radius: 40rpx; display: flex; align-items: center; justify-content: center; font-size: 30rpx; font-weight: 600; &.primary { background: linear-gradient(135deg, #FF6B35, #FF8A5C); text { color: #FFF; } } &.secondary { background: #F3F4F6; text { color: #374151; } } &.success { background: linear-gradient(135deg, #43A047, #66BB6A); text { color: #FFF; } } }
.emergency-bar { margin-top: 24rpx; padding: 16rpx; background: rgba(229,57,53,0.1); border-radius: 12rpx; text-align: center; }
.emergency-text { font-size: 26rpx; color: #E53935; }
</style>
