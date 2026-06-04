'use client'

import { Check } from 'lucide-react'

const STEPS = ['Detail', 'Item & Menu', 'Harga', 'Review']

export function LoaStepper({ step, onStep }: { step: number; onStep: (n: number) => void }) {
  return (
    <div className="mb-6 flex gap-1.5">
      {STEPS.map((label, i) => {
        const active = i === step
        const done = i < step
        return (
          <button
            key={label}
            type="button"
            onClick={() => onStep(i)}
            className={[
              'flex flex-1 items-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] transition',
              active ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500',
              done ? 'border-green-200 text-green-700' : '',
            ].join(' ')}
          >
            <span
              className={[
                'grid place-items-center rounded-full text-[12px] font-bold',
                active ? 'bg-indigo-600 text-white' : done ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500',
              ].join(' ')}
              style={{ width: 22, height: 22 }}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {label}
          </button>
        )
      })}
    </div>
  )
}
