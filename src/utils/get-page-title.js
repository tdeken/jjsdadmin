import defaultSettings from '@/settings'

const title = defaultSettings.title || '(σﾟ∀ﾟ)σ..:*☆数据中心后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
