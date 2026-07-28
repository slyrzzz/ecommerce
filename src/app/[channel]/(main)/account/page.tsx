import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/payload/auth";
import { Button } from "@/ui/components/ui/button";

export const metadata = {
	title: "Mi Cuenta",
	description: "Perfil de usuario y direcciones guardadas.",
};

export default async function AccountPage({ params }: { params: Promise<{ channel: string }> }) {
	const { channel } = await params;
	const user = await getCurrentUser();

	if (!user) {
		redirect(`/${channel}/login`);
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-12">
			<div className="mb-8 flex items-center justify-between border-b pb-4">
				<div>
					<h1 className="text-3xl font-bold">Mi Cuenta</h1>
					<p className="mt-1 text-muted-foreground">Bienvenido de nuevo, {user.firstName || user.email}</p>
				</div>
				<Link href={`/${channel}/account/orders`}>
					<Button variant="outline">Ver Pedidos Guardados</Button>
				</Link>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Información Personal</h2>
					<dl className="space-y-3 text-sm">
						<div>
							<dt className="font-medium text-muted-foreground">Nombre completo:</dt>
							<dd className="mt-0.5 font-medium">{user.firstName} {user.lastName}</dd>
						</div>
						<div>
							<dt className="font-medium text-muted-foreground">Correo electrónico:</dt>
							<dd className="mt-0.5 font-medium">{user.email}</dd>
						</div>
						<div>
							<dt className="font-medium text-muted-foreground">Teléfono / WhatsApp:</dt>
							<dd className="mt-0.5 font-medium">{user.phone || "No configurado"}</dd>
						</div>
					</dl>
				</div>

				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Dirección Predeterminada</h2>
					<dl className="space-y-3 text-sm">
						<div>
							<dt className="font-medium text-muted-foreground">Dirección:</dt>
							<dd className="mt-0.5 font-medium">{user.address || "No configurada"}</dd>
						</div>
						<div>
							<dt className="font-medium text-muted-foreground">Ciudad:</dt>
							<dd className="mt-0.5 font-medium">{user.city || "No configurada"}</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	);
}
