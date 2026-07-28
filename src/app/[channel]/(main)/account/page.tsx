import { redirect } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getCurrentUser } from "@/lib/payload/auth";
import { AccountDashboard } from "@/ui/components/account/account-dashboard";

export const metadata = {
	title: "Mi Cuenta y Pedidos",
	description: "Administra tu perfil, direcciones guardadas y pedidos de tu cuenta.",
};

export default async function AccountPage({ params }: { params: Promise<{ channel: string }> }) {
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

	return <AccountDashboard user={user} initialOrders={orders} channel={channel} />;
}
