import type { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'totalPrice', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      label: 'Order Number',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Customer Account',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'saved',
      options: [
        { label: 'No completado (Guardado)', value: 'saved' },
        { label: 'Enviado por WhatsApp', value: 'whatsapp_sent' },
        { label: 'Completado', value: 'completed' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
      required: true,
      label: 'Order Status',
    },
    {
      name: 'customer',
      type: 'group',
      label: 'Customer Information',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'address', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
      ],
    },
    {
      name: 'lines',
      type: 'array',
      label: 'Order Lines',
      fields: [
        { name: 'productName', type: 'text', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'merchandiseId', type: 'text', required: false },
      ],
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
      label: 'Total Price',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      label: 'Currency',
    },
  ],
};
