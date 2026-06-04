'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoaFormProvider, useLoaForm } from '../loa-form-context'
import type {
  InitialLoaData,
  LoaItemDraft,
  LoaPricingDraft,
  MenuCatalog,
  SalesUser,
} from '../types'
import { LoaStepper } from './loa-stepper'
import { StepDetail } from './step-detail'
import { StepItems } from './step-items'
import { StepPricing } from './step-pricing'
import { StepReview } from './step-review'
import { PricePanel } from './price-panel'
import { DocPreview } from './doc-preview'

interface LoaFormProps {
  orderId: string
  initial: InitialLoaData
  salesUsers: SalesUser[]
  catalog: MenuCatalog
  initialItems?: LoaItemDraft[]
  initialPricing?: LoaPricingDraft
}

export function LoaForm({
  orderId,
  initial,
  salesUsers,
  catalog,
  initialItems,
  initialPricing,
}: LoaFormProps) {
  return (
    <LoaFormProvider
      orderId={orderId}
      initial={initial}
      salesUsers={salesUsers}
      initialItems={initialItems}
      initialPricing={initialPricing}
    >
      <LoaFormBody catalog={catalog} />
    </LoaFormProvider>
  )
}

function LoaFormBody({ catalog }: { catalog: MenuCatalog }) {
  const { state, meta } = useLoaForm()
  const [step, setStep] = useState(0)
  const [view, setView] = useState<'form' | 'doc'>('form')

  const go = (dir: number) => setStep((s) => Math.max(0, Math.min(3, s + dir)))

  return (
    <div className="space-y-5">
      {/* Topbar: order + toggle view */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Form LoA</h1>
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
          {meta.orderNo}
        </span>
        <div className="ml-auto inline-flex overflow-hidden rounded-lg border">
          <button
            type="button"
            onClick={() => setView('form')}
            className={`px-3.5 py-1.5 text-[13px] font-semibold ${view === 'form' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}
          >
            Form Input
          </button>
          <button
            type="button"
            onClick={() => setView('doc')}
            className={`px-3.5 py-1.5 text-[13px] font-semibold ${view === 'doc' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}
          >
            Preview Dokumen
          </button>
        </div>
      </div>

      {view === 'doc' ? (
        <DocPreview />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <LoaStepper step={step} onStep={setStep} />
            {step === 0 && <StepDetail />}
            {step === 1 && <StepItems catalog={catalog} />}
            {step === 2 && <StepPricing />}
            {step === 3 && <StepReview />}

            <div className="mt-4 flex justify-between">
              <Button variant="outline" disabled={step === 0} onClick={() => go(-1)}>
                ← Kembali
              </Button>
              {step < 3 && (
                <Button
                  onClick={() => go(1)}
                  disabled={step === 1 && state.items.length === 0}
                >
                  Lanjut →
                </Button>
              )}
            </div>
          </div>
          <div>
            <PricePanel />
          </div>
        </div>
      )}
    </div>
  )
}
