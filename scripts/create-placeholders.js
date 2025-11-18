/**
 * Script para crear imágenes placeholder con Canvas para el CDC
 * Uso: node scripts/create-placeholders.js
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuración de placeholders
const placeholders = [
  // Hero
  { name: 'cdc-hero.jpg', folder: 'hero', width: 1920, height: 1080, bg: '#1e7e34', text: 'Centro de Día\nComunitario\n25 de Mayo' },
  
  // Talleres
  { name: 'transformarte.jpg', folder: 'talleres', width: 800, height: 600, bg: '#9333ea', text: 'TransformArte\n♻️' },
  { name: 'amor-huerta.jpg', folder: 'talleres', width: 800, height: 600, bg: '#10b981', text: 'Amor de Huerta\n🌱' },
  { name: 'expresamente.jpg', folder: 'talleres', width: 800, height: 600, bg: '#3b82f6', text: 'ExpresaMente\n✍️' },
  { name: 'teatro.jpg', folder: 'talleres', width: 800, height: 600, bg: '#ec4899', text: 'Teatro Leído\n🎭' },
  { name: 'espacio-grupal.jpg', folder: 'talleres', width: 800, height: 600, bg: '#f59e0b', text: 'Espacio Grupal\n💬' },
  { name: 'columna-radial.jpg', folder: 'talleres', width: 800, height: 600, bg: '#ef4444', text: 'Columna Radial\n📻' },
  
  // Noticias
  { name: 'actividades-comunitarias.jpg', folder: 'noticias', width: 1200, height: 800, bg: '#06b6d4', text: 'Actividades\nComunitarias' },
  { name: 'la-voz-cdc.jpg', folder: 'noticias', width: 1200, height: 800, bg: '#0891b2', text: 'La Voz del CDC\n📰' },
  
  // Logos
  { name: 'sedronar-logo.png', folder: 'logos', width: 400, height: 200, bg: '#ffffff', text: 'SEDRONAR' },
  { name: 'gobierno-pampa-logo.png', folder: 'logos', width: 400, height: 200, bg: '#ffffff', text: 'Gobierno\nLa Pampa' },
  { name: 'municipalidad-logo.png', folder: 'logos', width: 400, height: 200, bg: '#ffffff', text: 'Municipalidad\n25 de Mayo' },
];

/**
 * Crear una imagen placeholder
 */
function createPlaceholder({ name, folder, width, height, bg, text }) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fondo
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  
  // Texto
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.floor(width / 15)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Texto multilínea
  const lines = text.split('\n');
  const lineHeight = Math.floor(width / 12);
  const startY = (height / 2) - ((lines.length - 1) * lineHeight / 2);
  
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + (index * lineHeight));
  });
  
  // Guardar
  const folderPath = path.join(__dirname, '..', 'public', 'images', folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  const filepath = path.join(folderPath, name);
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(filepath, buffer);
  
  console.log(`✅ Creado: ${folder}/${name}`);
}

/**
 * Crear todos los placeholders
 */
function createAllPlaceholders() {
  console.log('🎨 Creando imágenes placeholder...\n');
  
  try {
    placeholders.forEach(createPlaceholder);
    console.log(`\n✅ ${placeholders.length} imágenes creadas exitosamente!`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Si el error es "Cannot find module \'canvas\'", instala con:');
    console.log('   npm install canvas');
  }
}

// Ejecutar
if (require.main === module) {
  createAllPlaceholders();
}

module.exports = { createPlaceholder, createAllPlaceholders };

