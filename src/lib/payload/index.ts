import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { ProductDetailsQuery, ProductListItemFragment } from '@/gql/graphql';
import { cookies } from 'next/headers';

export async function getProducts({ query, reverse, sortKey, categoryId }: { query?: string, reverse?: boolean, sortKey?: string, categoryId?: string }): Promise<ProductListItemFragment[]> {
  console.log("=== ADAPTER: getProducts starting ===");
  const payload = await getPayload({ config: configPromise });
  
  let where: any = {
    status: { equals: 'published' },
  };
  if (categoryId) {
    where['category.slug'] = { equals: categoryId };
  }
  if (query) {
    where['title'] = { like: query };
  }
  
  console.log("=== ADAPTER: querying products with where:", where);
  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 100,
    where,
  });

  console.log("=== ADAPTER: found raw products count:", products.docs.length);
  const mapped = products.docs.map((doc: any) => mapPayloadProductToCommerce(doc) as ProductListItemFragment);
  console.log("=== ADAPTER: mapped products count:", mapped.length);
  return mapped;
}

export async function getProduct(handle: string): Promise<NonNullable<ProductDetailsQuery['product']> | undefined> {
  const payload = await getPayload({ config: configPromise });
  const products = await payload.find({
    collection: 'products',
    where: { 
      slug: { equals: handle },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  });

  if (!products.docs.length) return undefined;
  return mapPayloadProductToCommerce(products.docs[0]);
}

export async function getCollectionProducts(collectionSlug: string): Promise<ProductListItemFragment[]> {
  const payload = await getPayload({ config: configPromise });
  // Find category id
  const categories = await payload.find({
    collection: 'categories',
    where: { slug: { equals: collectionSlug } }
  });
  const categoryId = categories.docs.length ? categories.docs[0].id : null;
  
  const where: any = {
    status: { equals: 'published' },
  };
  if (categoryId) {
    where['category'] = { equals: categoryId };
  }

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 100,
    where,
  });

  return products.docs.map((doc: any) => mapPayloadProductToCommerce(doc) as ProductListItemFragment);
}

export async function getCategories() {
  const payload = await getPayload({ config: configPromise });
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
  });
  return categories.docs.map((doc: any) => ({
    id: doc.id,
    name: doc.title,
    slug: doc.slug,
  }));
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const products = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'published' },
      },
      limit: 1000,
      depth: 0,
    });
    return products.docs.map((doc: any) => doc.slug);
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const categories = await payload.find({
      collection: 'categories',
      limit: 1000,
      depth: 0,
    });
    return categories.docs.map((doc: any) => doc.slug);
  } catch (error) {
    console.error("Error fetching category slugs:", error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<{ title: string; slug: string; htmlContent: string } | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const pages = await payload.find({
      collection: 'pages' as any,
      where: {
        slug: { equals: slug },
        status: { equals: 'published' }
      },
      limit: 1,
    });
    if (pages.docs.length > 0) {
      const doc = pages.docs[0] as any;
      return {
        title: doc.title || slug,
        slug: doc.slug || slug,
        htmlContent: doc.content ? lexicalToHtml(doc.content) : '',
      };
    }
  } catch (error) {
    console.error("Error fetching page by slug:", error);
  }

  // Fallbacks predeterminados por si la página aún no se ha creado en el CMS
  const normalized = slug.toLowerCase();
  if (normalized === 'faq' || normalized === 'preguntas-frecuentes') {
    return {
      title: "Preguntas Frecuentes",
      slug,
      htmlContent: `<h2>¿Cuánto tardan los envíos?</h2><p>Los pedidos normalmente se procesan entre 24 y 48 horas hábiles. El tiempo de envío varía entre 2 a 5 días dependiendo de su localidad.</p><h2>¿Cuáles son los métodos de pago aceptados?</h2><p>Aceptamos tarjetas de crédito, débito y transferencias bancarias de las principales entidades bancarias.</p><h2>¿Puedo modificar o cancelar mi pedido?</h2><p>Puede solicitar modificaciones o cancelaciones en las primeras 12 horas tras realizar el pedido poniéndose en contacto con nuestro equipo de soporte.</p>`
    };
  }
  if (normalized === 'envio' || normalized === 'shipping') {
    return {
      title: "Información de Envíos",
      slug,
      htmlContent: `<h2>Tiempos de entrega y procesamiento</h2><p>Nuestro compromiso es entregar sus pedidos en el menor tiempo posible. Trabajamos con paqueterías de confianza con número de seguimiento para todos los envíos nacionales.</p><h2>Tarifas de envío</h2><p>El costo de envío se calcula de manera automática al momento del checkout y dependerá del destino y peso de los productos seleccionados.</p>`
    };
  }
  if (normalized === 'devoluciones' || normalized === 'returns') {
    return {
      title: "Política de Devoluciones",
      slug,
      htmlContent: `<h2>Plazo para devoluciones</h2><p>Dispone de un plazo de 30 días corridos a partir de la recepción del producto para solicitar una devolución o cambio.</p><h2>Condiciones</h2><p>Los artículos deben encontrarse en su estado original, sin uso y en su embalaje original.</p>`
    };
  }

  return null;
}

export async function getFooterPages(): Promise<Array<{ title: string; slug: string; footerColumn?: 'soporte' | 'empresa' }>> {
  try {
    const payload = await getPayload({ config: configPromise });
    const pages = await payload.find({
      collection: 'pages' as any,
      where: {
        status: { equals: 'published' },
        showInFooter: { equals: true }
      },
      limit: 20,
    });
    return pages.docs.map((doc: any) => ({
      title: doc.title,
      slug: doc.slug,
      footerColumn: doc.footerColumn || 'soporte',
    }));
  } catch (error) {
    console.error("Error fetching footer pages:", error);
    return [];
  }
}

// --- MAPPERS ---
export function lexicalToHtml(node: any): string {
  if (!node) return "";
  
  if (typeof node === 'string') return node;
  
  if (node.children) {
    const childrenHtml = node.children.map((child: any) => lexicalToHtml(child)).join("");
    
    switch (node.type) {
      case 'root':
        return childrenHtml;
      case 'paragraph':
        return `<p>${childrenHtml}</p>`;
      case 'heading': {
        const tagStr = String(node.tag || 'h2').toLowerCase();
        const tag = tagStr.startsWith('h') ? tagStr : `h${tagStr}`;
        return `<${tag}>${childrenHtml}</${tag}>`;
      }
      case 'list': {
        const listTag = node.tag === 'ol' ? 'ol' : 'ul';
        return `<${listTag}>${childrenHtml}</${listTag}>`;
      }
      case 'listitem':
        return `<li>${childrenHtml}</li>`;
      case 'quote':
        return `<blockquote>${childrenHtml}</blockquote>`;
      case 'link':
      case 'autolink': {
        const href = node.fields?.url || node.url || '#';
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${childrenHtml}</a>`;
      }
      default:
        return childrenHtml;
    }
  }
  
  if (node.root) {
    return lexicalToHtml(node.root);
  }

  if (node.type === 'linebreak') {
    return '<br />';
  }
  
  if (node.type === 'text') {
    let text = node.text || "";
    if (node.format & 1) text = `<strong>${text}</strong>`;
    if (node.format & 2) text = `<em>${text}</em>`;
    if (node.format & 4) text = `<s>${text}</s>`;
    if (node.format & 8) text = `<u>${text}</u>`;
    if (node.format & 16) text = `<code>${text}</code>`;
    return text;
  }
  
  return "";
}

function mapPayloadProductToCommerce(doc: any): NonNullable<ProductDetailsQuery['product']> {
  const images = doc.media ? doc.media.map((m: any) => ({
    // cloudinaryURL is the direct CDN URL set by payload-cloudinary plugin.
    // Fallback to m.url only if cloudinaryURL is not present.
    url: m.cloudinaryURL || m.url || "",
    alt: m.alt || doc.title,
    type: "IMAGE"
  })) : [];

  const priceNum = doc.price || 0;
  const compareAtPriceNum = typeof doc.compareAtPrice === 'number' && doc.compareAtPrice > priceNum ? doc.compareAtPrice : null;

  // Convert Lexical description to HTML and mock EditorJS structure
  const htmlContent = doc.description ? lexicalToHtml(doc.description) : "";
  const descriptionJson = JSON.stringify({
    blocks: [
      {
        type: 'paragraph',
        data: {
          text: htmlContent
        }
      }
    ]
  });

  const categoryDoc = doc.category && doc.category.length > 0 ? doc.category[0] : null;

  const specificationAttributes = Array.isArray(doc.specifications)
    ? doc.specifications
        .filter((spec: any) => spec && spec.name && spec.value)
        .map((spec: any, idx: number) => ({
          attribute: {
            name: String(spec.name).trim(),
            slug: String(spec.name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") || `spec-${idx}`,
            icon: spec.icon || "none",
          },
          values: [{ name: String(spec.value).trim() }],
        }))
    : [];

  const brandAttribute = doc.brand ? [{
    attribute: { name: 'Marca', slug: 'marca', icon: 'none' },
    values: [{ name: String(doc.brand).trim() }],
  }] : [];

  const modelAttribute = doc.model ? [{
    attribute: { name: 'Modelo', slug: 'modelo', icon: 'none' },
    values: [{ name: String(doc.model).trim() }],
  }] : [];

  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.title,
    brand: doc.brand ? String(doc.brand).trim() : null,
    model: doc.model ? String(doc.model).trim() : null,
    showBrandInCard: doc.showBrandInCard !== false,
    showBrandInPDP: doc.showBrandInPDP !== false,
    description: descriptionJson,
    seoTitle: doc.title,
    seoDescription: doc.description ? (typeof doc.description === 'string' ? doc.description : htmlContent.replace(/<[^>]*>/g, '').slice(0, 150)) : doc.title,
    category: categoryDoc && typeof categoryDoc === 'object' ? { name: categoryDoc.title, slug: categoryDoc.slug } : null,
    thumbnail: images[0] || null,
    media: images,
    pricing: {
      priceRange: {
        start: { gross: { amount: priceNum, currency: 'USD' } },
        stop: { gross: { amount: priceNum, currency: 'USD' } }
      },
      priceRangeUndiscounted: compareAtPriceNum ? {
        start: { gross: { amount: compareAtPriceNum, currency: 'USD' } },
        stop: { gross: { amount: compareAtPriceNum, currency: 'USD' } }
      } : {
        start: { gross: { amount: priceNum, currency: 'USD' } },
        stop: { gross: { amount: priceNum, currency: 'USD' } }
      }
    },
    attributes: [
      ...brandAttribute,
      ...modelAttribute,
      ...specificationAttributes,
      {
        attribute: { name: 'Color', slug: 'color' },
        values: [{ name: 'Default' }]
      }
    ],
    variants: [
      {
        id: `variant-${doc.id}`,
        name: 'Default',
        quantityAvailable: 100,
        media: images,
        pricing: {
          price: { gross: { amount: priceNum, currency: 'USD' } },
          priceUndiscounted: compareAtPriceNum ? {
            gross: { amount: compareAtPriceNum, currency: 'USD' }
          } : undefined
        },
        selectionAttributes: [
          {
            attribute: { name: 'Color', slug: 'color' },
            values: [{ name: 'Default' }]
          }
        ],
        nonSelectionAttributes: [
          ...brandAttribute,
          ...modelAttribute,
          ...specificationAttributes,
        ],
        attributes: [
          ...brandAttribute,
          ...modelAttribute,
          ...specificationAttributes,
          {
            attribute: { name: 'Color', slug: 'color' },
            values: [{ name: 'Default' }]
          }
        ]
      }
    ]
  };
}

export async function getStoreIdentity() {
  try {
    const payload = await getPayload({ config: configPromise });
    const doc = await payload.findGlobal({ slug: "store-identity", depth: 1 }) as any;
    return {
      siteName: doc?.siteName ?? "Saleor Store",
      tagline: doc?.tagline ?? "",
      description: doc?.description ?? "",
      copyrightHolder: doc?.copyrightHolder ?? "Saleor Demo Store",
      logoUrl: doc?.logo && typeof doc.logo === "object" ? doc.logo.url : null,
      logoInvertedUrl: doc?.logoInverted && typeof doc.logoInverted === "object" ? doc.logoInverted.url : null,
      logoSizeHeader: doc?.logoSizeHeader ?? "normal",
      logoSizeFooter: doc?.logoSizeFooter ?? "normal",
      faviconUrl: (() => {
        const rawUrl = doc?.favicon && typeof doc.favicon === "object" ? doc.favicon.url : (typeof doc?.favicon === "string" ? doc.favicon : null);
        if (!rawUrl) return null;
        const version = (doc?.favicon && typeof doc.favicon === "object" && doc.favicon.updatedAt) || doc?.updatedAt || "";
        return `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(version)}`;
      })(),
      announcement: {
        enabled: doc?.announcement?.enabled !== false,
        text: doc?.announcement?.text ?? "",
        linkUrl: doc?.announcement?.linkUrl ?? "/products",
        linkLabel: doc?.announcement?.linkLabel ?? "",
      },
      hero: {
        enabled: doc?.hero?.enabled !== false,
        badge: doc?.hero?.badge ?? "",
        title: doc?.hero?.title ?? "",
        description: doc?.hero?.description ?? "",
        ctaText: doc?.hero?.ctaText ?? "",
        ctaLink: doc?.hero?.ctaLink ?? "/products",
        backgroundImageUrl: doc?.hero?.backgroundImage && typeof doc?.hero?.backgroundImage === "object" ? doc.hero.backgroundImage.url : null,
        overlayOpacity: doc?.hero?.overlayOpacity ?? "50",
      },
      footerColumns: {
        showSupportColumn: doc?.footerColumns?.showSupportColumn !== false,
        supportTitle: doc?.footerColumns?.supportTitle ?? "Soporte",
        showCompanyColumn: doc?.footerColumns?.showCompanyColumn !== false,
        companyTitle: doc?.footerColumns?.companyTitle ?? "Empresa",
      },
    };
  } catch (error) {
    console.error("Failed to fetch store-identity:", error);
    return {
      siteName: "Saleor Store",
      tagline: "Premium products with exceptional quality. Discover our curated collection.",
      description: "Starter pack for building performant e-commerce experiences with Saleor.",
      copyrightHolder: "Saleor Demo Store",
      logoUrl: null,
      logoInvertedUrl: null,
      logoSizeHeader: "normal",
      logoSizeFooter: "normal",
      faviconUrl: null,
      announcement: {
        enabled: true,
        text: "Envío gratis en compras mayores a $100 USD • Calidad Premium Garantizada",
        linkUrl: "/products",
        linkLabel: "Ver más",
      },
      hero: {
        enabled: true,
        badge: "COLECCIÓN DESTACADA",
        title: "Calidad y Elegancia en Cada Detalle",
        description: "Descubre nuestra selección curada de productos diseñados para ofrecerte el mejor rendimiento y estilo.",
        ctaText: "Explorar Catálogo",
        ctaLink: "/products",
        backgroundImageUrl: null,
        overlayOpacity: "50",
      },
      footerColumns: {
        showSupportColumn: true,
        supportTitle: "Soporte",
        showCompanyColumn: true,
        companyTitle: "Empresa",
      },
    };
  }
}

export async function getStoreContact() {
  try {
    const payload = await getPayload({ config: configPromise });
    const doc = await payload.findGlobal({ slug: "store-contact", depth: 1 }) as any;
    return {
      whatsapp: {
        enabled: doc?.enabled !== false,
        businessPhone: doc?.businessPhone ?? "",
        defaultMessagePrefix: doc?.defaultMessagePrefix ?? "",
      },
      contactInfo: {
        supportEmail: doc?.supportEmail ?? "",
        supportPhone: doc?.supportPhone ?? "",
        address: doc?.address ?? "",
        cityCountry: doc?.cityCountry ?? "",
        hours: doc?.hours ?? "",
      },
      socialLinks: {
        showSocialLinks: doc?.showSocialLinks !== false,
        instagram: doc?.instagram ?? null,
        facebook: doc?.facebook ?? null,
        twitter: doc?.twitter ?? null,
        tiktok: doc?.tiktok ?? null,
        whatsappSupport: doc?.whatsappSupport ?? null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch store-contact:", error);
    return {
      whatsapp: {
        enabled: true,
        businessPhone: "584120000000",
        defaultMessagePrefix: "¡Hola! Quiero completar mi pedido",
      },
      contactInfo: {
        supportEmail: "soporte@tienda.com",
        supportPhone: "+1 (555) 123-4567",
        address: "123 Commerce St, Suite 100",
        cityCountry: "Ciudad de México, México",
        hours: "Lunes - Viernes: 9am - 6pm",
      },
      socialLinks: {
        showSocialLinks: true,
        instagram: null,
        facebook: null,
        twitter: null,
        tiktok: null,
        whatsappSupport: null,
      },
    };
  }
}

