import type { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Pedido',
    plural: 'Pedidos',
  },
  admin: {
    useAsTitle: 'orderNumber',
    group: 'E-Commerce',
    defaultColumns: ['orderNumber', 'status', 'totalPrice', 'createdAt'],
    description: 'Pedidos guardados o realizados por clientes. Puedes consultar el teléfono y datos de envío para contactar por WhatsApp o procesar la orden.',
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
      label: 'Número de Orden',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Cuenta de Cliente',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'saved',
      options: [
        { label: 'No completado (Guardado)', value: 'saved' },
        { label: 'Enviado por WhatsApp', value: 'whatsapp_sent' },
        { label: 'En Proceso', value: 'processing' },
        { label: 'Completado', value: 'completed' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
      required: true,
      label: 'Estado del Pedido',
    },
    {
      name: 'customer',
      type: 'group',
      label: 'Información y Datos de Contacto del Cliente',
      fields: [
        { name: 'firstName', type: 'text', required: true, label: 'Nombre' },
        { name: 'lastName', type: 'text', required: true, label: 'Apellido' },
        { name: 'phone', type: 'text', required: true, label: 'Teléfono / WhatsApp' },
        { name: 'address', type: 'text', required: true, label: 'Dirección de Entrega' },
        { name: 'city', type: 'text', required: true, label: 'Ciudad' },
      ],
    },
    {
      name: 'lines',
      type: 'array',
      label: 'Productos de la Orden',
      fields: [
        { name: 'productName', type: 'text', required: true, label: 'Nombre del Producto' },
        { name: 'quantity', type: 'number', required: true, label: 'Cantidad' },
        { name: 'price', type: 'number', required: true, label: 'Precio Unitario' },
        { name: 'merchandiseId', type: 'text', required: false, label: 'ID de Producto' },
      ],
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
      label: 'Total de la Orden',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      label: 'Moneda',
    },
  ],
};
