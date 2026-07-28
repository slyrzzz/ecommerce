'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useField, FieldLabel } from '@payloadcms/ui';
import {
  Ban,
  Check,
  Layers,
  Ruler,
  Scale,
  ShieldCheck,
  Droplets,
  BatteryCharging,
  Cpu,
  Wifi,
  Bluetooth,
  Clock,
  Zap,
  Leaf,
  Package,
  Monitor,
  Volume2,
  Camera,
  HardDrive,
  Globe,
} from 'lucide-react';

interface IconOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const ICON_OPTIONS: IconOption[] = [
  { value: 'none', label: 'Sin ícono (Por defecto)', icon: <Ban className="w-4 h-4" /> },
  { value: 'check', label: 'Verificado / Sí', icon: <Check className="w-4 h-4" /> },
  { value: 'material', label: 'Material / Construcción', icon: <Layers className="w-4 h-4" /> },
  { value: 'dimensions', label: 'Dimensiones / Medidas', icon: <Ruler className="w-4 h-4" /> },
  { value: 'weight', label: 'Peso / Báscula', icon: <Scale className="w-4 h-4" /> },
  { value: 'shield', label: 'Garantía / Protección', icon: <ShieldCheck className="w-4 h-4" /> },
  { value: 'water', label: 'Resistencia al agua / IPX', icon: <Droplets className="w-4 h-4" /> },
  { value: 'battery', label: 'Batería / Autonomía', icon: <BatteryCharging className="w-4 h-4" /> },
  { value: 'cpu', label: 'Procesador / Chip', icon: <Cpu className="w-4 h-4" /> },
  { value: 'wifi', label: 'Conectividad / Wifi', icon: <Wifi className="w-4 h-4" /> },
  { value: 'bluetooth', label: 'Bluetooth / Inalámbrico', icon: <Bluetooth className="w-4 h-4" /> },
  { value: 'clock', label: 'Duración / Tiempo', icon: <Clock className="w-4 h-4" /> },
  { value: 'zap', label: 'Potencia / Carga rápida', icon: <Zap className="w-4 h-4" /> },
  { value: 'eco', label: 'Ecológico / Sostenible', icon: <Leaf className="w-4 h-4" /> },
  { value: 'box', label: 'Incluye en caja / Contenido', icon: <Package className="w-4 h-4" /> },
  { value: 'screen', label: 'Pantalla / Display', icon: <Monitor className="w-4 h-4" /> },
  { value: 'sound', label: 'Audio / Sonido', icon: <Volume2 className="w-4 h-4" /> },
  { value: 'camera', label: 'Cámara / Óptica', icon: <Camera className="w-4 h-4" /> },
  { value: 'storage', label: 'Capacidad / Memoria', icon: <HardDrive className="w-4 h-4" /> },
  { value: 'global', label: 'Compatibilidad / Origen', icon: <Globe className="w-4 h-4" /> },
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
    <div
      className="field-type text"
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        minWidth: '80px',
      }}
    >
      <FieldLabel label={field?.label || 'Ícono'} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title={selectedOption?.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '38px',
            borderRadius: '6px',
            border: '1px solid var(--theme-elevation-250, #444)',
            backgroundColor: 'var(--theme-elevation-100, #1e1e1e)',
            color: 'var(--theme-text, #fff)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {selectedOption?.icon}
        </button>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--theme-elevation-600, #aaa)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '130px',
          }}
        >
          {selectedOption?.label}
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 99999,
            width: '236px',
            backgroundColor: 'var(--theme-elevation-150, #18181b)',
            border: '1px solid var(--theme-elevation-300, #3f3f46)',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div
            style={{
              marginBottom: '8px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--theme-elevation-600, #a1a1aa)',
            }}
          >
            Seleccionar ícono
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '6px',
            }}
          >
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    border: isSelected
                      ? '2px solid #3b82f6'
                      : '1px solid var(--theme-elevation-250, #333)',
                    backgroundColor: isSelected
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'var(--theme-elevation-100, #222)',
                    color: isSelected ? '#60a5fa' : 'var(--theme-text, #e4e4e7)',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                    transform: isSelected ? 'scale(1.05)' : 'none',
                  }}
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
