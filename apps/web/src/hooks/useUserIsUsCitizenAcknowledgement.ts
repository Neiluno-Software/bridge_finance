/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum IdType {
  IFO = 'ifo',
  PERPETUALS = 'perpetuals',
  AFFILIATE_PROGRAM = 'affiliate-program',
}

const perpetuals = atomWithStorage('obridge:NotUsCitizenAcknowledgement-perpetuals', false)
const ifo = atomWithStorage<boolean>('obridge:NotUsCitizenAcknowledgement-ifo', false)
const affiliateProgram = atomWithStorage<boolean>('obridge:NotUsCitizenAcknowledgement-affiliate-program', false)

export function useUserNotUsCitizenAcknowledgement(id: IdType) {
  switch (id) {
    case IdType.IFO:
      return useAtom(ifo)
    case IdType.AFFILIATE_PROGRAM:
      return useAtom(affiliateProgram)
    default:
      return useAtom(perpetuals)
  }
}
