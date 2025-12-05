import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'
import type { CustomTabBarItem, NativeTabBarItem } from './types'

/**
 * tabbar 选择的策略
 * 0: 'NO_TABBAR' `无 tabbar`
 * 1: 'NATIVE_TABBAR'  `完全原生 tabbar`
 * 2: 'CUSTOM_TABBAR_WITH_CACHE' `有缓存自定义 tabbar`
 * 3: 'CUSTOM_TABBAR_WITHOUT_CACHE' `无缓存自定义 tabbar`
 */
export const TABBAR_STRATEGY_MAP = {
  NO_TABBAR: 0,
  NATIVE_TABBAR: 1,
  CUSTOM_TABBAR_WITH_CACHE: 2,
  CUSTOM_TABBAR_WITHOUT_CACHE: 3,
}

// 使用自定义带缓存的 tabbar
export const selectedTabbarStrategy = TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE

// 原生 tabbar 配置
export const nativeTabbarList: NativeTabBarItem[] = [
  {
    iconPath: 'static/tabbar/home.png',
    selectedIconPath: 'static/tabbar/homeHL.png',
    pagePath: 'pages/index/index',
    text: '首页',
  },
  {
    iconPath: 'static/tabbar/home.png',
    selectedIconPath: 'static/tabbar/homeHL.png',
    pagePath: 'pages/agent/index',
    text: 'AI助手',
  },
  {
    iconPath: 'static/tabbar/personal.png',
    selectedIconPath: 'static/tabbar/personalHL.png',
    pagePath: 'pages/me/me',
    text: '我的',
  },
]

// 自定义 tabbar 配置 - 救驾先锋主题色
export const customTabbarList: CustomTabBarItem[] = [
  {
    text: '首页',
    pagePath: 'pages/index/index',
    iconType: 'unocss',
    icon: 'i-carbon-home',
  },
  {
    text: 'AI助手',
    pagePath: 'pages/agent/index',
    iconType: 'unocss',
    icon: 'i-carbon-chat-bot',
  },
  {
    text: '我的',
    pagePath: 'pages/me/me',
    iconType: 'unocss',
    icon: 'i-carbon-user',
  },
]

/**
 * 是否启用 tabbar 缓存
 */
export const tabbarCacheEnable
  = [TABBAR_STRATEGY_MAP.NATIVE_TABBAR, TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE].includes(selectedTabbarStrategy)

/**
 * 是否启用自定义 tabbar
 */
export const customTabbarEnable
  = [TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE, TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITHOUT_CACHE].includes(selectedTabbarStrategy)

/**
 * 是否需要隐藏原生 tabbar
 */
export const needHideNativeTabbar = selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE

const _tabbarList = customTabbarEnable ? customTabbarList.map(item => ({ text: item.text, pagePath: item.pagePath })) : nativeTabbarList
export const tabbarList = customTabbarEnable ? customTabbarList : nativeTabbarList

const _tabbar: TabBar = {
  custom: selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE,
  color: '#999999',
  selectedColor: '#1a73e8',
  backgroundColor: '#FFFFFF',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: _tabbarList as unknown as TabBar['list'],
}

export const tabBar = tabbarCacheEnable ? _tabbar : undefined
