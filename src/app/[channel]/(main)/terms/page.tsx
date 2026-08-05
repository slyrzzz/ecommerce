import { getStoreLegal, getStoreIdentity } from "@/lib/payload";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Términos de Servicio",
	description: "Términos y condiciones de uso de nuestra tienda",
};

export default async function TermsOfServicePage() {
	const legal = await getStoreLegal();
	const identity = await getStoreIdentity();

	return (
		<div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="prose prose-neutral dark:prose-invert mx-auto max-w-none">
				<h1 className="text-3xl font-bold tracking-tight mb-8">Términos de Servicio</h1>
				<p className="text-sm text-neutral-500 mb-8">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

				<section className="mt-8 space-y-4">
					<h2>1. Introducción</h2>
					<p>
						Bienvenido a <strong>{identity.siteName}</strong>. Estos Términos de Servicio ("Términos") rigen su acceso y uso de nuestro 
						sitio web y los servicios que ofrecemos. Este sitio es operado por <strong>{legal.legalName}</strong> ("nosotros", "nuestro"). 
						Al acceder o utilizar nuestra tienda, usted acepta estar sujeto a estos Términos.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>2. Uso del Sitio</h2>
					<p>
						Usted acepta utilizar nuestro sitio web únicamente con fines lícitos. Queda prohibido el uso del sitio para actividades fraudulentas, 
						difamatorias, ofensivas, o para la distribución de malware. Nos reservamos el derecho de denegar el servicio, cancelar cuentas o 
						cancelar pedidos a nuestra entera discreción, incluyendo, pero no limitado a, si creemos que la conducta del cliente viola la ley aplicable o es perjudicial para nuestros intereses.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>3. Productos y Precios</h2>
					<p>
						Hacemos todo lo posible para mostrar con la mayor precisión posible los colores y las imágenes de nuestros productos que aparecen 
						en la tienda. Sin embargo, no garantizamos que la visualización de cualquier color en el monitor de su computadora sea exacta. 
						Todos los precios están sujetos a cambios sin previo aviso.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>4. Pagos y Facturación</h2>
					<p>
						Usted se compromete a proporcionar información de compra y de cuenta actual, completa y exacta para todas las compras realizadas en 
						nuestra tienda. En caso de que se requiera emitir una factura bajo el identificador fiscal <strong>{legal.taxId}</strong>, 
						deberá solicitarla cumpliendo con los requisitos locales establecidos en <strong>{legal.jurisdiction}</strong>.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>5. Propiedad Intelectual</h2>
					<p>
						Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, imágenes, audios y software, es propiedad de 
						<strong> {legal.legalName}</strong> o de sus proveedores de contenido, y está protegido por las leyes de propiedad intelectual 
						aplicables en <strong>{legal.jurisdiction}</strong> y tratados internacionales.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>6. Limitación de Responsabilidad</h2>
					<p>
						En ningún caso <strong>{legal.legalName}</strong>, nuestros directores, oficiales, empleados, afiliados, agentes, contratistas, 
						pasantes, proveedores, o prestadores de servicios serán responsables de ninguna lesión, pérdida, reclamo, o cualquier daño 
						directo, indirecto, incidental, punitivo, especial, o consecuente de cualquier tipo derivado de su uso de cualquiera de los 
						servicios o productos adquiridos mediante el servicio.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>7. Ley Aplicable</h2>
					<p>
						Estos Términos de Servicio y cualquier acuerdo separado por el cual le proporcionemos servicios se regirán e interpretarán de acuerdo 
						con las leyes de <strong>{legal.jurisdiction}</strong>. Cualquier disputa relacionada con estos términos estará sujeta a la 
						jurisdicción exclusiva de los tribunales de dicha ubicación.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>8. Contacto</h2>
					<p>
						Preguntas sobre los Términos de Servicio deben ser enviadas a nosotros a través de <strong>{legal.legalEmail}</strong> o por 
						correo a <strong>{legal.legalAddress}</strong>.
					</p>
				</section>
			</div>
		</div>
	);
}
