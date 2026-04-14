'use client'

// app/nordkreis/enroll/page.tsx
// Nordkreis — Einschreibung / Inscripción
// Steps: Kind → Eltern → Zahlung → Unterschrift → Übersicht

import { useState, useRef, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, IbanElement, useStripe, useElements } from '@stripe/react-stripe-js'
import SignaturePad from 'react-signature-canvas'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ── Constants ─────────────────────────────────────────────────────────────────

// Fee step removed — all groups are 45 €/month, one child per registration
const MONTHLY_AMOUNT = 45
const ENROLLMENT_FEE = 60

const STEPS = ['Kind', 'Eltern', 'Zahlung', 'Unterschrift', 'Übersicht']

const GROUPS = [
  {
    value: 'Spielkreis (0–3 Jahre)',
    label: 'Spielkreis (0–3 Jahre)',
    sublabel: 'Círculo de juego (0–3 años)',
  },
  {
    value: 'Entdeckerkreis (3–5 Jahre, I3–I5)',
    label: 'Entdeckerkreis (3–5 Jahre, I3–I5)',
    sublabel: 'Círculo de exploradores (3–5 años, I3–I5)',
  },
  {
    value: 'Kompasskreis (6–8 Jahre, 1.–2. Primaria)',
    label: 'Kompasskreis (6–8 Jahre, 1.–2. Primaria)',
    sublabel: 'Círculo brújula (6–8 años, 1.º–2.º Primaria)',
  },
]

const GERMAN_SPEAKER_OPTIONS = [
  { value: 'Mutter / Mother', labelDE: 'Mutter', labelES: 'Madre' },
  { value: 'Vater / Father', labelDE: 'Vater', labelES: 'Padre' },
  { value: 'Beide / Both', labelDE: 'Beide', labelES: 'Ambos' },
  { value: 'Andere Person / Other person', labelDE: 'Andere Person', labelES: 'Otra persona' },
]

const SCHOOL_YEARS = [
  'I3',
  'I4',
  'I5',
  '1.º Primaria',
  '2.º Primaria',
  '3.º Primaria',
  '4.º Primaria',
  '5.º Primaria',
  '6.º Primaria',
  'ESO 1',
  'ESO 2',
  'ESO 3',
  'ESO 4',
  'Noch nicht in der Schule / Aún no escolarizado',
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  childFirstName: string
  childSurname1: string
  childSurname2: string
  childDOB: string
  schoolYear: string
  childGroup: string
  germanSpeakingParent: string
  medicalAllergies: string
  parent1FirstName: string
  parent1Surname1: string
  parent1Surname2: string
  parent1Phone: string
  parent1Email: string
  parent2FirstName: string
  parent2Surname1: string
  parent2Surname2: string
  parent2Phone: string
  parent2Email: string
  addressStreet: string
  city: string
  postalCode: string
  emergencyContactName: string
  emergencyContactPhone: string
  additionalNotes: string
  accountHolder: string
  enrollmentFeeConsent: boolean
  sepaConsent: boolean
  legalConsent: boolean
  signatureDataUrl: string
  // Honeypot — must stay empty
  _trap: string
}

// ── UI primitives ─────────────────────────────────────────────────────────────

function SectionCard({
  children,
  surface = false,
}: {
  children: React.ReactNode
  surface?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border border-[#9A8F85]/40 px-6 py-10 ${surface ? 'bg-[#E3DED7] dark:bg-[#081C3C]' : 'bg-[#F4EFE8] dark:bg-[#081C3C]'}`}
    >
      {children}
    </div>
  )
}

function StepDot({ label, index, current }: { label: string; index: number; current: number }) {
  const done = index < current
  const active = index === current
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${done ? 'bg-[#B3475A] text-[#F4EFE8]' : active ? 'bg-[#081C3C] text-[#F4EFE8] ring-4 ring-[#081C3C]/20 dark:bg-[#F4EFE8] dark:text-[#081C3C]' : 'bg-[#E3DED7] text-[#9A8F85]'}`}
      >
        {done ? '✓' : index + 1}
      </div>
      <span
        className={`hidden text-xs sm:block ${active ? 'font-semibold text-[#081C3C] dark:text-[#F4EFE8]' : 'text-[#9A8F85]'}`}
      >
        {label}
      </span>
    </div>
  )
}

function Field({
  label,
  sublabel,
  required,
  hint,
  children,
}: {
  label: string
  sublabel?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#081C3C] dark:text-[#F4EFE8]">
        {label} {required && <span className="text-[#B3475A]">*</span>}
      </label>
      {sublabel && <p className="-mt-1 text-xs text-[#9A8F85]">{sublabel}</p>}
      {children}
      {hint && <p className="text-xs text-[#9A8F85]">{hint}</p>}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-lg border border-[#9A8F85]/50 bg-white px-3 py-2.5 text-sm text-[#081C3C] placeholder:text-[#9A8F85] focus:border-[#B3475A] focus:ring-2 focus:ring-[#B3475A]/20 focus:outline-none dark:border-[#9A8F85]/40 dark:bg-[#081C3C] dark:text-[#F4EFE8]"
      {...props}
    />
  )
}

function Sel({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className="w-full rounded-lg border border-[#9A8F85]/50 bg-white px-3 py-2.5 text-sm text-[#081C3C] focus:border-[#B3475A] focus:ring-2 focus:ring-[#B3475A]/20 focus:outline-none dark:border-[#9A8F85]/40 dark:bg-[#081C3C] dark:text-[#F4EFE8]"
      {...props}
    >
      {children}
    </select>
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full resize-none rounded-lg border border-[#9A8F85]/50 bg-white px-3 py-2.5 text-sm text-[#081C3C] placeholder:text-[#9A8F85] focus:border-[#B3475A] focus:ring-2 focus:ring-[#B3475A]/20 focus:outline-none dark:border-[#9A8F85]/40 dark:bg-[#081C3C] dark:text-[#F4EFE8]"
      {...props}
    />
  )
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex gap-3 border-b border-[#9A8F85]/20 py-1.5 last:border-0">
      <span className="w-44 shrink-0 text-xs text-[#9A8F85]">{label}</span>
      <span className="text-sm font-medium text-[#081C3C] dark:text-[#F4EFE8]">{value}</span>
    </div>
  )
}

function ConsentBox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-all ${checked ? 'border-[#B3475A] bg-[#B3475A]/5' : 'border-[#9A8F85]/40 hover:border-[#9A8F85]/70'}`}
    >
      <input
        type="checkbox"
        className="mt-0.5 shrink-0 accent-[#B3475A]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-xs leading-relaxed text-[#9A8F85]">{children}</span>
    </label>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

function EnrollForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const sigRef = useRef<SignaturePad>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<FormState>({
    childFirstName: '',
    childSurname1: '',
    childSurname2: '',
    childDOB: '',
    schoolYear: '',
    childGroup: '',
    germanSpeakingParent: '',
    medicalAllergies: '',
    parent1FirstName: '',
    parent1Surname1: '',
    parent1Surname2: '',
    parent1Phone: '',
    parent1Email: '',
    parent2FirstName: '',
    parent2Surname1: '',
    parent2Surname2: '',
    parent2Phone: '',
    parent2Email: '',
    addressStreet: '',
    city: '',
    postalCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    additionalNotes: '',
    accountHolder: '',
    enrollmentFeeConsent: false,
    sepaConsent: false,
    legalConsent: false,
    signatureDataUrl: '',
    _trap: '',
  })

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({
        ...f,
        [field]:
          e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
      }))

  const validateStep = () => {
    if (step === 0)
      return (
        form.childFirstName &&
        form.childSurname1 &&
        form.childDOB &&
        form.childGroup &&
        form.germanSpeakingParent
      )
    if (step === 1)
      return (
        form.parent1FirstName &&
        form.parent1Surname1 &&
        form.parent1Email &&
        form.parent1Phone &&
        form.addressStreet &&
        form.city
      )
    if (step === 2) return form.accountHolder && form.sepaConsent
    if (step === 3)
      return !sigRef.current?.isEmpty() && form.enrollmentFeeConsent && form.legalConsent
    return true
  }

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const next = () => {
    if (!validateStep()) {
      setError(
        'Bitte alle Pflichtfelder ausfüllen. / Por favor, rellena todos los campos obligatorios.'
      )
      return
    }
    setError('')
    if (step === 3) {
      const dataUrl = sigRef.current!.getTrimmedCanvas().toDataURL('image/png')
      setForm((f) => ({ ...f, signatureDataUrl: dataUrl }))
    }
    setStep((s) => s + 1)
    scrollToTop()
  }

  const back = () => {
    setError('')
    setStep((s) => s - 1)
    scrollToTop()
  }

  const submit = async () => {
    // Honeypot check
    if (form._trap) return

    if (!stripe || !elements) return
    setSubmitting(true)
    setError('')
    try {
      const setupRes = await fetch('/api/nordkreis/create-setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.parent1FirstName} ${form.parent1Surname1}`.trim(),
          email: form.parent1Email,
        }),
      })
      const { clientSecret, customerId } = await setupRes.json()
      if (!clientSecret) throw new Error('Setup konnte nicht initialisiert werden.')

      const { setupIntent, error: stripeError } = await stripe.confirmSepaDebitSetup(clientSecret, {
        payment_method: {
          sepa_debit: elements.getElement(IbanElement)!,
          billing_details: { name: form.accountHolder, email: form.parent1Email },
        },
      })
      if (stripeError) throw new Error(stripeError.message)

      const enrollRes = await fetch('/api/nordkreis/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthlyAmount: MONTHLY_AMOUNT,
          enrollmentFee: true,
          stripeCustomerId: customerId,
          stripePaymentMethodId: setupIntent!.payment_method,
        }),
      })
      const data = await enrollRes.json()
      if (!enrollRes.ok) throw new Error(data.error || 'Anmeldung fehlgeschlagen.')

      router.push(
        `/nordkreis/success?name=${encodeURIComponent(form.parent1FirstName)}&email=${encodeURIComponent(form.parent1Email)}`
      )
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ein Fehler ist aufgetreten.')
    } finally {
      setSubmitting(false)
    }
  }

  const dateStr = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const childFullName = [form.childFirstName, form.childSurname1, form.childSurname2]
    .filter(Boolean)
    .join(' ')

  return (
    <main
      ref={topRef}
      className="mx-auto max-w-2xl space-y-8 px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]"
    >
      {/* Header */}
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis"
            width={80}
            height={80}
            className="block dark:hidden"
          />
          <Image
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis"
            width={80}
            height={80}
            className="hidden dark:block"
          />
        </div>
        <h1 className="text-4xl" style={{ letterSpacing: '-0.04em' }}>
          <span className="font-[400]">Einschreibung</span>
        </h1>
        <p className="mt-2 text-lg font-semibold text-[#B3475A]">Warteliste · Lista de espera</p>
        <p className="mt-2 text-sm text-[#081C3C]/70 dark:text-[#F4EFE8]/70">
          Nordkreis · Deutsche Gemeinschaft & Samstagsschule · Barcelona
        </p>
      </div>

      {/* Step indicators */}
      <div className="relative flex items-center justify-between">
        <div className="absolute top-4 right-4 left-4 h-px bg-[#9A8F85]/30" />
        {STEPS.map((label, i) => (
          <StepDot key={label} label={label} index={i} current={step} />
        ))}
      </div>

      {/* Honeypot — invisible to humans, bots will fill it */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" value={form._trap} onChange={set('_trap')} />
      </div>

      <SectionCard surface={step % 2 === 1}>
        {/* STEP 0 – Kind */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#081C3C] dark:text-[#F4EFE8]">
                Kind / Niño·a
              </h2>
              <p className="mt-1 text-sm text-[#9A8F85]">Angaben zum Kind, das teilnehmen soll</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Vorname" sublabel="Nombre" required>
                <Input
                  placeholder="Emma"
                  value={form.childFirstName}
                  onChange={set('childFirstName')}
                />
              </Field>
              <Field label="1. Nachname" sublabel="1.er apellido" required>
                <Input
                  placeholder="Müller"
                  value={form.childSurname1}
                  onChange={set('childSurname1')}
                />
              </Field>
              <Field label="2. Nachname" sublabel="2.º apellido">
                <Input
                  placeholder="García"
                  value={form.childSurname2}
                  onChange={set('childSurname2')}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Geburtsdatum" sublabel="Fecha de nacimiento" required>
                <Input type="date" value={form.childDOB} onChange={set('childDOB')} />
              </Field>
              <Field label="Schuljahr" sublabel="Curso escolar">
                <Sel value={form.schoolYear} onChange={set('schoolYear')}>
                  <option value="">— Schuljahr / Curso —</option>
                  {SCHOOL_YEARS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </Sel>
              </Field>
            </div>

            <Field label="Gruppe" sublabel="Grupo" required>
              <div className="space-y-2">
                {GROUPS.map((g) => (
                  // eslint-disable-next-line jsx-a11y/label-has-associated-control
                  <label
                    key={g.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-all ${form.childGroup === g.value ? 'border-[#B3475A] bg-[#B3475A]/5' : 'border-[#9A8F85]/40 hover:border-[#9A8F85]/70'}`}
                  >
                    <input
                      type="radio"
                      name="childGroup"
                      aria-label={g.label}
                      className="mt-0.5 accent-[#B3475A]"
                      checked={form.childGroup === g.value}
                      onChange={() => setForm((f) => ({ ...f, childGroup: g.value }))}
                    />
                    <div>
                      <span className="text-sm font-medium text-[#081C3C] dark:text-[#F4EFE8]">
                        {g.label}
                      </span>
                      <span className="ml-2 text-xs text-[#9A8F85]">45 €/Monat</span>
                      <p className="mt-0.5 text-xs text-[#9A8F85]">{g.sublabel} · 45 €/mes</p>
                    </div>
                  </label>
                ))}
              </div>
            </Field>

            <Field
              label="Deutschsprechender Elternteil"
              sublabel="Padre o madre germanohablante"
              required
            >
              <div className="grid grid-cols-2 gap-2">
                {GERMAN_SPEAKER_OPTIONS.map((o) => (
                  // eslint-disable-next-line jsx-a11y/label-has-associated-control
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 transition-all ${form.germanSpeakingParent === o.value ? 'border-[#B3475A] bg-[#B3475A]/5' : 'border-[#9A8F85]/40 hover:border-[#9A8F85]/70'}`}
                  >
                    <input
                      type="radio"
                      name="germanSpeaker"
                      aria-label={o.labelDE}
                      className="accent-[#B3475A]"
                      checked={form.germanSpeakingParent === o.value}
                      onChange={() => setForm((f) => ({ ...f, germanSpeakingParent: o.value }))}
                    />
                    <div>
                      <span className="text-sm text-[#081C3C] dark:text-[#F4EFE8]">
                        {o.labelDE}
                      </span>
                      <span className="block text-xs text-[#9A8F85]">{o.labelES}</span>
                    </div>
                  </label>
                ))}
              </div>
            </Field>

            <Field
              label="Medizinische Hinweise"
              sublabel="Información médica y alergias"
              hint="Allergien, Unverträglichkeiten, wichtige Hinweise / Alergias, intolerancias, información importante"
            >
              <Textarea
                rows={2}
                placeholder="z.B. Nussallergie / p.ej. alergia a frutos secos"
                value={form.medicalAllergies}
                onChange={set('medicalAllergies')}
              />
            </Field>
          </div>
        )}

        {/* STEP 1 – Eltern */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#081C3C] dark:text-[#F4EFE8]">
                Eltern / Padres
              </h2>
              <p className="mt-1 text-sm text-[#9A8F85]">
                Angaben der Erziehungsberechtigten · Datos de los padres o tutores
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold tracking-wide text-[#9A8F85] uppercase">
                Elternteil 1 / Padre o madre 1
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Vorname" sublabel="Nombre" required>
                  <Input
                    placeholder="Klaus"
                    value={form.parent1FirstName}
                    onChange={set('parent1FirstName')}
                  />
                </Field>
                <Field label="1. Nachname" sublabel="1.er apellido" required>
                  <Input
                    placeholder="Müller"
                    value={form.parent1Surname1}
                    onChange={set('parent1Surname1')}
                  />
                </Field>
                <Field label="2. Nachname" sublabel="2.º apellido">
                  <Input
                    placeholder="García"
                    value={form.parent1Surname2}
                    onChange={set('parent1Surname2')}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="E-Mail" required>
                  <Input
                    type="email"
                    placeholder="correo@email.com"
                    value={form.parent1Email}
                    onChange={set('parent1Email')}
                  />
                </Field>
                <Field label="Telefon / Teléfono" required>
                  <Input
                    type="tel"
                    placeholder="+34 612 345 678"
                    value={form.parent1Phone}
                    onChange={set('parent1Phone')}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#9A8F85]/30 pt-5">
              <p className="text-xs font-bold tracking-wide text-[#9A8F85] uppercase">
                Elternteil 2 / Padre o madre 2 (optional)
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Vorname" sublabel="Nombre">
                  <Input
                    placeholder="María"
                    value={form.parent2FirstName}
                    onChange={set('parent2FirstName')}
                  />
                </Field>
                <Field label="1. Nachname" sublabel="1.er apellido">
                  <Input
                    placeholder="García"
                    value={form.parent2Surname1}
                    onChange={set('parent2Surname1')}
                  />
                </Field>
                <Field label="2. Nachname" sublabel="2.º apellido">
                  <Input
                    placeholder="López"
                    value={form.parent2Surname2}
                    onChange={set('parent2Surname2')}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="E-Mail">
                  <Input
                    type="email"
                    placeholder="correo@email.com"
                    value={form.parent2Email}
                    onChange={set('parent2Email')}
                  />
                </Field>
                <Field label="Telefon / Teléfono">
                  <Input
                    type="tel"
                    placeholder="+34 …"
                    value={form.parent2Phone}
                    onChange={set('parent2Phone')}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#9A8F85]/30 pt-5">
              <p className="text-xs font-bold tracking-wide text-[#9A8F85] uppercase">
                Adresse / Dirección
              </p>
              <Field label="Straße und Hausnummer / Calle y número" required>
                <Input
                  placeholder="Carrer de la Providència 47"
                  value={form.addressStreet}
                  onChange={set('addressStreet')}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stadt / Ciudad" required>
                  <Input placeholder="Barcelona" value={form.city} onChange={set('city')} />
                </Field>
                <Field label="Postleitzahl / Código postal">
                  <Input placeholder="08024" value={form.postalCode} onChange={set('postalCode')} />
                </Field>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#9A8F85]/30 pt-5">
              <p className="text-xs font-bold tracking-wide text-[#9A8F85] uppercase">
                Notfallkontakt / Contacto de emergencia
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name / Nombre">
                  <Input
                    placeholder="Vollständiger Name"
                    value={form.emergencyContactName}
                    onChange={set('emergencyContactName')}
                  />
                </Field>
                <Field label="Telefon / Teléfono">
                  <Input
                    type="tel"
                    placeholder="+34 …"
                    value={form.emergencyContactPhone}
                    onChange={set('emergencyContactPhone')}
                  />
                </Field>
              </div>
            </div>

            <Field label="Weitere Anmerkungen / Notas adicionales">
              <Textarea
                rows={3}
                placeholder="Sonstiges, Fragen, besondere Wünsche... / Otras observaciones, preguntas..."
                value={form.additionalNotes}
                onChange={set('additionalNotes')}
              />
            </Field>
          </div>
        )}

        {/* STEP 2 – Zahlung — always mounted so IbanElement stays in DOM */}
        <div className={step === 2 ? undefined : 'hidden'}>
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#081C3C] dark:text-[#F4EFE8]">
                Zahlungsermächtigung
              </h2>
              <p className="mt-1 text-sm text-[#9A8F85]">Mandato de adeudo SEPA</p>
            </div>

            <div className="space-y-1 rounded-xl bg-[#081C3C]/5 p-4 text-sm leading-relaxed text-[#081C3C]/80 dark:bg-[#F4EFE8]/5 dark:text-[#F4EFE8]/80">
              <p>
                <strong>Heute wird kein Betrag abgebucht.</strong> Hoy no se realiza ningún cargo.
              </p>
              <p className="text-xs text-[#9A8F85]">
                Monatsbeitrag / Cuota mensual: <strong>45 €</strong> × 10 Monate/meses = 450 €<br />
                Einschreibegebühr / Matrícula: <strong>60 €</strong> (einmalig / pago único)
                <br />
                Gesamtbetrag / Importe total: <strong>510 €</strong>
              </p>
            </div>

            <Field
              label="Kontoinhaber / Titular de la cuenta"
              required
              hint="Wie auf dem Bankkonto angegeben / Como figura en la cuenta bancaria"
            >
              <Input
                placeholder="Klaus Müller García"
                value={form.accountHolder}
                onChange={set('accountHolder')}
              />
            </Field>

            <Field
              label="IBAN"
              required
              hint="Sicher verarbeitet durch Stripe · Nordkreis sieht Deine vollständige IBAN nicht"
            >
              <div className="rounded-lg border border-[#9A8F85]/50 bg-white px-3 py-3 transition-all focus-within:border-[#B3475A] focus-within:ring-2 focus-within:ring-[#B3475A]/20 dark:border-[#9A8F85]/40 dark:bg-[#081C3C]">
                <IbanElement
                  options={{
                    supportedCountries: ['SEPA'],
                    placeholderCountry: 'DE',
                    style: {
                      base: {
                        color: '#081C3C',
                        fontSize: '14px',
                        fontFamily: "'Noto Sans', sans-serif",
                        '::placeholder': { color: '#9A8F85' },
                      },
                      invalid: { color: '#B3475A' },
                    },
                  }}
                />
              </div>
              <p className="flex items-center gap-1 text-xs text-[#9A8F85]">
                🔒 Gesichert durch Stripe
              </p>
            </Field>

            <ConsentBox
              checked={form.sepaConsent}
              onChange={(v) => setForm((f) => ({ ...f, sepaConsent: v }))}
            >
              <span className="font-semibold text-[#081C3C] dark:text-[#F4EFE8]">
                SEPA-Lastschriftmandat / Mandato de adeudo SEPA *
              </span>
              <br />
              Ich ermächtige Nordkreis, Zahlungen von meinem Konto einzuziehen, sobald der Kurs per
              E-Mail bestätigt wird: 45 €/Monat für 10 Monate sowie einmalig 60 € Einschreibegebühr.
              Ich habe das Recht auf Erstattung innerhalb von 8 Wochen ab Abbuchungsdatum.
              <br />
              <span className="mt-1 block text-[#9A8F85]">
                Autorizo a Nordkreis a cargar en mi cuenta, una vez confirmado el curso por correo
                electrónico: 45 €/mes durante 10 meses y 60 € de matrícula (pago único). Derecho a
                devolución en 8 semanas.
              </span>
            </ConsentBox>
          </div>
        </div>

        {/* STEP 3 – Unterschrift */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#081C3C] dark:text-[#F4EFE8]">
                Unterschrift / Firma
              </h2>
              <p className="mt-1 text-sm text-[#9A8F85]">
                Bitte alle Punkte bestätigen und unterschreiben · Confirma todos los puntos y firma
              </p>
            </div>

            {/* Enrollment fee consent */}
            <ConsentBox
              checked={form.enrollmentFeeConsent}
              onChange={(v) => setForm((f) => ({ ...f, enrollmentFeeConsent: v }))}
            >
              <span className="font-semibold text-[#081C3C] dark:text-[#F4EFE8]">
                Einschreibegebühr / Matrícula *
              </span>
              <br />
              Ich bestätige, dass ich die einmalige Einschreibegebühr von 60 € zur Kenntnis genommen
              habe. Diese wird vor der ersten Monatsabbuchung per E-Mail in Rechnung gestellt.
              <br />
              <span className="mt-1 block text-[#9A8F85]">
                Confirmo haber tomado nota de la matrícula única de 60 €, que se facturará por
                correo electrónico antes del primer cargo mensual.
              </span>
            </ConsentBox>

            {/* Legal consent */}
            <ConsentBox
              checked={form.legalConsent}
              onChange={(v) => setForm((f) => ({ ...f, legalConsent: v }))}
            >
              <span className="font-semibold text-[#081C3C] dark:text-[#F4EFE8]">
                Datenschutz & Teilnahmebedingungen / Protección de datos y condiciones *
              </span>
              <br />
              Ich habe die{' '}
              <a
                href="/nordkreis/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#B3475A] underline hover:text-[#9f3f50]"
              >
                Teilnahmebedingungen
              </a>{' '}
              gelesen und stimme ihnen zu. Ich bin damit einverstanden, dass meine personenbezogenen
              Daten gemäß der DSGVO ausschließlich zur Kursverwaltung verarbeitet werden.
              Kündigungen sind mit einer Frist von mindestens 7 Tagen nach der Kursbestätigung per
              E-Mail an nordkreis@linguatash.com möglich.
              <br />
              <span className="mt-1 block text-[#9A8F85]">
                He leído y acepto las{' '}
                <a
                  href="/nordkreis/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B3475A] underline"
                >
                  condiciones de participación
                </a>
                . Consiento el tratamiento de mis datos personales conforme al RGPD. Las
                cancelaciones deben notificarse con al menos 7 días de antelación a
                nordkreis@linguatash.com.
              </span>
            </ConsentBox>

            {/* Signature pad */}
            <Field
              label="Unterschrift des Erziehungsberechtigten / Firma del padre, madre o tutor"
              required
            >
              <div className="overflow-hidden rounded-xl border-2 border-dashed border-[#9A8F85]/50 bg-white dark:bg-[#081C3C]/50">
                <SignaturePad
                  ref={sigRef}
                  canvasProps={{ className: 'w-full', height: 180 }}
                  penColor="#081C3C"
                />
              </div>
              <button
                onClick={() => sigRef.current?.clear()}
                className="mt-1 text-xs text-[#9A8F85] underline transition-colors hover:text-[#B3475A]"
              >
                Unterschrift löschen / Borrar firma
              </button>
            </Field>
            <p className="text-xs text-[#9A8F85]">Datum / Fecha: {dateStr}</p>
          </div>
        )}

        {/* STEP 4 – Übersicht */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#081C3C] dark:text-[#F4EFE8]">
                Übersicht / Resumen
              </h2>
              <p className="mt-1 text-sm text-[#9A8F85]">
                Bitte alle Angaben vor dem Absenden prüfen · Revisa todos los datos antes de enviar
              </p>
            </div>
            <div className="space-y-0.5">
              <ReviewRow label="Kind / Niño·a" value={childFullName} />
              <ReviewRow label="Geburtsdatum / F. nacimiento" value={form.childDOB} />
              <ReviewRow label="Schuljahr / Curso" value={form.schoolYear} />
              <ReviewRow label="Gruppe / Grupo" value={form.childGroup} />
              <ReviewRow label="Deutschspr. Elternteil" value={form.germanSpeakingParent} />
              <ReviewRow
                label="Elternteil 1 / Padre·madre 1"
                value={[form.parent1FirstName, form.parent1Surname1, form.parent1Surname2]
                  .filter(Boolean)
                  .join(' ')}
              />
              <ReviewRow label="E-Mail" value={form.parent1Email} />
              <ReviewRow label="Telefon / Teléfono" value={form.parent1Phone} />
              {form.parent2FirstName && (
                <ReviewRow
                  label="Elternteil 2 / Padre·madre 2"
                  value={[form.parent2FirstName, form.parent2Surname1, form.parent2Surname2]
                    .filter(Boolean)
                    .join(' ')}
                />
              )}
              <ReviewRow
                label="Adresse / Dirección"
                value={`${form.addressStreet}, ${form.city} ${form.postalCode}`}
              />
              {form.emergencyContactName && (
                <ReviewRow
                  label="Notfallkontakt / Emergencia"
                  value={`${form.emergencyContactName} · ${form.emergencyContactPhone}`}
                />
              )}
              <ReviewRow
                label="Monatsbeitrag / Cuota mensual"
                value="45 € × 10 Monate/meses = 450 €"
              />
              <ReviewRow
                label="Einschreibegebühr / Matrícula"
                value="60 € (einmalig / pago único)"
              />
              <ReviewRow label="Gesamtbetrag / Total" value="510 €" />
              <ReviewRow label="Kontoinhaber / Titular" value={form.accountHolder} />
            </div>
            {form.signatureDataUrl && (
              <div>
                <p className="mb-1 text-xs text-[#9A8F85]">Unterschrift / Firma</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.signatureDataUrl}
                  alt="Unterschrift"
                  className="h-14 rounded-lg border border-[#9A8F85]/30 bg-white p-2"
                />
              </div>
            )}
            <div className="rounded-xl border border-[#9A8F85]/30 bg-[#081C3C]/5 p-4 text-xs leading-relaxed text-[#081C3C]/80 dark:bg-[#F4EFE8]/5 dark:text-[#F4EFE8]/80">
              Mit dem Absenden bestätigst Du alle obigen Angaben. Ein unterzeichnetes
              Vertragsexemplar wird an <strong>{form.parent1Email}</strong> gesendet.{' '}
              <strong>Es wird heute kein Betrag abgebucht.</strong>
              <br />
              <span className="text-[#9A8F85]">
                Al enviar, confirmas todos los datos anteriores. Se enviará una copia firmada del
                contrato a {form.parent1Email}. Hoy no se realiza ningún cargo.
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-[#B3475A]/10 px-3 py-2 text-sm text-[#B3475A]">
            {error}
          </p>
        )}

        <div className="mt-8 flex justify-between">
          {step > 0 ? (
            <button
              onClick={back}
              className="rounded-xl border border-[#9A8F85]/50 px-5 py-2.5 text-sm text-[#9A8F85] transition-all hover:border-[#081C3C] hover:text-[#081C3C] dark:hover:border-[#F4EFE8] dark:hover:text-[#F4EFE8]"
            >
              ← Zurück
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button
              onClick={next}
              className="rounded-xl bg-[#081C3C] px-6 py-2.5 text-sm font-semibold text-[#F4EFE8] shadow-sm transition-all hover:bg-[#B3475A] dark:bg-[#F4EFE8] dark:text-[#081C3C] dark:hover:bg-[#B3475A] dark:hover:text-[#F4EFE8]"
            >
              Weiter →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting || !stripe}
              className="rounded-xl bg-[#B3475A] px-6 py-2.5 text-sm font-semibold text-[#F4EFE8] shadow-sm transition-all hover:bg-[#9f3f50] disabled:opacity-60"
            >
              {submitting ? 'Wird gesendet…' : 'Absenden & Vertrag senden'}
            </button>
          )}
        </div>
      </SectionCard>

      <p className="text-center text-xs text-[#9A8F85]">
        Nordkreis · Zahlungen gesichert durch Stripe
      </p>
    </main>
  )
}

export default function NordkreisEnrollPage() {
  return (
    <Elements stripe={stripePromise}>
      <EnrollForm />
    </Elements>
  )
}
