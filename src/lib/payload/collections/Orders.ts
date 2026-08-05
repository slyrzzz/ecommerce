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
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Si el estado cambió a 'completed' y antes no lo estaba
        if (doc.status === 'completed' && previousDoc.status !== 'completed') {
          try {
            // Buscamos el correo del cliente. Puede estar referenciado por User o podemos enviarlo al admin como fallback si no hay correo directo.
            // Para fines de esta implementación, asumiremos que si hay usuario relacionado, le enviamos el correo a ese usuario.
            let emailTo = '';
            
            if (doc.user) {
              const user = typeof doc.user === 'object' ? doc.user : await req.payload.findByID({ collection: 'users', id: doc.user });
              if (user && user.email) {
                emailTo = user.email;
              }
            }

            if (emailTo) {
              await req.payload.sendEmail({
                to: emailTo,
                subject: `Tu pedido #${doc.orderNumber} ha sido completado`,
                html: `
                  <h1>¡Gracias por tu compra!</h1>
                  <p>Hola ${doc.customer?.firstName || 'cliente'},</p>
                  <p>Tu pedido <strong>#${doc.orderNumber}</strong> ha sido confirmado y está siendo procesado.</p>
                  <p>Total: $${doc.totalPrice} ${doc.currency || 'USD'}</p>
                  <p>Te avisaremos cuando tu orden esté en camino hacia ${doc.customer?.address || 'tu domicilio'}.</p>
                `,
              });
              req.payload.logger.info(`Correo de pedido completado enviado a ${emailTo}`);
            }
          } catch (error) {
            req.payload.logger.error(`Error enviando correo de orden: ${error}`);
          }
        }
        return doc;
      }
    ]
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
