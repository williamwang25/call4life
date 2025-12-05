<script lang="ts" setup>
/**
 * 救驾先锋 - 响应页
 */
defineOptions({ name: 'C4LResponse' })

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '救援响应',
  },
})

const latitude = ref(39.881468702840706)
const longitude = ref(116.48628077202613)
const scale = ref(17)
const dogLat = ref(39.882568702840706)
const dogLng = ref(116.48728077202613)

const markers = computed(() => [
  { id: 1, latitude: latitude.value, longitude: longitude.value, title: '我的位置', width: 40, height: 40 },
  { id: 2, latitude: dogLat.value, longitude: dogLng.value, title: '小援1号', width: 40, height: 40 },
])

const polyline = computed(() => [{
  points: [
    { latitude: dogLat.value, longitude: dogLng.value },
    { latitude: latitude.value, longitude: longitude.value },
  ],
  color: '#FF6B35', width: 6, arrowLine: true,
}])

const status = ref('running')
const dogName = ref('小援1号')
const distance = ref(120)
const estimatedTime = ref(45)
const progress = ref(35)
const tips = ref(['请保持手机畅通', '不要关闭小程序', '准备好迎接机器狗'])
const currentTipIndex = ref(0)

function simulateDogMovement() {
  const moveInterval = setInterval(() => {
    if (status.value === 'arrived') { clearInterval(moveInterval); return }
    dogLat.value += (latitude.value - dogLat.value) * 0.05
    dogLng.value += (longitude.value - dogLng.value) * 0.05
    distance.value = Math.max(0, distance.value - 3)
    estimatedTime.value = Math.max(0, Math.floor(distance.value / 2.7))
    progress.value = Math.min(100, 100 - (distance.value / 120) * 100)
    if (distance.value <= 5) status.value = 'arriving'
    if (distance.value <= 0) { status.value = 'arrived'; clearInterval(moveInterval) }
  }, 1000)
}

function goToRescue() { uni.redirectTo({ url: '/pages/rescue/index' }) }
function cancelCall() {
  uni.showModal({
    title: '确认取消', content: '确定要取消本次呼救吗？',
    success: (res) => { if (res.confirm) uni.redirectTo({ url: '/pages/home/index' }) },
  })
}

onLoad(() => {
  simulateDogMovement()
  setInterval(() => { currentTipIndex.value = (currentTipIndex.value + 1) % tips.value.length }, 3000)
})
</script>

<template>
  <view class="response-page">
    <view class="status-header" :class="`status-${status}`">
      <view class="status-content">
        <view class="status-icon"><text class="icon-text">{{ status === 'arrived' ? '✅' : '🐕' }}</text></view>
        <view class="status-info">
          <text class="status-title">{{ status === 'arrived' ? '小援已到达！' : '小援正在赶来' }}</text>
          <text class="status-subtitle">{{ dogName }}</text>
        </view>
      </view>
    </view>
    <view class="map-section">
      <map id="responseMap" class="map" :latitude="(latitude + dogLat) / 2" :longitude="(longitude + dogLng) / 2" :scale="scale" :markers="markers" :polyline="polyline" />
    </view>
    <view class="info-panel">
      <view class="progress-section">
        <view class="progress-bar"><view class="progress-fill" :style="{ width: progress + '%' }" /></view>
        <view class="progress-labels"><text>出发</text><text>途中</text><text>到达</text></view>
      </view>
      <view class="detail-cards">
        <view class="detail-card"><text class="detail-value">{{ distance }}</text><text class="detail-unit">米</text><text class="detail-label">剩余距离</text></view>
        <view class="detail-divider" />
        <view class="detail-card highlight"><text class="detail-value">{{ estimatedTime }}</text><text class="detail-unit">秒</text><text class="detail-label">预计到达</text></view>
      </view>
      <view class="tip-card"><text class="tip-icon">💡</text><text class="tip-text">{{ tips[currentTipIndex] }}</text></view>
      <view class="action-buttons">
        <view v-if="status === 'arrived'" class="btn-primary" @tap="goToRescue"><text class="btn-text">开始AR救援引导</text></view>
        <view v-else class="btn-secondary" @tap="cancelCall"><text class="btn-text">取消呼救</text></view>
      </view>
      <view class="emergency-contact"><text class="contact-text">如需人工支援，请拨打</text><text class="contact-number">120</text></view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.response-page { min-height: 100vh; background: #F5F7FA; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; overflow-x: hidden; }
.status-header { padding-top: env(safe-area-inset-top); padding-bottom: 32rpx; width: 100%; box-sizing: border-box; &.status-running { background: linear-gradient(135deg, #FF6B35, #FF8A5C); } &.status-arriving { background: linear-gradient(135deg, #FB8C00, #FFA726); } &.status-arrived { background: linear-gradient(135deg, #43A047, #66BB6A); } }
.status-content { display: flex; align-items: center; padding: 24rpx 32rpx; width: 100%; box-sizing: border-box; }
.status-icon { width: 100rpx; height: 100rpx; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin-right: 24rpx; }
.icon-text { font-size: 48rpx; }
.status-info { flex: 1; }
.status-title { display: block; font-size: 40rpx; font-weight: 700; color: #FFF; margin-bottom: 8rpx; }
.status-subtitle { font-size: 28rpx; color: rgba(255,255,255,0.85); }
.map-section { height: 400rpx; width: 100%; margin-top: -20rpx; border-radius: 24rpx 24rpx 0 0; overflow: hidden; }
.map { width: 100%; height: 100%; }
.info-panel { flex: 1; background: #FFF; border-radius: 32rpx 32rpx 0 0; margin-top: -24rpx; padding: 32rpx; padding-bottom: calc(32rpx + env(safe-area-inset-bottom)); width: 100%; box-sizing: border-box; box-shadow: 0 -8rpx 32rpx rgba(0,0,0,0.06); }
.progress-section { margin-bottom: 32rpx; width: 100%; box-sizing: border-box; }
.progress-bar { height: 12rpx; background: #E5E7EB; border-radius: 6rpx; overflow: hidden; margin-bottom: 16rpx; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #FF6B35, #43A047); border-radius: 6rpx; transition: width 0.3s; }
.progress-labels { display: flex; justify-content: space-between; font-size: 24rpx; color: #9CA3AF; }
.detail-cards { display: flex; align-items: center; justify-content: space-around; background: #F9FAFB; border-radius: 20rpx; padding: 28rpx 16rpx; margin-bottom: 24rpx; width: 100%; box-sizing: border-box; }
.detail-card { display: flex; flex-direction: column; align-items: center; &.highlight .detail-value { color: #FF6B35; } }
.detail-divider { width: 1rpx; height: 60rpx; background: #E5E7EB; }
.detail-value { font-size: 48rpx; font-weight: 800; color: #1A1A2E; }
.detail-unit { font-size: 24rpx; color: #6B7280; margin-top: 4rpx; }
.detail-label { font-size: 24rpx; color: #9CA3AF; margin-top: 8rpx; }
.tip-card { display: flex; align-items: center; justify-content: center; background: rgba(255,107,53,0.08); border-radius: 16rpx; padding: 20rpx 24rpx; margin-bottom: 32rpx; width: 100%; box-sizing: border-box; }
.tip-icon { font-size: 32rpx; margin-right: 16rpx; }
.tip-text { font-size: 28rpx; color: #FF6B35; font-weight: 500; }
.action-buttons { margin-bottom: 24rpx; width: 100%; box-sizing: border-box; }
.btn-primary { background: linear-gradient(135deg, #43A047, #66BB6A); border-radius: 48rpx; padding: 28rpx; display: flex; align-items: center; justify-content: center; box-shadow: 0 8rpx 24rpx rgba(67,160,71,0.3); width: 100%; box-sizing: border-box; .btn-text { color: #FFF; font-size: 32rpx; font-weight: 700; } }
.btn-secondary { background: #FFF; border: 2rpx solid #E5E7EB; border-radius: 48rpx; padding: 28rpx; display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; .btn-text { color: #6B7280; font-size: 30rpx; font-weight: 600; } }
.emergency-contact { display: flex; align-items: center; justify-content: center; }
.contact-text { font-size: 26rpx; color: #9CA3AF; }
.contact-number { font-size: 28rpx; font-weight: 700; color: #E53935; margin-left: 8rpx; }
</style>
