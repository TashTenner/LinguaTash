import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Die Beziehung ist die Methode · LinguaTash'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F4EFE8',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#B3475A',
            marginBottom: 28,
          }}
        >
          Eine Audiobotschaft von Tash · LinguaTash
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: '#081C3C',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Die Beziehung ist die Methode
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#081C3C',
            opacity: 0.7,
            marginTop: 28,
            textAlign: 'center',
          }}
        >
          Wie Du mit Deinem Kind sprichst, ist schon Sprachvermittlung
        </div>
      </div>
    ),
    { ...size }
  )
}
