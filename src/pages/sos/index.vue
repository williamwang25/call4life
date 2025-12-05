<script lang="ts" setup>
/**
 * 救驾先锋 - 呼救页
 * 简洁的地图页面，支持一键呼救
 */
defineOptions({
  name: 'C4LSOS',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '紧急呼救',
  },
})

// 地图相关
const mapContext = ref<any>(null)
const latitude = ref(39.881468702840706) // 北京工业大学逸夫图书馆北侧
const longitude = ref(116.48628077202613)
const scale = ref(17)

// 标记点
const markers = ref([
  {
    id: 1,
    latitude: 39.881468702840706,
    longitude: 116.48628077202613,
    title: '我的位置',
    iconPath: '/static/marker-user.svg',
    width: 40,
    height: 40,
    callout: {
      content: '您当前的位置',
      display: 'ALWAYS',
      padding: 10,
      borderRadius: 8,
      bgColor: '#FFFFFF',
      color: '#333333',
      fontSize: 12,
    },
  },
  // 模拟附近的机器狗位置
  {
    id: 2,
    latitude: 39.882568702840706,
    longitude: 116.48728077202613,
    title: '小援1号',
    iconPath: '/static/marker-dog.svg',
    width: 36,
    height: 36,
    callout: {
      content: '小援1号 | 120米',
      display: 'BYCLICK',
      padding: 8,
      borderRadius: 6,
      bgColor: '#FF6B35',
      color: '#FFFFFF',
      fontSize: 12,
    },
  },
  {
    id: 3,
    latitude: 39.880168702840706,
    longitude: 116.48428077202613,
    title: '小援2号',
    iconPath: '/static/marker-dog.svg',
    width: 36,
    height: 36,
    callout: {
      content: '小援2号 | 200米',
      display: 'BYCLICK',
      padding: 8,
      borderRadius: 6,
      bgColor: '#FF6B35',
      color: '#FFFFFF',
      fontSize: 12,
    },
  },
])

// 状态
const isHolding = ref(false)
const holdProgress = ref(0)
const holdTimer = ref<ReturnType<typeof setInterval> | null>(null)
const locationAddress = ref('北京工业大学逸夫图书馆北侧')
const nearestDog = ref({ name: '小援1号', distance: '120米', time: '约45秒' })

// 长按呼救逻辑
function startHold() {
  isHolding.value = true
  holdProgress.value = 0
  
  holdTimer.value = setInterval(() => {
    holdProgress.value += 2
    if (holdProgress.value >= 100) {
      finishHold()
    }
  }, 60) // 3秒完成
}

function cancelHold() {
  isHolding.value = false
  holdProgress.value = 0
  if (holdTimer.value) {
    clearInterval(holdTimer.value)
    holdTimer.value = null
  }
}

function finishHold() {
  cancelHold()
  // 跳转到响应页
  uni.redirectTo({
    url: '/pages/response/index',
  })
}

// 返回上一页
function goBack() {
  uni.navigateBack()
}

// 重新定位
function relocate() {
  uni.showToast({
    title: '正在重新定位...',
    icon: 'none',
  })
  // 模拟定位
  setTimeout(() => {
    uni.showToast({
      title: '定位成功',
      icon: 'success',
    })
  }, 1000)
}

onLoad(() => {
  // 创建地图上下文
  mapContext.value = uni.createMapContext('sosMap')
})

onUnload(() => {
  if (holdTimer.value) {
    clearInterval(holdTimer.value)
  }
})
</script>

<template>
  <view class="sos-page">
    <!-- 地图全屏区域 -->
    <view class="map-container">
      <map
        id="sosMap"
        class="map"
        :latitude="latitude"
        :longitude="longitude"
        :scale="scale"
        :markers="markers"
        :show-location="true"
        :enable-3D="false"
        :enable-overlooking="false"
        :enable-zoom="true"
        :enable-scroll="true"
      />
      
      <!-- 顶部导航悬浮 -->
      <view class="nav-bar">
        <view class="nav-bar-content">
          <view class="nav-back" @tap="goBack">
            <text class="nav-back-icon">←</text>
          </view>
          <text class="nav-title">紧急呼救</text>
          <view class="nav-placeholder" />
        </view>
      </view>
      
      <!-- 地图上的信息卡片 -->
      <view class="map-info-card">
        <view class="info-location">
          <text class="info-address">{{ locationAddress }}</text>
          <view class="relocate-btn" @tap="relocate">
            <text class="relocate-text">重新定位</text>
          </view>
        </view>
        <view class="info-divider" />
        <view class="info-dog">
          <text class="dog-label">最近机器狗</text>
          <view class="dog-detail">
            <text class="dog-name">{{ nearestDog.name }}</text>
            <text class="dog-distance">{{ nearestDog.distance }}</text>
            <text class="dog-time">预计{{ nearestDog.time }}到达</text>
          </view>
        </view>
      </view>

      <!-- 悬浮呼救按钮 -->
      <view class="sos-float-area">
        <view class="sos-button-container">
          <view
            class="sos-hold-button"
            :class="{ holding: isHolding }"
            @touchstart="startHold"
            @touchend="cancelHold"
            @touchcancel="cancelHold"
          >
            <view class="progress-ring">
              <view
                class="progress-fill"
                :style="{ '--progress': holdProgress + '%' }"
              />
            </view>
            <view class="button-content">
              <text class="button-text">{{ isHolding ? '持续按住' : '长按呼救' }}</text>
            </view>
          </view>
        </view>
        <text class="sos-hint">长按3秒发起紧急呼救</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.sos-page {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

// 地图容器全屏
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
}

// 顶部导航悬浮
.nav-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  padding-top: env(safe-area-inset-top);
  width: 100%;
  box-sizing: border-box;
  z-index: 100;
}

.nav-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  height: 80rpx;
  width: 100%;
  box-sizing: border-box;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 247, 250, 0.9);
  border-radius: 50%;
}

.nav-back-icon {
  font-size: 32rpx;
  color: #374151;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1A1A2E;
}

.nav-placeholder {
  width: 64rpx;
}

// 信息卡片悬浮
.map-info-card {
  position: absolute;
  top: calc(env(safe-area-inset-top) + 100rpx);
  left: 24rpx;
  right: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  width: calc(100% - 48rpx);
  box-sizing: border-box;
  z-index: 50;
}

.info-location {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.info-address {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1A2E;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.relocate-btn {
  padding: 12rpx 20rpx;
  background: rgba(255, 107, 53, 0.15);
  border-radius: 24rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
}

.relocate-text {
  font-size: 24rpx;
  color: #FF6B35;
  font-weight: 500;
}

.info-divider {
  height: 1rpx;
  background: #F3F4F6;
  margin: 16rpx 0;
}

.info-dog {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.dog-label {
  font-size: 26rpx;
  color: #6B7280;
  flex-shrink: 0;
}

.dog-detail {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.dog-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #FF6B35;
  margin-right: 16rpx;
}

.dog-distance {
  font-size: 26rpx;
  color: #374151;
  margin-right: 16rpx;
}

.dog-time {
  font-size: 24rpx;
  color: #43A047;
  background: rgba(67, 160, 71, 0.15);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

// 悬浮呼救按钮区域
.sos-float-area {
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom) + 60rpx);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.sos-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}

.sos-hold-button {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  background: rgba(229, 57, 53, 0.85);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 12rpx 40rpx rgba(229, 57, 53, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &.holding {
    transform: scale(0.92);
    background: rgba(229, 57, 53, 0.95);
    box-shadow: 0 8rpx 24rpx rgba(229, 57, 53, 0.5);
  }
  
  &:active {
    transform: scale(0.92);
  }
}

.progress-ring {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  pointer-events: none;
}

.progress-fill {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #4ADE80 var(--progress, 0%),
    transparent var(--progress, 0%)
  );
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.button-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.sos-hint {
  font-size: 26rpx;
  color: #374151;
  background: rgba(255, 255, 255, 0.9);
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}
</style>
