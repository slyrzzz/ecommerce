import type { CollectionConfig } from 'payload';
import {
  lexicalEditor,
  HeadingFeature,
} from '@payloadcms/richtext-lexical';
import { formatSlugHook } from '../utils/slug-utils';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'price', 'inventory', 'updatedAt'],
    description: 'Gestión completa del catálogo de productos (sin barra lateral dividida).',
  },
  access: {
    read: () => true, // Catálogo público
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Información Básica',
          description: 'Detalles principales, enlace web y estado de publicación en la tienda.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Nombre del Producto *',
                  admin: {
                    width: '70%',
                    description: 'Nombre claro y atractivo que verán los clientes en la tienda.',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  label: 'Estado en la Tienda *',
                  defaultValue: 'draft',
                  required: true,
                  options: [
                    { label: '🟡 Borrador (Oculto)', value: 'draft' },
                    { label: '🟢 Publicado (Visible)', value: 'published' },
                  ],
                  admin: {
                    width: '30%',
                    description: 'Determina si el producto se muestra públicamente.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'URL Slug (Enlace permanente) *',
                  hooks: {
                    beforeValidate: [formatSlugHook('title')],
                  },
                  admin: {
                    width: '50%',
                    description: 'Enlace amigable (ej: gamuza-blanca). Se llena automáticamente del nombre o puedes editarlo.',
                    components: {
                      Field: '@/lib/payload/components/SlugInput#SlugInput',
                    },
                  },
                },
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'categories',
                  hasMany: true,
                  required: true,
                  label: 'Categoría(s) del Producto *',
                  admin: {
                    width: '50%',
                    description: 'Selecciona una o más categorías para organizar el producto.',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              label: 'Descripción Comercial *',
              admin: {
                description: 'Detalla características y beneficios. Puedes usar subtítulos, negritas y listas.',
              },
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures.filter((feature) => feature.key !== 'heading'),
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                ],
              }),
            },
          ],
        },
        {
          label: 'Precios e Inventario',
          description: 'Control de precios de venta, descuentos y existencias disponibles.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: 'Precio Actual de Venta ($) *',
                  admin: {
                    width: '50%',
                    description: 'Precio final que se cobrará al cliente en la tienda.',
                  },
                },
                {
                  name: 'compareAtPrice',
                  type: 'number',
                  label: 'Precio Anterior / Original ($) (Opcional)',
                  admin: {
                    width: '50%',
                    description: 'Si es mayor al Precio Actual, aparecerá tachado indicando descuento.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'sku',
                  type: 'text',
                  label: 'SKU (Código Interno de Referencia)',
                  admin: {
                    width: '50%',
                    description: 'Código único para identificación en tu inventario.',
                  },
                },
                {
                  name: 'inventory',
                  type: 'number',
                  label: 'Unidades en Stock *',
                  defaultValue: 0,
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Cantidad física disponible para la venta inmediata.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Multimedia y Ficha Técnica',
          description: 'Galería visual y tabla de especificaciones técnicas del producto.',
          fields: [
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              required: true,
              label: 'Galería de Imágenes del Producto *',
              admin: {
                description: 'Sube imágenes claras (recomendado formato 1:1 o cuadrado). La primera imagen será la portada.',
              },
            },
            {
              name: 'specifications',
              type: 'array',
              label: 'Tabla de Especificaciones Técnicas (Opcional)',
              labels: {
                singular: 'Especificación',
                plural: 'Especificaciones',
              },
              admin: {
                description: 'Agrega pares de datos técnicos (Ejemplo: Material -> Acero Inoxidable, Color -> Negro Mate).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Característica (Ej: Material)',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      label: 'Valor (Ej: Aluminio Anodizado)',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      label: 'Ícono',
                      defaultValue: 'none',
                      admin: {
                        width: '20%',
                        components: {
                          Field: '@/lib/payload/components/IconPicker#IconPicker',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
