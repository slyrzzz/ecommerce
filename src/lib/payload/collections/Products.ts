import type { CollectionConfig } from 'payload';
import {
  lexicalEditor,
  HeadingFeature,
} from '@payloadcms/richtext-lexical';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'price', 'inventory', 'updatedAt'],
    description: 'Gestión del catálogo de productos.',
  },
  access: {
    read: () => true, // Catálogo público
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Información General',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Nombre del Producto',
              admin: {
                description: 'Nombre claro y conciso del producto.',
              },
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              label: 'Descripción (Soporta formato enriquecido)',
              admin: {
                description: 'Detalla las características de tu producto. Usa estilos, listas y emojis para destacar información.',
              },
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures.filter((feature) => feature.key !== 'heading'),
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                ],
              }),
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'sku',
                  type: 'text',
                  label: 'SKU (Unidad de Mantenimiento de Stock)',
                  admin: {
                    width: '50%',
                    description: 'Código de referencia interno único.',
                  },
                },
                {
                  name: 'inventory',
                  type: 'number',
                  label: 'Inventario (Stock)',
                  defaultValue: 0,
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Cantidad de unidades disponibles para la venta.',
                  },
                },
              ],
            },
            {
              name: 'compareAtPrice',
              type: 'number',
              label: 'Precio Anterior / Compare at price ($)',
              admin: {
                description: 'Precio original sin descuento. Aparecerá tachado si es mayor al precio actual.',
              },
            },
          ],
        },
        {
          label: 'Ficha Técnica',
          fields: [
            {
              name: 'specifications',
              type: 'array',
              label: 'Especificaciones',
              labels: {
                singular: 'Especificación',
                plural: 'Especificaciones',
              },
              admin: {
                description: 'Agrega pares de especificaciones técnicas (ej. Material -> Acero, Movimiento -> Cuarzo).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Nombre de la propiedad',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      label: 'Valor',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Multimedia',
          fields: [
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              required: true,
              label: 'Galería de Imágenes',
              admin: {
                description: 'Sube imágenes cuadradas (1:1) para mantener un diseño limpio. La primera imagen será la principal.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado del Producto',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Publicado', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Determina si el producto es visible en la tienda.',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Precio Actual ($)',
      admin: {
        position: 'sidebar',
        description: 'Precio final de venta (aplicará el cobro sobre este valor).',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      label: 'Categoría',
      admin: {
        position: 'sidebar',
        description: 'Asigna una o más categorías a este producto.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
        description: 'Identificador único en la URL. Usualmente en minúsculas y separado por guiones.',
      },
    },
  ],
};
