import type { CollectionConfig } from 'payload';

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'id',
    group: 'Shop',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'lines',
      type: 'array',
      fields: [
        {
          name: 'merchandiseId',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
      ],
    },
  ],
};
