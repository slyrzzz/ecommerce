import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Organiza las categorías de productos de la tienda.',
  },
  access: {
    read: () => true, // Acceso público
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Nombre de la Categoría *',
          admin: {
            width: '60%',
            description: 'Nombre visible de la categoría en la tienda.',
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
            description: 'Identificador para la URL (ej. ropa-de-verano). En minúsculas y separado por guiones.',
          },
        },
      ],
    },
  ],
};
