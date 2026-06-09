'use client'

import Image from 'next/image'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoaForm } from '../loa-form-context'
import { UMARA_COMPANY } from '../company'
import { hariID, tanggalID } from '@/lib/utils/date-id'
import { formatRupiah, formatDateRange } from '@/lib/utils/format'
import styles from './doc-preview.module.css'

export function DocPreview() {
  const { state, meta, salesUsers, calc } = useLoaForm()
  const { detail, events, pricing } = state
  const sales = salesUsers.find((u) => u.id === detail.salesId)

  function handleDownload() {
    const safeClient = (meta.client.name || 'Klien').replace(/[\\/:*?"<>|]/g, '').trim()
    const now = new Date()
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const filename = `LOA-${safeClient} - ${dd}-${mm}-${now.getFullYear()}`
    const prevTitle = document.title
    const restore = () => {
      document.title = prevTitle
      window.removeEventListener('afterprint', restore)
    }
    window.addEventListener('afterprint', restore)
    document.title = filename
    window.print()
  }

  const td = 'border border-slate-400 px-2.5 py-1.5 align-top'

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button type="button" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className={styles.paper}>
        <div className={styles.kop}>
          <Image src={UMARA_COMPANY.logo} alt={UMARA_COMPANY.brandName} width={140} height={116}
            style={{ height: 116, width: 'auto', objectFit: 'contain' }} />
          <div className={styles.kopAddr}>
            <span className={styles.co}>{UMARA_COMPANY.brandName}</span><br />
            {UMARA_COMPANY.address}<br />
            {UMARA_COMPANY.phone} · {UMARA_COMPANY.email}
          </div>
        </div>

        <div className={styles.meta}>
          <div>No. Dokumen : {UMARA_COMPANY.docNo}</div>
          <div>Revisi : 00</div>
        </div>

        <div className={styles.title}>
          <div className={styles.t1}>SURAT PERJANJIAN PENYEDIAAN JASA KATERING</div>
          <div>antara</div>
          <div className={styles.party}>{UMARA_COMPANY.legalName}</div>
          <div>dan</div>
          <div className={styles.party}>{meta.client.name}</div>
        </div>

        <div className={styles.cols}>
          <div className={styles.dl}>
            <span className={styles.k}>Nama</span><span>{meta.client.name}</span>
            <span className={styles.k}>Segmen</span><span>{meta.client.segmen}</span>
            <span className={styles.k}>Alamat</span><span>{meta.client.address}</span>
            <span className={styles.k}>PIC</span><span>{meta.client.picName}</span>
            <span className={styles.k}>HP</span><span>{meta.client.picPhone}</span>
            <span className={styles.k}>Nama Kegiatan</span><span>{detail.eventName || '—'}</span>
            <span className={styles.k}>Tanggal Kegiatan</span>
            <span>{meta.eventDateStart ? formatDateRange(meta.eventDateStart, meta.eventDateEnd) : '—'}</span>
          </div>
          <div className={styles.dl} style={{ alignContent: 'start' }}>
            <span className={styles.k}>Properti</span><span>{UMARA_COMPANY.brandName}</span>
            <span className={styles.k}>Alamat</span><span>{UMARA_COMPANY.address}</span>
            <span className={styles.k}>Telepon</span><span>{UMARA_COMPANY.phone}</span>
            <span className={styles.k}>Sales in Charge</span><span>{sales?.name ?? '—'}</span>
            <span className={styles.k}>HP</span><span>{sales?.phone ?? '—'}</span>
            <span className={styles.k}>Email</span><span>{sales?.email ?? '—'}</span>
          </div>
        </div>

        <p className={styles.intro}>
          Perjanjian penyediaan jasa catering ini menyepakati beberapa hal di bawah ini :
        </p>

        {/* 1. Waktu & Tempat (multi-event) */}
        <div className={styles.secTitle}>1. WAKTU &amp; TEMPAT KEGIATAN</div>
        <table className={styles.wt}>
          <thead>
            <tr>{['Tgl.', 'Hari', 'Waktu siap saji', 'Tempat', 'Set Up', 'Pax'].map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>—</td></tr>
            )}
            {events.map((ev) => (
              <tr key={ev.key}>
                <td>{ev.eventDate ? tanggalID(ev.eventDate) : '—'}</td>
                <td>{ev.eventDate ? hariID(ev.eventDate) : '—'}</td>
                <td>{ev.servingTime || '—'}</td>
                <td className={styles.tempat}>{ev.venue || '—'}</td>
                <td>{ev.setupLocation || ''}</td>
                <td>{ev.pax || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 2. Biaya Jasa Katering (pohon per event) */}
        <div className={styles.secTitle} style={{ marginTop: 14 }}>2. BIAYA JASA KATERING</div>
        <p className="mb-1.5 text-[12.5px] text-slate-600">
          Biaya penyediaan jasa katering, mencakup makanan &amp; minuman sesuai menu yang dipilih
          (sudah termasuk pajak dan biaya lainnya) adalah sbb:
        </p>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-slate-100">
              <th className={td + ' text-left'}>Tgl.</th>
              <th className={td + ' text-left'}>Order</th>
              <th className={td + ' text-right'}>Harga/pax</th>
              <th className={td + ' text-center'}>Pax</th>
              <th className={td + ' text-right'}>Total</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) =>
              ev.headers.map((h, hIdx) => {
                const lineTotal = (h.amount || 0) * (h.pax || 0) // amount = harga/pax
                return (
                  <FragmentRows key={h.key}>
                    <tr>
                      <td className={td}>{hIdx === 0 && ev.eventDate ? tanggalID(ev.eventDate) : ''}</td>
                      <td className={td + ' font-semibold'}>
                        {h.name || '—'}
                        {h.keterangan ? <span className="font-normal text-slate-500"> — {h.keterangan}</span> : null}
                      </td>
                      <td className={td + ' text-right'}>{h.amount > 0 ? formatRupiah(h.amount) : '—'}</td>
                      <td className={td + ' text-center'}>{h.pax || '—'}</td>
                      <td className={td + ' text-right font-semibold'}>{formatRupiah(lineTotal)}</td>
                    </tr>
                    {h.items.map((it) => (
                      <tr key={it.key}>
                        <td className={td}></td>
                        <td className={td} colSpan={4}>
                          • {it.name}
                          {it.keterangan ? <span className="text-slate-500"> — {it.keterangan}</span> : null}
                        </td>
                      </tr>
                    ))}
                    {h.sections.map((sec) => (
                      <FragmentRows key={sec.key}>
                        <tr>
                          <td className={td}></td>
                          <td className={td + ' font-semibold'} colSpan={4}>
                            {sec.name}
                            {sec.keterangan ? <span className="font-normal text-slate-500"> — {sec.keterangan}</span> : null}
                          </td>
                        </tr>
                        {sec.items.map((it) => (
                          <tr key={it.key}>
                            <td className={td}></td>
                            <td className={td} colSpan={4}>
                              • {it.name}
                              {it.keterangan ? <span className="text-slate-500"> — {it.keterangan}</span> : null}
                            </td>
                          </tr>
                        ))}
                        {sec.subGroups.map((sg) => (
                          <FragmentRows key={sg.key}>
                            <tr>
                              <td className={td}></td>
                              <td className={td + ' pl-6 font-medium italic text-slate-700'} colSpan={4}>{sg.name}</td>
                            </tr>
                            {sg.items.map((it) => (
                              <tr key={it.key}>
                                <td className={td}></td>
                                <td className={td + ' pl-6'} colSpan={4}>
                                  • {it.name}
                                  {it.keterangan ? <span className="text-slate-500"> — {it.keterangan}</span> : null}
                                </td>
                              </tr>
                            ))}
                          </FragmentRows>
                        ))}
                      </FragmentRows>
                    ))}
                  </FragmentRows>
                )
              }),
            )}

            {/* Totals */}
            <TotalRow td={td} label="Sub Total 1" value={formatRupiah(calc.subTotal1)} />
            {pricing.discountEnabled && (
              <TotalRow td={td} label="Diskon" value={'− ' + formatRupiah(calc.discountAmt)} />
            )}
            <TotalRow td={td} label={`Service Charge (${pricing.scPct}%)`} value={formatRupiah(calc.serviceChargeAmt)} />
            <TotalRow td={td} label="Sub Total 2" value={formatRupiah(calc.subTotal2)} />
            <TotalRow td={td} label="PB1 (10%)" value={formatRupiah(calc.pb1Amt)} />
            <TotalRow td={td} label={`Handling (${pricing.handlingType === 'percent' ? `${pricing.handlingValue}%` : 'flat'})`} value={formatRupiah(calc.handlingFeeAmt)} />
            <tr className="bg-slate-100 font-bold">
              <td className={td} colSpan={3}></td>
              <td className={td + ' text-right'}>GRAND TOTAL</td>
              <td className={td + ' text-right'}>{formatRupiah(calc.grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FragmentRows({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function TotalRow({ td, label, value }: { td: string; label: string; value: string }) {
  return (
    <tr>
      <td className={td} colSpan={3}></td>
      <td className={td + ' text-right text-slate-600'}>{label}</td>
      <td className={td + ' text-right'}>{value}</td>
    </tr>
  )
}
