// app/nordkreis/teilnahmebedingungen/page.tsx
// Nordkreis — Teilnahmebedingungen / Condiciones de participación

import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Terms & Conditions · Nordkreis',
  description: 'Teilnahmebedingungen und Datenschutzhinweise für Nordkreis Barcelona',
}

const sections: { de: string; es: string; items: { de: string; es: string }[] }[] = [
  {
    de: '1. Kursbestätigung',
    es: '1. Confirmación del curso',
    items: [
      {
        de: 'Die Kursbestätigung erfolgt per E-Mail, sobald die Mindestteilnehmerzahl erreicht wurde. Bis zur Bestätigung gilt die Anmeldung als Wartelisteneintrag ohne rechtliche Verbindlichkeit.',
        es: 'La confirmación del curso se realizará por correo electrónico una vez alcanzado el número mínimo de participantes. Hasta la confirmación, la inscripción se considera una reserva en lista de espera sin carácter vinculante.',
      },
    ],
  },
  {
    de: '2. Beiträge und Zahlungen',
    es: '2. Cuotas y pagos',
    items: [
      {
        de: 'Der Monatsbeitrag beträgt 45 € pro Kind und Monat über eine Laufzeit von 10 Monaten. Hinzu kommt eine einmalige Einschreibegebühr von 60 €.',
        es: 'La cuota mensual es de 45 € por niño al mes durante un período de 10 meses. A esto se añade una matrícula única de 60 €.',
      },
      {
        de: 'Sämtliche Beträge werden erst nach der E-Mail-Kursbestätigung durch Nordkreis per SEPA-Lastschrift eingezogen. Heute wird kein Betrag abgebucht.',
        es: 'Todos los importes se cobrarán mediante adeudo directo SEPA únicamente después de la confirmación del curso por correo electrónico. Hoy no se realiza ningún cargo.',
      },
      {
        de: 'Die Einschreibegebühr wird vor der ersten Monatsabbuchung separat in Rechnung gestellt. Jeden Monat erhältst Du per E-Mail eine PDF-Rechnung über den monatlichen Beitrag.',
        es: 'La matrícula se facturará por separado antes del primer cargo mensual. Cada mes recibirás por correo electrónico una factura en PDF correspondiente a la cuota mensual.',
      },
    ],
  },
  {
    de: '3. Kündigung und Rücktritt',
    es: '3. Cancelación y desistimiento',
    items: [
      {
        de: 'Nach der E-Mail-Kursbestätigung kann dieser Vertrag mit einer Frist von mindestens 7 Tagen schriftlich per E-Mail an nordkreis@linguatash.com gekündigt werden.',
        es: 'Tras la confirmación del curso por correo electrónico, este contrato puede rescindirse por escrito mediante correo electrónico a nordkreis@linguatash.com con un preaviso mínimo de 7 días.',
      },
      {
        de: 'Bei Kündigung mit weniger als 7 Tagen Vorlauf nach der Kursbestätigung kann eine Stornogebühr in Höhe einer Monatsrate (45 €) anfallen.',
        es: 'En caso de cancelación con menos de 7 días de antelación tras la confirmación del curso, podrá aplicarse una penalización equivalente a una mensualidad (45 €).',
      },
      {
        de: 'Das Recht auf Erstattung bei SEPA-Lastschriften besteht innerhalb von 8 Wochen ab dem Abbuchungsdatum gemäß dem SEPA Core Direct Debit Scheme.',
        es: 'El derecho a devolución de adeudos SEPA puede ejercerse en un plazo de 8 semanas desde la fecha del cargo, conforme al esquema SEPA Core.',
      },
    ],
  },
  {
    de: '4. Absage oder Verschiebung durch Nordkreis',
    es: '4. Cancelación o aplazamiento por parte de Nordkreis',
    items: [
      {
        de: 'Nordkreis behält sich das Recht vor, Kurse abzusagen oder zu verschieben, insbesondere wenn die Mindestteilnehmerzahl nicht erreicht wird oder außergewöhnliche Umstände vorliegen.',
        es: 'Nordkreis se reserva el derecho de cancelar o posponer los cursos, especialmente si no se alcanza el número mínimo de participantes o concurren circunstancias extraordinarias.',
      },
      {
        de: 'In diesem Fall werden alle Zahlungsermächtigungen hinfällig und die Erziehungsberechtigten werden umgehend per E-Mail informiert. Es entstehen keinerlei Kosten.',
        es: 'En tal caso, todas las autorizaciones de pago quedarán sin efecto y los padres o tutores serán informados de inmediato por correo electrónico. No se generará ningún coste.',
      },
    ],
  },
  {
    de: '5. Datenschutz (DSGVO)',
    es: '5. Protección de datos (RGPD)',
    items: [
      {
        de: 'Die im Rahmen der Anmeldung erhobenen personenbezogenen Daten werden gemäß der Datenschutz-Grundverordnung (DSGVO) ausschließlich zur Verwaltung der Kursanmeldung verarbeitet und nicht an Dritte weitergegeben.',
        es: 'Los datos personales recabados durante el proceso de inscripción se tratarán conforme al Reglamento General de Protección de Datos (RGPD) exclusivamente para la gestión de la inscripción al curso, y no se cederán a terceros.',
      },
      {
        de: 'Verantwortliche für die Datenverarbeitung ist Natascha Tenner, erreichbar unter nordkreis@linguatash.com. Du hast das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch bezüglich Deiner gespeicherten Daten.',
        es: 'La responsable del tratamiento de datos es Natascha Tenner, contactable en nordkreis@linguatash.com. Tienes derecho de acceso, rectificación, supresión y oposición respecto a tus datos almacenados.',
      },
      {
        de: 'Du kannst Deine Einwilligung jederzeit widerrufen, indem Du Nordkreis unter nordkreis@linguatash.com kontaktierst.',
        es: 'Puedes revocar tu consentimiento en cualquier momento contactando a Nordkreis en nordkreis@linguatash.com.',
      },
    ],
  },
  {
    de: '6. Rechnungen',
    es: '6. Facturas',
    items: [
      {
        de: 'Du erhältst jeden Monat per E-Mail eine PDF-Rechnung über den monatlichen Beitrag. Die Rechnung über die Einschreibegebühr wird separat vor der ersten Monatsabbuchung zugesandt.',
        es: 'Recibirás mensualmente por correo electrónico una factura en PDF correspondiente a la cuota mensual. La factura de la matrícula se enviará por separado antes del primer cargo mensual.',
      },
    ],
  },
  {
    de: '7. SEPA-Lastschriftmandat',
    es: '7. Mandato de adeudo directo SEPA',
    items: [
      {
        de: 'Mit der Unterzeichnung des Anmeldevertrags erteilst Du Nordkreis (vertreten durch Natascha Tenner) die Erlaubnis, per SEPA-Lastschrift Zahlungen einzuziehen. Diese Erlaubnis gilt ausschließlich nach einer Kursbestätigung per E-Mail.',
        es: 'Al firmar el contrato de inscripción, autorizas a Nordkreis (representado por Natascha Tenner) a cobrar mediante adeudo directo SEPA. Esta autorización solo será válida tras la confirmación del curso por correo electrónico.',
      },
      {
        de: 'Die Zahlungen werden durch Stripe Payments Europe Ltd. abgewickelt. Nordkreis speichert Deine vollständige IBAN nicht; sie wird ausschließlich von Stripe verarbeitet.',
        es: 'Los pagos son gestionados por Stripe Payments Europe Ltd. Nordkreis no almacena tu IBAN completo; este es procesado exclusivamente por Stripe.',
      },
    ],
  },
  {
    de: '8. Verbindlichkeit des Vertrags',
    es: '8. Carácter vinculante del contrato',
    items: [
      {
        de: 'Der Anmeldevertrag wird mit der E-Mail-Kursbestätigung durch Nordkreis rechtsverbindlich. Es wird kein weiterer separater Vertrag ausgestellt. Der bei der Anmeldung unterzeichnete und per E-Mail zugesandte Vertrag ist das einzige rechtsverbindliche Dokument.',
        es: 'El contrato de inscripción adquiere carácter vinculante con la confirmación del curso por correo electrónico por parte de Nordkreis. No se emitirá ningún contrato adicional. El contrato firmado durante la inscripción y enviado por correo electrónico es el único documento con carácter vinculante.',
      },
    ],
  },
]

export default function TeilnahmebedingunungenPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-12 px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      {/* Header */}
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis"
            width={64}
            height={64}
            className="block dark:hidden"
          />
          <Image
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis"
            width={64}
            height={64}
            className="hidden dark:block"
          />
        </div>
        <h1
          className="text-3xl font-[400] text-[#081C3C] dark:text-[#F4EFE8]"
          style={{ letterSpacing: '-0.03em' }}
        >
          Teilnahmebedingungen
        </h1>
        <p className="mt-2 text-base font-semibold text-[#B3475A]">Condiciones de participación</p>
        <p className="mt-2 text-sm text-[#9A8F85]">
          Nordkreis · Deutsche Gemeinschaft & Samstagsschule · Barcelona
        </p>
      </div>

      {/* Intro */}
      <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-8 dark:bg-[#081C3C]">
        <p className="text-sm leading-relaxed text-[#081C3C]/80 dark:text-[#F4EFE8]/80">
          Diese Teilnahmebedingungen gelten für alle Anmeldungen bei Nordkreis. Mit der
          Unterzeichnung des Anmeldevertrags erkennst Du diese Bedingungen an.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-[#9A8F85]">
          Estas condiciones de participación se aplican a todas las inscripciones en Nordkreis. Al
          firmar el contrato de inscripción, aceptas estas condiciones.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.de}
            className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-6 dark:bg-[#081C3C]"
          >
            <h2 className="mb-4 text-lg font-semibold text-[#081C3C] dark:text-[#F4EFE8]">
              {section.de}
              <span className="ml-2 text-sm font-normal text-[#9A8F85]">/ {section.es}</span>
            </h2>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i}>
                  <p className="text-sm leading-relaxed text-[#081C3C] dark:text-[#F4EFE8]">
                    {item.de}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#9A8F85]">{item.es}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-8 text-center dark:bg-[#081C3C]">
        <p className="text-sm text-[#081C3C]/80 dark:text-[#F4EFE8]/80">
          Fragen zu diesen Bedingungen? Schreib uns an{' '}
          <a
            href="mailto:nordkreis@linguatash.com"
            className="font-semibold text-[#B3475A] hover:underline"
          >
            nordkreis@linguatash.com
          </a>
        </p>
        <p className="mt-2 text-xs text-[#9A8F85]">
          ¿Preguntas sobre estas condiciones? Escríbenos a{' '}
          <a href="mailto:nordkreis@linguatash.com" className="text-[#B3475A] hover:underline">
            nordkreis@linguatash.com
          </a>
        </p>
        <div className="mt-6">
          <Link
            href="/nordkreis/enroll"
            className="inline-block rounded-xl bg-[#B3475A] px-6 py-2.5 text-sm font-semibold text-[#F4EFE8] transition-all hover:bg-[#9f3f50]"
          >
            Zur Anmeldung / Inscribirse →
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-[#9A8F85]">
        Stand / Versión:{' '}
        {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
      </p>
    </main>
  )
}
