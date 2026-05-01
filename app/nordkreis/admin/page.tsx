'use client'

// app/nordkreis/admin/page.tsx
// LOCAL ONLY — localhost:3000/nordkreis/admin

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'

interface Student {
  enrolledAt: string
  contractNo: string
  childFirstName: string
  childSurname1: string
  childFullName: string
  childDOB: string
  schoolYear: string
  childGroup: string
  parent1FullName: string
  parent1Email: string
  parent1Phone: string
  addressStreet: string
  city: string
  germanSpeakingParent: string
  medicalAllergies: string
  additionalNotes: string
  emergencyContactName: string
  emergencyContactPhone: string
  enrollmentStatus: string
  paymentStatus: string
  pdfUrl: string
  stripeCustomerId: string
  stripePaymentMethodId: string
  activationDate: string
  internalNotes: string
}

type SortKey = 'enrolledAt' | 'childGroup' | 'childFullName' | 'enrollmentStatus'
type FilterType = 'all' | 'waiting' | 'active' | 'deleted'

function StatusBadge({ status, activationDate }: { status: string; activationDate?: string }) {
  const isWaiting = status.startsWith('Warteliste')
  const isActive = status.startsWith('Aktiviert')
  const label = isActive ? 'Aktiviert' : status
  const activatedOn =
    isActive && activationDate
      ? new Date(activationDate).toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : null
  return (
    <div>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          isWaiting
            ? 'bg-[#B3475A]/10 text-[#B3475A]'
            : isActive
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'bg-[#9A8F85]/10 text-[#9A8F85]'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${isWaiting ? 'bg-[#B3475A]' : isActive ? 'bg-emerald-500' : 'bg-[#9A8F85]'}`}
        />
        {label}
      </span>
      {activatedOn && <div className="mt-1 text-xs text-[#9A8F85]">seit {activatedOn}</div>}
    </div>
  )
}

function ActivateModal({
  student,
  onConfirm,
  onCancel,
  activating,
}: {
  student: Student
  onConfirm: () => void
  onCancel: () => void
  activating: boolean
}) {
  // Calculate preview dates — mirrors server logic
  const enrollmentFeeDate = new Date()
  enrollmentFeeDate.setDate(enrollmentFeeDate.getDate() + 8)
  const enrollmentFeeDateStr = enrollmentFeeDate.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // First monthly: next 3rd, skip May/June/July/August → September
  const now = new Date()
  const next3rd = new Date(now.getFullYear(), now.getMonth(), 3)
  if (next3rd <= now) next3rd.setMonth(next3rd.getMonth() + 1)
  const m = next3rd.getMonth()
  if (m === 4 || m === 5 || m === 6 || m === 7) next3rd.setMonth(8)
  const next3rdStr = next3rd.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // End date: June 3rd of current school year
  const chargeMonth = next3rd.getMonth()
  const endYear = chargeMonth >= 8 ? next3rd.getFullYear() + 1 : next3rd.getFullYear()
  const endDate = new Date(endYear, 5, 3)
  const endDateStr = endDate.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  // Last charge = June 3rd (same month as endDate which is June 4th)
  const lastChargeDate = new Date(endYear, 5, 3)
  const numMonths =
    (lastChargeDate.getFullYear() - next3rd.getFullYear()) * 12 +
    (lastChargeDate.getMonth() - next3rd.getMonth()) +
    1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#081C3C]">
        <h2 className="mb-1 text-lg font-bold text-[#081C3C] dark:text-[#F4EFE8]">
          Kurs bestätigen
        </h2>
        <p className="mb-5 text-sm text-[#9A8F85]">
          Bitte überprüfe die Zahlungsdaten vor der Aktivierung.
        </p>

        <div className="mb-5 space-y-3">
          <div className="space-y-1.5 rounded-xl bg-[#F4EFE8] p-4 dark:bg-[#081C3C]/50">
            <div className="flex justify-between text-sm">
              <span className="text-[#9A8F85]">Kind</span>
              <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">
                {student.childFullName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9A8F85]">Gruppe</span>
              <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">
                {student.childGroup}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9A8F85]">Elternteil</span>
              <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">
                {student.parent1FullName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9A8F85]">E-Mail</span>
              <span className="text-xs font-medium text-[#081C3C] dark:text-[#F4EFE8]">
                {student.parent1Email}
              </span>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-[#B3475A]/30 bg-[#B3475A]/5 p-4">
            <p className="text-xs font-bold tracking-wide text-[#B3475A] uppercase">Zahlungsplan</p>
            <div className="flex justify-between text-sm">
              <span className="text-[#081C3C] dark:text-[#F4EFE8]">Einschreibegebühr (60 €)</span>
              <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">
                {enrollmentFeeDateStr}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#081C3C] dark:text-[#F4EFE8]">1. Monatsbeitrag (45 €)</span>
              <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">{next3rdStr}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#081C3C] dark:text-[#F4EFE8]">Letzte Zahlung (45 €)</span>
              <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">{endDateStr}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9A8F85]">Anzahl Monate</span>
              <span className="text-[#9A8F85]">{numMonths} Monate</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-[#9A8F85]">
            Eine Bestätigungs-E-Mail wird sofort an <strong>{student.parent1Email}</strong>{' '}
            gesendet. Die Zahlungen werden über Stripe per SEPA-Lastschrift eingezogen.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={activating}
            className="flex-1 rounded-xl border border-[#9A8F85]/40 py-2.5 text-sm text-[#9A8F85] transition-all hover:border-[#081C3C] hover:text-[#081C3C] disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={activating}
            className="flex-1 rounded-xl bg-[#B3475A] py-2.5 text-sm font-semibold text-[#F4EFE8] transition-all hover:bg-[#9f3f50] disabled:opacity-60"
          >
            {activating ? 'Wird aktiviert…' : 'Jetzt aktivieren'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({
  student,
  onConfirm,
  onCancel,
  deleting,
}: {
  student: Student
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  const isActive = student.enrollmentStatus.startsWith('Aktiviert')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#081C3C]">
        <h2 className="mb-1 text-lg font-bold text-[#B3475A]">Eintrag löschen</h2>
        <p className="mb-5 text-sm text-[#9A8F85]">
          Eliminar inscripción · Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div className="mb-5 space-y-1.5 rounded-xl bg-[#F4EFE8] p-4 dark:bg-[#081C3C]/50">
          <div className="flex justify-between text-sm">
            <span className="text-[#9A8F85]">Kind</span>
            <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">
              {student.childFullName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9A8F85]">Elternteil</span>
            <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">
              {student.parent1FullName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9A8F85]">Status</span>
            <span className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">
              {student.enrollmentStatus}
            </span>
          </div>
        </div>
        {isActive && (
          <div className="mb-5 rounded-xl border border-[#B3475A]/30 bg-[#B3475A]/5 p-3">
            <p className="text-xs leading-relaxed text-[#B3475A]">
              ⚠️ Dieser Schüler ist aktiviert. Das Stripe-Abonnement wird sofort gekündigt und
              offene Rechnungen werden storniert.
            </p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-xl border border-[#9A8F85]/40 py-2.5 text-sm text-[#9A8F85] transition-all hover:border-[#081C3C] hover:text-[#081C3C] disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl bg-[#B3475A] py-2.5 text-sm font-semibold text-[#F4EFE8] transition-all hover:bg-[#9f3f50] disabled:opacity-60"
          >
            {deleting ? 'Wird gelöscht…' : 'Löschen'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)
  const [confirmStudent, setConfirmStudent] = useState<Student | null>(null)
  const [messages, setMessages] = useState<
    Record<string, { type: 'success' | 'error'; text: string }>
  >({})
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('enrolledAt')
  const [sortAsc, setSortAsc] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({})
  const [pendingFees, setPendingFees] = useState<
    { invoiceId: string; childName: string; amountEur: number; finalizeAfter: string; daysLeft: number | null }[]
  >([])

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/nordkreis/admin-students')
      const data = await res.json()
      setStudents(data.students ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
    fetch('/api/nordkreis/pending-fees')
      .then((r) => r.json())
      .then((d) => setPendingFees(d.pending ?? []))
      .catch(console.error)
  }, [fetchStudents])

  const handleActivate = async (student: Student) => {
    setActivating(true)
    try {
      const res = await fetch('/api/nordkreis/activate-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeCustomerId: student.stripeCustomerId,
          stripePaymentMethodId: student.stripePaymentMethodId,
          childName: student.childFullName,
          childGroup: student.childGroup,
          parentName: student.parent1FullName,
          parentEmail: student.parent1Email,
          contractNo: student.contractNo,
          studentName: student.childFullName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages((m) => ({
        ...m,
        [student.contractNo]: {
          type: 'success',
          text: `Aktiviert · Einschreibegebühr: ${data.enrollmentFeeDate} · 1. Monatsbeitrag: ${data.firstMonthlyDate}`,
        },
      }))
      setTimeout(fetchStudents, 2000)
    } catch (e: unknown) {
      setMessages((m) => ({
        ...m,
        [student.contractNo]: {
          type: 'error',
          text: e instanceof Error ? e.message : 'Fehler',
        },
      }))
    } finally {
      setActivating(false)
      setConfirmStudent(null)
    }
  }

  const handleCancel = async (student: Student) => {
    if (
      !confirm(`Wirklich stornieren? / ¿Cancelar de verdad?

${student.childFullName} — ${student.parent1Email}

Dies setzt den Status auf "Storniert" in Google Sheets.`)
    )
      return
    try {
      const res = await fetch('/api/nordkreis/cancel-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: student.parent1Email,
          contractNo: student.contractNo,
          stripeCustomerId: student.stripeCustomerId,
          enrollmentStatus: student.enrollmentStatus,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages((m) => ({ ...m, [student.contractNo]: { type: 'success', text: 'Storniert' } }))
      setTimeout(fetchStudents, 1000)
    } catch (e: unknown) {
      setMessages((m) => ({
        ...m,
        [student.contractNo]: { type: 'error', text: e instanceof Error ? e.message : 'Fehler' },
      }))
    }
  }

  const handleDelete = async (student: Student) => {
    setDeleting(true)
    try {
      const res = await fetch('/api/nordkreis/cancel-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: student.parent1Email,
          contractNo: student.contractNo,
          stripeCustomerId: student.stripeCustomerId,
          enrollmentStatus: student.enrollmentStatus,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTimeout(fetchStudents, 500)
    } catch (e: unknown) {
      setMessages((m) => ({
        ...m,
        [student.contractNo]: {
          type: 'error',
          text: e instanceof Error ? e.message : 'Fehler beim Löschen',
        },
      }))
    } finally {
      setDeleting(false)
      setDeleteStudent(null)
    }
  }

  const saveNotes = async (student: Student) => {
    setSavingNotes((m) => ({ ...m, [student.contractNo]: true }))
    try {
      const res = await fetch('/api/nordkreis/update-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: student.parent1Email,
          notes: editingNotes[student.contractNo] ?? student.internalNotes,
        }),
      })
      if (!res.ok) throw new Error('Fehler')
      setMessages((m) => ({ ...m, [student.contractNo]: { type: 'success', text: 'Notiz gespeichert' } }))
      setTimeout(fetchStudents, 500)
    } catch {
      setMessages((m) => ({ ...m, [student.contractNo]: { type: 'error', text: 'Fehler beim Speichern' } }))
    } finally {
      setSavingNotes((m) => ({ ...m, [student.contractNo]: false }))
    }
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const sorted = [...students]
    .filter((s) => {
      if (filter === 'waiting') return s.enrollmentStatus.startsWith('Warteliste')
      if (filter === 'active') return s.enrollmentStatus.startsWith('Aktiviert')
      if (filter === 'deleted') return s.enrollmentStatus.startsWith('Gelöscht')
      // "all" hides deleted by default
      return !s.enrollmentStatus.startsWith('Gelöscht')
    })
    .filter(
      (s) =>
        !search ||
        [s.childFullName, s.parent1FullName, s.parent1Email, s.childGroup]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const va = a[sortKey] ?? ''
      const vb = b[sortKey] ?? ''
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va)
    })

  const waiting = students.filter((s) => s.enrollmentStatus.startsWith('Warteliste'))
  const active = students.filter((s) => s.enrollmentStatus.startsWith('Aktiviert'))
  const cancelled = students.filter((s) => s.enrollmentStatus.startsWith('Storniert'))
  const deleted = students.filter((s) => s.enrollmentStatus.startsWith('Gelöscht'))

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 text-[#9A8F85]">{sortKey === k ? (sortAsc ? '↑' : '↓') : '↕'}</span>
  )

  return (
    <div className="min-h-screen font-['Noto_Sans'] text-[#081C3C] dark:text-[#F4EFE8]">
      {deleteStudent && (
        <DeleteModal
          student={deleteStudent}
          onConfirm={() => handleDelete(deleteStudent)}
          onCancel={() => setDeleteStudent(null)}
          deleting={deleting}
        />
      )}

      {confirmStudent && (
        <ActivateModal
          student={confirmStudent}
          onConfirm={() => handleActivate(confirmStudent)}
          onCancel={() => setConfirmStudent(null)}
          activating={activating}
        />
      )}

      {/* Header */}
      <div className="bg-[#081C3C] px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B3475A] p-1.5">
              <Image
                src="/static/images/nordkreis-icon.png"
                alt="Nordkreis"
                width={40}
                height={40}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#F4EFE8]">Nordkreis Admin</h1>
              <p className="text-xs text-[#9A8F85]">🔒 localhost only</p>
            </div>
          </div>
          <button
            onClick={fetchStudents}
            className="rounded-xl border border-[#9A8F85]/40 px-4 py-2 text-sm text-[#9A8F85] transition-all hover:border-[#F4EFE8] hover:text-[#F4EFE8]"
          >
            ↻ Aktualisieren
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          {(
            [
              [
                'Gesamt',
                students.filter((s) => !s.enrollmentStatus.startsWith('Gelöscht')).length,
                '#081C3C',
              ],
              ['Warteliste', waiting.length, '#B3475A'],
              ['Aktiviert', active.length, '#059669'],
              ['Gelöscht', deleted.length, '#9A8F85'],
            ] as [string, number, string][]
          ).map(([label, count, color]) => (
            <div
              key={label}
              className="min-w-[80px] rounded-xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-4 py-3 dark:bg-[#081C3C]"
            >
              <div className="text-xl font-bold" style={{ color }}>
                {count}
              </div>
              <div className="mt-0.5 text-xs whitespace-nowrap text-[#9A8F85]">{label}</div>
            </div>
          ))}
        </div>

        {/* Group summary */}
        <div className="flex flex-wrap gap-3">
          {(['Spielkreis', 'Entdeckerkreis', 'Kompasskreis'] as const).map((group) => {
            const total = students.filter(
              (s) => s.childGroup === group && !s.enrollmentStatus.startsWith('Gelöscht')
            ).length
            const act = students.filter(
              (s) => s.childGroup === group && s.enrollmentStatus.startsWith('Aktiviert')
            ).length
            const wait = students.filter(
              (s) => s.childGroup === group && s.enrollmentStatus.startsWith('Warteliste')
            ).length
            return (
              <div
                key={group}
                className="rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-3 dark:bg-[#081C3C]/60"
              >
                <div className="text-xs font-semibold text-[#081C3C] dark:text-[#F4EFE8]">{group}</div>
                <div className="mt-1 text-lg font-bold text-[#081C3C] dark:text-[#F4EFE8]">{total}</div>
                <div className="mt-0.5 text-[11px] text-[#9A8F85]">
                  {act} aktiv · {wait} Warteliste
                </div>
              </div>
            )
          })}
        </div>

        {/* Pending enrollment fees */}
        {pendingFees.length > 0 && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-900/20">
            <p className="mb-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              ⏳ Einschreibegebühren ausstehend ({pendingFees.length})
            </p>
            <div className="space-y-1">
              {pendingFees.map((fee) => (
                <div key={fee.invoiceId} className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                  <span>{fee.childName || '—'}</span>
                  <span>
                    {fee.amountEur} € ·{' '}
                    {fee.daysLeft !== null && fee.daysLeft > 0
                      ? `in ${fee.daysLeft} Tag${fee.daysLeft === 1 ? '' : 'en'}`
                      : fee.daysLeft !== null && fee.daysLeft <= 0
                        ? 'fällig heute'
                        : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters + Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            {(['all', 'waiting', 'active', 'deleted'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as FilterType)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? 'bg-[#081C3C] text-[#F4EFE8]' : 'border border-[#9A8F85]/40 text-[#9A8F85] hover:border-[#081C3C]'}`}
              >
                {f === 'all'
                  ? 'Aktive'
                  : f === 'waiting'
                    ? 'Warteliste'
                    : f === 'active'
                      ? 'Aktiviert'
                      : 'Gelöscht'}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Suchen…"
            className="flex-1 rounded-xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-4 py-2 text-sm text-[#081C3C] placeholder:text-[#9A8F85] focus:border-[#B3475A] focus:outline-none dark:bg-[#081C3C] dark:text-[#F4EFE8]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="py-16 text-center text-[#9A8F85]">Wird geladen…</p>
        ) : sorted.length === 0 ? (
          <p className="py-16 text-center text-[#9A8F85]">Keine Einträge gefunden.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#9A8F85]/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#9A8F85]/20 bg-[#E3DED7] dark:bg-[#081C3C]/80">
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => toggleSort('enrolledAt')}
                      className="text-xs font-bold tracking-wide text-[#9A8F85] uppercase hover:text-[#081C3C]"
                    >
                      Angemeldet <SortIcon k="enrolledAt" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => toggleSort('childFullName')}
                      className="text-xs font-bold tracking-wide text-[#9A8F85] uppercase hover:text-[#081C3C]"
                    >
                      Kind <SortIcon k="childFullName" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => toggleSort('childGroup')}
                      className="text-xs font-bold tracking-wide text-[#9A8F85] uppercase hover:text-[#081C3C]"
                    >
                      Gruppe <SortIcon k="childGroup" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-[#9A8F85] uppercase">
                    Elternteil
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => toggleSort('enrollmentStatus')}
                      className="text-xs font-bold tracking-wide text-[#9A8F85] uppercase hover:text-[#081C3C]"
                    >
                      Status <SortIcon k="enrollmentStatus" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold tracking-wide text-[#9A8F85] uppercase">
                    Aktion
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => {
                  const isWaiting = s.enrollmentStatus.startsWith('Warteliste')
                  const msg = messages[s.contractNo]
                  const isExpanded = expandedRow === s.contractNo

                  return (
                    <>
                      <tr
                        key={s.contractNo}
                        className={`border-b border-[#9A8F85]/10 transition-colors ${i % 2 === 0 ? 'bg-[#F4EFE8] dark:bg-[#081C3C]' : 'bg-white dark:bg-[#081C3C]/60'} ${isExpanded ? 'border-b-0' : ''}`}
                      >
                        <td className="px-4 py-3 text-xs text-[#9A8F85]">
                          {s.enrolledAt
                            ? new Date(s.enrolledAt).toLocaleString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                          <div className="font-mono text-[10px] text-[#9A8F85]/60">
                            {s.contractNo}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#081C3C] dark:text-[#F4EFE8]">
                            {s.childFullName}
                          </div>
                          <div className="text-xs text-[#9A8F85]">{s.childDOB}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#081C3C] dark:text-[#F4EFE8]">
                          {s.childGroup.replace(' (', '\n(').split('\n')[0]}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-[#081C3C] dark:text-[#F4EFE8]">
                            {s.parent1FullName}
                          </div>
                          <div className="text-xs text-[#9A8F85]">{s.parent1Email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            status={s.enrollmentStatus}
                            activationDate={s.activationDate}
                          />
                          {msg && msg.type === 'error' && (
                            <div className="mt-1 text-xs text-[#B3475A]">{msg.text}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setExpandedRow(isExpanded ? null : s.contractNo)}
                              className="rounded-lg border border-[#9A8F85]/40 px-2.5 py-1 text-xs text-[#9A8F85] transition-all hover:border-[#081C3C] hover:text-[#081C3C]"
                            >
                              {isExpanded ? '↑' : '↓'}
                            </button>
                            {isWaiting && (
                              <button
                                onClick={() => setConfirmStudent(s)}
                                className="rounded-lg bg-[#B3475A] px-3 py-1 text-xs font-semibold text-[#F4EFE8] transition-all hover:bg-[#9f3f50]"
                              >
                                ▶ Aktivieren
                              </button>
                            )}
                            {!s.enrollmentStatus.startsWith('Storniert') &&
                              !s.enrollmentStatus.startsWith('Gelöscht') && (
                                <button
                                  onClick={() => handleCancel(s)}
                                  className="rounded-lg border border-[#9A8F85]/40 px-2.5 py-1 text-xs text-[#9A8F85] transition-all hover:border-[#B3475A] hover:text-[#B3475A]"
                                  title="Stornieren / Cancelar"
                                >
                                  🗑
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr
                          key={`${s.contractNo}-expanded`}
                          className={`border-b border-[#9A8F85]/10 ${i % 2 === 0 ? 'bg-[#F4EFE8] dark:bg-[#081C3C]' : 'bg-white dark:bg-[#081C3C]/60'}`}
                        >
                          <td colSpan={6} className="px-4 pb-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:grid-cols-4">
                              {(
                                [
                                  ['Schuljahr', s.schoolYear],
                                  ['Telefon', s.parent1Phone],
                                  ['Adresse', `${s.addressStreet}, ${s.city}`],
                                  ['Deutschspr. Elternteil', s.germanSpeakingParent],
                                  ['Medizin. Hinweise', s.medicalAllergies || '—'],
                                  [
                                    'Notfallkontakt',
                                    s.emergencyContactName
                                      ? `${s.emergencyContactName} · ${s.emergencyContactPhone}`
                                      : '—',
                                  ],
                                  ['Stripe Customer', s.stripeCustomerId],
                                  ['Payment Method', s.stripePaymentMethodId],
                                  [
                                    'Aktivierungsdatum',
                                    s.activationDate
                                      ? new Date(s.activationDate).toLocaleDateString('de-DE')
                                      : '—',
                                  ],
                                ] as [string, string][]
                              ).map(([label, value]) => (
                                <div key={label}>
                                  <div className="font-medium text-[#9A8F85]">{label}</div>
                                  <div className="font-mono text-[11px] break-all text-[#081C3C] dark:text-[#F4EFE8]">
                                    {value}
                                  </div>
                                </div>
                              ))}
                              {/* Editable internal notes */}
                              <div className="col-span-full mt-2">
                                <div className="mb-1 text-xs font-medium text-[#9A8F85]">Interne Notizen</div>
                                <textarea
                                  rows={2}
                                  value={editingNotes[s.contractNo] ?? s.internalNotes ?? ''}
                                  onChange={(e) =>
                                    setEditingNotes((n) => ({ ...n, [s.contractNo]: e.target.value }))
                                  }
                                  className="w-full rounded-lg border border-[#9A8F85]/40 bg-white px-3 py-2 text-xs text-[#081C3C] focus:border-[#B3475A] focus:outline-none dark:bg-[#081C3C] dark:text-[#F4EFE8]"
                                  placeholder="Notiz hinzufügen…"
                                />
                                <button
                                  onClick={() => saveNotes(s)}
                                  disabled={savingNotes[s.contractNo]}
                                  className="mt-1 rounded-lg bg-[#081C3C] px-3 py-1 text-[11px] text-[#F4EFE8] transition-opacity hover:opacity-80 disabled:opacity-50"
                                >
                                  {savingNotes[s.contractNo] ? 'Speichern…' : 'Speichern'}
                                </button>
                              </div>
                              {s.pdfUrl && (
                                <div className="col-span-full mt-1">
                                  <a
                                    href={s.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#B3475A] underline"
                                  >
                                    Vertrag PDF →
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
