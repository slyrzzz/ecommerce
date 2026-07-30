import type { CollectionConfig } from 'payload';
import {
  lexicalEditor,
  HeadingFeature,
} from '@payloadcms/richtext-lexical';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'showInFooter', 'updatedAt'],
    description: 'Páginas informativas de la tienda (ej: Preguntas Frecuentes, Envío, Devoluciones, Contacto).',
  },
  access: {
    read: () => true, // Páginas públicas
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título de la Página *',
          admin: {
            width: '60%',
            description: 'Nombre de la página visible para los usuarios.',
          },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'URL Slug *',
          admin: {
            width: '40%',
            description: 'Identificador URL (ej. faq, envio, contacto, devoluciones).',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'published',
          options: [
            { label: 'Publicado', value: 'published' },
            { label: 'Borrador', value: 'draft' },
          ],
          label: 'Estado',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'showInFooter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar enlace en el Footer de la tienda',
          admin: {
            width: '50%',
            description: 'Si está activo, aparecerá un enlace a esta página en el pie de página.',
          },
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Contenido de la Página *',
      admin: {
        description: 'Escribe y da formato al contenido de la página (títulos, listas, negritas, enlaces).',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        ],
      }),
    },
  ],
};
