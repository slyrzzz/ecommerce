import type { GlobalConfig } from "payload";

export const StoreContact: GlobalConfig = {
	slug: "store-contact",
	label: "Contacto y Redes Sociales",
	admin: {
		group: "Manejo de Tienda",
		description: "Configura el número de WhatsApp comercial para pedidos, información de contacto de soporte y enlaces a redes sociales.",
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
					label: "WhatsApp para Pedidos",
					description: "Configura el número al cual llegarán los pedidos que los clientes envíen desde el Checkout o desde Órdenes Guardadas en Mi Cuenta.",
					fields: [
						{
							name: "enabled",
							type: "checkbox",
							label: "Habilitar completado de órdenes por WhatsApp en Checkout y Mi Cuenta",
							defaultValue: true,
						},
						{
							name: "businessPhone",
							type: "text",
							label: "Número de WhatsApp Comercial",
							defaultValue: "584120000000",
							required: true,
							admin: {
								description: "Código de país seguido del número telefónico, sin símbolo + ni espacios (ejemplo: 584120000000, 5215500000000, 34600000000).",
							},
						},
						{
							name: "defaultMessagePrefix",
							type: "text",
							label: "Prefijo de mensaje inicial",
							defaultValue: "¡Hola! Quiero completar mi pedido",
							admin: {
								description: "Frase inicial del mensaje automático en WhatsApp.",
							},
						},
					],
				},
				{
					label: "Información de Contacto",
					description: "Datos de contacto de tu negocio que aparecerán en la tienda y páginas de soporte.",
					fields: [
						{
							name: "supportEmail",
							type: "email",
							label: "Correo Electrónico de Soporte",
							defaultValue: "soporte@tienda.com",
						},
						{
							name: "supportPhone",
							type: "text",
							label: "Teléfono de Atención al Cliente",
							defaultValue: "+1 (555) 123-4567",
						},
						{
							name: "address",
							type: "text",
							label: "Dirección Física de la Tienda",
							defaultValue: "123 Commerce St, Suite 100",
						},
						{
							name: "cityCountry",
							type: "text",
							label: "Ciudad / País",
							defaultValue: "Ciudad de México, México",
						},
						{
							name: "hours",
							type: "text",
							label: "Horario de Atención",
							defaultValue: "Lunes - Viernes: 9am - 6pm",
						},
					],
				},
				{
					label: "Redes Sociales (Footer)",
					description: "Controla las redes sociales mostradas al final del pie de página de la tienda.",
					fields: [
						{
							name: "showSocialLinks",
							type: "checkbox",
							label: "Mostrar íconos de Redes Sociales en el Pie de Página (Footer)",
							defaultValue: true,
						},
						{
							name: "instagram",
							type: "text",
							label: "Instagram (URL o usuario)",
							admin: {
								description: "Ejemplo: https://instagram.com/tumarca o @tumarca",
								condition: (_, siblingData) => Boolean(siblingData?.showSocialLinks),
							},
						},
						{
							name: "facebook",
							type: "text",
							label: "Facebook (URL de página)",
							admin: {
								condition: (_, siblingData) => Boolean(siblingData?.showSocialLinks),
							},
						},
						{
							name: "twitter",
							type: "text",
							label: "Twitter / X (URL o usuario)",
							admin: {
								condition: (_, siblingData) => Boolean(siblingData?.showSocialLinks),
							},
						},
						{
							name: "tiktok",
							type: "text",
							label: "TikTok (URL o usuario)",
							admin: {
								condition: (_, siblingData) => Boolean(siblingData?.showSocialLinks),
							},
						},
						{
							name: "whatsappSupport",
							type: "text",
							label: "WhatsApp de Soporte (URL o teléfono para dudas de clientes)",
							admin: {
								condition: (_, siblingData) => Boolean(siblingData?.showSocialLinks),
							},
						},
					],
				},
			],
		},
	],
};
