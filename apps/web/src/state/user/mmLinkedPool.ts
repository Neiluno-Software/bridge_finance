import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const userUseMMLinkedPoolAtom = atomWithStorageWithErrorCatch<boolean>('obridge:useMMlinkedPool', true)

export function useMMLinkedPoolByDefault() {
  return useAtom(userUseMMLinkedPoolAtom)
}
