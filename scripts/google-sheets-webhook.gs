// Google Apps Script para recibir datos del bot CDC
// Instrucciones:
// 1. Ir a https://script.google.com
// 2. Nuevo proyecto
// 3. Pegar este código
// 4. Desplegar como Web App
// 5. Copiar URL y agregar a .env como GOOGLE_SHEETS_WEBHOOK_URL

// =====================================================
// CONFIGURACIÓN
// =====================================================

// ID de tu Google Sheet (obtener de la URL)
const SPREADSHEET_ID = '1vcUEk78giKIktMRtkpDv-eTk-7LSEVqQwqxakwfBMnc';

// =====================================================
// FUNCIÓN PRINCIPAL - Recibe POST del bot
// =====================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet || 'Conversaciones';
    const rowData = data.data;

    // Abrir spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(sheetName);

    // Si la hoja no existe, crearla
    if (!sheet) {
      sheet = createSheet(ss, sheetName);
    }

    // Agregar fila
    sheet.appendRow(rowData);

    // Actualizar estadísticas diarias
    updateDailyStats(ss);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// =====================================================
// CREAR HOJAS CON ESTRUCTURA
// =====================================================

function createSheet(ss, sheetName) {
  let sheet;

  if (sheetName === 'Conversaciones') {
    sheet = ss.insertSheet('Conversaciones');
    sheet.appendRow([
      'Timestamp',
      'Session ID',
      'Mensaje Usuario',
      'Mensaje Normalizado',
      'Respuesta Bot',
      'RAG Usado',
      'Modelo',
      'Tiempo Respuesta (ms)',
      'Error',
      'Mensaje Error',
      'Opción Menú',
      'Relevancia Contexto',
      'User Agent',
      'Fue Útil'
    ]);
    
    // Formato
    sheet.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    sheet.setFrozenRows(1);
    
  } else if (sheetName === 'Estadísticas Diarias') {
    sheet = ss.insertSheet('Estadísticas Diarias');
    sheet.appendRow([
      'Fecha',
      'Total Sesiones',
      'Total Mensajes',
      'Usuarios Únicos',
      'Promedio Mensajes/Sesión',
      'Tiempo Respuesta Promedio',
      'Tasa de Error (%)',
      'Preguntas Top 5',
      'Tópicos Top 5',
      'Hora Pico'
    ]);
    
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    sheet.setFrozenRows(1);
    
  } else if (sheetName === 'Sesiones') {
    sheet = ss.insertSheet('Sesiones');
    sheet.appendRow([
      'Session ID',
      'Inicio',
      'Fin',
      'Duración (min)',
      'Total Mensajes',
      'Mensajes Usuario',
      'Mensajes Bot',
      'Errores',
      'Tiempo Respuesta Promedio',
      'Opciones Menú',
      'Consultas RAG',
      'Tópicos'
    ]);
    
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#fbbc04').setFontColor('white');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// =====================================================
// ACTUALIZAR ESTADÍSTICAS DIARIAS
// =====================================================

function updateDailyStats(ss) {
  const conversationsSheet = ss.getSheetByName('Conversaciones');
  const statsSheet = ss.getSheetByName('Estadísticas Diarias') || createSheet(ss, 'Estadísticas Diarias');
  
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  
  // Obtener datos de hoy
  const data = conversationsSheet.getDataRange().getValues();
  const todayData = data.filter((row, index) => {
    if (index === 0) return false; // Skip header
    const rowDate = Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    return rowDate === today;
  });

  if (todayData.length === 0) return;

  // Calcular métricas
  const totalMessages = todayData.length;
  const uniqueSessions = [...new Set(todayData.map(row => row[1]))].length;
  const avgMessagesPerSession = (totalMessages / uniqueSessions).toFixed(2);
  const avgResponseTime = (todayData.reduce((sum, row) => sum + row[7], 0) / totalMessages).toFixed(0);
  const errorCount = todayData.filter(row => row[8] === 'Sí').length;
  const errorRate = ((errorCount / totalMessages) * 100).toFixed(2);

  // Top preguntas
  const questions = {};
  todayData.forEach(row => {
    const q = row[2].substring(0, 100); // Primeros 100 chars
    questions[q] = (questions[q] || 0) + 1;
  });
  const topQuestions = Object.entries(questions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([q, count]) => `${q} (${count})`)
    .join(' | ');

  // Actualizar o agregar fila
  const statsData = statsSheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < statsData.length; i++) {
    const rowDate = Utilities.formatDate(new Date(statsData[i][0]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    if (rowDate === today) {
      rowIndex = i + 1;
      break;
    }
  }

  const newRow = [
    today,
    uniqueSessions,
    totalMessages,
    uniqueSessions, // Aproximación de usuarios únicos
    avgMessagesPerSession,
    avgResponseTime,
    errorRate,
    topQuestions,
    '', // Tópicos (se puede calcular)
    '' // Hora pico (se puede calcular)
  ];

  if (rowIndex > 0) {
    statsSheet.getRange(rowIndex, 1, 1, 10).setValues([newRow]);
  } else {
    statsSheet.appendRow(newRow);
  }
}

// =====================================================
// FUNCIONES DE PRUEBA
// =====================================================

function testWebhook() {
  const testData = {
    sheet: 'Conversaciones',
    data: [
      new Date().toISOString(),
      'test_session_123',
      'Hola, que talleres hay?',
      'hola que talleres hay',
      'Tenemos 5 talleres disponibles...',
      'Sí',
      'llama-70b',
      1234,
      'No',
      '',
      '',
      0.85,
      'Test User Agent',
      ''
    ]
  };

  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(e);
  Logger.log(result.getContent());
}

function initializeSpreadsheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Crear todas las hojas necesarias
  createSheet(ss, 'Conversaciones');
  createSheet(ss, 'Estadísticas Diarias');
  createSheet(ss, 'Sesiones');
  
  Logger.log('Spreadsheet inicializado correctamente');
}

