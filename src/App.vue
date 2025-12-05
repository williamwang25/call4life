<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'

onLaunch((options) => {
  console.log('救驾先锋 App.vue onLaunch', options)
})
onShow((options) => {
  console.log('App.vue onShow', options)
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import 'uview-pro/index.scss';
@import '@/style/theme.scss';

/* 全局样式重置 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #F8F9FA;
}

/* 禁止长按选中文字 */
view, text {
  -webkit-user-select: none;
  user-select: none;
}

/* 通用盒模型 */
view, scroll-view {
  box-sizing: border-box;
}
</style>
