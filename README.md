# Plan de Mantenimiento - Sistema de Gestión

Sistema web full-stack para la gestión de mantenimiento de maquinaria pesada.

## 🚀 Tecnologías

### Backend
- Node.js + Express
- Python (pandas, openpyxl) para lectura de Excel
- API REST

### Frontend
- React 18
- Vite
- React Router
- CSS moderno con glassmorphism

## 📁 Estructura del Proyecto

```
plan_mant/
├── backend/
│   ├── server.js          # Servidor Express
│   ├── read_sheet.py      # Script Python para leer Excel
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── venv/                  # Entorno virtual Python
└── Plan_Mant.xlsm        # Archivo Excel con datos
```

## 🔧 Instalación

### 1. Backend

```bash
cd backend
npm install
```

### 2. Frontend

```bash
cd frontend
npm install
```

## ▶️ Ejecución

### Iniciar Backend (Terminal 1)

```bash
cd backend
node server.js
```

El backend estará disponible en: `http://localhost:3001`

### Iniciar Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📊 Características

### Dashboard
- Estadísticas generales del sistema
- Resumen de maquinaria, personal, herramientas e insumos
- Acciones rápidas

### Maquinaria
- Inventario completo de equipos pesados
- Detalles de cada máquina (marca, modelo, año, estado)
- Vista en tarjetas con diseño moderno

### Personal
- Directorio de empleados
- Información de contacto completa
- Tabla con búsqueda y filtrado

### Mantenimiento
- Planes de mantenimiento por horas (10, 50, 250, 500, 1000, 2000)
- Cronogramas mensuales
- Check lists por tipo de equipo
- Reportes diarios

### Inventario
- Herramientas disponibles
- Insumos y materiales
- Control de stock
- Vista con pestañas

## 🎨 Diseño

- **Tema oscuro premium** con gradientes
- **Glassmorphism** para efectos de vidrio
- **Animaciones suaves** y transiciones
- **Diseño responsive** para todos los dispositivos
- **Tipografía moderna** (Inter de Google Fonts)

## 📡 API Endpoints

- `GET /api/health` - Estado del servidor
- `GET /api/sheets` - Lista de todas las hojas
- `GET /api/sheet/:name` - Datos de una hoja específica
- `GET /api/machinery` - Inventario de maquinaria
- `GET /api/personnel` - Datos de personal
- `GET /api/tools` - Herramientas
- `GET /api/supplies` - Insumos
- `GET /api/stats` - Estadísticas del dashboard

## 🛠️ Desarrollo

### Agregar nuevas páginas

1. Crear componente en `frontend/src/pages/`
2. Agregar ruta en `App.jsx`
3. Actualizar navegación en `Navbar.jsx`

### Agregar nuevos endpoints

1. Agregar ruta en `backend/server.js`
2. Actualizar `frontend/src/services/api.js`

## 📝 Notas

- Asegúrate de que el entorno virtual de Python (`venv`) esté activado
- El archivo `Plan_Mant.xlsm` debe estar en la raíz del proyecto
- El backend debe estar ejecutándose antes de iniciar el frontend

## 🎯 Próximos Pasos

- Implementar búsqueda y filtrado avanzado
- Agregar gráficos y visualizaciones
- Exportar reportes a PDF
- Sistema de autenticación
- Edición de datos en tiempo real

---

**Desarrollado con ❤️ para la gestión eficiente de mantenimiento**
