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
		<div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div className="text-center">
				<h1 className="text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
					Contacto y Soporte
				</h1>
				<p className="mt-4 text-base text-neutral-400">
					Estamos aquí para ayudarte. Contáctanos por cualquiera de nuestros canales oficiales.
				</p>
			</div>

			<div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
				{/* Información de Contacto */}
				<div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
					<h2 className="text-lg font-semibold text-neutral-200">Datos del Negocio</h2>
					<ul className="mt-6 space-y-5 text-sm text-neutral-400">
						{storeContact.contactInfo.address && (
							<li className="flex items-start gap-3">
								<MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
								<div>
									<span className="block font-medium text-neutral-300">Dirección</span>
									<span>{storeContact.contactInfo.address}</span>
									{storeContact.contactInfo.cityCountry && (
										<span className="block text-xs text-neutral-500">
											{storeContact.contactInfo.cityCountry}
										</span>
									)}
								</div>
							</li>
						)}

						{storeContact.contactInfo.supportPhone && (
							<li className="flex items-start gap-3">
								<Phone className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
								<div>
									<span className="block font-medium text-neutral-300">Teléfono</span>
									<a
										href={`tel:${storeContact.contactInfo.supportPhone.replace(/[^\d+]/g, "")}`}
										className="transition-colors hover:text-neutral-200"
									>
										{storeContact.contactInfo.supportPhone}
									</a>
								</div>
							</li>
						)}

						{storeContact.contactInfo.supportEmail && (
							<li className="flex items-start gap-3">
								<Mail className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
								<div>
									<span className="block font-medium text-neutral-300">Correo Electrónico</span>
									<a
										href={`mailto:${storeContact.contactInfo.supportEmail}`}
										className="transition-colors hover:text-neutral-200"
									>
										{storeContact.contactInfo.supportEmail}
									</a>
								</div>
							</li>
						)}

						{storeContact.contactInfo.hours && (
							<li className="flex items-start gap-3">
								<Clock className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
								<div>
									<span className="block font-medium text-neutral-300">Horario de Atención</span>
									<span>{storeContact.contactInfo.hours}</span>
								</div>
							</li>
						)}
					</ul>
				</div>

				{/* Soporte Rápido por WhatsApp */}
				<div className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
					<div>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
								<MessageCircle className="h-5 w-5" />
							</div>
							<h2 className="text-lg font-semibold text-neutral-200">
								Atención Rápida por WhatsApp
							</h2>
						</div>
						<p className="mt-4 text-sm leading-relaxed text-neutral-400">
							¿Tienes una pregunta sobre un producto, un pedido en curso o necesitas asistencia inmediata? Escríbenos directamente a nuestro WhatsApp oficial de atención.
						</p>
					</div>

					<div className="mt-8">
						<a
							href={`https://wa.me/${storeContact.whatsapp.businessPhone}?text=${encodeURIComponent("¡Hola! Necesito ayuda con una consulta de la tienda.")}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
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
