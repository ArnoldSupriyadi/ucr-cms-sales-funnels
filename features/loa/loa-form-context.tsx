'use client'

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { loaFormReducer, type LoaFormAction } from './loa-form-reducer'
import { calculateLoa, type LoaCalcResult } from '@/lib/loa/calculations'
import {
  DEFAULT_PRICING,
  type InitialLoaData,
  type LoaItemDraft,
  type LoaPricingDraft,
  type LoaWizardState,
  type SalesUser,
} from './types'

interface LoaFormContextValue {
  state: LoaWizardState
  dispatch: Dispatch<LoaFormAction>
  calc: LoaCalcResult
  orderId: string
  meta: { orderNo: string; client: InitialLoaData['client'] }
  salesUsers: SalesUser[]
}

const LoaFormContext = createContext<LoaFormContextValue | null>(null)

export function LoaFormProvider({
  orderId,
  initial,
  salesUsers,
  initialItems,
  initialPricing,
  children,
}: {
  orderId: string
  initial: InitialLoaData
  salesUsers: SalesUser[]
  initialItems?: LoaItemDraft[]
  initialPricing?: LoaPricingDraft
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(loaFormReducer, {
    detail: initial.detail,
    items: initialItems ?? [],
    pricing: initialPricing ?? { ...DEFAULT_PRICING },
  })

  const calc = useMemo(
    () =>
      calculateLoa(
        state.items.map((i) => ({ pricePerPax: i.pricePerPax, pax: i.pax })),
        state.pricing,
      ),
    [state.items, state.pricing],
  )

  const value = useMemo<LoaFormContextValue>(
    () => ({
      state,
      dispatch,
      calc,
      orderId,
      meta: { orderNo: initial.orderNo, client: initial.client },
      salesUsers,
    }),
    [state, calc, orderId, initial.orderNo, initial.client, salesUsers],
  )

  return <LoaFormContext.Provider value={value}>{children}</LoaFormContext.Provider>
}

export function useLoaForm(): LoaFormContextValue {
  const ctx = useContext(LoaFormContext)
  if (!ctx) throw new Error('useLoaForm harus dipakai di dalam <LoaFormProvider>')
  return ctx
}
