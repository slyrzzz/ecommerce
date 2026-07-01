import { notFound } from "next/navigation";

export default function LoginPage() {
	// Login is disabled in this storefront as it operates without user accounts for WhatsApp checkout.
	notFound();
}
