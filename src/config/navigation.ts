import { Rocket, Users, Trophy, Hammer, Gem } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'expansion' -> t('nav.expansion')
	path: string // URL 路径，如 '/expansion'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'expansion', path: '/expansion', icon: Rocket, isContentType: true },
	{ key: 'characters', path: '/characters', icon: Users, isContentType: true },
	{ key: 'tier', path: '/tier', icon: Trophy, isContentType: true },
	{ key: 'builds', path: '/builds', icon: Hammer, isContentType: true },
	{ key: 'sigils', path: '/sigils', icon: Gem, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['expansion', 'characters', 'tier', 'builds', 'sigils']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
