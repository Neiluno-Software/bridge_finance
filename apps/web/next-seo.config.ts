import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Bridge3',
  defaultTitle: 'Bridge3',
  description:
    'Our goal is to enable cross-rollup transactions from ETH Layer 1 to Layer 3 Chains, improving Ethereum’s inter-chain compatibility and maintaining real-time synchronization between rollups and the mainnet. We are committed to reducing gas consumption through EVM Technology.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Bridge3',
    site: '@Bridge3',
  },
  openGraph: {
    title: 'Bridge3',
    description:
      'Our goal is to enable cross-rollup transactions from ETH Layer 1 to Layer 3 Chains, improving Ethereum’s inter-chain compatibility and maintaining real-time synchronization between rollups and the mainnet. We are committed to reducing gas consumption through EVM Technology.',
    images: [{ url: 'https://ucarecdn.com/d3fd0b61-38e5-438b-81c3-d1ae957198d9/hero.jpg' }],
  },
}
