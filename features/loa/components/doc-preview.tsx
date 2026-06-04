'use client'

import Image from 'next/image'
import { useLoaForm } from '../loa-form-context'
import { UMARA_COMPANY } from '../company'
import { hariID, tanggalID } from '@/lib/utils/date-id'
import styles from './doc-preview.module.css'

export function DocPreview() {
  const { state, meta, salesUsers } = useLoaForm()
  const { detail } = state
  const { client } = meta
  const sales = salesUsers.find((u) => u.id === detail.salesId)

  return (
    <div className={styles.wrap}>
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
          <div className={styles.party}>{client.name}</div>
        </div>

        <div className={styles.cols}>
          <div className={styles.dl}>
            <span className={styles.k}>Nama</span><span>{client.name}</span>
            <span className={styles.k}>Segmen</span><span>{client.segmen}</span>
            <span className={styles.k}>Alamat</span><span>{client.address}</span>
            <span className={styles.k}>PIC</span><span>{client.picName}</span>
            <span className={styles.k}>HP</span><span>{client.picPhone}</span>
            <span className={styles.k}>Nama Kegiatan</span><span>{detail.eventName || '—'}</span>
            <span className={styles.k}>Alamat Kegiatan</span><span>{detail.eventAddress || '—'}</span>
            <span className={styles.k}>Tanggal Kegiatan</span><span>{tanggalID(detail.eventDate)}</span>
            <span className={styles.k}>Hari</span><span>{hariID(detail.eventDate)}</span>
            <span className={styles.k}>Waktu</span><span>{detail.eventTime || '—'}</span>
            <span className={styles.k}>Pax</span><span>{detail.pax || '—'}</span>
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

        <div className={styles.secTitle}>I. WAKTU &amp; TEMPAT KEGIATAN</div>
        <table className={styles.wt}>
          <thead>
            <tr>{['Tgl.', 'Hari', 'Waktu siap saji', 'Tempat', 'Set Up', 'Pax'].map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            <tr>
              <td>{tanggalID(detail.eventDate)}</td>
              <td>{hariID(detail.eventDate)}</td>
              <td>{detail.eventTime || '—'}</td>
              <td className={styles.tempat}>{detail.eventAddress || '—'}</td>
              <td>{detail.setupLocation || ''}</td>
              <td>{detail.pax || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
