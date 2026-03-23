/**
 * verifactu-test.ts  v3
 * Tests para verifacturapi.com con payload correcto
 *
 * Endpoints confirmados:
 *   GET  /api/v1/verifactu/test-connection
 *   GET  /api/v1/user
 *   GET  /api/v1/verifactu/list
 *   POST /api/v1/verifactu/create
 *   POST /api/v1/verifactu/cancel
 *
 * Uso: npx tsx verifactu-test.ts
 */

const API_BASE = 'https://verifacturapi.com/api/v1'
const API_KEY =
  process.env.VERIFACTU_API_KEY ?? '15|KyaJGAxoi3JGKX3OTLz6ebfpozCm0tK49YflSJPB4d1a92d3'
const NIF = process.env.VERIFACTU_NIF ?? 'Y4279128S'

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

async function req(method: string, path: string, body?: unknown) {
  const url = `${API_BASE}${path}`
  console.log(`\n→ ${method} ${url}`)
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'follow',
  })
  let data: unknown
  try {
    data = await res.json()
  } catch {
    data = await res.text()
  }
  console.log(`← ${res.status} ${res.statusText}`)
  return { status: res.status, ok: res.ok, data }
}

function print(label: string, r: { status: number; ok: boolean; data: unknown }) {
  console.log(`\n── ${label} ${'─'.repeat(Math.max(0, 50 - label.length))}`)
  console.log(JSON.stringify(r.data, null, 2))
}

// ── Payload factura simplificada Salten ────────────────────────────────────
// €3 IVA incluido = base €2.48 + IVA 21% €0.52
// F2 = factura simplificada (sin destinatario)
function buildFactura(series: string, number: string) {
  return {
    series,
    number,
    issue_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    invoice_type: 'F2', // simplificada
    description: 'Salten – juego fonético descarga digital',
    currency: 'EUR',
    external_reference: `RESUENA-2026-${number}`,
    customer: {
      name: 'CONSUMIDOR FINAL',
      nif: '00000000T',
    },
    items: [
      {
        description: 'Salten descarga digital (1 idioma)',
        quantity: 1,
        unit_price: 2.48,
        tax_rate: 21,
        aeat_code: '01', // IVA
        regime_key: '01',
        operation_qualification: 'S1', // sujeta y no exenta
      },
    ],
  }
}

// ── Tests ──────────────────────────────────────────────────────────────────

async function testConnection() {
  const r = await req('GET', '/verifactu/test-connection')
  print('TEST CONNECTION', r)
  const d = r.data as any
  console.log('  environment :', d?.details?.environment ?? '—')
  console.log('  cert error  :', d?.error ?? 'ninguno')
  return r.ok
}

async function testUser() {
  const r = await req('GET', '/user')
  print('USER', r)
}

async function testList() {
  // Requiere exercise (YYYY) y period (código AEAT) como query params
  const r = await req('GET', '/verifactu/list?exercise=2026&period=0A')
  print('LIST (ejercicio 2026, periodo 0A = anual)', r)
}

async function testCreate() {
  const payload = buildFactura('RESUENA', 'TEST001')
  console.log('\n── PAYLOAD CREATE ' + '─'.repeat(32))
  console.log(JSON.stringify(payload, null, 2))
  const r = await req('POST', '/verifactu/create', payload)
  print('CREATE (alta factura)', r)
  return r
}

async function testCancel(series: string, number: string, issue_date: string) {
  const payload = { series, number, issue_date }
  console.log('\n── PAYLOAD CANCEL ' + '─'.repeat(32))
  console.log(JSON.stringify(payload, null, 2))
  const r = await req('POST', '/verifactu/cancel', payload)
  print('CANCEL (anulación)', r)
  return r
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('═'.repeat(60))
  console.log('  VERIFACTU API — TEST SUITE v3')
  console.log('  Base :', API_BASE)
  console.log('  NIF  :', NIF)
  console.log('═'.repeat(60))

  // 1. Conexión
  const connected = await testConnection()
  if (!connected) {
    console.error('\n✗ Sin conexión. Abortando.')
    process.exit(1)
  }
  console.log("\n✓ Conexión OK (nota: 'No certificate' es esperado en sandbox)")

  // 2. Usuario
  await testUser()

  // 3. Listar facturas existentes
  await testList()

  // 4. Crear factura de prueba
  const alta = await testCreate()
  if (!alta.ok) {
    console.log('\n✗ CREATE falló — ver respuesta arriba.')
    // No abortamos para ver el error completo
  } else {
    console.log('\n✓ Factura creada en sandbox')

    // 5. Anular la factura recién creada
    const hoy = new Date().toISOString().split('T')[0]
    await testCancel('RESUENA', 'TEST001', hoy)
  }

  console.log('\n\n✓ Tests completados.\n')
}

main().catch((err) => {
  console.error('\n✗ Error:', err)
  process.exit(1)
})

// /**
//  * verifactu-test.ts
//  * Pruebas del API de verifacturapi.com en sandbox
//  *
//  * Uso:
//  *   npx tsx verifactu-test.ts
//  *
//  * Desde la raíz del proyecto LinguaTash (donde está .env.local)
//  */

// const API_BASE = 'https://verifacturapi.com/api/v1'
// const API_KEY = '15|KyaJGAxoi3JGKX3OTLz6ebfpozCm0tK49YflSJPB4d1a92d3'

// // NIF de LinguaTash — reemplaza si el sandbox usa un NIF de prueba diferente
// const NIF_EMISOR = 'Y4279128S'

// const headers = {
//   Authorization: `Bearer ${API_KEY}`,
//   'Content-Type': 'application/json',
//   Accept: 'application/json',
// }

// // ─── Utilidades ────────────────────────────────────────────────────────────────

// function log(title: string, data: unknown) {
//   console.log(`\n${'─'.repeat(60)}`)
//   console.log(`▶ ${title}`)
//   console.log('─'.repeat(60))
//   console.log(JSON.stringify(data, null, 2))
// }

// async function apiFetch(method: string, path: string, body?: unknown) {
//   const url = `${API_BASE}${path}`
//   console.log(`\n→ ${method} ${url}`)

//   const res = await fetch(url, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : undefined,
//     redirect: 'follow',
//   })

//   const text = await res.text()
//   let json: unknown
//   try {
//     json = JSON.parse(text)
//   } catch {
//     json = { raw: text }
//   }

//   console.log(`← ${res.status} ${res.statusText}`)
//   return { status: res.status, ok: res.ok, data: json }
// }

// // ─── Tests ─────────────────────────────────────────────────────────────────────

// async function testConnection() {
//   const result = await apiFetch('GET', '/verifactu/test-connection')
//   log('TEST CONNECTION', result)
//   return result.ok
// }

// async function getEmisor() {
//   const result = await apiFetch('GET', `/verifactu/emisor?nif=${NIF_EMISOR}`)
//   log('GET EMISOR', result)
//   return result
// }

// // Factura simplificada tipo Salten: €3 IVA incluido (base €2.48 + IVA 21% €0.52)
// // Sin destinatario (factura simplificada art. 7.2)
// function buildPayloadFacturaSimplificada(numSerie: string) {
//   const fecha = new Date().toISOString().split('T')[0] // YYYY-MM-DD
//   return {
//     IDEmisorFactura: NIF_EMISOR,
//     NumSerieFactura: numSerie,
//     FechaExpedicionFactura: fecha,
//     TipoFactura: 'F2', // Simplificada
//     DescripcionOperacion: 'Juego de cartas fonético Salten - descarga digital',
//     FacturaSimplificadaArt7273: 'S',
//     EmitidaPorTercODesti: null,
//     Destinatarios: [],
//     Desglose: [
//       {
//         Impuesto: '01', // IVA
//         ClaveRegimen: '01', // Operación general
//         CalificacionOperacion: 'S1', // Sujeta y no exenta
//         TipoImpositivo: 21,
//         BaseImponibleOImporteNoSujeto: 2.48,
//         CuotaRepercutida: 0.52,
//       },
//     ],
//     CuotaTotal: 0.52,
//     ImporteTotal: 3.0,
//     tag: 'salten-test',
//   }
// }

// async function validarFactura() {
//   const payload = buildPayloadFacturaSimplificada('RESUENA-2026-TEST001')
//   log('PAYLOAD VALIDAR', payload)
//   const result = await apiFetch('POST', '/verifactu/alta-registro-facturacion/validar', payload)
//   log('VALIDAR FACTURA (sin registrar)', result)
//   return result
// }

// async function registrarFactura() {
//   const payload = buildPayloadFacturaSimplificada('RESUENA-2026-TEST001')
//   log('PAYLOAD ALTA', payload)
//   const result = await apiFetch('POST', '/verifactu/alta-registro-facturacion', payload)
//   log('ALTA FACTURA (sandbox)', result)
//   return result
// }

// async function anularFactura(numSerie: string, fecha: string) {
//   const payload = {
//     IDEmisorFactura: NIF_EMISOR,
//     NumSerieFactura: numSerie,
//     FechaExpedicionFactura: fecha,
//     SinRegistroPrevio: false,
//   }
//   log('PAYLOAD ANULACIÓN', payload)
//   const result = await apiFetch('POST', '/verifactu/anulacion-registro-facturacion', payload)
//   log('ANULACIÓN FACTURA', result)
//   return result
// }

// // ─── Main ──────────────────────────────────────────────────────────────────────

// async function main() {
//   console.log('═'.repeat(60))
//   console.log('  VERIFACTU API — TEST SUITE (sandbox)')
//   console.log('  Base URL :', API_BASE)
//   console.log('  NIF      :', NIF_EMISOR)
//   console.log('═'.repeat(60))

//   // 1. Conexión
//   const connected = await testConnection()
//   if (!connected) {
//     console.error('\n✗ No se pudo conectar. Abortando.')
//     // process.exit(1)
//   }
//   console.log('\n✓ Conexión OK')

//   // 2. Datos del emisor
//   await getEmisor()

//   // 3. Validar payload (no genera registro)
//   const validacion = await validarFactura()
//   if (!validacion.ok) {
//     console.log('\n✗ Validación fallida — revisar payload antes de continuar.')
//     // process.exit(1)
//   }
//   console.log('\n✓ Payload válido')

//   // 4. Registrar factura en sandbox
//   const alta = await registrarFactura()
//   if (!alta.ok) {
//     console.log('\n✗ Alta fallida.')
//     // process.exit(1)
//   }
//   console.log('\n✓ Factura registrada en sandbox')

//   // 5. Anular la factura recién creada (limpieza sandbox)
//   const hoy = new Date().toISOString().split('T')[0]
//   await anularFactura('RESUENA-2026-TEST001', hoy)

//   console.log('\n\n✓ Tests completados.\n')

//   // Explorar rutas
//   // Explorar rutas correctas
//   await apiFetch('GET', '/user')
//   await apiFetch('GET', '/invoices')
//   await apiFetch('GET', '/invoice')
//   await apiFetch('GET', '/alta-registro-facturacion')
//   await apiFetch('GET', '/registro-facturacion')
//   await apiFetch('GET', '/facturas')
//   await apiFetch('GET', '/verifactu')
//   await apiFetch('GET', '/')

//   const user = await apiFetch('GET', '/user')
//   log('USER', user)
// }

// main().catch((err) => {
//   console.error('\n✗ Error inesperado:', err)
//   // process.exit(1)
// })
