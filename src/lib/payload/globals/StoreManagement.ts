import type { GlobalConfig } from "payload";

export const StoreManagement: GlobalConfig = {
	slug: "store-management",
	label: "Opciones de Carrito",
	admin: {
		group: "Manejo de Tienda",
		description: "Configura la apariencia, barra de progreso para envío gratis y mensajes informativos del Carrito de Compras.",
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
					label: "Opciones de Carrito",
					description: "Controla si se muestra la barra de progreso de envío gratis y los mensajes del pie de carrito.",
					fields: [
						{
							type: "group",
							name: "freeShipping",
							label: "Barra de Envío Gratis (Parte Superior)",
							fields: [
								{
									name: "enabled",
									type: "checkbox",
									label: 'Mostrar barra de progreso "Add $XX.XX more for free shipping" en el carrito',
									defaultValue: true,
								},
								{
									name: "thresholdAmount",
									type: "number",
									label: "Monto mínimo para Envío Gratis ($ USD)",
									defaultValue: 100,
									required: true,
									admin: {
										description: "Monto que el cliente debe alcanzar en el subtotal de su carrito para obtener envío gratis (ej: 50, 100, 150).",
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
							],
						},
						{
							type: "group",
							name: "footerMessages",
							label: "Mensajes Informativos en Pie de Carrito (Parte Inferior)",
							fields: [
								{
									name: "enabled",
									type: "checkbox",
									label: 'Mostrar mensajes informativos inferiores ("Free delivery over...", "30-day returns")',
									defaultValue: true,
								},
								{
									name: "freeDeliveryText",
									type: "text",
									label: "Texto para Envío Gratis en el pie del carrito",
									defaultValue: "Free delivery over",
									admin: {
										description: "Texto que acompaña el ícono de envío. Si no incluye un monto, se añadirá automáticamente el monto configurado arriba.",
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
								{
									name: "returnsText",
									type: "text",
									label: "Texto para Política de Devoluciones en el pie del carrito",
									defaultValue: "30-day returns",
									admin: {
										description: "Texto que acompaña el ícono de devolución.",
										condition: (_, siblingData) => Boolean(siblingData?.enabled),
									},
								},
							],
						},
					],
				},
			],
		},
	],
};
