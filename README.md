# Circulapp Frontend

¡Bienvenido a **Circulapp Frontend**!  
Este proyecto es la interfaz de usuario de Circulapp, una aplicación orientada a la economía circular, sostenibilidad y gestión de recursos. Está desarrollado principalmente con **React** y otras tecnologías modernas de frontend.

## Características

- Interfaz intuitiva para usuarios finales
- Visualización de recursos disponibles y gestionados
- Flujos para registro, inicio de sesión y administración
- Integración con API backend para datos dinámicos
- Diseño responsivo adaptable a diferentes dispositivos

## Tecnologías utilizadas

- **React** (JavaScript)
- **Vite** o **Create React App** (según configuración)
- **CSS Modules** / **Styled Components** / **Tailwind** (dependiendo del stack usado)
- **Axios** para solicitudes HTTP
- **React Router** para navegación
- Otros: ver `package.json`

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/MayraMoy/circulapp-frontend.git
   cd circulapp-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Inicia el proyecto:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

## Uso

- Accede a la aplicación en [http://localhost:3000](http://localhost:3000) (o el puerto configurado).
- Regístrate o inicia sesión para comenzar a usar las funcionalidades.
- Explora las diferentes secciones y gestiona recursos de acuerdo a tus necesidades.

## Configuración

Si necesitas conectar con un backend, configura las variables de entorno en un archivo `.env`:
```
VITE_API_URL=https://tuservidorbackend.com/api
```

## Estructura del proyecto

```
src/
│
├── components/       # Componentes reutilizables
├── pages/            # Vistas principales
├── services/         # Lógica para consumo de APIs
├── assets/           # Imágenes, estilos, fuentes
├── App.jsx           # Componente raíz de la aplicación
└── main.jsx          # Punto de entrada
```

## Contribución

¡Las contribuciones son bienvenidas!  
Por favor abre un issue o pull request para sugerencias, mejoras o correcciones.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

**Contacto:**  
¿Dudas o comentarios? Puedes contactar a [MayraMoy](https://github.com/MayraMoy) directamente en GitHub.

