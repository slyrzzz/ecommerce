import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutos
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
