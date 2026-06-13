export default function PoliticaPrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 font-['Noto_Sans'] text-gray-900 dark:text-gray-100">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">Política de Privacidad</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Última actualización: 12.06.2026
        </p>
      </header>

      <article className="space-y-8 text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            1. Introducción
          </h2>
          <p>
            La protección de sus datos personales es muy importante para nosotros. Esta Política de
            Privacidad explica cómo se recopilan, procesan y protegen los datos cuando visita este
            sitio web.
          </p>
          <p>
            {/* TODO: Add NIF once available (expected July 2026) — required under Spanish law */}
          Este sitio web es operado por: Tash Tenner, Barcelona, España. Correo electrónico:
            info@linguatash.com
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">2. Alcance</h2>
          <p>
            Esta Política de Privacidad se aplica a todos los datos personales procesados a través
            de este sitio web, incluidos los datos anónimos recopilados mediante analíticas y
            cualquier interacción futura (como boletines, reservas o compras).
          </p>
          <p>
            Usuarios internacionales: Al utilizar nuestros servicios y proporcionar información,
            usted reconoce que sus datos personales pueden ser procesados en España y en la Unión
            Europea. Se aplican las normas del GDPR.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            3. Datos que recopilamos
          </h2>
          <p>Recopilamos dos tipos de datos:</p>
          <p className="font-medium">Datos anónimos (analíticas)</p>
          <p>A través de Umami Cloud Analytics, sin cookies ni identificadores personales:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Visitas a páginas (número de visitas, páginas visitadas)</li>
            <li>Tipo y versión del navegador</li>
            <li>Sistema operativo</li>
            <li>URL de referencia</li>
            <li>Fecha y hora de acceso</li>
          </ul>
          <p className="font-medium">Datos personales (formulario de lista de espera)</p>
          <p>Cuando se suscribe a nuestra lista de espera o boletín, recopilamos:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Dirección de correo electrónico</li>
            <li>Proyectos de interés seleccionados (opcional)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            4. Finalidad del procesamiento de datos
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Monitorizar y mejorar el rendimiento del sitio web</li>
            <li>Garantizar que el sitio web sea seguro y funcional</li>
            <li>Proporcionar información sobre crianza multilingüe y aprendizaje de idiomas</li>
            <li>
              Enviar comunicaciones, novedades y actualizaciones sobre los proyectos y servicios de
              LinguaTash a quienes se hayan suscrito voluntariamente
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            5. Base legal para el procesamiento
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Art. 6(1)(f) GDPR – interés legítimo</li>
            <li>Art. 6(1)(a) GDPR – consentimiento</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            6. Boletín y lista de espera — Kit (ConvertKit)
          </h2>
          <p>
            Si se suscribe a nuestra lista de espera o boletín, su dirección de correo electrónico y
            los proyectos de interés seleccionados se transmiten a Kit (ConvertKit, Inc.), proveedor
            externo de servicios de email marketing con sede en Estados Unidos.
          </p>
          <p>
            Kit actúa como encargado del tratamiento de datos en nuestro nombre. La transferencia de
            datos a Estados Unidos se realiza al amparo de las Cláusulas Contractuales Tipo
            aprobadas por la Comisión Europea, lo que garantiza un nivel de protección adecuado
            conforme al GDPR.
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <span className="font-medium">Base legal:</span> consentimiento explícito del usuario
              (Art. 6(1)(a) GDPR)
            </li>
            <li>
              <span className="font-medium">Finalidad:</span> envío de novedades, actualizaciones y
              comunicaciones relacionadas con los proyectos de LinguaTash
            </li>
            <li>
              <span className="font-medium">Retirada del consentimiento:</span> puede darse de baja
              en cualquier momento haciendo clic en el enlace de cancelación incluido en cada
              correo, o escribiendo a info@linguatash.com
            </li>
          </ul>
          <p>
            Más información sobre la política de privacidad de Kit en:{' '}
            <a
              href="https://kit.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-[#B3475A]"
            >
              kit.com/privacy
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            7. Pagos — Stripe
          </h2>
          <p>
            Los pagos realizados a través de este sitio web son procesados por Stripe, Inc.,
            proveedor externo de servicios de pago con sede en Estados Unidos. LinguaTash no
            almacena ni tiene acceso a los datos completos de su tarjeta bancaria o cuenta.
          </p>
          <p>En el proceso de pago, Stripe puede recopilar y tratar datos como:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Nombre del titular de la cuenta</li>
            <li>Datos bancarios (IBAN, tarjeta) — gestionados directamente por Stripe</li>
            <li>Dirección de correo electrónico</li>
            <li>Dirección de facturación</li>
          </ul>
          <p>
            La transferencia de datos a Estados Unidos se realiza al amparo de las Cláusulas
            Contractuales Tipo aprobadas por la Comisión Europea. Stripe cumple con el estándar PCI
            DSS para la seguridad de datos de pago.
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <span className="font-medium">Base legal:</span> ejecución de un contrato (Art.
              6(1)(b) GDPR)
            </li>
            <li>
              <span className="font-medium">Finalidad:</span> procesamiento seguro de pagos y
              gestión de mandatos de domiciliación SEPA
            </li>
          </ul>
          <p>
            Más información sobre la política de privacidad de Stripe en:{' '}
            <a
              href="https://stripe.com/es/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-[#B3475A]"
            >
              stripe.com/es/privacy
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            8. Flujos automatizados de mensajería en redes sociales
          </h2>
          <p>
            LinguaTash opera flujos automatizados en Instagram, Facebook y WhatsApp. Cuando ustedes
            comentan o envían una palabra clave específica (por ejemplo, HAFEN o AUDIO), el sistema
            reconoce esa palabra, les envía el recurso gratuito correspondiente y registra la
            interacción.
          </p>
          <p className="font-medium">Datos que procesamos</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Identificador de usuario y nombre de usuario en la plataforma donde interactúan.</li>
            <li>Contenido del comentario o mensaje que activó el flujo.</li>
            <li>
              Fecha y hora de la interacción, necesaria para cumplir las ventanas de mensajería de
              cada plataforma.
            </li>
            <li>
              Registro de la palabra clave activada y si el recurso fue enviado correctamente.
            </li>
            <li>Si optan por recibir correos electrónicos: su dirección de correo electrónico.</li>
          </ul>
          <p>
            No procesamos datos de ubicación, cookies ni ninguna otra categoría no mencionada aquí.
          </p>
          <p className="font-medium">Base jurídica</p>
          <p>
            El envío del recurso y el registro de la interacción se basan en nuestro interés
            legítimo (Art. 6(1)(f) GDPR) en responder a una solicitud que ustedes iniciaron
            voluntariamente. Si optan por suscribirse a nuestra lista de correo, el tratamiento de
            su dirección de correo se basa en su consentimiento expreso (Art. 6(1)(a) GDPR), que
            pueden retirar en cualquier momento.
          </p>
          <p className="font-medium">Proveedores de servicios</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <span className="font-medium">Meta Platforms Ireland Ltd.</span> (Instagram, Facebook,
              WhatsApp): plataformas a través de las cuales se produce la interacción.
            </li>
            <li>
              <span className="font-medium">MongoDB Atlas:</span> almacenamiento de los registros de
              interacción en una región de la Unión Europea.
            </li>
            <li>
              <span className="font-medium">Kit (ConvertKit):</span> gestión del correo electrónico
              si optan por suscribirse. La transferencia de datos se realiza conforme a lo indicado
              en el apartado 6.
            </li>
          </ul>
          <p className="font-medium">Plazo de conservación</p>
          <p>
            Los registros de interacción se conservan durante 12 meses desde la fecha de la
            interacción. Si optan por suscribirse a la lista de correo, su dirección de correo se
            gestiona conforme a lo indicado en el apartado 6.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            9. Contacto por correo electrónico
          </h2>
          <p>
            Si nos contacta por correo electrónico, los datos personales proporcionados se
            almacenarán únicamente para responder a su consulta y no se compartirán sin su
            consentimiento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            10. Cookies y analíticas
          </h2>
          <p>
            Este sitio web utiliza Umami Cloud Analytics, que es sin cookies y anónimo. No se
            recopilan datos personales ni se establecen cookies de seguimiento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            11. Alojamiento
          </h2>
          <p>
            El sitio web está alojado en Vercel, que puede registrar datos técnicos de acceso con
            fines de seguridad y mantenimiento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            12. Derechos de los usuarios
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Acceder a sus datos personales</li>
            <li>Rectificar datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Restringir el procesamiento</li>
            <li>Oponerse al procesamiento</li>
            <li>Portabilidad de datos</li>
            <li>Retirar su consentimiento en cualquier momento</li>
          </ul>
          <p>
            Puede presentar una reclamación ante la Agencia Española de Protección de Datos
            (www.aepd.es).
          </p>
          <p>Para ejercer sus derechos: info@linguatash.com</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            13. Seguridad de los datos
          </h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger los datos contra accesos no
            autorizados, pérdidas o usos indebidos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            14. Cambios en esta Política
          </h2>
          <p>
            Esta Política de Privacidad puede actualizarse para reflejar cambios legales o en los
            servicios. La versión más reciente siempre estará disponible en este sitio web.
          </p>
        </section>
      </article>
    </main>
  )
}
