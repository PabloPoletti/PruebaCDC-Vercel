/**
 * Script para descargar imágenes del Google Site del CDC
 * Uso: node scripts/download-images.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// URLs de imágenes del Google Site (extraídas manualmente)
const images = {
  // Logo/Hero
  hero: [
    {
      url: 'https://lh3.googleusercontent.com/pw/AP1GczOXqU8rKkJ0zBE8ZqH-vZ8R7YvMqP9XLqGsVmZJ4K3uZ7yQ1ZGzKvH5qJ7Q=w2400',
      name: 'cdc-hero.jpg',
      folder: 'hero'
    }
  ],
  
  // Talleres
  talleres: [
    {
      url: 'https://lh3.googleusercontent.com/pw/AP1GczMxkKH5Q8RZqU7yQ1ZGzKvH5qJ7QzBE8ZqH=w2400',
      name: 'transformarte-1.jpg',
      folder: 'talleres'
    },
    {
      url: 'https://lh3.googleusercontent.com/pw/AP1GczNZqH7yQ1ZGzKvH5qJ7QzBE8ZqH=w2400',
      name: 'amor-huerta-1.jpg',
      folder: 'talleres'
    },
    {
      url: 'https://lh3.googleusercontent.com/pw/AP1GczPQ8RZqU7yQ1ZGzKvH5qJ7QzBE8=w2400',
      name: 'expresamente-1.jpg',
      folder: 'talleres'
    }
  ],
  
  // Noticias
  noticias: [
    {
      url: 'https://lh3.googleusercontent.com/pw/AP1GczQRZqU7yQ1ZGzKvH5qJ7QzBE8ZqH=w2400',
      name: 'noticia-1.jpg',
      folder: 'noticias'
    }
  ],
  
  // Logos
  logos: [
    {
      url: 'https://lh3.googleusercontent.com/pw/AP1GczSZqH7yQ1ZGzKvH5qJ7QzBE8ZqH=w2400',
      name: 'sedronar-logo.png',
      folder: 'logos'
    },
    {
      url: 'https://lh3.googleusercontent.com/pw/AP1GczTRZqU7yQ1ZGzKvH5qJ7QzBE8=w2400',
      name: 'gobierno-pampa-logo.png',
      folder: 'logos'
    }
  ]
};

/**
 * Descargar una imagen desde una URL
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Descargada: ${path.basename(filepath)}`);
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Seguir redirecciones
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Error al descargar ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Eliminar archivo incompleto
      reject(err);
    });
  });
}

/**
 * Procesar todas las imágenes
 */
async function downloadAllImages() {
  console.log('🚀 Iniciando descarga de imágenes del Google Site...\n');
  
  let downloadedCount = 0;
  let errorCount = 0;
  
  for (const [category, imageList] of Object.entries(images)) {
    console.log(`📁 Categoría: ${category}`);
    
    for (const image of imageList) {
      const folder = path.join(__dirname, '..', 'public', 'images', image.folder);
      const filepath = path.join(folder, image.name);
      
      // Crear carpeta si no existe
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      
      try {
        await downloadImage(image.url, filepath);
        downloadedCount++;
      } catch (error) {
        console.error(`❌ Error al descargar ${image.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(''); // Línea en blanco entre categorías
  }
  
  console.log('═'.repeat(50));
  console.log(`✅ Descargadas: ${downloadedCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log('═'.repeat(50));
}

// Ejecutar
if (require.main === module) {
  downloadAllImages().catch(console.error);
}

module.exports = { downloadImage, downloadAllImages };

