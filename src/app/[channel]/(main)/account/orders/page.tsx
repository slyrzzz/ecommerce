import { redirect } from "next/navigation";
import Link from "next/link";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getCurrentUser } from "@/lib/payload/auth";
import { ResumeOrderWhatsAppButton } from "@/ui/components/account/resume-order-whatsapp-button";

export const metadata = {
	title: "Mis Pedidos",
	description: "Consulta tus pedidos guardados y completa tus órdenes pendientes.",
};

export default async function AccountOrdersPage({ params }: { params: Promise<{ channel: string }> }) {
	const { channel } = await params;
	const user = await getCurrentUser();

	if (!user) {
		redirect(`/${channel}/login`);
	}

	const payload = await getPayload({ config: configPromise });
	const ordersRes = await payload.find({
		collection: "orders",
		where: {
			user: {
				equals: user.id,
			},
		},
		sort: "-createdAt",
	});

	const orders = ordersRes.docs || [];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "saved":
				return (
					<span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
						Pedido no completado (Guardado)
					</span>
				);
			case "whatsapp_sent":
				return (
					<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
						Enviado por WhatsApp
					</span>
				);
			case "completed":
				return (
					<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
						Completado
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
						{status}
					</span>
				);
		}
	};

	return (
		<div className="mx-auto max-w-4xl px-4 py-12">
			<div className="mb-8 flex items-center justify-between border-b pb-4">
				<div>
					<h1 className="text-3xl font-bold">Mis Pedidos</h1>
					<p className="mt-1 text-muted-foreground">
						Administra tus pedidos y retoma fácilmente tus órdenes no completadas en WhatsApp.
					</p>
				</div>
				<Link
					href={`/${channel}/account`}
					className="text-sm font-medium text-foreground underline underline-offset-2 hover:no-underline"
				>
					&larr; Volver a Mi Cuenta
				</Link>
			</div>

			{orders.length === 0 ? (
				<div className="rounded-lg border bg-card p-12 text-center shadow-sm">
					<h3 className="text-lg font-semibold">No tienes pedidos guardados</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Cuando guardes una orden en el Checkout, aparecerá aquí para que puedas completarla en cualquier momento.
					</p>
					<Link
						href={`/${channel}`}
						className="mt-6 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Ir a la Tienda
					</Link>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map((order: any) => (
						<div key={order.id} className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
							<div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
								<div>
									<div className="flex items-center gap-3">
										<span className="text-lg font-bold">{order.orderNumber}</span>
										{getStatusBadge(order.status)}
									</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Creado el {new Date(order.createdAt).toLocaleDateString("es-ES")}
									</p>
								</div>
								<div className="text-right">
									<span className="text-xs text-muted-foreground block">Total:</span>
									<span className="text-xl font-bold">${Number(order.totalPrice || 0).toFixed(2)}</span>
								</div>
							</div>

							<div className="my-4">
								<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
									Productos ({order.lines?.length || 0})
								</h4>
								<ul className="divide-y text-sm">
									{order.lines?.map((line: any, index: number) => (
										<li key={index} className="flex justify-between py-2">
											<span>
												<span className="font-semibold">{line.quantity}x</span> {line.productName}
											</span>
											<span className="font-medium">${Number(line.price || 0).toFixed(2)}</span>
										</li>
									))}
								</ul>
							</div>

							{order.status === "saved" && (
								<div className="mt-6 flex items-center justify-end border-t pt-4">
									<ResumeOrderWhatsAppButton
										orderNumber={order.orderNumber}
										lines={order.lines || []}
										totalPrice={Number(order.totalPrice || 0)}
										customer={order.customer}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
