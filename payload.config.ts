import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { cloudinaryStorage } from 'payload-cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './src/lib/payload/collections/Users';
import { Media } from './src/lib/payload/collections/Media';
import { Categories } from './src/lib/payload/collections/Categories';
import { Products } from './src/lib/payload/collections/Products';
import { Carts } from './src/lib/payload/collections/Carts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Panel de administración camuflado mediante variable de entorno
  admin: {
    user: 'users',
  },
  // Si no se define PANEL_ROUTE, se usa un hash por defecto para evitar exposición
  // Importante: Al no tener NEXT_PUBLIC_, esta var solo vive en el servidor
  routes: {
    admin: process.env.PANEL_ROUTE || '/panel-secreto',
  },
  // Colecciones (las definiremos en la Fase 2)
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Carts,
  ],
  plugins: [
    cloudinaryStorage({
      collections: {
        media: true,
      },
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
      },
    }),
  ],
  editor: lexicalEditor({}),
  // Secret server-side puro, sin NEXT_PUBLIC_
  secret: process.env.PAYLOAD_SECRET || 'secret-development-key',
  db: mongooseAdapter({
    // URI server-side pura, sin NEXT_PUBLIC_
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1/vercel-commerce-payload',
    transactionOptions: false,
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
