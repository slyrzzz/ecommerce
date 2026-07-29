import { Suspense } from "react";
import { LoginMode } from "@/ui/components/auth/login-mode";

export const metadata = {
	title: "Iniciar sesión",
	description: "Inicia sesión en tu cuenta para ver tus pedidos y agilizar tus compras.",
};

export default function LoginPage() {
	return (
		<Suspense fallback={<LoginSkeleton />}>
			<section className="mx-auto max-w-7xl p-8 pb-24">
				<LoginMode />
			</section>
		</Suspense>
	);
}

function LoginSkeleton() {
	return (
		<section className="mx-auto max-w-7xl p-8 pb-24">
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="mb-6 flex flex-col items-center gap-2">
						<div className="h-7 w-44 animate-pulse rounded bg-secondary" />
						<div className="h-4 w-52 animate-pulse rounded bg-secondary" />
					</div>
					<div className="space-y-4">
						<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
						<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
						<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
					</div>
				</div>
			</div>
		</section>
	);
}
