// ========================================
// backend/src/server.js
// ========================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

console.log('🌸 Iniciando SakuraDevClass Backend...');

// Middleware de seguridad
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Demasiadas peticiones, intenta de nuevo en 15 minutos'
  }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// ========================================
// RUTAS
// ========================================

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🌸 SakuraDevClass API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de bienvenida
app.get('/api', (req, res) => {
  res.json({
    message: '🌸 Bienvenido a SakuraDevClass API',
    version: '1.0.0',
    endpoints: [
      'GET /api/health - Health check',
      'GET /api/projects - Obtener proyectos',
      'GET /api/students - Obtener estudiantes',
      'POST /api/contact - Enviar mensaje'
    ]
  });
});

// Rutas de datos (mock por ahora)
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        title: 'E-commerce Vintage',
        description: 'Tienda online con estética retro',
        technologies: ['React', 'Node.js', 'MongoDB'],
        difficulty: 'Intermedio',
        season: 'Verano',
        status: 'Completado',
        featured: true,
        sakuraPoints: 75,
        students: [
          {
            _id: 's1',
            name: 'María García',
            avatar: 'https://via.placeholder.com/150x150/FFB7C5/FFFFFF?text=MG'
          }
        ]
      },
      {
        _id: '2',
        title: 'API de Biblioteca',
        description: 'Sistema de gestión de libros',
        technologies: ['Node.js', 'Express', 'MySQL'],
        difficulty: 'Avanzado',
        season: 'Otoño',
        status: 'En Progreso',
        featured: false,
        sakuraPoints: 50,
        students: [
          {
            _id: 's2',
            name: 'Carlos López',
            avatar: 'https://via.placeholder.com/150x150/FFB7C5/FFFFFF?text=CL'
          }
        ]
      }
    ],
    count: 2
  });
});

app.get('/api/students', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: 's1',
        name: 'María García',
        email: 'maria@example.com',
        avatar: 'https://via.placeholder.com/150x150/FFB7C5/FFFFFF?text=MG',
        bio: 'Desarrolladora Frontend apasionada por React',
        currentLevel: 'Intermedio',
        totalSakuraPoints: 150,
        skills: [
          { name: 'React', level: 4 },
          { name: 'JavaScript', level: 4 },
          { name: 'CSS', level: 3 }
        ]
      },
      {
        _id: 's2',
        name: 'Carlos López',
        email: 'carlos@example.com',
        avatar: 'https://via.placeholder.com/150x150/FFB7C5/FFFFFF?text=CL',
        bio: 'Backend developer enfocado en APIs',
        currentLevel: 'Avanzado',
        totalSakuraPoints: 200,
        skills: [
          { name: 'Node.js', level: 5 },
          { name: 'MongoDB', level: 4 },
          { name: 'Express', level: 5 }
        ]
      }
    ],
    count: 2
  });
});

// Ruta de contacto (POST)
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validación básica
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }
  
  // Simular envío de email (aquí iría nodemailer)
  console.log('📮 Nuevo mensaje de contacto:', { name, email, subject });
  
  res.json({
    success: true,
    message: '🌸 Mensaje enviado correctamente. Te responderé pronto!'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada 🌸',
    availableRoutes: ['/api/health', '/api/projects', '/api/students', '/api/contact']
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🌸'.repeat(20));
  console.log(`🌸 Servidor SakuraDevClass corriendo`);
  console.log(`🌸 Puerto: ${PORT}`);
  console.log(`🌸 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌸 Health Check: http://localhost:${PORT}/api/health`);
  console.log('🌸'.repeat(20));
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Error no manejado:', err.message);
  process.exit(1);
});

module.exports = app;