'use client'

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { loaFormReducer, type LoaFormAction } from './loa-form-reducer'
import { calculateLoa, type LoaCalcResult } from '@/lib/loa/calculations'
import {
  DEFAULT_PRICING,
  type EventDraft,
  type InitialLoaData,
  type LoaPricingDraft,
  type LoaWizardState,
  type SalesUser,
} from './types'

interface LoaFormContextValue {
  state: LoaWizardState
  dispatch: Dispatch<LoaFormAction>
  calc: LoaCalcResult
  orderId: string
  meta: { orderNo: string; eventDateStart: string; eventDateEnd: string | null; client: InitialLoaData['client'] }
  salesUsers: SalesUser[]
}

const LoaFormContext = createContext<LoaFormContextValue | null>(null)

export function LoaFormProvider({
  orderId,
  initial,
  salesUsers,
  initialEvents,
  initialPricing,
  children,
}: {
  orderId: string
  initial: InitialLoaData
  salesUsers: SalesUser[]
  initialEvents?: EventDraft[]
  initialPricing?: LoaPricingDraft
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(loaFormReducer, {
    detail: initial.detail,
    events: initialEvents ?? [],
    pricing: initialPricing ?? { ...DEFAULT_PRICING },
  })

  const calc = useMemo(
    () => calculateLoa(state.events.flatMap((e) => e.headers).map((h) => h.amount), state.pricing),
    [state.events, state.pricing],
  )

  const value = useMemo<LoaFormContextValue>(
    () => ({
      state,
      dispatch,
      calc,
      orderId,
      meta: {
        orderNo: initial.orderNo,
        eventDateStart: initial.eventDateStart,
        eventDateEnd: initial.eventDateEnd,
        client: initial.client,
      },
      salesUsers,
    }),
    [state, calc, orderId, initial.orderNo, initial.eventDateStart, initial.eventDateEnd, initial.client, salesUsers],
  )

  return <LoaFormContext.Provider value={value}>{children}</LoaFormContext.Provider>
}

export function useLoaForm(): LoaFormContextValue {
  const ctx = useContext(LoaFormContext)
  if (!ctx) throw new Error('useLoaForm harus dipakai di dalam <LoaFormProvider>')
  return ctx
}
