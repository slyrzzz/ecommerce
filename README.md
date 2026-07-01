# Storefront E-commerce Premium (Diseño Saleor + Payload CMS 3.0) 🚀

Este proyecto es una plataforma de comercio electrónico de alto rendimiento con el **diseño limpio y premium de Saleor Storefront (Paper)**, pero completamente adaptado para correr con un backend **local y embebido** basado en **Payload CMS 3.0** y **MongoDB Atlas**.

Está especialmente diseñado para comercios independientes que quieren un catálogo visual elegante similar al de Saleor, pero sin los costos y complejidades de un servidor GraphQL externo. Integra la subida de imágenes a **Cloudinary** y el procesamiento de pedidos mediante redirección directa al **API de WhatsApp**.

---

## 🏗️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) con Tailwind CSS 3 y componentes interactivos basados en Radix UI.
- **Backend Embebido**: Payload CMS 3.0 corriendo dentro del mismo servidor de Next.js (Local API rápido y sin latencia externa).
- **Base de Datos**: MongoDB Atlas (Capa gratuita M0, ideal para el catálogo de productos y usuarios).
- **Almacenamiento Multimedia**: Cloudinary (Capa gratuita de 25GB) integrado en las colecciones multimedia de Payload para la subida de imágenes de productos.
- **Checkout**: Integración modular con redirección dinámica al API de WhatsApp, enviando un mensaje detallado con los productos, cantidades y subtotal del pedido.

---

## ✨ Características de Diseño y Administración

1. **Diseño Visual Saleor Storefront**:
   - Selector dinámico de variantes, galería interactiva de imágenes y drawer lateral de carrito fluido.
   - Rendimiento optimizado y excelente experiencia en dispositivos móviles.
2. **Panel de Administración optimizado**:
   - Ubicado en `/admin` (o ruta personalizada definida por variable de entorno).
   - Estructura limpia de pestañas para la colección de Productos (Detalles, Ficha Técnica, Multimedia).
   - Soporte para descripción enriquecida Lexical, SKU, control de inventario (Stock), precio de comparación/oferta y especificaciones estructuradas en tabla.

---

## 🛠️ Requisitos Previos

Asegúrate de contar con las siguientes cuentas antes de levantar el proyecto en casa:
- **Node.js** v20 o superior.
- Cuenta en **MongoDB Atlas** (Base de datos gratuita).
- Cuenta en **Cloudinary** (Configuración para almacenamiento de imágenes).
- Número de WhatsApp habilitado para recibir pedidos.

---

## 🚀 Configuración y Puesta en Marcha en Casa

### 1. Clonar el repositorio e instalar dependencias
Instala los paquetes necesarios en el directorio raíz usando `npm`:

```bash
npm install
```

### 2. Configurar el archivo de entorno
Crea tu archivo `.env` local copiando el archivo de muestra:

```bash
cp .env.example .env
```

Abre el archivo `.env` y define tus credenciales:
- `MONGODB_URI`: URL de conexión de MongoDB Atlas.
- `PAYLOAD_SECRET`: Una clave aleatoria larga para encriptación de sesiones.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credenciales de tu API de Cloudinary.
- `PANEL_ROUTE`: Ruta de acceso al panel de administración (por ejemplo, `/admin`).
- `WHATSAPP_NUMBER`: Número internacional de teléfono (sin el `+`) que recibirá los pedidos de tus clientes (Ejemplo: `50761416952`).

### 3. Registrar los componentes en Payload
Para que Payload CMS registre la interfaz de usuario correctamente, debes generar el mapa de importaciones:

```bash
npx payload generate:importmap
```

> 💡 **Nota**: Se recomienda ejecutar este comando siempre que agregues nuevas colecciones, relaciones o modifiques la estructura profunda de esquemas en Payload.

### 4. Ejecutar el servidor en desarrollo

```bash
npm run dev
```

El servidor local se iniciará en [http://localhost:3000](http://localhost:3000).

---

## 💾 Sembrado de Datos Iniciales (Seeding)

Para poblar automáticamente tu base de datos y Cloudinary con productos y categorías reales de prueba:

1. Asegúrate de tener el servidor corriendo localmente en modo desarrollo.
2. Abre tu navegador y dirígete a [http://localhost:3000/api/seed](http://localhost:3000/api/seed).
3. El script descargará imágenes de relojes de muestra (Picsum) y las registrará en Cloudinary y MongoDB. Al terminar, verás un mensaje JSON de éxito.
4. Ahora, al cargar la página principal de la tienda, ya verás el catálogo con las imágenes y productos sembrados.

---

## 🔑 Acceso al Administrador y Primer Registro

1. Accede a tu panel en la ruta configurada en `PANEL_ROUTE` (por ejemplo: [http://localhost:3000/admin](http://localhost:3000/admin)).
2. El sistema detectará que es la primera vez que se accede y te solicitará crear un correo y contraseña de administrador (mínimo 12 caracteres).
3. Una vez registrado, podrás gestionar las colecciones de **Usuarios**, **Multimedia**, **Categorías**, **Productos** y **Carritos**.
