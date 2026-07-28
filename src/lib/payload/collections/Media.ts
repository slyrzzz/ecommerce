import type { CollectionConfig } from 'payload';
import { v2 as cloudinary } from 'cloudinary';

// Configuración segura del cliente de Cloudinary en entorno de servidor
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

async function uploadBufferToCloudinary(
  buffer: Buffer,
  filename: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'storefront-media',
        resource_type: 'auto',
        public_id: filename.replace(/\.[^/.]+$/, ''),
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Error al subir imagen a Cloudinary'));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );
    stream.end(buffer);
  });
}

function optimizeCloudinaryUrl(url: unknown): string | null {
  if (typeof url !== 'string' || !url) return null;
  if (!url.includes('cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }
  if (url.includes('/image/upload/f_auto,q_auto/')) {
    return url;
  }
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Restricción estricta de MIME-Types a imágenes seguras/optimizadas
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    staticDir: process.env.VERCEL ? '/tmp' : 'public/media',
    disableLocalStorage: true,
    adminThumbnail: ({ doc }) =>
      optimizeCloudinaryUrl(
        (doc as Record<string, unknown>)?.cloudinaryURL ||
          (doc as Record<string, unknown>)?.url
      ) || null,
    handlers: [
      async (req, { doc }) => {
        const targetUrl =
          (doc as Record<string, unknown>)?.cloudinaryURL ||
          (doc as Record<string, unknown>)?.url;
        if (
          targetUrl &&
          typeof targetUrl === 'string' &&
          /^https?:\/\//i.test(targetUrl)
        ) {
          const optimized = optimizeCloudinaryUrl(targetUrl) || targetUrl;
          return Response.redirect(optimized, 302);
        }
        return null;
      },
    ],
  },
  access: {
    read: () => true, // Acceso público para visualizar imágenes en la tienda
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (req.file && req.file.data && process.env.CLOUDINARY_CLOUD_NAME) {
          try {
            const res = await uploadBufferToCloudinary(
              req.file.data,
              req.file.name || 'image'
            );
            const optimized =
              optimizeCloudinaryUrl(res.secure_url) || res.secure_url;
            data.cloudinaryURL = optimized;
            data.cloudinaryPublicId = res.public_id;
            data.url = optimized; // URL en el CDN global de Cloudinary optimizada con f_auto, q_auto
          } catch (err) {
            req.payload.logger.error(`Error subiendo imagen a Cloudinary: ${err}`);
          }
        }
        return data;
      },
    ],
    afterRead: [
      ({ doc }) => {
        if (doc?.cloudinaryURL) {
          doc.url = optimizeCloudinaryUrl(doc.cloudinaryURL) || doc.cloudinaryURL;
        } else if (doc?.url) {
          doc.url = optimizeCloudinaryUrl(doc.url) || doc.url;
        }
        return doc;
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        if (doc?.cloudinaryPublicId && process.env.CLOUDINARY_CLOUD_NAME) {
          try {
            await cloudinary.uploader.destroy(doc.cloudinaryPublicId);
          } catch (err) {
            req.payload.logger.error(`Error borrando imagen de Cloudinary: ${err}`);
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto Alternativo (SEO)',
    },
    {
      name: 'cloudinaryURL',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'URL directa en CDN de Cloudinary',
      },
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
};
