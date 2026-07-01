import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Acceso público
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nombre de la Categoría',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL amigable (ej. ropa-de-verano)',
      },
    },
  ],
};
