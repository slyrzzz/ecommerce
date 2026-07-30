import type { GlobalConfig } from "payload";

export const StoreIdentity: GlobalConfig = {
	slug: "store-identity",
	label: "Identidad de Tienda",
	admin: {
		group: "Manejo de Tienda",
		description: "Configura el nombre de tu tienda, logotipo, eslogan, descripción SEO y texto de copyright.",
	},
	access: {
		read: () => true,
		update: () => true,
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Marca y Textos",
					description: "Información general sobre tu negocio y marca para cabecera, pie de página y metadatos SEO.",
					fields: [
						{
							name: "siteName",
							type: "text",
							label: "Nombre de la Tienda",
							defaultValue: "Saleor Store",
							required: true,
							admin: {
								description: "Nombre principal usado en el título de la pestaña del navegador y cabecera.",
							},
						},
						{
							name: "tagline",
							type: "text",
							label: "Eslogan / Subtítulo",
							defaultValue: "Premium products with exceptional quality. Discover our curated collection.",
							admin: {
								description: "Breve frase promocional o lema que se muestra en el pie de página.",
							},
						},
						{
							name: "description",
							type: "textarea",
							label: "Descripción SEO del Sitio",
							defaultValue: "Starter pack for building performant e-commerce experiences with Saleor.",
							admin: {
								description: "Descripción por defecto para buscadores (Google) y redes sociales.",
							},
						},
						{
							name: "copyrightHolder",
							type: "text",
							label: "Titular del Copyright",
							defaultValue: "Saleor Demo Store",
							admin: {
								description: "Nombre que aparece al final del pie de página después de © y el año actual.",
							},
						},
					],
				},
				{
					label: "Logotipo e Iconos",
					description: "Imágenes de marca que se mostrarán en la cabecera, pie de página y pestaña del navegador. Se recomiendan archivos SVG o PNG con fondo transparente.",
					fields: [
						{
							name: "logo",
							type: "upload",
							relationTo: "media",
							label: "Logotipo Principal (Cabecera)",
							admin: {
								description: "Sube una imagen o SVG con fondo transparente (formato horizontal / apaisado). Tamaño recomendado: 180x40 px a 240x60 px (altura visual adaptada a 40px en cabecera).",
							},
						},
						{
							name: "logoInverted",
							type: "upload",
							relationTo: "media",
							label: "Logotipo Invertido / Claro (Pie de página)",
							admin: {
								description: "Versión en color blanco o claro para fondos oscuros (Footer). Tamaño recomendado: 180x40 px a 240x60 px.",
							},
						},
						{
							name: "favicon",
							type: "upload",
							relationTo: "media",
							label: "Favicon (Icono de pestaña)",
							admin: {
								description: "Icono cuadrado para la pestaña del navegador en formato PNG, ICO o SVG. Tamaño recomendado: 32x32 px o 64x64 px.",
							},
						},
					],
				},
				{
					label: "Barra de Anuncio",
					description: "Configura la barra de aviso superior que aparece arriba de la cabecera del sitio.",
					fields: [
						{
							type: "group",
							name: "announcement",
							label: "Barra de Anuncio (Superior)",
							fields: [
								{
									name: "enabled",
									type: "checkbox",
									label: "Mostrar barra de anuncio superior",
									defaultValue: true,
								},
								{
									name: "text",
									type: "text",
									label: "Texto del Anuncio",
									defaultValue: "Envío gratis en compras mayores a $100 USD • Calidad Premium Garantizada",
									required: true,
									admin: {
										description: "Mensaje conciso que verán todos los usuarios al entrar a la tienda.",
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
								{
									name: "linkUrl",
									type: "text",
									label: "URL del Enlace (Opcional)",
									defaultValue: "/products",
									admin: {
										description: "Ejemplo: /products o /category/relojes",
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
								{
									name: "linkLabel",
									type: "text",
									label: "Texto del Enlace (Opcional)",
									defaultValue: "Ver más",
									admin: {
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
							],
						},
					],
				},
				{
					label: "Hero Banner (Home)",
					description: "Configura el banner principal que aparece en la parte superior de la página principal (Home).",
					fields: [
						{
							type: "group",
							name: "hero",
							label: "Hero Banner Principal",
							fields: [
								{
									name: "enabled",
									type: "checkbox",
									label: "Mostrar Hero Banner en el Home",
									defaultValue: true,
								},
								{
									name: "badge",
									type: "text",
									label: "Etiqueta Superior (Opcional)",
									defaultValue: "COLECCIÓN DESTACADA",
									admin: {
										description: "Texto sutil en mayúsculas sobre el título principal.",
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
								{
									name: "title",
									type: "text",
									label: "Titular Principal (H1)",
									defaultValue: "Calidad y Elegancia en Cada Detalle",
									required: true,
									admin: {
										description: "Título corto e impactante para tu tienda.",
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
								{
									name: "description",
									type: "textarea",
									label: "Subtítulo / Descripción",
									defaultValue: "Descubre nuestra selección curada de productos diseñados para ofrecerte el mejor rendimiento y estilo.",
									admin: {
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
								{
									name: "ctaText",
									type: "text",
									label: "Texto del Botón Principal (CTA)",
									defaultValue: "Explorar Catálogo",
									admin: {
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
								{
									name: "ctaLink",
									type: "text",
									label: "Enlace del Botón",
									defaultValue: "/products",
									admin: {
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
								{
									name: "backgroundImage",
									type: "upload",
									relationTo: "media",
									label: "Imagen de Portada (Opcional)",
									admin: {
										description: "Imagen de fondo para el Hero Banner. Tamaño recomendado: 1920x600 px o relación de aspecto horizontal 16:5. Formatos recomendados: JPG o WebP de alta resolución.",
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
							],
						},
					],
				},
				{
					label: "Pie de Página (Footer)",
					description: "Configura la visibilidad y los títulos de las columnas de enlaces en el pie de página.",
					fields: [
						{
							type: "group",
							name: "footerColumns",
							label: "Columnas del Footer",
							fields: [
								{
									type: "row",
									fields: [
										{
											name: "showSupportColumn",
											type: "checkbox",
											label: "Mostrar columna 'Soporte'",
											defaultValue: true,
											admin: {
												width: "50%",
												description: "Activa o desactiva toda la columna de enlaces de Soporte en el Footer.",
											},
										},
										{
											name: "supportTitle",
											type: "text",
											label: "Título de la Columna 1",
											defaultValue: "Soporte",
											admin: {
												width: "50%",
												condition: (_, siblingData) => Boolean(siblingData?.showSupportColumn),
											},
										},
									],
								},
								{
									type: "row",
									fields: [
										{
											name: "showCompanyColumn",
											type: "checkbox",
											label: "Mostrar columna 'Empresa'",
											defaultValue: true,
											admin: {
												width: "50%",
												description: "Activa o desactiva toda la columna de enlaces de Empresa en el Footer.",
											},
										},
										{
											name: "companyTitle",
											type: "text",
											label: "Título de la Columna 2",
											defaultValue: "Empresa",
											admin: {
												width: "50%",
												condition: (_, siblingData) => Boolean(siblingData?.showCompanyColumn),
											},
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};

