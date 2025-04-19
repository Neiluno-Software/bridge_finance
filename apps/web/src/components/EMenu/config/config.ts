import { ContextApi } from '@pancakeswap/localization'
import { DropdownMenuItems, MenuItemsType, NftFillIcon, NftIcon } from '@pancakeswap/uikit'
import { SUPPORT_NFTS, SUPPORT_ONLY_ORB3 } from 'config/constants/supportChains'
import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Bridge'),
      href: '/bridge',
      // supportChainIds: SUPPORT_ONLY_ORB3,
    },
    {
      label: t('History'),
      href: '/history',
      // supportChainIds: SUPPORT_ONLY_ORB3,
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
