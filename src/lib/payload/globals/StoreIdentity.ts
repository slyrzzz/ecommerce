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
			],
		},
	],
};
