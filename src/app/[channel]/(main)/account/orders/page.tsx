import { redirect } from "next/navigation";

export default async function AccountOrdersRedirectPage({ params }: { params: Promise<{ channel: string }> }) {
	const { channel } = await params;
	redirect(`/${channel}/account`);
}
