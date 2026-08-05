import type { GlobalConfig } from "payload";

export const StoreLegal: GlobalConfig = {
	slug: "store-legal",
	label: "Información Legal",
	admin: {
		group: "Manejo de Tienda",
		description: "Configura la información legal de tu empresa y la visibilidad de las políticas en el pie de página.",
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
					label: "Datos Legales de la Empresa",
					description: "Esta información se usará para autocompletar las páginas de Política de Privacidad y Términos de Servicio.",
					fields: [
						{
							name: "legalName",
							type: "text",
							label: "Razón Social / Nombre Legal",
							defaultValue: "Empresa de Ejemplo, S.A. de C.V.",
							required: true,
						},
						{
							name: "taxId",
							type: "text",
							label: "Identificador Fiscal (RFC / RUT / NIF / CIF)",
							defaultValue: "XAXX010101000",
						},
						{
							name: "legalAddress",
							type: "text",
							label: "Dirección Legal / Fiscal",
							defaultValue: "123 Calle Principal, Ciudad, País",
							required: true,
						},
						{
							name: "legalEmail",
							type: "email",
							label: "Correo Electrónico para Asuntos Legales y de Privacidad",
							defaultValue: "legal@ejemplo.com",
							required: true,
						},
						{
							name: "jurisdiction",
							type: "text",
							label: "Jurisdicción (País / Estado para leyes aplicables)",
							defaultValue: "Ciudad de México, México",
							required: true,
							admin: {
								description: "Ejemplo: 'Madrid, España' o 'Ciudad de México, México'. Se usará para definir bajo qué leyes se rigen los Términos de Servicio.",
							},
						},
					],
				},
				{
					label: "Visibilidad en el Footer",
					description: "Controla si los enlaces a estas páginas aparecen en la parte inferior de la tienda.",
					fields: [
						{
							name: "showPrivacyPolicy",
							type: "checkbox",
							label: "Mostrar enlace de 'Política de Privacidad' en el pie de página",
							defaultValue: true,
						},
						{
							name: "showTermsOfService",
							type: "checkbox",
							label: "Mostrar enlace de 'Términos de Servicio' en el pie de página",
							defaultValue: true,
						},
					],
				},
			],
		},
	],
};
