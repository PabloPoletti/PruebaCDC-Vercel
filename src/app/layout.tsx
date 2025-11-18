import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Centro de Día Comunitario - 25 de Mayo, La Pampa',
  description: 'Centro de Día Comunitario de 25 de Mayo. Espacio de encuentro, contención y crecimiento para toda la comunidad. Talleres, actividades y acompañamiento en salud mental.',
  keywords: 'CDC, Centro de Día, 25 de Mayo, La Pampa, salud mental, consumos problemáticos, talleres, SEDRONAR, acompañamiento terapéutico, prevención, promoción',
  authors: [{ name: 'CDC 25 de Mayo' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Centro de Día Comunitario - 25 de Mayo',
    description: 'Espacio de encuentro, contención y crecimiento. Talleres, actividades y acompañamiento en salud mental.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'CDC 25 de Mayo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Centro de Día Comunitario - 25 de Mayo',
    description: 'Espacio de encuentro, contención y crecimiento para toda la comunidad',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

