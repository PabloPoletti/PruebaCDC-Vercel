'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: React.ReactNode
  image?: string
}

function ArticleModal({ isOpen, onClose, title, content, image }: ArticleModalProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {image && (
          <div className="w-full h-64 bg-gradient-to-r from-cdc-green to-cdc-dark-green relative">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
        )}
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-3xl font-bold text-cdc-dark-green">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="prose prose-lg max-w-none">{content}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[600px] bg-gradient-to-r from-cdc-dark-green to-cdc-green overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Texto a la izquierda */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-white space-y-6 z-10 relative"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Centro de Día<br />
                Comunitario
              </h1>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-semibold text-green-100">
                  25 de Mayo
                </p>
                <p className="text-xl md:text-2xl text-green-50">
                  La Pampa, Argentina
                </p>
              </div>
              <p className="text-lg md:text-xl text-green-50 max-w-xl leading-relaxed">
                Un espacio de encuentro, contención y crecimiento para toda la comunidad
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <motion.a
                  href="#talleres"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-cdc-dark-green px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Ver Talleres
                </motion.a>
                <motion.a
                  href="#contacto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
                >
                  Contacto
                </motion.a>
              </div>
            </motion.div>

            {/* Logo a la derecha */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative h-[400px] md:h-[500px] flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/hero/inicio-extra-6.png"
                  alt="Centro de Día Comunitario 25 de Mayo"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      </motion.section>

      {/* La Voz del CDC - Diario Digital */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4 text-cdc-dark-green">📰 La Voz del CDC</h2>
            <p className="text-2xl text-gray-700 mb-6">Diario Digital</p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              El objetivo de La Voz del CDC es promover la salud mental y el bienestar en nuestra comunidad. 
              A través de notas, entrevistas, testimonios y videos, buscamos informar, sensibilizar y fomentar 
              el cuidado de nuestras emociones, y del consumo problemático de quienes nos rodean.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.button
              onClick={() => setActiveModal('salud-mental')}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-2xl transition-all"
            >
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-cdc-dark-green mb-2">Salud Mental</h3>
              <p className="text-gray-600">
                Avances, noticias y reflexiones sobre salud mental y bienestar emocional
              </p>
            </motion.button>

            <motion.button
              onClick={() => setActiveModal('columna-radial')}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-2xl transition-all"
            >
              <div className="text-4xl mb-4">📻</div>
              <h3 className="text-2xl font-bold text-cdc-dark-green mb-2">Columna Radial</h3>
              <p className="text-gray-600">
                Columnas del Lic. Sebastián Mendicoa sobre salud mental
              </p>
            </motion.button>
          </div>
        </div>
      </section>

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
      <section id="talleres" className="py-16 px-4 bg-gray-50">
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
            <motion.button
              onClick={() => setActiveModal('transformarte')}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all text-left"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/hero/inicio-extra-4.jpg"
                  alt="TransformArte - Reciclaje Artístico"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent flex items-center justify-center">
                  <span className="text-6xl">♻️</span>
                </div>
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
                <p className="text-sm text-cdc-green font-semibold mt-4">Ver más →</p>
              </div>
            </motion.button>

            {/* Taller 2: Amor de Huerta */}
            <motion.button
              onClick={() => setActiveModal('amor-huerta')}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all text-left"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/hero/inicio-extra-8.png"
                  alt="Amor de Huerta"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 to-transparent flex items-center justify-center">
                  <span className="text-6xl">🌱</span>
                </div>
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
                <p className="text-sm text-cdc-green font-semibold mt-4">Ver más →</p>
              </div>
            </motion.button>

            {/* Taller 3: ExpresaMente */}
            <motion.button
              onClick={() => setActiveModal('expresamente')}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all text-left"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/talleres/expresamente-principal.jpg"
                  alt="ExpresaMente"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent flex items-center justify-center">
                  <span className="text-6xl">✍️</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">ExpresaMente</h3>
                <p className="text-gray-600 mb-4">
                  La palabra como medio de expresión y comunicación. Incluye el diario digital.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Incluye:</strong><br />
                  Teatro leído, escritura creativa y diario digital
                </p>
                <p className="text-sm text-cdc-green font-semibold mt-4">Ver más →</p>
              </div>
            </motion.button>

            {/* Taller 4: Teatro Leído */}
            <motion.button
              onClick={() => setActiveModal('teatro')}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all text-left"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/hero/hero-principal.jpg"
                  alt="Teatro Leído y Escritura"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 to-transparent flex items-center justify-center">
                  <span className="text-6xl">🎭</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">Teatro Leído</h3>
                <p className="text-gray-600 mb-4">
                  Expresión artística a través del teatro y la lectura dramatizada.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Horario:</strong><br />
                  Viernes: 18:00 - 19:00 hs
                </p>
                <p className="text-sm text-cdc-green font-semibold mt-4">Ver más →</p>
              </div>
            </motion.button>

            {/* Taller 5: Espacio Grupal */}
            <motion.button
              onClick={() => setActiveModal('espacio-grupal')}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all text-left"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/hero/inicio-extra-9.jpg"
                  alt="Espacio Grupal"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 to-transparent flex items-center justify-center">
                  <span className="text-6xl">💬</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">Espacio Grupal</h3>
                <p className="text-gray-600 mb-4">
                  Espacio para dialogar con otros, acompañado por un profesional de salud mental.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Horario:</strong><br />
                  Miércoles: 14:00 hs
                </p>
                <p className="text-sm text-cdc-green font-semibold mt-4">Ver más →</p>
              </div>
            </motion.button>

            {/* Taller 6: Columna Radial */}
            <motion.button
              onClick={() => setActiveModal('columna-radial')}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all text-left"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/hero/hero-actividad.jpg"
                  alt="Columna Radial"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 to-transparent flex items-center justify-center">
                  <span className="text-6xl">📻</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-cdc-dark-green">Columna Radial</h3>
                <p className="text-gray-600 mb-4">
                  Programa radial sobre salud mental del Lic. Sebastián Mendicoa.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Horario:</strong><br />
                  Lunes: 11:00 hs (Radio Municipal)
                </p>
                <p className="text-sm text-cdc-green font-semibold mt-4">Ver más →</p>
              </div>
            </motion.button>
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

      {/* Noticias */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-cdc-dark-green"
          >
            📢 Noticias y Actividades
          </motion.h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Aquí te mostraremos la actualidad del centro, compartiendo noticias sobre las actividades llevadas a cabo
          </p>
          <div className="text-center">
            <button
              onClick={() => setActiveModal('noticias')}
              className="bg-cdc-green hover:bg-cdc-dark-green text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Ver todas las noticias
            </button>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-16 px-4 bg-gradient-to-r from-cdc-dark-green to-cdc-green text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">¿Cómo encontrarnos?</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Información de Contacto */}
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
                >
                  <div className="text-4xl mb-3">📍</div>
                  <h3 className="text-xl font-bold mb-2">Dirección</h3>
                  <p className="text-green-100">Calle Trenel N°53<br />25 de Mayo, La Pampa</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
                >
                  <div className="text-4xl mb-3">📞</div>
                  <h3 className="text-xl font-bold mb-2">Teléfono</h3>
                  <a href="tel:2994152668" className="text-green-100 hover:text-white transition-colors">
                    299 4152668
                  </a>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center md:col-span-2"
                >
                  <div className="text-4xl mb-3">📧</div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <a 
                    href="mailto:cdc.25demayolp.coordinacion@gmail.com" 
                    className="text-green-100 hover:text-white transition-colors break-words"
                  >
                    cdc.25demayolp.coordinacion@gmail.com
                  </a>
                </motion.div>
              </div>

              {/* Horarios */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4 text-center">Horarios de Verano</h3>
                <div className="space-y-3">
                  <p className="text-lg">
                    <strong>Mañanas:</strong> Lunes a Viernes 9:00 - 12:00 hs
                  </p>
                  <p className="text-lg">
                    <strong>Tardes:</strong> Lunes, Miércoles y Jueves 16:00 - 19:00 hs
                  </p>
                  <p className="text-lg">
                    <strong>Tardes:</strong> Martes y Viernes 17:00 - 20:00 hs
                  </p>
                </div>
              </div>
            </div>

            {/* Mapa de Google Maps */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <a
                href="https://www.google.com/maps/place/Trenel+53,+L6238+25+de+Mayo,+La+Pampa/@-37.7694444,-67.7263889,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full group relative"
              >
                {/* Iframe de Google Maps */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3258.3!2d-67.7263889!3d-37.7694444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96769e8e8e8e8e8e%3A0x8e8e8e8e8e8e8e8e!2sTrenel%2053%2C%20L6238%2025%20de%20Mayo%2C%20La%20Pampa!5e0!3m2!1ses-419!2sar!4v1234567890123!5m2!1ses-419!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
                
                {/* Overlay con texto al hacer hover */}
                <div className="absolute inset-0 bg-cdc-dark-green/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-5xl mb-3">📍</div>
                    <p className="text-xl font-bold">Click para abrir en Google Maps</p>
                    <p className="text-sm mt-2 text-green-100">Obtener direcciones</p>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Botón para abrir en Google Maps (móvil) */}
          <div className="text-center">
            <motion.a
              href="https://www.google.com/maps/place/Trenel+53,+L6238+25+de+Mayo,+La+Pampa/@-37.7694444,-67.7263889,17z"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-cdc-dark-green px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-2xl">🗺️</span>
              <span>Abrir en Google Maps</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Bolsa de Trabajo */}
      <section className="py-12 px-4 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-cdc-dark-green">💼 Bolsa de Trabajo</h2>
          <p className="text-lg text-gray-700 mb-6">
            Programa una visita en persona a nuestro Centro para consultar oportunidades laborales
          </p>
          <button
            onClick={() => setActiveModal('bolsa-trabajo')}
            className="bg-cdc-green hover:bg-cdc-dark-green text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Más información
          </button>
        </div>
      </section>

      {/* Galería de Fotos */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-cdc-dark-green"
          >
            📸 Galería de Momentos
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              '/images/noticias/noticia-evento.jpg',
              '/images/noticias/noticia-actividad.jpg',
              '/images/noticias/noticia-taller.png',
              '/images/talleres/amor-huerta-cultivo.png',
              '/images/talleres/amor-huerta-cosecha.png',
              '/images/noticias/noticias-extra-4.jpg',
              '/images/noticias/noticias-extra-5.jpg',
              '/images/noticias/noticias-extra-6.jpg',
            ].map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`Actividad CDC ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Logos Institucionales */}
          <div className="mb-8">
            <h3 className="text-white text-center text-lg font-semibold mb-6">Dependencias</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-white p-4 rounded-lg"
              >
                <Image
                  src="/images/logos/logo-1.jpg"
                  alt="SEDRONAR"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-white p-4 rounded-lg"
              >
                <Image
                  src="/images/logos/logo-2.jpg"
                  alt="Gobierno de La Pampa"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-white p-4 rounded-lg"
              >
                <Image
                  src="/images/logos/logo-3.jpg"
                  alt="Municipalidad 25 de Mayo"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </motion.div>
            </div>
          </div>

          {/* Información */}
          <div className="text-center border-t border-gray-700 pt-8">
            <p className="mb-2">
              <strong className="text-white">Centro de Día Comunitario - 25 de Mayo</strong>
            </p>
            <p className="text-sm mb-4">
              Un dispositivo de SEDRONAR, Subsecretaría de Salud Mental y Adicciones de La Pampa,
              y Municipalidad de 25 de Mayo
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
              <span>📍 Trenel 53, 25 de Mayo</span>
              <span>📞 299 4152668</span>
              <span>📧 cdc.25demayolp.coordinacion@gmail.com</span>
            </div>
            <p className="text-xs text-gray-500">
              © 2025 CDC 25 de Mayo - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Modales */}
      <ArticleModal
        isOpen={activeModal === 'transformarte'}
        onClose={() => setActiveModal(null)}
        title="TransformArte"
        image="/images/hero/inicio-extra-4.jpg"
        content={
          <div>
            <p className="text-lg mb-4">
              En este taller aprenderás en conjunto con otros/as diferentes aspectos y técnicas del trabajo de reciclado creativo.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">¿Qué hacemos?</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reciclado de materiales diversos (papel, cartón, plástico, vidrio)</li>
              <li>Técnicas de decoración y transformación artística</li>
              <li>Creación de objetos útiles y decorativos</li>
              <li>Desarrollo de la creatividad individual y grupal</li>
              <li>Trabajo en equipo y colaboración</li>
            </ul>
            <h4 className="text-xl font-bold mt-6 mb-3">Horarios</h4>
            <p>Lunes y Jueves: 18:00 - 20:00 hs</p>
            <h4 className="text-xl font-bold mt-6 mb-3">Beneficios</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Desarrollo de habilidades manuales y artísticas</li>
              <li>Conciencia ambiental y cuidado del medio ambiente</li>
              <li>Espacio de socialización y encuentro</li>
              <li>Expresión creativa y personal</li>
            </ul>
          </div>
        }
      />

      <ArticleModal
        isOpen={activeModal === 'amor-huerta'}
        onClose={() => setActiveModal(null)}
        title="Amor de Huerta"
        image="/images/hero/inicio-extra-8.png"
        content={
          <div>
            <p className="text-lg mb-4">
              En este taller aprenderás en conjunto con otros/as diferentes aspectos y técnicas del trabajo hortícola.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">¿Qué aprendemos?</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Preparación de tierra y siembra</li>
              <li>Cuidado y mantenimiento de cultivos</li>
              <li>Control de plagas de forma natural</li>
              <li>Cosecha y aprovechamiento de productos</li>
              <li>Compostaje y cuidado del suelo</li>
              <li>Cultivo de plantas aromáticas y medicinales</li>
            </ul>
            <h4 className="text-xl font-bold mt-6 mb-3">Horarios</h4>
            <p>Martes y Viernes: 18:30 - 20:30 hs</p>
            <p>Miércoles: 10:30 - 12:30 hs</p>
            <h4 className="text-xl font-bold mt-6 mb-3">Beneficios</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Conexión con la naturaleza</li>
              <li>Alimentación saludable y soberanía alimentaria</li>
              <li>Actividad física al aire libre</li>
              <li>Trabajo en equipo y solidaridad</li>
              <li>Reducción del estrés y mejora del bienestar</li>
            </ul>
          </div>
        }
      />

      <ArticleModal
        isOpen={activeModal === 'expresamente'}
        onClose={() => setActiveModal(null)}
        title="ExpresaMente"
        image="/images/talleres/expresamente-principal.jpg"
        content={
          <div>
            <p className="text-lg mb-4">
              Esta propuesta apunta al uso de la palabra no solo como medio de expresión, sino también como medio de comunicación.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">Actividades incluidas</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Teatro leído:</strong> Lectura dramatizada de obras teatrales</li>
              <li><strong>Escritura creativa:</strong> Desarrollo de textos propios (cuentos, poemas, crónicas)</li>
              <li><strong>Diario Digital "La Voz del CDC":</strong> Producción de contenidos para el medio digital del centro</li>
              <li><strong>Talleres de expresión:</strong> Ejercicios de comunicación y expresión oral</li>
            </ul>
            <h4 className="text-xl font-bold mt-6 mb-3">Objetivos</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fortalecer la comunicación interpersonal</li>
              <li>Desarrollar la creatividad literaria</li>
              <li>Generar un espacio de reflexión y autoconocimiento</li>
              <li>Promover la participación comunitaria a través de la palabra</li>
            </ul>
            <h4 className="text-xl font-bold mt-6 mb-3">¿Para quién?</h4>
            <p>
              Abierto a todas las personas que quieran expresarse, compartir historias y conectar con otros a través de la palabra.
            </p>
          </div>
        }
      />

      <ArticleModal
        isOpen={activeModal === 'espacio-grupal'}
        onClose={() => setActiveModal(null)}
        title="Espacio Grupal"
        image="/images/hero/inicio-extra-9.jpg"
        content={
          <div>
            <p className="text-lg mb-4">
              Este es un espacio para dialogar con otros y con EL OTRO, tratando temas en particular en compañía de un profesional de la salud mental.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">¿Cómo funciona?</h4>
            <p className="mb-4">
              Es un espacio terapéutico grupal donde los participantes pueden compartir experiencias, reflexiones y preocupaciones
              en un ambiente de confianza y respeto, acompañados por un profesional especializado.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">Horario</h4>
            <p className="mb-4">Miércoles: 14:00 hs</p>
            <h4 className="text-xl font-bold mt-6 mb-3">Temas abordados</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manejo de emociones y sentimientos</li>
              <li>Relaciones interpersonales</li>
              <li>Autoconocimiento y crecimiento personal</li>
              <li>Estrategias de afrontamiento</li>
              <li>Comunicación asertiva</li>
              <li>Construcción de vínculos saludables</li>
            </ul>
            <h4 className="text-xl font-bold mt-6 mb-3">Beneficios</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sentimiento de pertenencia y contención</li>
              <li>Apoyo mutuo entre participantes</li>
              <li>Acompañamiento profesional especializado</li>
              <li>Desarrollo de herramientas para la vida cotidiana</li>
            </ul>
          </div>
        }
      />

      <ArticleModal
        isOpen={activeModal === 'columna-radial'}
        onClose={() => setActiveModal(null)}
        title="Columna Radial"
        image="/images/hero/hero-actividad.jpg"
        content={
          <div>
            <p className="text-lg mb-4">
              Te invitamos a escuchar las columnas radiales del Licenciado en Psicología Sebastián Mendicoa, 
              quien aborda diferentes temáticas con respecto a la salud mental.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">Sobre la columna</h4>
            <p className="mb-4">
              Todos los lunes a las 11:00 hs, el Lic. Sebastián Mendicoa comparte reflexiones, consejos y herramientas
              relacionadas con la salud mental y el bienestar emocional a través de la Radio Municipal de 25 de Mayo.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">Temas tratados</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Salud mental y bienestar emocional</li>
              <li>Prevención de consumos problemáticos</li>
              <li>Manejo del estrés y la ansiedad</li>
              <li>Construcción de vínculos saludables</li>
              <li>Promoción de hábitos saludables</li>
              <li>Recursos comunitarios disponibles</li>
            </ul>
            <h4 className="text-xl font-bold mt-6 mb-3">Horario</h4>
            <p className="mb-4">Lunes: 11:00 hs - Radio Municipal de 25 de Mayo</p>
            <p className="italic text-gray-600">
              Una oportunidad para informarte, reflexionar y cuidar tu salud mental desde la comodidad de tu hogar.
            </p>
          </div>
        }
      />

      <ArticleModal
        isOpen={activeModal === 'salud-mental'}
        onClose={() => setActiveModal(null)}
        title="Salud Mental"
        content={
          <div>
            <p className="text-lg mb-4">
              ¿Te interesa saber un poco más sobre los avances en salud mental? Aquí encontrarás información actualizada
              sobre diversos temas relacionados con el bienestar emocional y psicológico.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">Temas de ayuda</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prevención de consumos problemáticos</li>
              <li>Manejo de crisis y situaciones difíciles</li>
              <li>Promoción del autocuidado</li>
              <li>Recursos de salud mental disponibles</li>
              <li>Desmitificación de estigmas sobre salud mental</li>
              <li>Herramientas para el bienestar emocional</li>
            </ul>
            <h4 className="text-xl font-bold mt-6 mb-3">¿Por qué es importante?</h4>
            <p className="mb-4">
              La salud mental es tan importante como la salud física. Cuidar de nuestras emociones, pensamientos y relaciones
              es fundamental para tener una vida plena y satisfactoria.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">Recursos disponibles</h4>
            <p className="mb-2">En el CDC ofrecemos:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Atención psicológica individual</li>
              <li>Espacios grupales terapéuticos</li>
              <li>Talleres de prevención y promoción</li>
              <li>Acompañamiento terapéutico</li>
              <li>Articulación con otros servicios de salud</li>
            </ul>
          </div>
        }
      />

      <ArticleModal
        isOpen={activeModal === 'noticias'}
        onClose={() => setActiveModal(null)}
        title="Noticias y Actividades del CDC"
        content={
          <div>
            <p className="text-lg mb-6">
              Aquí encontrarás las últimas novedades, eventos y actividades que realizamos en el Centro de Día Comunitario.
            </p>
            
            <div className="space-y-8">
              <div className="border-l-4 border-cdc-green pl-4">
                <h4 className="text-xl font-bold mb-2">Actividades Comunitarias</h4>
                <p className="text-gray-600 mb-2">Constantemente organizamos actividades abiertas a la comunidad</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Jornadas de prevención</li>
                  <li>Ferias de productos de los talleres</li>
                  <li>Eventos culturales y artísticos</li>
                  <li>Charlas informativas sobre salud mental</li>
                </ul>
              </div>

              <div className="border-l-4 border-cdc-green pl-4">
                <h4 className="text-xl font-bold mb-2">Talleres Abiertos</h4>
                <p className="text-gray-600 mb-2">Durante el año realizamos talleres abiertos a toda la comunidad</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Taller de huerta comunitaria</li>
                  <li>Encuentros de arte y reciclado</li>
                  <li>Espacios de escritura y lectura</li>
                  <li>Jornadas de teatro</li>
                </ul>
              </div>

              <div className="border-l-4 border-cdc-green pl-4">
                <h4 className="text-xl font-bold mb-2">Colaboraciones Institucionales</h4>
                <p className="text-gray-600 mb-2">Trabajamos en red con diversas instituciones:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Hospitales y centros de salud</li>
                  <li>Escuelas y centros educativos</li>
                  <li>Organizaciones sociales</li>
                  <li>Gobierno provincial y municipal</li>
                </ul>
              </div>

              <div className="bg-cdc-green/10 p-6 rounded-lg">
                <h4 className="text-xl font-bold mb-2">¿Querés participar?</h4>
                <p className="mb-4">
                  Todas nuestras actividades son gratuitas y abiertas a la comunidad. 
                  Podés acercarte al centro o contactarnos para más información sobre las próximas actividades.
                </p>
                <p className="font-semibold">
                  📍 Trenel 53, 25 de Mayo<br />
                  📞 299 4152668<br />
                  📧 cdc.25demayolp.coordinacion@gmail.com
                </p>
              </div>
            </div>
          </div>
        }
      />

      <ArticleModal
        isOpen={activeModal === 'bolsa-trabajo'}
        onClose={() => setActiveModal(null)}
        title="Bolsa de Trabajo"
        content={
          <div>
            <p className="text-lg mb-6">
              El Centro de Día Comunitario cuenta con una bolsa de trabajo para facilitar la inserción laboral
              de las personas que participan en nuestros dispositivos.
            </p>
            
            <h4 className="text-xl font-bold mt-6 mb-3">¿Cómo funciona?</h4>
            <p className="mb-4">
              La bolsa de trabajo funciona como un espacio de intermediación entre personas que buscan empleo
              y empresas o particulares que necesitan trabajadores. También brindamos orientación laboral y
              apoyo en la búsqueda de empleo.
            </p>

            <h4 className="text-xl font-bold mt-6 mb-3">Servicios que ofrecemos</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Registro de postulantes</li>
              <li>Orientación laboral</li>
              <li>Armado de CV</li>
              <li>Preparación para entrevistas</li>
              <li>Vinculación con ofrecimientos laborales</li>
              <li>Seguimiento post-inserción</li>
            </ul>

            <h4 className="text-xl font-bold mt-6 mb-3">¿Cómo participar?</h4>
            <p className="mb-4">
              Para acceder a la bolsa de trabajo, te invitamos a acercarte personalmente al centro
              para una primera entrevista. Allí podremos conocer tu perfil, tus intereses y tus necesidades.
            </p>

            <div className="bg-cdc-green/10 p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-3">Visitanos</h4>
              <p className="mb-2"><strong>Dirección:</strong> Calle Trenel N°53, 25 de Mayo, La Pampa</p>
              <p className="mb-2"><strong>Horarios de atención:</strong></p>
              <ul className="ml-6 mb-3">
                <li>Mañanas: Lunes a Viernes 9:00 - 12:00 hs</li>
                <li>Tardes: Lunes, Miércoles y Jueves 16:00 - 19:00 hs</li>
                <li>Tardes: Martes y Viernes 17:00 - 20:00 hs</li>
              </ul>
              <p><strong>Teléfono:</strong> 299 4152668</p>
              <p><strong>Email:</strong> cdc.25demayolp.coordinacion@gmail.com</p>
            </div>
          </div>
        }
      />

      <ArticleModal
        isOpen={activeModal === 'teatro'}
        onClose={() => setActiveModal(null)}
        title="Teatro Leído"
        image="/images/hero/hero-principal.jpg"
        content={
          <div>
            <p className="text-lg mb-4">
              El taller de Teatro Leído es un espacio de expresión artística donde la palabra cobra vida a través
              de la lectura dramatizada de obras teatrales.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">¿Qué es el teatro leído?</h4>
            <p className="mb-4">
              Es una forma de hacer teatro donde los actores leen en voz alta un texto dramático, 
              interpretando a los personajes y dando vida a la historia sin necesidad de memorizar el texto.
              Esto permite enfocarse en la expresión, la entonación y la conexión emocional con el personaje.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-3">Actividades</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lectura dramatizada de obras clásicas y contemporáneas</li>
              <li>Ejercicios de voz y expresión oral</li>
              <li>Trabajo sobre personajes y emociones</li>
              <li>Improvisaciones y juegos teatrales</li>
              <li>Presentaciones para la comunidad</li>
            </ul>
            <h4 className="text-xl font-bold mt-6 mb-3">Horario</h4>
            <p className="mb-4">Viernes: 18:00 - 19:00 hs</p>
            <h4 className="text-xl font-bold mt-6 mb-3">Beneficios</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mejora de la expresión oral y corporal</li>
              <li>Desarrollo de la confianza y autoestima</li>
              <li>Trabajo en equipo y colaboración</li>
              <li>Conexión con las emociones propias y ajenas</li>
              <li>Espacio de creatividad y disfrute</li>
            </ul>
            <p className="mt-6 italic text-gray-600">
              No se requiere experiencia previa. Todos son bienvenidos a sumarse y descubrir el mundo del teatro.
            </p>
          </div>
        }
      />
    </div>
  )
}
