import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

// ---------------------------------------------------------------------------
// Helper: nodo Lexical mínimo válido
// ---------------------------------------------------------------------------
function makeLexicalDoc(text: string) {
  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children: [
        {
          type: 'paragraph',
          version: 1,
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          textFormat: 0,
          children: [
            {
              type: 'text',
              version: 1,
              text,
              format: 0,
              detail: 0,
              mode: 'normal' as const,
              style: '',
            },
          ],
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Helper: descarga una imagen remota y devuelve su Buffer
// ---------------------------------------------------------------------------
async function fetchImageBuffer(
  url: string,
): Promise<{ buffer: Buffer; mimeType: string; size: number }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'PayloadSeedScript/1.0' },
    // Permitir hasta 10 segundos de espera por imagen
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} al intentar descargar ${url}`);
  }

  const mimeType = res.headers.get('content-type') ?? 'image/jpeg';
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return { buffer, mimeType: mimeType.split(';')[0]!.trim(), size: buffer.byteLength };
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------
const MOCK_IMAGES = [
  {
    filename: 'reloj-deportivo.jpg',
    alt: 'Reloj deportivo de titanio',
    url: 'https://picsum.photos/id/1060/800/800.jpg',
  },
  {
    filename: 'reloj-clasico-acero.jpg',
    alt: 'Reloj clásico de acero inoxidable',
    url: 'https://picsum.photos/id/175/800/800.jpg',
  },
  {
    filename: 'reloj-negro-minimalista.jpg',
    alt: 'Reloj negro minimalista con correa de cuero',
    url: 'https://picsum.photos/id/26/800/800.jpg',
  },
  {
    filename: 'reloj-dorado-lujo.jpg',
    alt: 'Reloj dorado de lujo sobre terciopelo',
    url: 'https://picsum.photos/id/325/800/800.jpg',
  },
  {
    filename: 'smartwatch-moderno.jpg',
    alt: 'Smartwatch moderno en muñeca',
    url: 'https://picsum.photos/id/536/800/800.jpg',
  },
  {
    filename: 'reloj-buceo-azul.jpg',
    alt: 'Reloj de buceo resistente al agua',
    url: 'https://picsum.photos/id/250/800/800.jpg',
  },
];

const MOCK_CATEGORIES = [
  { title: 'Línea Deportiva',     slug: 'linea-deportiva'    },
  { title: 'Línea Clásica',       slug: 'linea-clasica'      },
  { title: 'Tecnología Wearable', slug: 'tecnologia-wearable'},
];

// ---------------------------------------------------------------------------
// GET /api/seed
// ---------------------------------------------------------------------------
export async function GET() {
  // ── Protección de entorno ─────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Forbidden: seed endpoint is disabled in production.' },
      { status: 403 },
    );
  }

  const log: string[] = [];
  const errors: string[] = [];

  try {
    const payload = await getPayload({ config: configPromise });

    // ── 1. Limpieza previa ────────────────────────────────────────────────
    log.push('Limpiando colecciones previas…');
    await payload.delete({ collection: 'products',   where: { id: { exists: true } } });
    await payload.delete({ collection: 'categories', where: { id: { exists: true } } });
    await payload.delete({ collection: 'media',      where: { id: { exists: true } } });
    log.push('✓ Colecciones vaciadas.');

    // ── 2. Crear Media ─ fetch real + Buffer ──────────────────────────────
    // Payload Upload requiere el buffer del archivo en el campo `file`.
    // Se hace secuencialmente para no saturar la red ni Cloudinary.
    log.push('Creando media (descargando imágenes como Buffer)…');
    const createdMediaIds: string[] = [];

    for (const img of MOCK_IMAGES) {
      try {
        log.push(`  → Descargando ${img.url}…`);
        const { buffer, mimeType, size } = await fetchImageBuffer(img.url);

        const doc = await payload.create({
          collection: 'media',
          data: {
            alt: img.alt,
          },
          // ↙ Así es como Payload 3 recibe un archivo en la Local API
          file: {
            data:     buffer,
            name:     img.filename,
            mimetype: mimeType,
            size,
          },
        });

        createdMediaIds.push(doc.id);
        log.push(`  ✓ Media creada: ${img.filename} → id: ${doc.id}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`Media "${img.filename}" falló: ${msg}`);
        log.push(`  ✗ Media fallida: ${img.filename} — ${msg}`);
      }
    }

    // Helpers de acceso seguro a IDs por posición
    const mid = (i: number) => createdMediaIds[i] ?? null;
    const mediaIds = (...indices: number[]) =>
      indices.map(mid).filter((id): id is string => id !== null);

    // ── 3. Crear Categorías ───────────────────────────────────────────────
    log.push('Creando categorías…');
    const createdCategories: { id: string; slug: string; title: string }[] = [];

    for (const cat of MOCK_CATEGORIES) {
      try {
        const doc = await payload.create({
          collection: 'categories',
          data: { title: cat.title, slug: cat.slug },
        });
        createdCategories.push({ id: doc.id, slug: cat.slug, title: cat.title });
        log.push(`  ✓ Categoría: ${cat.title}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`Categoría "${cat.title}" falló: ${msg}`);
        log.push(`  ✗ Categoría fallida: ${cat.title} — ${msg}`);
      }
    }

    const catDeportivaId = createdCategories[0]?.id;
    const catClasicaId   = createdCategories[1]?.id;
    const catTechId      = createdCategories[2]?.id;

    // ── 4. Crear Productos ────────────────────────────────────────────────
    log.push('Creando productos…');

    const productSeeds = [
      {
        title: 'ChronoRace Pro Titanium',
        slug:  'chronorace-pro-titanium',
        price: 189.99,
        description: makeLexicalDoc(
          'Diseñado para atletas de alto rendimiento. Carcasa de titanio grado 2, resistencia al agua 200m, GPS integrado y monitor cardíaco avanzado. Tu compañero perfecto en cada carrera.',
        ),
        category: [catDeportivaId].filter(Boolean) as string[],
        media:    mediaIds(0, 5),
      },
      {
        title: 'AquaMaster Dive 300',
        slug:  'aquamaster-dive-300',
        price: 249.99,
        description: makeLexicalDoc(
          'Reloj de buceo profesional certificado ISO 6425. Bisel giratorio unidireccional, cristal de zafiro anti-reflejo y correa de caucho vulcanizado. Sumergible hasta 300 metros.',
        ),
        category: [catDeportivaId].filter(Boolean) as string[],
        media:    mediaIds(5, 0),
      },
      {
        title: 'Elegance Royale Gold',
        slug:  'elegance-royale-gold',
        price: 459.99,
        description: makeLexicalDoc(
          'La joya de nuestra colección clásica. Caja de acero inoxidable con baño de oro de 18k, esfera de nácar y movimiento suizo de cuarzo. Perfecto para ocasiones especiales.',
        ),
        category: [catClasicaId].filter(Boolean) as string[],
        media:    mediaIds(3, 1),
      },
      {
        title: 'Heritage Noir Leather',
        slug:  'heritage-noir-leather',
        price: 159.99,
        description: makeLexicalDoc(
          'Estilo atemporal en cada detalle. Carcasa delgada de acero negro PVD, esfera minimalista con índices dorados y correa de cuero genuino italiano. Elegancia sin esfuerzo.',
        ),
        category: [catClasicaId].filter(Boolean) as string[],
        media:    mediaIds(2, 1),
      },
      {
        title: 'Prestige Acero Classic',
        slug:  'prestige-acero-classic',
        price: 299.99,
        description: makeLexicalDoc(
          'Movimiento mecánico automático visible a través del fondo de cristal. Pulsera de eslabones de acero inoxidable 316L con cierre desplegable de seguridad. Garantía de 5 años.',
        ),
        category: [catClasicaId].filter(Boolean) as string[],
        media:    mediaIds(1, 3),
      },
      {
        title: 'SmartPulse X7 Wearable',
        slug:  'smartpulse-x7-wearable',
        price: 329.99,
        description: makeLexicalDoc(
          'Smartwatch con pantalla AMOLED Always-On, más de 100 modos deportivos, ECG en tiempo real, SpO2 y batería de 14 días. Compatible con iOS y Android. El futuro en tu muñeca.',
        ),
        category: [catTechId].filter(Boolean) as string[],
        media:    mediaIds(4, 0),
      },
    ];

    const createdProducts: { id: string; slug: string; title: string; price: number }[] = [];

    for (const p of productSeeds) {
      // Si no hay media disponible no podemos cumplir required:true en el campo media.
      // En ese caso omitimos el producto y registramos el error.
      if (p.media.length === 0) {
        const msg = 'Sin imágenes disponibles (todos los uploads de media fallaron).';
        errors.push(`Producto "${p.title}" omitido: ${msg}`);
        log.push(`  ✗ Producto omitido: ${p.title} — ${msg}`);
        continue;
      }

      try {
        const doc = await payload.create({
          collection: 'products',
          data: {
            title:       p.title,
            slug:        p.slug,
            price:       p.price,
            description: p.description,
            category:    p.category,
            media:       p.media,
          },
        });
        createdProducts.push({ id: doc.id, slug: p.slug, title: p.title, price: p.price });
        log.push(`  ✓ Producto: ${p.title}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`Producto "${p.title}" falló: ${msg}`);
        log.push(`  ✗ Producto fallido: ${p.title} — ${msg}`);
      }
    }

    // ── 5. Respuesta final ────────────────────────────────────────────────
    const hasErrors = errors.length > 0;
    return NextResponse.json(
      {
        success: createdProducts.length > 0,
        message: hasErrors
          ? `⚠️ Seed completado con ${errors.length} advertencia(s). Ver "errors".`
          : '✅ Base de datos poblada exitosamente.',
        summary: {
          media:      createdMediaIds.length,
          categories: createdCategories.length,
          products:   createdProducts.length,
        },
        errors,
        log,
        data: {
          mediaIds:   createdMediaIds,
          categories: createdCategories,
          products:   createdProducts,
        },
      },
      { status: hasErrors ? 207 : 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Seed] Error fatal:', error);
    return NextResponse.json({ success: false, error: message, log, errors }, { status: 500 });
  }
}
