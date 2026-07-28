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
					description: "Imágenes de marca que se mostrarán en la tienda. Si se dejan vacías, se utilizarán las imágenes o iconos por defecto.",
					fields: [
						{
							name: "logo",
							type: "upload",
							relationTo: "media",
							label: "Logotipo Principal (Cabecera)",
							admin: {
								description: "Sube un archivo de imagen o SVG con fondo transparente para el Header.",
							},
						},
						{
							name: "logoInverted",
							type: "upload",
							relationTo: "media",
							label: "Logotipo Invertido / Claro (Pie de página)",
							admin: {
								description: "Versión en color blanco o claro para mostrarse sobre fondos oscuros (Footer).",
							},
						},
						{
							name: "favicon",
							type: "upload",
							relationTo: "media",
							label: "Favicon (Icono de pestaña)",
							admin: {
								description: "Icono pequeño en formato PNG o ICO (16x16 o 32x32).",
							},
						},
					],
				},
			],
		},
	],
};
