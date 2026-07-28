'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useField, FieldLabel } from '@payloadcms/ui';
import {
  Ban,
  Check,
  Layers,
  Ruler,
  Scale,
  Shield,
  Droplets,
  Battery,
  Cpu,
  Wifi,
  Bluetooth,
  Star,
  Leaf,
  Wrench,
  Shirt,
  Sparkles,
  Clock,
  Zap,
  Lock,
  Globe,
} from 'lucide-react';

interface IconOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const ICON_OPTIONS: IconOption[] = [
  { value: 'none', label: 'Sin ícono (Por defecto)', icon: <Ban className="w-4 h-4 text-neutral-400" /> },
  { value: 'check', label: 'Check (✔)', icon: <Check className="w-4 h-4" /> },
  { value: 'layers', label: 'Material / Capas', icon: <Layers className="w-4 h-4" /> },
  { value: 'ruler', label: 'Medidas / Tamaño', icon: <Ruler className="w-4 h-4" /> },
  { value: 'weight', label: 'Peso / Báscula', icon: <Scale className="w-4 h-4" /> },
  { value: 'shield', label: 'Resistencia / Escudo', icon: <Shield className="w-4 h-4" /> },
  { value: 'droplets', label: 'Agua / Impermeable', icon: <Droplets className="w-4 h-4" /> },
  { value: 'battery', label: 'Batería / Energía', icon: <Battery className="w-4 h-4" /> },
  { value: 'cpu', label: 'Tecnología / CPU', icon: <Cpu className="w-4 h-4" /> },
  { value: 'wifi', label: 'Conectividad / Wifi', icon: <Wifi className="w-4 h-4" /> },
  { value: 'bluetooth', label: 'Bluetooth', icon: <Bluetooth className="w-4 h-4" /> },
  { value: 'star', label: 'Garantía / Estrella', icon: <Star className="w-4 h-4" /> },
  { value: 'leaf', label: 'Ecológico / Hoja', icon: <Leaf className="w-4 h-4" /> },
  { value: 'wrench', label: 'Herramienta / Montaje', icon: <Wrench className="w-4 h-4" /> },
  { value: 'shirt', label: 'Prenda / Tela', icon: <Shirt className="w-4 h-4" /> },
  { value: 'sparkles', label: 'Destacado / Sparkles', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'clock', label: 'Tiempo / Duración', icon: <Clock className="w-4 h-4" /> },
  { value: 'zap', label: 'Carga rápida / Rayo', icon: <Zap className="w-4 h-4" /> },
  { value: 'lock', label: 'Seguridad / Candado', icon: <Lock className="w-4 h-4" /> },
  { value: 'globe', label: 'Global / Mundo', icon: <Globe className="w-4 h-4" /> },
];

export const IconPicker: React.FC<{ path: string; field: { label?: string; name: string } }> = ({
  path,
  field,
}) => {
  const { value, setValue } = useField<string>({ path });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentValue = value || 'none';
  const selectedOption =
    ICON_OPTIONS.find((opt) => opt.value === currentValue) || ICON_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="field-type text" ref={containerRef} style={{ position: 'relative' }}>
      <FieldLabel label={field?.label || 'Ícono'} />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title={selectedOption?.label}
          className="flex h-10 w-12 items-center justify-center rounded-md border border-neutral-300 bg-white shadow-sm transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          style={{ cursor: 'pointer' }}
        >
          {selectedOption?.icon}
        </button>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[120px]">
          {selectedOption?.label}
        </span>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 z-50 mt-1.5 w-64 rounded-lg border border-neutral-300 bg-white p-2.5 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
          style={{ top: '100%' }}
        >
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Seleccionar ícono
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {ICON_OPTIONS.map((option) => {
              const isSelected = option.value === currentValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setValue(option.value);
                    setIsOpen(false);
                  }}
                  title={option.label}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-400 scale-105 shadow-sm'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  {option.icon}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
