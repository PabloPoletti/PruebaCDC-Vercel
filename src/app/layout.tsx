import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CDC Bot - Centro de Día Comunitario 25 de Mayo',
  description: 'Asistente virtual del Centro de Día Comunitario de 25 de Mayo, La Pampa',
  keywords: 'CDC, Centro de Día, 25 de Mayo, La Pampa, salud mental, consumos problemáticos',
  authors: [{ name: 'CDC 25 de Mayo' }],
  openGraph: {
    title: 'CDC Bot - Centro de Día Comunitario',
    description: 'Asistente virtual para consultas sobre el Centro de Día',
    type: 'website',
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

