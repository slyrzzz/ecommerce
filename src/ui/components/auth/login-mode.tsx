"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginMode() {
	const router = useRouter();
	const params = useParams<{ channel: string }>();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [resetMessage, setResetMessage] = useState("");
	const [resetEmailSent, setResetEmailSent] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email || !EMAIL_RE.test(email)) {
			setError("Por favor ingresa un correo electrónico válido");
			return;
		}

		if (!password) {
			setError("Por favor ingresa tu contraseña");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok || data.errors?.length) {
				setError(data.errors?.[0]?.message || "Correo o contraseña inválidos. Por favor intenta de nuevo.");
				return;
			}

			if (data.token) {
				router.push(`/${params.channel}`);
				router.refresh();
			}
		} catch {
			setError("Ocurrió un error. Por favor intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleForgotPassword = async () => {
		setError("");
		setResetMessage("");

		if (!email || !EMAIL_RE.test(email)) {
			setError("Por favor ingresa un correo electrónico válido primero");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					channel: params.channel,
					redirectUrl: `${window.location.origin}/${params.channel}/login`,
				}),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string }>;
				success?: boolean;
			};

			if (data.errors?.length) {
				setError(data.errors[0].message || "No se pudo enviar el enlace de recuperación");
				return;
			}

			setResetEmailSent(true);
			setResetMessage(
				`Si existe una cuenta para ${email}, se ha enviado un enlace de recuperación de contraseña. Nota: Solo puedes solicitar un enlace de recuperación cada 15 minutos.`,
			);
		} catch {
			setError("Ocurrió un error. Por favor intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto my-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-semibold">Bienvenido de vuelta</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						¿No tienes una cuenta?{" "}
						<Link
							href={`/${params.channel}/signup`}
							className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
						>
							Regístrate
						</Link>
					</p>
				</div>

				<form onSubmit={handleLogin} className="space-y-4">
					{error && (
						<div role="alert" className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					{resetMessage && (
						<div aria-live="polite" className="rounded-md bg-green-100 p-3 text-sm text-green-800 dark:border dark:border-green-800/50 dark:bg-green-950/50 dark:text-green-300">
							{resetMessage}
						</div>
					)}

					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-sm font-medium">
							Correo electrónico
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder="tu@ejemplo.com"
								autoComplete="email"
								spellCheck={false}
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setResetEmailSent(false);
								}}
								className="h-12 pl-10"
								required
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-sm font-medium">
							Contraseña
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Ingresa tu contraseña"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-12 pl-10 pr-10"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					<div className="flex justify-end">
						<button
							type="button"
							onClick={handleForgotPassword}
							disabled={isSubmitting}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline disabled:opacity-50"
						>
							{resetEmailSent ? "¿Reenviar enlace?" : "¿Olvidaste tu contraseña?"}
						</button>
					</div>

					<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
						{isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
					</Button>
				</form>
			</div>
		</div>
	);
}
