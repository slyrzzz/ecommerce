import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { es } from '@payloadcms/translations/languages/es';
import { en } from '@payloadcms/translations/languages/en';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './src/lib/payload/collections/Users';
import { Media } from './src/lib/payload/collections/Media';
import { Categories } from './src/lib/payload/collections/Categories';
import { Products } from './src/lib/payload/collections/Products';
import { Carts } from './src/lib/payload/collections/Carts';
import { Orders } from './src/lib/payload/collections/Orders';
import { StoreManagement } from './src/lib/payload/globals/StoreManagement';
import { StoreIdentity } from './src/lib/payload/globals/StoreIdentity';
import { StoreContact } from './src/lib/payload/globals/StoreContact';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  i18n: {
    supportedLanguages: { es, en },
    fallbackLanguage: 'es',
  },
  // Panel de administración camuflado mediante variable de entorno
  admin: {
    user: 'users',
    components: {
      beforeNavLinks: ['@/lib/payload/components/AdminDashboardButton#AdminDashboardButton'],
      graphics: {
        Icon: '@/lib/payload/components/AdminHeaderIcon#AdminHeaderIcon',
        Logo: '@/lib/payload/components/AdminHeaderIcon#AdminHeaderIcon',
      },
    },
  },
  // Configuración de rutas administrativas del CMS
  routes: {
    admin: process.env.PANEL_ROUTE || '/admin',
  },
  // Colecciones (las definiremos en la Fase 2)
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Carts,
    Orders,
  ],
  globals: [
    StoreManagement,
    StoreIdentity,
    StoreContact,
  ],
  plugins: [],
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
