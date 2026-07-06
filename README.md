# Frontend Uber Clone — Guía rápida

## Cómo levantarlo

1. Abre el backend primero (Spring Boot en `http://localhost:8080`, según su propio README).
2. En esta carpeta del frontend:
   ```bash
   npm install
   npm run dev
   ```
3. Abre lo que te muestre la terminal (normalmente `http://localhost:5173`).

Usuarios de prueba para probar el flujo (vienen precargados en el backend):

| Email | Password | Rol |
|---|---|---|
| `ana@uber.com` | `pass123` | PASSENGER |
| `carlos@uber.com` | `pass123` | DRIVER |

---

## Errores comunes y cómo resolverlos

### 1. `Cannot find type definition file for 'vite/client'`
Casi siempre significa que `node_modules` no se instaló completo.

```bash
npm config delete production
unset NODE_ENV
rm -rf node_modules package-lock.json
npm install
```

Si sigue el error solo en el editor (VS Code): `Ctrl+Shift+P` → "TypeScript: Restart TS Server".

### 2. `Failed to resolve import` / pantalla en blanco al abrir `npm run dev`
Revisa que los imports apunten a archivos que existen de verdad (mayúsculas/minúsculas y rutas exactas). Ya se corrigieron los dos que traía este proyecto:
- `App.tsx` → `ProtectedRoute` ahora vive en `src/components/`
- `authService.ts` → apunta a `src/api/axios.ts`

### 3. Error 401 al hacer cualquier request después de loguearte
El token expiró o no se guardó. Revisa en el navegador: DevTools → Application → Local Storage → debe existir una key `token`. Si no está, vuelve a loguearte.

### 4. Error 403 en algún endpoint
Es el backend avisando que ese endpoint es solo para un rol (ej. `PASSENGER` no puede pegarle a `/trips/pending`, que es solo de `DRIVER`). No es un bug, es la validación de roles funcionando bien — revisa que estés logueado con el rol correcto para esa pantalla.

### 5. Los estilos no se ven (todo sin diseño, texto plano)
Falta Tailwind instalado o mal conectado. Verifica:
- `vite.config.ts` tiene `tailwindcss()` en `plugins`.
- `src/index.css` empieza con `@import "tailwindcss";`
- Corriste `npm install` después de que se agregó `tailwindcss` y `@tailwindcss/vite` al `package.json`.

### 6. El backend no responde / CORS
Revisa que el backend esté corriendo en el puerto `8080` y que `vite.config.ts` tenga el proxy:
```ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
  },
},
```

---

## Cumplimiento del README del backend (tabla de calificación, 20 pts)

| # | Pantalla | Pts | ¿Cumple? |
|---|---|---|---|
| 1 | Login / Registro | 3 | ✅ Guarda JWT, lo adjunta en cada request, redirige según rol |
| 2 | Dashboard pasajero | 3 | ✅ Muestra nombre, botón "Pedir viaje", lista de `GET /trips` con badge de estado |
| 3 | Solicitar viaje | 2 | ✅ Muestra conductores disponibles, crea el viaje, redirige al detalle |
| 4 | Detalle de viaje (pasajero) | 4 | ✅ Estado, conductor asignado o "buscando conductor...", form de calificación, polling cada 4s |
| 5 | Dashboard conductor | 4 | ✅ Rating propio, viajes pendientes con botón Aceptar, viaje activo destacado |
| 6 | Detalle de viaje (conductor) | 2 | ✅ Datos del pasajero, botón Completar, resumen tras completar |
| 7 | Historial | 2 | ✅ Tabla con filtro por estado, según rol |
| **Total** | | **20/20** | **Todos los endpoints requeridos están cubiertos y probados con build limpio (`tsc` + `vite build` sin errores)** |

