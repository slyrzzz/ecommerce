export const esDictionary = {
	common: {
		search: "Buscar productos...",
		cart: "Carrito",
		account: "Mi Cuenta",
		contact: "Contacto",
		support: "Soporte",
		company: "Empresa",
		privacyPolicy: "Política de Privacidad",
		termsOfService: "Términos de Servicio",
	},
	header: {
		catalog: "Catálogo",
		orders: "Mis Órdenes",
		login: "Iniciar Sesión",
		logout: "Cerrar Sesión",
	},
	checkout: {
		title: "Finalizar compra",
		subtitle: "Completa tus datos para procesar tu pedido",
		placeOrder: "Confirmar y Enviar Pedido",
		whatsappButton: "Completar por WhatsApp",
	},
	account: {
		title: "Panel de Mi Cuenta",
		ordersTitle: "Órdenes Guardadas",
		resumeWhatsApp: "Completar orden por WhatsApp",
	},
} as const;

export type Dictionary = typeof esDictionary;
