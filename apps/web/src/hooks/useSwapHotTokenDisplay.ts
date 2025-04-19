import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { atom, useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const isSwapHotTokenDisplay = atomWithStorageWithErrorCatch<boolean>('obridge:isHotTokensDisplay', false)
const isSwapHotTokenDisplayETH = atomWithStorageWithErrorCatch<boolean>('obridge:isHotTokensDisplayETH', true)
const isHotTokensDisplayMobile = atom(false)

export const useSwapHotTokenDisplay = () => {
  const { isMobile } = useMatchBreakpoints()
  return useAtom(
    isMobile ? isHotTokensDisplayMobile : isSwapHotTokenDisplayETH,
  )
}
