import { ContextApi } from '@pancakeswap/localization'
import { LinkExternal } from '@pancakeswap/uikit'

const config = (t: ContextApi['t']) => {
  return [
    {
      title: t('I sold an NFT, where’s my ETH?'),
      description: [
        t(
          'Trades are settled in WETH, which is a wrapped version of ETH used on ETH Smart Chain. That means that when you sell an item, WETH is sent to your wallet instead of ETH.',
        ),
        t('You can instantly swap your WETH for ETH with no trading fees on Orb3.'),
      ],
    },
    {
      title: t('How can I list my NFT collection on the Market?'),
      description: [
        t('In Phase 2 of the NFT Marketplace, collections must be whitelisted before they may be listed.'),
        t('We are now accepting applications from NFT collection owners seeking to list their collections.'),
      ],
    },
    {
      title: t('What are the fees?'),
      description: [
        t(
          '100% of all platform fees taken by Orb3 from sales are used to buy back and BURN CAKE tokens in our weekly CAKE burns.',
        ),
        t(
          'Platform fees: 2% is subtracted from NFT sales on the market. Subject to change.Collection fees: Additional fees may be taken by collection creators, once those collections are live. These will not contribute to the CAKE burns.',
        ),
      ],
    },
  ]
}

export default config
