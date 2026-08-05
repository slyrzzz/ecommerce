import { getStoreLegal, getStoreIdentity } from "@/lib/payload";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Política de Privacidad",
	description: "Política de privacidad de nuestra tienda",
};

export default async function PrivacyPolicyPage() {
	const legal = await getStoreLegal();
	const identity = await getStoreIdentity();

	return (
		<div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="prose prose-neutral dark:prose-invert mx-auto max-w-none">
				<h1 className="text-3xl font-bold tracking-tight mb-8">Política de Privacidad</h1>
				<p className="text-sm text-neutral-500 mb-8">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

				<section className="mt-8 space-y-4">
					<h2>1. Información General</h2>
					<p>
						En <strong>{identity.siteName}</strong> (propiedad de <strong>{legal.legalName}</strong>, con identificador fiscal {legal.taxId}), 
						valoramos y respetamos su privacidad. Esta política de privacidad describe cómo recopilamos, usamos y protegemos su información 
						personal cuando visita nuestra tienda o realiza una compra.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>2. Información que Recopilamos</h2>
					<p>
						Recopilamos información que usted nos proporciona directamente al crear una cuenta, realizar una compra o comunicarse con nosotros. 
						Esto incluye su nombre, dirección de envío y facturación, dirección de correo electrónico, y número de teléfono. 
						También recopilamos automáticamente cierta información sobre su dispositivo y su navegación en nuestra tienda.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>3. Uso de la Información</h2>
					<p>
						Utilizamos la información recopilada para procesar y completar sus pedidos, comunicarnos con usted sobre su compra o cuenta, 
						mejorar y personalizar su experiencia en nuestra tienda, y detectar o prevenir posibles fraudes o abusos.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>4. Compartición de Datos</h2>
					<p>
						No vendemos, alquilamos ni comercializamos su información personal a terceros. Podemos compartir su información con 
						proveedores de servicios de confianza que nos asisten en operar nuestra tienda, procesar pagos y entregar sus pedidos, 
						siempre y cuando estas partes acuerden mantener esta información confidencial.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>5. Sus Derechos</h2>
					<p>
						Dependiendo de su jurisdicción, usted puede tener el derecho de acceder a la información personal que tenemos sobre usted, 
						así como solicitar que su información personal sea corregida, actualizada o eliminada. Para ejercer estos derechos, 
						por favor contáctenos utilizando la información proporcionada a continuación.
					</p>
				</section>

				<section className="mt-8 space-y-4">
					<h2>6. Contacto</h2>
					<p>
						Si tiene alguna pregunta sobre esta política de privacidad o nuestras prácticas de tratamiento de datos, 
						puede contactarnos en <strong>{legal.legalEmail}</strong> o por correo postal a la siguiente dirección: 
						<strong>{legal.legalAddress}</strong>.
					</p>
				</section>
			</div>
		</div>
	);
}
