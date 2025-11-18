'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] min-h-[500px] bg-gradient-to-r from-cdc-dark-green to-cdc-green flex items-center justify-center text-white"
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Centro de Día Comunitario
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-green-50"
          >
            25 de Mayo - La Pampa
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto"
          >
            Un espacio de encuentro, contención y crecimiento para toda la comunidad
          </motion.p>
        </div>
      </motion.section>

      {/* ¿Qué es el CDC? */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-8 text-cdc-dark-green">
            ¿Qué es el Centro de Día?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto text-center">
            El Centro de Día es un dispositivo territorial cuyo objetivo es abordar las problemáticas relacionadas con{' '}
            <strong>salud mental y consumos problemáticos de sustancias</strong>. Este dispositivo, que depende de SEDRONAR,
            consiste en un espacio de encuentro, contención, recreación, formación y capacitación que busca impulsar la
            creatividad, el desarrollo cultural, deportivo y artístico, generando distintas herramientas acordes a cada
            persona, con el fin de potenciar el proyecto de vida de cada participante.
          </p>
        </motion.div>
      </section>

      {/* Talleres */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-cdc-dark-green"
          >
            Nuestros Talleres
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Taller 1: TransformArte */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-48 flex items-center justify-center">
                <span className="text-6xl">♻️</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">TransformArte</h3>
                <p className="text-gray-600 mb-4">
                  Taller de reciclado creativo donde transformamos materiales en arte.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Horarios:</strong><br />
                  Lunes y Jueves: 18:00 - 20:00 hs
                </p>
              </div>
            </motion.div>

            {/* Taller 2: Amor de Huerta */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-48 flex items-center justify-center">
                <span className="text-6xl">🌱</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">Amor de Huerta</h3>
                <p className="text-gray-600 mb-4">
                  Aprendé técnicas de horticultura y cultivá tus propios alimentos.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Horarios:</strong><br />
                  Martes y Viernes: 18:30 - 20:30 hs<br />
                  Miércoles: 10:30 - 12:30 hs
                </p>
              </div>
            </motion.div>

            {/* Taller 3: Teatro y Escritura */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-48 flex items-center justify-center">
                <span className="text-6xl">🎭</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">Teatro Leído y Escritura</h3>
                <p className="text-gray-600 mb-4">
                  Expresión artística a través del teatro y la escritura creativa.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Horario:</strong><br />
                  Viernes: 18:00 - 19:00 hs
                </p>
              </div>
            </motion.div>

            {/* Taller 4: Espacio Grupal */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-48 flex items-center justify-center">
                <span className="text-6xl">💬</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">Espacio Grupal</h3>
                <p className="text-gray-600 mb-4">
                  Terapia grupal con acompañamiento profesional de salud mental.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Horario:</strong><br />
                  Miércoles: 14:00 hs
                </p>
              </div>
            </motion.div>

            {/* Taller 5: Columna Radial */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-red-500 to-rose-500 h-48 flex items-center justify-center">
                <span className="text-6xl">📻</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">Columna Radial</h3>
                <p className="text-gray-600 mb-4">
                  Programa radial sobre salud mental en la radio municipal.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Horario:</strong><br />
                  Lunes: 11:00 hs (Radio Municipal)
                </p>
              </div>
            </motion.div>

            {/* La Voz del CDC */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-48 flex items-center justify-center">
                <span className="text-6xl">📰</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">La Voz del CDC</h3>
                <p className="text-gray-600 mb-4">
                  Diario digital sobre salud mental y bienestar comunitario.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Propósito:</strong><br />
                  Informar, sensibilizar y fomentar el cuidado emocional.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Actividades */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-cdc-dark-green">¿Qué actividades ofrecemos?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🏥</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Abordajes clínicos individuales</h3>
                  <p className="text-gray-600">Con nexo en los equipos de salud locales</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🤝</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Acompañamientos terapéuticos</h3>
                  <p className="text-gray-600">Singulares y grupales</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📊</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Seguimientos psicosociales</h3>
                  <p className="text-gray-600">Integrales y personalizados</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🌍</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Actividades comunitarias</h3>
                  <p className="text-gray-600">De prevención y promoción</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contacto */}
      <section className="py-16 px-4 bg-gradient-to-r from-cdc-dark-green to-cdc-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">¿Cómo encontrarnos?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-3">📍</div>
              <h3 className="text-xl font-bold mb-2">Dirección</h3>
              <p className="text-green-100">Calle Trenel N°53<br />25 de Mayo, La Pampa</p>
            </div>
            <div>
              <div className="text-4xl mb-3">📞</div>
              <h3 className="text-xl font-bold mb-2">Teléfono</h3>
              <p className="text-green-100">299 4152668</p>
            </div>
            <div>
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-green-100 break-words">cdc.25demayolp.coordinacion@gmail.com</p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4">Horarios de Verano</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-lg mb-2">
                <strong>Mañanas:</strong> Lunes a Viernes 9:00 - 12:00 hs
              </p>
              <p className="text-lg mb-2">
                <strong>Tardes:</strong> Lunes, Miércoles y Jueves 16:00 - 19:00 hs
              </p>
              <p className="text-lg">
                <strong>Tardes:</strong> Martes y Viernes 17:00 - 20:00 hs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">
            <strong className="text-white">Centro de Día Comunitario - 25 de Mayo</strong>
          </p>
          <p className="text-sm">
            Un dispositivo de SEDRONAR, Subsecretaría de Salud Mental y Adicciones de La Pampa,
            y Municipalidad de 25 de Mayo
          </p>
          <p className="text-xs mt-4 text-gray-500">
            © 2025 CDC 25 de Mayo - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}

