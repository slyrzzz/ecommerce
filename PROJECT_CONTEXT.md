# Contexto y Estrategia del Proyecto (Project Context)

Este documento contiene la visión de negocio, el modelo operativo y las decisiones de infraestructura de este proyecto. **Todos los agentes de IA deben leer este documento antes de sugerir cambios arquitectónicos o de infraestructura.**

## 1. Visión del Producto
- **Público Objetivo**: Tiendas que actualmente venden por Instagram o redes sociales y no tienen una página web propia.
- **Propuesta de Valor**: Entregarles un catálogo web/tienda online autogestionable, rápido y con su propia identidad visual (logo, colores), para que sus clientes puedan ver productos y realizar pedidos de forma mucho más sencilla.
- **Promesa de Servicio**: El despliegue y entrega de la tienda al cliente debe realizarse en un máximo de **24 horas**.
- **Gestión de Contenido**: El cliente o administrador utiliza el panel de control de Payload CMS para subir productos, cambiar logos o colores. Estos cambios se ven reflejados **de inmediato** en la tienda.

## 2. Arquitectura de Despliegue (Modelo Single-Tenant)
- No es una plataforma tipo SaaS donde todos inician sesión en la misma web.
- Es un modelo **Single-Tenant**: Este repositorio funciona como una "plantilla maestra". Por cada cliente nuevo, se realiza un despliegue de un proyecto totalmente independiente.
- Cada tienda tiene su propio servidor de frontend, su propia base de datos y sus propias credenciales.

## 3. Estrategia de Infraestructura y Escalabilidad

El proyecto se diseñó inicialmente intentando apalancarse al 100% en las capas gratuitas (Free Tiers) de varios servicios. A continuación se detallan los límites de este modelo y las opciones recomendadas para escalar:

### Vercel (Hosting del Frontend/CMS)
- **Límite Gratuito (Hobby)**: Vercel permite alojar múltiples proyectos de forma gratuita, PERO sus términos de servicio prohíben estrictamente el uso comercial (como tiendas online que procesan pedidos). Vercel suele escanear y suspender este tipo de proyectos.
- **Opción de Pago (Recomendada)**: Adquirir el plan **Vercel Pro ($20/mes)**. Este plan permite uso comercial y el despliegue de miles de proyectos bajo la misma cuenta. Con esto, se cubre el hosting de todos los clientes sin riesgo de suspensión.

### MongoDB Atlas (Base de Datos)
- **Límite Gratuito (M0 Cluster)**: MongoDB otorga bases de datos gratuitas de 512MB. Sin embargo, **solo permite 1 base de datos gratuita por cuenta de correo**. Además, tiene un límite crítico de **500 conexiones simultáneas**. 
- **Opción A (Gratuita pero inviable operativamente)**: Crear un correo electrónico distinto y registrar una cuenta nueva de MongoDB por cada cliente que llegue. Esto hace que gestionar bases de datos, contraseñas o resolver problemas técnicos de los clientes sea muy lento y caótico, arruinando la promesa de entrega en 24h.
- **Opción B (De Pago - Recomendada)**: Usar un solo cluster compartido de pago (Ej. **Cluster M2 por ~$9/mes**). Desde una sola cuenta y pantalla de MongoDB se pueden crear instancias de bases de datos ilimitadas en 2 segundos por cada cliente nuevo, soportando miles de conexiones sin caídas.

### Cloudinary (Hosting de Imágenes)
- **Límite Gratuito**: 25 créditos mensuales (equivale a 25GB de almacenamiento o ancho de banda).
- **Veredicto**: Extremadamente generoso. Una sola cuenta gratuita centralizada puede alojar las imágenes de decenas de tiendas pequeñas de Instagram antes de llegar al límite. Una vez alcanzado, se puede migrar a su plan Plus ($89/mes) o crear una cuenta por cliente (más fácil que Mongo ya que no tiene límites estrictos de cuentas por IP en la capa gratis).

### Resend (Correos Transaccionales)
- **Límite Gratuito**: Permite enviar 3,000 correos al mes, pero **solo permite 1 solo dominio verificado por cuenta**.
- **Veredicto**: Como cada cliente querrá enviar correos desde su propio dominio (o desde el correo que te proporcione), la solución operativa es crear una cuenta gratuita de Resend por cada cliente (usando su propio email). Se genera su `RESEND_API_KEY` y se coloca en las variables de entorno de su tienda en Vercel.

## 4. Notas de Desarrollo
- La arquitectura ya **no depende de Saleor**. Todo el stack es Next.js + Payload CMS 3 manejando nativamente Productos, Órdenes, Usuarios y el carrito.
- La estética debe ser siempre moderna, limpia, y la experiencia de usuario debe priorizar la visualización en dispositivos móviles (Mobile First), dado que el tráfico provendrá de Instagram.
