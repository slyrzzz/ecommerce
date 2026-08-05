import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { es } from '@payloadcms/translations/languages/es';
import { en } from '@payloadcms/translations/languages/en';
import { resendAdapter } from '@payloadcms/email-resend';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './src/lib/payload/collections/Users';
import { Media } from './src/lib/payload/collections/Media';
import { Categories } from './src/lib/payload/collections/Categories';
import { Products } from './src/lib/payload/collections/Products';
import { Carts } from './src/lib/payload/collections/Carts';
import { Orders } from './src/lib/payload/collections/Orders';
import { Pages } from './src/lib/payload/collections/Pages';
import { StoreManagement } from './src/lib/payload/globals/StoreManagement';
import { StoreIdentity } from './src/lib/payload/globals/StoreIdentity';
import { StoreContact } from './src/lib/payload/globals/StoreContact';
import { StoreLegal } from './src/lib/payload/globals/StoreLegal';

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
      beforeNavLinks: ['@/lib/payload/components/AdminSidebarHeader#AdminSidebarHeader'],
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
  // Configuración de correo usando Resend
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_DEFAULT_FROM_ADDRESS || 'onboarding@resend.dev',
    defaultFromName: process.env.RESEND_DEFAULT_FROM_NAME || 'Tienda (Pruebas)',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  // Colecciones (las definiremos en la Fase 2)
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Carts,
    Orders,
    Pages,
  ],
  globals: [
    StoreManagement,
    StoreIdentity,
    StoreContact,
    StoreLegal,
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
