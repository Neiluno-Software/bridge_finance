/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const anniversaryModal = atomWithStorage('obridge:third-anniversary-modal', {})

export function useShowOnceAnniversaryModal() {
  return useAtom(anniversaryModal)
}
