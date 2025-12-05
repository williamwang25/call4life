<script lang="ts" setup>
/**
 * 救驾先锋 - 我的页面
 */
defineOptions({
  name: 'C4LMe',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
})

// 用户信息
const userInfo = ref({
  name: '用户',
  phone: '138****8888',
  avatar: '',
  isCertified: true,
})

// 统计数据
const userStats = ref([
  { label: '参与救援', value: '0', unit: '次' },
  { label: '获得勋章', value: '3', unit: '枚' },
  { label: '培训时长', value: '2.5', unit: '小时' },
])

// 功能菜单
const menuItems = ref([
  { id: 'history', icon: '📋', title: '呼救记录', desc: '查看历史呼救记录' },
  { id: 'training', icon: '🎓', title: '急救培训', desc: '学习CPR和AED使用' },
  { id: 'certificate', icon: '📜', title: '我的证书', desc: '急救能力认证' },
  { id: 'feedback', icon: '💬', title: '意见反馈', desc: '帮助我们改进' },
  { id: 'settings', icon: '⚙️', title: '设置', desc: '账号与隐私设置' },
  { id: 'about', icon: 'ℹ️', title: '关于我们', desc: '了解救驾先锋' },
])

function handleMenuClick(item: typeof menuItems.value[0]) {
  uni.showToast({
    title: `${item.title}开发中`,
    icon: 'none',
  })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出', icon: 'success' })
      }
    },
  })
}
</script>

<template>
  <view class="me-page">
    <!-- 顶部用户信息区 -->
    <view class="user-header">
      <view class="header-bg" />
      <view class="user-card">
        <view class="avatar-section">
          <view class="avatar">
            <text class="avatar-text">{{ userInfo.name.charAt(0) }}</text>
          </view>
          <view v-if="userInfo.isCertified" class="certified-badge">
            <text class="badge-text">已认证</text>
          </view>
        </view>
        <view class="user-info">
          <text class="user-name">{{ userInfo.name }}</text>
          <text class="user-phone">{{ userInfo.phone }}</text>
        </view>
        <view class="edit-btn">
          <text class="edit-icon">✏️</text>
        </view>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-section">
      <view class="stats-card">
        <view v-for="(stat, index) in userStats" :key="index" class="stat-item">
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-unit">{{ stat.unit }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-card">
        <view
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item"
          @tap="handleMenuClick(item)"
        >
          <view class="menu-left">
            <text class="menu-icon">{{ item.icon }}</text>
            <view class="menu-text">
              <text class="menu-title">{{ item.title }}</text>
              <text class="menu-desc">{{ item.desc }}</text>
            </view>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <view class="logout-btn" @tap="handleLogout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>

    <!-- 底部安全距离 -->
    <view class="safe-bottom" />
  </view>
</template>

<style lang="scss" scoped>
.me-page {
  min-height: 100vh;
  background: #F5F7FA;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  padding-bottom: 160rpx;
}

// 顶部用户区
.user-header {
  position: relative;
  padding-bottom: 60rpx;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300rpx;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8A5C 100%);
  padding-top: env(safe-area-inset-top);
}

.user-card {
  position: relative;
  margin: 0 24rpx;
  margin-top: calc(env(safe-area-inset-top) + 100rpx);
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  width: calc(100% - 48rpx);
  box-sizing: border-box;
}

.avatar-section {
  position: relative;
  margin-right: 24rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8A5C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: #FFFFFF;
  font-size: 48rpx;
  font-weight: 700;
}

.certified-badge {
  position: absolute;
  bottom: -8rpx;
  left: 50%;
  transform: translateX(-50%);
  background: #43A047;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.badge-text {
  color: #FFFFFF;
  font-size: 20rpx;
  font-weight: 500;
}

.user-info {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #1A1A2E;
  margin-bottom: 8rpx;
}

.user-phone {
  font-size: 26rpx;
  color: #6B7280;
}

.edit-btn {
  width: 64rpx;
  height: 64rpx;
  background: #F5F7FA;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 28rpx;
}

// 统计区域
.stats-section {
  padding: 0 24rpx;
  margin-top: 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.stats-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 800;
  color: #FF6B35;
}

.stat-unit {
  font-size: 22rpx;
  color: #6B7280;
  margin-top: -4rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-top: 8rpx;
}

// 菜单区域
.menu-section {
  padding: 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.menu-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #F3F4F6;
  width: 100%;
  box-sizing: border-box;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: #F9FAFB;
  }
}

.menu-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
}

.menu-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1A2E;
  margin-bottom: 4rpx;
}

.menu-desc {
  font-size: 24rpx;
  color: #9CA3AF;
}

.menu-arrow {
  font-size: 36rpx;
  color: #D1D5DB;
}

// 退出登录
.logout-section {
  padding: 0 24rpx;
  margin-top: 48rpx;
  width: 100%;
  box-sizing: border-box;
}

.logout-btn {
  background: #FFFFFF;
  border-radius: 48rpx;
  padding: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #E5E7EB;
  width: 100%;
  box-sizing: border-box;
  
  &:active {
    background: #F9FAFB;
  }
}

.logout-text {
  font-size: 30rpx;
  color: #6B7280;
  font-weight: 500;
}

.safe-bottom {
  height: 40rpx;
}
</style>
