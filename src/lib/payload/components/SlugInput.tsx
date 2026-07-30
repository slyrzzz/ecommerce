'use client';

import React, { useEffect, useCallback } from 'react';
import { useField, useFormFields, FieldLabel } from '@payloadcms/ui';
import { formatSlugString } from '../utils/slug-utils';

interface SlugInputProps {
  path: string;
  field: {
    label?: string;
    name: string;
    required?: boolean;
    admin?: {
      description?: string;
    };
  };
}

export const SlugInput: React.FC<SlugInputProps> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path });

  // Sincronizamos con el campo title del formulario en tiempo real
  const titleValue = useFormFields(([fields]) => fields.title?.value as string);

  // Cuando el título cambia y el slug está vacío, completamos el slug automáticamente
  useEffect(() => {
    if (titleValue && typeof titleValue === 'string') {
      const generated = formatSlugString(titleValue);
      if (!value || value.trim() === '') {
        setValue(generated);
      }
    }
  }, [titleValue, value, setValue]);

  const handleGenerateFromTitle = useCallback(() => {
    if (titleValue && typeof titleValue === 'string') {
      setValue(formatSlugString(titleValue));
    }
  }, [titleValue, setValue]);

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      <FieldLabel
        label={field.label || 'URL Slug'}
        required={field.required}
        path={path}
      />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => setValue(formatSlugString(e.target.value))}
          placeholder="ej: gamuza-blanca"
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid var(--theme-elevation-250, #3f3f46)',
            borderRadius: '4px',
            backgroundColor: 'var(--theme-input-bg, #18181b)',
            color: 'var(--theme-text, #f4f4f5)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleGenerateFromTitle}
          title="Regenerar URL slug automáticamente desde el nombre del producto"
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--theme-elevation-150, #27272a)',
            border: '1px solid var(--theme-elevation-300, #3f3f46)',
            borderRadius: '4px',
            color: 'var(--theme-text, #f4f4f5)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.15s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--theme-elevation-200, #3f3f46)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150, #27272a)')}
        >
          Generar desde nombre
        </button>
      </div>
      {field.admin?.description && (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--theme-elevation-600, #a1a1aa)',
            marginTop: '6px',
          }}
        >
          {field.admin.description}
        </div>
      )}
    </div>
  );
};
