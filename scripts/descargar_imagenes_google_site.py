"""
Script mejorado para descargar todas las imágenes del Google Site del CDC
y organizarlas automáticamente en las carpetas correctas.

Uso: python scripts/descargar_imagenes_google_site.py
"""

import os
import sys
import requests
from bs4 import BeautifulSoup
import mimetypes
from pathlib import Path
from urllib.parse import urljoin, urlparse
import time
from PIL import Image

# URL del Google Site
GOOGLE_SITE_URL = "https://sites.google.com/view/centro-de-dia-25-de-mayo/"

# Páginas a procesar
PAGINAS = {
    "inicio": "https://sites.google.com/view/centro-de-dia-25-de-mayo/",
    "transformarte": "https://sites.google.com/view/centro-de-dia-25-de-mayo/transformarte",
    "expresamente": "https://sites.google.com/view/centro-de-dia-25-de-mayo/expresamente",
    "amor-huerta": "https://sites.google.com/view/centro-de-dia-25-de-mayo/amor-de-huerta",
    "noticias": "https://sites.google.com/view/centro-de-dia-25-de-mayo/noticias",
}

# Carpetas de destino
BASE_DIR = Path(__file__).parent.parent / "public" / "images"
FOLDERS = {
    "inicio": BASE_DIR / "hero",
    "transformarte": BASE_DIR / "talleres",
    "expresamente": BASE_DIR / "talleres",
    "amor-huerta": BASE_DIR / "talleres",
    "noticias": BASE_DIR / "noticias",
    "logos": BASE_DIR / "logos",
}

# Headers para simular navegador
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    "Referer": "https://sites.google.com/",
}


def crear_carpetas():
    """Crear estructura de carpetas si no existe"""
    for folder in FOLDERS.values():
        folder.mkdir(parents=True, exist_ok=True)
    print("✅ Carpetas creadas/verificadas")


def detectar_extension_real(filepath, url=None):
    """
    Detectar la extensión real de un archivo usando múltiples métodos:
    1. Pillow (detectar formato de imagen)
    2. MIME type del archivo
    3. Content-Type del servidor (si se proporciona URL)
    """
    # Método 1: Usar Pillow para detectar formato
    try:
        with Image.open(filepath) as img:
            format_name = img.format.lower() if img.format else None
            if format_name:
                return "jpg" if format_name == "jpeg" else format_name
    except Exception:
        pass
    
    # Método 2: MIME type
    mime = mimetypes.guess_type(filepath)[0]
    if mime:
        ext = mime.split("/")[-1]
        return "jpg" if ext == "jpeg" else ext
    
    # Método 3: Intentar desde la URL
    if url:
        try:
            response = requests.head(url, headers=HEADERS, timeout=5)
            content_type = response.headers.get("Content-Type", "")
            if "image/" in content_type:
                ext = content_type.split("/")[-1].split(";")[0]
                return "jpg" if ext == "jpeg" else ext
        except:
            pass
    
    # Fallback: jpg por defecto
    return "jpg"


def descargar_imagen(url, destino, nombre_base):
    """
    Descargar una imagen desde una URL y guardarla con el nombre correcto
    """
    try:
        print(f"  📥 Descargando: {url[:80]}...")
        response = requests.get(url, headers=HEADERS, timeout=15, stream=True)
        response.raise_for_status()
        
        # Guardar temporalmente
        temp_path = destino / f"{nombre_base}_temp"
        with open(temp_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Detectar extensión real
        ext = detectar_extension_real(temp_path, url)
        
        # Renombrar con la extensión correcta
        final_path = destino / f"{nombre_base}.{ext}"
        temp_path.rename(final_path)
        
        print(f"  ✅ Guardada: {final_path.name}")
        return final_path
        
    except Exception as e:
        print(f"  ❌ Error al descargar {url}: {e}")
        if temp_path.exists():
            temp_path.unlink()
        return None


def extraer_imagenes_pagina(url, seccion):
    """
    Extraer todas las URLs de imágenes de una página del Google Site
    """
    try:
        print(f"\n🔍 Procesando: {seccion.upper()}")
        print(f"   URL: {url}")
        
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Buscar todas las imágenes
        imagenes = []
        
        # Método 1: Tags <img>
        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src")
            if src:
                # Google Sites usa URLs especiales, construir URL completa
                if src.startswith("//"):
                    src = "https:" + src
                elif src.startswith("/"):
                    src = urljoin(GOOGLE_SITE_URL, src)
                
                # Filtrar imágenes relevantes (no iconos pequeños)
                if "googleusercontent.com" in src or "ggpht.com" in src:
                    # Mejorar calidad: cambiar parámetros de tamaño
                    if "=w" in src or "=s" in src:
                        src = src.split("=")[0] + "=w2000"
                    imagenes.append(src)
        
        # Método 2: Buscar en atributos style con background-image
        for element in soup.find_all(style=True):
            style = element.get("style", "")
            if "background-image" in style and "url(" in style:
                start = style.find("url(") + 4
                end = style.find(")", start)
                url_img = style[start:end].strip("'\"")
                if url_img.startswith("//"):
                    url_img = "https:" + url_img
                if "googleusercontent.com" in url_img or "ggpht.com" in url_img:
                    if "=w" in url_img or "=s" in url_img:
                        url_img = url_img.split("=")[0] + "=w2000"
                    imagenes.append(url_img)
        
        # Eliminar duplicados
        imagenes = list(set(imagenes))
        
        print(f"   📊 Encontradas: {len(imagenes)} imágenes")
        return imagenes
        
    except Exception as e:
        print(f"   ❌ Error al procesar {url}: {e}")
        return []


def procesar_todas_las_paginas():
    """
    Procesar todas las páginas del Google Site y descargar sus imágenes
    """
    crear_carpetas()
    
    print("\n" + "="*70)
    print("🚀 INICIANDO DESCARGA DE IMÁGENES DEL GOOGLE SITE DEL CDC")
    print("="*70)
    
    total_descargadas = 0
    total_errores = 0
    
    for seccion, url in PAGINAS.items():
        imagenes = extraer_imagenes_pagina(url, seccion)
        
        if not imagenes:
            print(f"   ⚠️  No se encontraron imágenes en {seccion}")
            continue
        
        # Determinar carpeta de destino
        destino = FOLDERS.get(seccion, FOLDERS["inicio"])
        
        # Descargar cada imagen
        for idx, img_url in enumerate(imagenes, 1):
            nombre_base = f"{seccion}-{idx}"
            resultado = descargar_imagen(img_url, destino, nombre_base)
            
            if resultado:
                total_descargadas += 1
            else:
                total_errores += 1
            
            # Pequeña pausa para no saturar el servidor
            time.sleep(0.5)
    
    # Buscar y descargar logos específicos
    print("\n🔍 Buscando logos institucionales...")
    logos_url = GOOGLE_SITE_URL
    imagenes_logos = extraer_imagenes_pagina(logos_url, "logos")
    
    # Filtrar logos (generalmente son pequeños o están en el footer)
    for idx, img_url in enumerate(imagenes_logos[:5], 1):  # Limitar a 5 logos
        nombre_base = f"logo-{idx}"
        resultado = descargar_imagen(img_url, FOLDERS["logos"], nombre_base)
        if resultado:
            total_descargadas += 1
        else:
            total_errores += 1
        time.sleep(0.5)
    
    # Resumen final
    print("\n" + "="*70)
    print("📊 RESUMEN FINAL")
    print("="*70)
    print(f"✅ Imágenes descargadas exitosamente: {total_descargadas}")
    print(f"❌ Errores: {total_errores}")
    print(f"📁 Ubicación: {BASE_DIR}")
    print("="*70)
    
    # Listar archivos descargados por carpeta
    print("\n📂 ARCHIVOS POR CARPETA:")
    for nombre, carpeta in FOLDERS.items():
        archivos = list(carpeta.glob("*.*"))
        # Filtrar solo imágenes (no SVG creados previamente)
        archivos = [f for f in archivos if f.suffix.lower() in [".jpg", ".jpeg", ".png", ".gif", ".webp"]]
        print(f"   {nombre.upper()}: {len(archivos)} archivos")
        for archivo in sorted(archivos):
            print(f"      • {archivo.name}")


def renombrar_imagenes_descargadas():
    """
    Renombrar las imágenes descargadas con nombres más descriptivos
    """
    print("\n🔄 Renombrando imágenes con nombres descriptivos...")
    
    # Mapeo de nombres descriptivos
    renombres = {
        "transformarte": ["transformarte-principal", "transformarte-actividad", "transformarte-muestra"],
        "expresamente": ["expresamente-principal", "expresamente-taller", "expresamente-obra"],
        "amor-huerta": ["amor-huerta-principal", "amor-huerta-cultivo", "amor-huerta-cosecha"],
        "noticias": ["noticia-evento", "noticia-actividad", "noticia-taller"],
        "inicio": ["hero-principal", "hero-actividad", "hero-comunidad"],
    }
    
    for seccion, nombres in renombres.items():
        carpeta = FOLDERS.get(seccion, FOLDERS["inicio"])
        archivos = sorted([f for f in carpeta.glob("*.*") 
                          if f.suffix.lower() in [".jpg", ".jpeg", ".png", ".gif", ".webp"]])
        
        for idx, archivo in enumerate(archivos):
            if idx < len(nombres):
                nuevo_nombre = f"{nombres[idx]}{archivo.suffix}"
            else:
                nuevo_nombre = f"{seccion}-extra-{idx+1}{archivo.suffix}"
            
            nuevo_path = carpeta / nuevo_nombre
            if not nuevo_path.exists():
                archivo.rename(nuevo_path)
                print(f"   ✅ {archivo.name} → {nuevo_nombre}")


if __name__ == "__main__":
    try:
        # Verificar dependencias
        try:
            from bs4 import BeautifulSoup
        except ImportError:
            print("❌ Error: beautifulsoup4 no está instalado")
            print("   Instala con: pip install beautifulsoup4 requests")
            sys.exit(1)
        
        # Ejecutar descarga
        procesar_todas_las_paginas()
        
        # Renombrar con nombres descriptivos
        renombrar_imagenes_descargadas()
        
        print("\n✅ ¡PROCESO COMPLETADO!")
        print("💡 Ahora puedes usar estas imágenes en el landing page")
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Proceso cancelado por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

