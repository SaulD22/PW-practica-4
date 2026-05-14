
class AIRequestHandler {
  constructor(rawText, metadata = {}) {
    this.rawText  = rawText;
    this.metadata = metadata;
    this.sanitizedText = this.#sanitize(rawText);
    this.wordCount     = this.#countWords(this.sanitizedText);
    this.timestamp     = new Date().toISOString();
  }

  // Eliminacion de caracteres que podrían causar problemas en prompts
  #sanitize(text) {
    return text
      .replace(/[<>{}[\]\\]/g, '')          
      .replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ.,;:!?¿¡()\-"'@]/g, '') 
      .replace(/\s{2,}/g, ' ')            
      .trim();
  }

  // Cuenta las palabras del texto
  #countWords(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  // Devuelve el objeto listo para enviar al modelo de lenguaje
  toAPIPayload() {
    return {
      model:    'gemini-pro',        // modelo destino
      prompt:   this.sanitizedText,  // texto limpio
      metadata: {
        ...this.metadata,
        wordCount:  this.wordCount,
        submittedAt: this.timestamp,
      },
    };
  }

  // Resumen del objeto para logs / respuesta al cliente
  getSummary() {
    return {
      wordCount:        this.wordCount,
      sanitizedPreview: this.sanitizedText.substring(0, 60),
      timestamp:        this.timestamp,
      payload:          this.toAPIPayload(),
    };
  }
}


export default function handler(req, res) {

  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido. Usa POST.' });
  }

  // ---- Extraer datos del body ----
  const { nombre, apellidos, correo, propuesta } = req.body;

  // ---- Validación de campos requeridos (estructuras de control) ----
  if (!nombre || !apellidos || !correo || !propuesta) {
    return res.status(400).json({
      message: 'Todos los campos son obligatorios.',
    });
  }

  // Validar formato de correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ message: 'Correo electrónico inválido.' });
  }

  // ---- Contar palabras y validar extensión mínima ----
  const MIN_WORDS = 10;
  const rawWords  = propuesta.trim().split(/\s+/).filter(w => w.length > 0);

  if (rawWords.length < MIN_WORDS) {
    return res.status(400).json({
      message: `La propuesta debe tener al menos ${MIN_WORDS} palabras. ` +
               `Se detectaron: ${rawWords.length}.`,
    });
  }

  const handler = new AIRequestHandler(propuesta, {
    nombre:    nombre.trim(),
    apellidos: apellidos.trim(),
    correo:    correo.trim(),
  });

  const summary = handler.getSummary();

  console.log('[AIRequestHandler] Propuesta procesada:', summary);

  return res.status(200).json({
    message: 'Datos listos para ser enviados a una IA',
    details: {
      wordCount:        summary.wordCount,
      sanitizedPreview: summary.sanitizedPreview,
      timestamp:        summary.timestamp,
    },
    apiPayload: summary.payload,
  });
}