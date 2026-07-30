import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

// Helper para construir la estructura Lexical richText
function makeLexicalRichDoc(sections: Array<{ heading?: string; paragraph: string }>) {
  const children: any[] = [];
  for (const sec of sections) {
    if (sec.heading) {
      children.push({
        type: 'heading',
        version: 1,
        tag: 'h2',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        children: [
          {
            type: 'text',
            version: 1,
            text: sec.heading,
            format: 0,
            detail: 0,
            mode: 'normal' as const,
            style: '',
          },
        ],
      });
    }
    children.push({
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
          text: sec.paragraph,
          format: 0,
          detail: 0,
          mode: 'normal' as const,
          style: '',
        },
      ],
    });
  }

  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children,
    },
  };
}

export async function GET() {
  const log: string[] = [];
  const errors: string[] = [];
  const createdPages: string[] = [];

  try {
    const payload = await getPayload({ config: configPromise });

    const pageSeeds = [
      {
        title: "Preguntas Frecuentes",
        slug: "faq",
        showInFooter: true,
        status: "published" as const,
        sections: [
          {
            heading: "¿Cuánto tardan los envíos?",
            paragraph: "Los pedidos normalmente se procesan entre 24 y 48 horas hábiles. El tiempo de envío varía entre 2 a 5 días dependiendo de su localidad."
          },
          {
            heading: "¿Cuáles son los métodos de pago aceptados?",
            paragraph: "Aceptamos tarjetas de crédito, débito y transferencias bancarias de las principales entidades bancarias."
          },
          {
            heading: "¿Puedo modificar o cancelar mi pedido?",
            paragraph: "Puede solicitar modificaciones o cancelaciones en las primeras 12 horas tras realizar el pedido poniéndose en contacto con nuestro equipo de soporte."
          }
        ]
      },
      {
        title: "Información de Envíos",
        slug: "envio",
        showInFooter: true,
        status: "published" as const,
        sections: [
          {
            heading: "Tiempos de entrega y procesamiento",
            paragraph: "Nuestro compromiso es entregar sus pedidos en el menor tiempo posible. Trabajamos con paqueterías de confianza con número de seguimiento para todos los envíos nacionales."
          },
          {
            heading: "Tarifas de envío",
            paragraph: "El costo de envío se calcula de manera automática al momento del checkout y dependerá del destino y peso de los productos seleccionados."
          }
        ]
      },
      {
        title: "Política de Devoluciones",
        slug: "devoluciones",
        showInFooter: true,
        status: "published" as const,
        sections: [
          {
            heading: "Plazo para devoluciones",
            paragraph: "Dispone de un plazo de 30 días corridos a partir de la recepción del producto para solicitar una devolución o cambio."
          },
          {
            heading: "Condiciones de devolución",
            paragraph: "Los artículos deben encontrarse en su estado original, sin uso, en su embalaje original y con todas las etiquetas intactas."
          }
        ]
      },
      {
        title: "Sobre nosotros",
        slug: "sobre-nosotros",
        showInFooter: true,
        status: "published" as const,
        sections: [
          {
            heading: "Nuestra Historia",
            paragraph: "Somos una marca apasionada por ofrecer productos excepcionales, combinando calidad superior, diseño moderno y un servicio al cliente impecable."
          },
          {
            heading: "Nuestra Visión",
            paragraph: "Buscamos innovar de manera constante y brindar una experiencia de compra confiable, cercana y excepcional para cada uno de nuestros clientes."
          }
        ]
      },
      {
        title: "Sostenibilidad",
        slug: "sostenibilidad",
        showInFooter: true,
        status: "published" as const,
        sections: [
          {
            heading: "Nuestras Prácticas Ecológicas",
            paragraph: "Nos comprometemos con la sostenibilidad utilizando empaques reciclables, optimizando nuestras rutas logísticas y seleccionando proveedores con responsabilidad ambiental."
          }
        ]
      },
      {
        title: "Carreras",
        slug: "carreras",
        showInFooter: false,
        status: "published" as const,
        sections: [
          {
            heading: "Únete al Equipo",
            paragraph: "Estamos siempre en búsqueda de talento creativo, proactivo y apasionado por el comercio electrónico. Contáctanos a través de nuestros canales oficiales para conocer las posiciones abiertas."
          }
        ]
      },
      {
        title: "Prensa",
        slug: "prensa",
        showInFooter: false,
        status: "published" as const,
        sections: [
          {
            heading: "Atención a Medios",
            paragraph: "Para consultas de prensa, colaboraciones o solicitudes de entrevistas, por favor escríbenos a nuestro correo oficial de soporte o prensa."
          }
        ]
      }
    ];

    for (const p of pageSeeds) {
      try {
        const existing = await payload.find({
          collection: 'pages' as any,
          where: {
            slug: { equals: p.slug },
          },
          limit: 1,
        });

        if (existing.docs.length > 0) {
          log.push(`  ↻ Página existente omitida: "${p.title}" (${p.slug})`);
          continue;
        }

        await payload.create({
          collection: 'pages' as any,
          data: {
            title: p.title,
            slug: p.slug,
            showInFooter: p.showInFooter,
            status: p.status,
            content: makeLexicalRichDoc(p.sections),
          },
        });

        createdPages.push(p.title);
        log.push(`  ✓ Página creada: "${p.title}" (/pages/${p.slug})`);
      } catch (e: any) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`Error al crear página "${p.title}": ${msg}`);
        log.push(`  ✗ Error en página "${p.title}": ${msg}`);
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      message:
        createdPages.length > 0
          ? `✅ Se crearon ${createdPages.length} páginas en la base de datos MongoDB.`
          : '↻ Las páginas oficiales ya existían en MongoDB.',
      createdPages,
      log,
      errors,
    });
  } catch (error: any) {
    console.error('[Seed Pages] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        log,
        errors,
      },
      { status: 500 }
    );
  }
}
