import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Restricción estricta de MIME-Types a imágenes seguras/optimizadas
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    staticDir: 'public/media', // Directorio temporal local si no hay cloud
    // Cloudinary adapter hooks son inyectados automáticamente por el plugin en payload.config.ts
  },
  access: {
    read: () => true, // Acceso público para visualizar imágenes en la tienda
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto Alternativo (SEO)',
    },
  ],
};
