import memoize from 'lodash/memoize'
import { ContextApi } from '@pancakeswap/localization'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Bridge3',
  description:
    'Our goal is to enable cross-rollup transactions from ETH Layer 1 to Layer 3 Chains, improving Ethereum’s inter-chain compatibility and maintaining real-time synchronization between rollups and the mainnet. We are committed to reducing gas consumption through EVM Technology.',
  image: `https://ucarecdn.com/d3fd0b61-38e5-438b-81c3-d1ae957198d9/hero.jpg`,
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const getPathList = (t: ContextApi['t']): PathList => {
  return {
    paths: {
      '/': { title: t('Home') },
      '/bridge': {
        basePath: true,
        title: t('Bridge'),
        image: `https://ucarecdn.com/d3fd0b61-38e5-438b-81c3-d1ae957198d9/hero.jpg`,
      },
      '/history': {
        basePath: true,
        title: t('History'),
        image: `https://ucarecdn.com/d3fd0b61-38e5-438b-81c3-d1ae957198d9/hero.jpg`,
      },
    },
    defaultTitleSuffix: t('Bridge3Hub'),
  }
}

export const getCustomMeta = memoize(
  (path: string, t: ContextApi['t'], _: string): PageMeta => {
    const pathList = getPathList(t)
    const pathMetadata =
      pathList.paths[path] ??
      pathList.paths[Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]]

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path, t, locale) => `${path}#${locale}`,
)
