import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutos
    forgotPassword: {
      generateEmailHTML: ({ req, token, user }) => {
        // En Next.js App Router, el frontend normalmente usa una página para resetear
        // Ajustaremos la URL según el diseño del storefront. Asumiremos /reset-password
        const resetUrl = `${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        
        return `
          <h1>Restablecer Contraseña</h1>
          <p>Hola ${user.firstName || 'cliente'},</p>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para cambiarla:</p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background-color:#000;color:#fff;text-decoration:none;border-radius:5px;">Restablecer Contraseña</a>
          <p>Si no fuiste tú, puedes ignorar este correo.</p>
        `;
      },
    }
  },
  admin: {
    useAsTitle: 'email',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // En Payload 3.0, data ya contiene los valores parseados del request
        const password = (data as any)?.password;
        
        if (password && typeof password === 'string') {
          const isLongEnough = password.length >= 8;

          if (!isLongEnough) {
            throw new Error('La contraseña debe tener al menos 8 caracteres.');
          }
        }
        return data;
      }
    ]
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number (WhatsApp)',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
    },
    {
      name: 'city',
      type: 'text',
      label: 'City',
    },
  ],
};
