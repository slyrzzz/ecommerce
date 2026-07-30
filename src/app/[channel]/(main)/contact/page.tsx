import { getStoreContact } from "@/lib/payload";
import { type Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
	title: "Contacto y Soporte",
	description: "Contáctanos para resolver cualquier duda o consulta sobre tu pedido.",
};

export default async function ContactPage() {
	const storeContact = await getStoreContact();

	return (
		<div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			{/* Encabezado */}
			<div className="mx-auto max-w-2xl text-center">
				<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Contacto y Soporte
				</h1>
				<p className="mt-4 text-base text-muted-foreground">
					Estamos aquí para ayudarte. Contáctanos por cualquiera de nuestros canales oficiales para una atención rápida y personalizada.
				</p>
			</div>

			{/* Tarjetas principales */}
			<div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
				{/* Información de Contacto */}
				<div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md sm:p-8">
					<h2 className="text-xl font-bold text-foreground">Datos del Negocio</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Información general y canales de atención de nuestra tienda.
					</p>

					<ul className="mt-8 space-y-6 text-sm">
						{storeContact.contactInfo.address && (
							<li className="flex items-start gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<MapPin className="h-5 w-5" />
								</div>
								<div>
									<span className="block font-semibold text-foreground">Dirección</span>
									<span className="text-muted-foreground">{storeContact.contactInfo.address}</span>
									{storeContact.contactInfo.cityCountry && (
										<span className="mt-0.5 block text-xs text-muted-foreground">
											{storeContact.contactInfo.cityCountry}
										</span>
									)}
								</div>
							</li>
						)}

						{storeContact.contactInfo.supportPhone && (
							<li className="flex items-start gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<Phone className="h-5 w-5" />
								</div>
								<div>
									<span className="block font-semibold text-foreground">Teléfono</span>
									<a
										href={`tel:${storeContact.contactInfo.supportPhone.replace(/[^\d+]/g, "")}`}
										className="text-muted-foreground transition-colors hover:text-foreground hover:underline"
									>
										{storeContact.contactInfo.supportPhone}
									</a>
								</div>
							</li>
						)}

						{storeContact.contactInfo.supportEmail && (
							<li className="flex items-start gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<Mail className="h-5 w-5" />
								</div>
								<div>
									<span className="block font-semibold text-foreground">Correo Electrónico</span>
									<a
										href={`mailto:${storeContact.contactInfo.supportEmail}`}
										className="text-muted-foreground transition-colors hover:text-foreground hover:underline"
									>
										{storeContact.contactInfo.supportEmail}
									</a>
								</div>
							</li>
						)}

						{storeContact.contactInfo.hours && (
							<li className="flex items-start gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<Clock className="h-5 w-5" />
								</div>
								<div>
									<span className="block font-semibold text-foreground">Horario de Atención</span>
									<span className="text-muted-foreground">{storeContact.contactInfo.hours}</span>
								</div>
							</li>
						)}
					</ul>
				</div>

				{/* Soporte Rápido por WhatsApp */}
				<div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md sm:p-8">
					<div>
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
								<MessageCircle className="h-6 w-6" />
							</div>
							<div>
								<h2 className="text-xl font-bold text-foreground">
									Atención Rápida por WhatsApp
								</h2>
								<p className="font-medium text-xs text-emerald-600 dark:text-emerald-400">
									Respuesta directa en línea
								</p>
							</div>
						</div>

						<p className="mt-6 text-sm leading-relaxed text-muted-foreground">
							¿Tienes una pregunta sobre un producto, un pedido en curso o necesitas asistencia inmediata? Escríbenos directamente a nuestro WhatsApp oficial de atención.
						</p>
					</div>

					<div className="mt-8">
						<a
							href={`https://wa.me/${storeContact.whatsapp.businessPhone}?text=${encodeURIComponent("¡Hola! Necesito ayuda con una consulta de la tienda.")}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow"
						>
							<MessageCircle className="h-5 w-5" />
							<span>Iniciar Chat en WhatsApp</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
