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
          const hasUppercase = /[A-Z]/.test(password);
          const hasNumber = /\d/.test(password);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          const isLongEnough = password.length >= 12;

          if (!hasUppercase || !hasNumber || !hasSpecialChar || !isLongEnough) {
            throw new Error('Políticas de seguridad: La contraseña debe tener al menos 12 caracteres, incluir una mayúscula, un número y un carácter especial.');
          }
        }
        return data;
      }
    ]
  },
  fields: [
    // Email is automatically added by Payload when auth: true
  ],
};
