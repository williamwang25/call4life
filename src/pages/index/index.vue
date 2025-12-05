<script lang="ts" setup>
/**
 * 救驾先锋 - 首页
 * 卡片式布局，集成多种功能入口和信息展示
 */
defineOptions({
  name: 'C4LHome',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '救驾先锋',
  },
})

// 响应式数据
const systemOnline = ref(true)
const nearbyDogs = ref(3)
const currentLocation = ref('北京工业大学')
const userName = ref('用户')

// 功能入口
const features = ref([
  {
    id: 'sos',
    icon: '🆘',
    title: '紧急呼救',
    desc: '一键呼叫AED',
    color: '#E53935',
    bgColor: 'rgba(229, 57, 53, 0.1)',
    path: '/pages/sos/index',
  },
  {
    id: 'guide',
    icon: '📖',
    title: '急救指南',
    desc: 'CPR教学视频',
    color: '#1E88E5',
    bgColor: 'rgba(30, 136, 229, 0.1)',
    path: '',
  },
  {
    id: 'nearby',
    icon: '📍',
    title: '附近AED',
    desc: '查看周边设备',
    color: '#43A047',
    bgColor: 'rgba(67, 160, 71, 0.1)',
    path: '',
  },
  {
    id: 'history',
    icon: '📋',
    title: '历史记录',
    desc: '查看呼救历史',
    color: '#FB8C00',
    bgColor: 'rgba(251, 140, 0, 0.1)',
    path: '',
  },
])

// 最新动态 - 模拟数据
const newsItems = ref([
  { id: 1, title: '系统已完成今日巡检', time: '10分钟前', type: 'success' },
  { id: 2, title: '逸夫图书馆机器狗已就位', time: '30分钟前', type: 'info' },
  { id: 3, title: '新增救援培训课程上线', time: '2小时前', type: 'warning' },
])

// 统计数据 - 模拟数据
const stats = ref([
  { label: '今日救援', value: '0', unit: '次' },
  { label: '平均响应', value: '45', unit: '秒' },
  { label: '累计服务', value: '1,280', unit: '人次' },
])

// 跳转到呼救页面
function goToSOS() {
  uni.navigateTo({
    url: '/pages/sos/index',
  })
}

// 跳转到功能页
function goToFeature(item: typeof features.value[0]) {
  if (item.path) {
    uni.navigateTo({
      url: item.path,
    })
  }
  else {
    uni.showToast({
      title: '功能开发中',
      icon: 'none',
    })
  }
}

onLoad(() => {
  console.log('首页加载')
})
</script>

<template>
  <view class="home-page">
    <!-- 顶部状态栏 -->
    <view class="status-bar">
      <view class="status-bar-content">
        <view class="status-left">
          <view class="status-dot" :class="systemOnline ? 'online' : 'offline'" />
          <text class="status-text">{{ systemOnline ? '系统在线' : '系统离线' }}</text>
        </view>
        <view class="status-right">
          <text class="dog-count">附近机器狗：{{ nearbyDogs }}台</text>
        </view>
      </view>
    </view>

    <!-- 欢迎区域 -->
    <view class="welcome-section">
      <view class="welcome-card">
        <view class="welcome-header">
          <view class="welcome-info">
            <text class="welcome-greeting">你好，{{ userName }}</text>
            <view class="location-row">
              <text class="location-icon">📍</text>
              <text class="location-text">{{ currentLocation }}</text>
            </view>
          </view>
          <view class="avatar-wrapper">
            <view class="avatar">
              <text class="avatar-text">{{ userName.charAt(0) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 紧急呼救大按钮 -->
    <view class="sos-section">
      <view class="sos-button-wrapper" @tap="goToSOS">
        <view class="sos-wave" />
        <view class="sos-wave delay-1" />
        <view class="sos-wave delay-2" />
        <view class="sos-button">
          <text class="sos-icon">SOS</text>
          <text class="sos-text">紧急呼救</text>
        </view>
      </view>
      <text class="sos-hint">点击立即呼叫AED机器狗</text>
    </view>

    <!-- 功能入口网格 -->
    <view class="features-section">
      <view class="section-header">
        <text class="section-title">快捷功能</text>
      </view>
      <view class="features-grid">
        <view
          v-for="item in features"
          :key="item.id"
          class="feature-card"
          @tap="goToFeature(item)"
        >
          <view class="feature-icon-wrapper" :style="{ backgroundColor: item.bgColor }">
            <text class="feature-icon">{{ item.icon }}</text>
          </view>
          <text class="feature-title">{{ item.title }}</text>
          <text class="feature-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-section">
      <view class="stats-card">
        <view v-for="(stat, index) in stats" :key="index" class="stat-item">
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-unit">{{ stat.unit }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>
    </view>

    <!-- 最新动态 -->
    <view class="news-section">
      <view class="section-header">
        <text class="section-title">最新动态</text>
        <text class="section-more">查看全部</text>
      </view>
      <view class="news-list">
        <view v-for="item in newsItems" :key="item.id" class="news-item">
          <view class="news-dot" :class="`news-dot-${item.type}`" />
          <view class="news-content">
            <text class="news-title">{{ item.title }}</text>
            <text class="news-time">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全距离 -->
    <view class="safe-bottom" />
  </view>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F2 0%, #F8F9FA 30%);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  padding-bottom: 160rpx;
}

// 状态栏
.status-bar {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8A5C 100%);
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-top: calc(env(safe-area-inset-top) + 20rpx);
  width: 100%;
  box-sizing: border-box;
}

.status-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  width: 100%;
  box-sizing: border-box;
}

.status-left {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  margin-right: 12rpx;
  
  &.online {
    background: #4ADE80;
    box-shadow: 0 0 12rpx #4ADE80;
  }
  
  &.offline {
    background: #EF4444;
    box-shadow: 0 0 12rpx #EF4444;
  }
}

.status-text {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 500;
}

.status-right {
  display: flex;
  align-items: center;
}

.dog-count {
  color: rgba(255, 255, 255, 0.9);
  font-size: 26rpx;
}

// 欢迎区域
.welcome-section {
  margin: -20rpx 24rpx 24rpx;
  position: relative;
  z-index: 10;
  width: calc(100% - 48rpx);
  box-sizing: border-box;
}

.welcome-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  width: 100%;
  box-sizing: border-box;
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.welcome-info {
  flex: 1;
}

.welcome-greeting {
  font-size: 40rpx;
  font-weight: 700;
  color: #1A1A2E;
  display: block;
  margin-bottom: 12rpx;
}

.location-row {
  display: flex;
  align-items: center;
}

.location-icon {
  font-size: 28rpx;
  margin-right: 8rpx;
}

.location-text {
  font-size: 28rpx;
  color: #6B7280;
}

.avatar-wrapper {
  margin-left: 24rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8A5C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: #FFFFFF;
  font-size: 40rpx;
  font-weight: 700;
}

// SOS 按钮区域
.sos-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 32rpx;
  width: 100%;
  box-sizing: border-box;
}

.sos-button-wrapper {
  position: relative;
  width: 280rpx;
  height: 280rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sos-wave {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(229, 57, 53, 0.15);
  animation: wave-animation 2s ease-out infinite;
  
  &.delay-1 {
    animation-delay: 0.5s;
  }
  
  &.delay-2 {
    animation-delay: 1s;
  }
}

@keyframes wave-animation {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.sos-button {
  width: 220rpx;
  height: 220rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #E53935 0%, #C62828 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(229, 57, 53, 0.45);
  position: relative;
  z-index: 10;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.sos-icon {
  font-size: 56rpx;
  font-weight: 900;
  color: #FFFFFF;
  letter-spacing: 4rpx;
}

.sos-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 8rpx;
}

.sos-hint {
  margin-top: 24rpx;
  font-size: 26rpx;
  color: #9CA3AF;
}

// 功能区域
.features-section {
  padding: 0 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1A1A2E;
}

.section-more {
  font-size: 26rpx;
  color: #FF6B35;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.feature-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  
  &:active {
    transform: scale(0.98);
  }
}

.feature-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.feature-icon {
  font-size: 40rpx;
}

.feature-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1A2E;
  margin-bottom: 6rpx;
}

.feature-desc {
  font-size: 24rpx;
  color: #9CA3AF;
}

// 统计区域
.stats-section {
  padding: 32rpx 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.stats-card {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8A5C 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-around;
  width: 100%;
  box-sizing: border-box;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 48rpx;
  font-weight: 800;
  color: #FFFFFF;
}

.stat-unit {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: -8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8rpx;
}

// 动态区域
.news-section {
  padding: 0 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.news-list {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.news-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
  width: 100%;
  box-sizing: border-box;
  
  &:last-child {
    border-bottom: none;
  }
}

.news-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  flex-shrink: 0;
  
  &.news-dot-success {
    background: #43A047;
  }
  
  &.news-dot-info {
    background: #1E88E5;
  }
  
  &.news-dot-warning {
    background: #FB8C00;
  }
}

.news-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
}

.news-title {
  font-size: 28rpx;
  color: #374151;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-time {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-left: 16rpx;
  flex-shrink: 0;
}

.safe-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  padding-bottom: 40rpx;
}
</style>
