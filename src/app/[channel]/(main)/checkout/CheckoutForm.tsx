// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { CheckoutCustomerData, CheckoutCartData, WhatsAppCheckoutStrategy } from "@/checkout/strategy";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/ui/components/ui/button";
import { Save, CheckCircle2, MessageSquare } from "lucide-react";
import { useDictionary } from "@/lib/i18n/client";

export function CheckoutForm({
	cartData,
	currentUser,
	whatsappNumber = "584120000000",
	whatsappPrefix = "¡Hola! Quiero completar mi pedido",
}: {
	cartData: CheckoutCartData;
	currentUser?: any;
	whatsappNumber?: string;
	whatsappPrefix?: string;
}) {
	const dict = useDictionary();
	const [customer, setCustomer] = useState<CheckoutCustomerData>({
		firstName: currentUser?.firstName || "",
		lastName: currentUser?.lastName || "",
		phone: currentUser?.phone || "",
		address: currentUser?.address || "",
		city: currentUser?.city || "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState("");
	const [saveError, setSaveError] = useState("");

	// Caching in localStorage for guest users (when !currentUser)
	useEffect(() => {
		if (!currentUser) {
			try {
				const cached = localStorage.getItem("checkout_customer_cache");
				if (cached) {
					const parsed = JSON.parse(cached);
					setCustomer((prev) => ({
						firstName: prev.firstName || parsed.firstName || "",
						lastName: prev.lastName || parsed.lastName || "",
						phone: prev.phone || parsed.phone || "",
						address: prev.address || parsed.address || "",
						city: prev.city || parsed.city || "",
					}));
				}
			} catch {
				// Ignore localStorage read error
			}
		}
	}, [currentUser]);

	const updateCustomerField = (field: keyof CheckoutCustomerData, value: string) => {
		const updated = { ...customer, [field]: value };
		setCustomer(updated);

		// Limpiar error del campo si el usuario empieza a escribir
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}

		if (!currentUser) {
			try {
				localStorage.setItem("checkout_customer_cache", JSON.stringify(updated));
			} catch {
				// Ignore storage error
			}
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!customer.firstName || !customer.firstName.trim()) {
			newErrors.firstName = "El nombre es obligatorio.";
		}
		if (!customer.lastName || !customer.lastName.trim()) {
			newErrors.lastName = "El apellido es obligatorio.";
		}
		if (!customer.phone || !customer.phone.trim()) {
			newErrors.phone = "El teléfono / WhatsApp es obligatorio.";
		}
		if (!customer.address || !customer.address.trim()) {
			newErrors.address = "La dirección de entrega es obligatoria.";
		}
		if (!customer.city || !customer.city.trim()) {
			newErrors.city = "La ciudad es obligatoria.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		const strategy = new WhatsAppCheckoutStrategy(whatsappNumber, whatsappPrefix);
		strategy.execute(customer, cartData);
	};

	const handleSaveOrder = async () => {
		if (!validateForm()) return;

		setIsSaving(true);
		setSaveSuccess("");
		setSaveError("");

		try {
			const res = await fetch("/api/auth/save-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					customer,
					lines: cartData.lines,
					totalPrice: cartData.totalPrice,
					currency: cartData.currency,
					status: "saved",
				}),
			});

			const data = await res.json();
			if (!res.ok || data.errors?.length) {
				setSaveError(data.errors?.[0]?.message || "No se pudo guardar la orden");
			} else {
				if (currentUser) {
					setSaveSuccess("¡Orden guardada correctamente en tu cuenta en Pedidos no completados!");
				} else {
					setSaveSuccess("¡Orden guardada en tu sesión! Inicia sesión o regístrate en Mi Cuenta para consultarla después.");
				}
			}
		} catch {
			setSaveError("Error de conexión al guardar la orden.");
		} finally {
			setIsSaving(false);
		}
	};

	if (cartData.lines.length === 0) {
		return (
			<div className="text-center py-12">
				<h2 className="text-2xl font-semibold mb-4">{dict.checkout.emptyCart || "Tu bolsa está vacía"}</h2>
				<p className="text-muted-foreground">{dict.checkout.emptyCartSubtitle || "Agrega productos para proceder al checkout."}</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<div>
				<h2 className="text-2xl font-semibold mb-6">{dict.checkout.shippingInfo || "Información de Envío"}</h2>

				{currentUser && (
					<div className="mb-6 rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm">
						<p className="font-semibold text-primary">Sesión iniciada como {currentUser.email}</p>
						<p className="text-muted-foreground mt-0.5">
							Tus datos han sido completados por defecto desde tu perfil de usuario.
						</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4" noValidate>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium flex items-center gap-1">
								{dict.checkout.firstName || "Nombre"} <span className="text-destructive">*</span>
							</label>
							<input
								type="text"
								className={`w-full rounded-md border bg-background px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
									errors.firstName
										? "border-destructive focus:ring-destructive/30"
										: "border-border focus:ring-primary/20"
								}`}
								value={customer.firstName}
								onChange={(e) => updateCustomerField("firstName", e.target.value)}
								placeholder={dict.checkout.enterFirstName || "Ingresa tu nombre"}
							/>
							{errors.firstName && (
								<p className="text-xs text-destructive font-medium mt-1">{errors.firstName}</p>
							)}
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium flex items-center gap-1">
								{dict.checkout.lastName || "Apellido"} <span className="text-destructive">*</span>
							</label>
							<input
								type="text"
								className={`w-full rounded-md border bg-background px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
									errors.lastName
										? "border-destructive focus:ring-destructive/30"
										: "border-border focus:ring-primary/20"
								}`}
								value={customer.lastName}
								onChange={(e) => updateCustomerField("lastName", e.target.value)}
								placeholder={dict.checkout.enterLastName || "Ingresa tu apellido"}
							/>
							{errors.lastName && (
								<p className="text-xs text-destructive font-medium mt-1">{errors.lastName}</p>
							)}
						</div>
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium flex items-center gap-1">
							{dict.checkout.phone || "Teléfono / WhatsApp"} <span className="text-destructive">*</span>
						</label>
						<input
							type="tel"
							className={`w-full rounded-md border bg-background px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
								errors.phone
									? "border-destructive focus:ring-destructive/30"
									: "border-border focus:ring-primary/20"
							}`}
							value={customer.phone}
							onChange={(e) => updateCustomerField("phone", e.target.value)}
							placeholder={dict.checkout.enterPhone || "Ej: +58 412 1234567"}
						/>
						{errors.phone && (
							<p className="text-xs text-destructive font-medium mt-1">{errors.phone}</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium flex items-center gap-1">
							{dict.checkout.address || "Dirección de entrega"} <span className="text-destructive">*</span>
						</label>
						<input
							type="text"
							className={`w-full rounded-md border bg-background px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
								errors.address
									? "border-destructive focus:ring-destructive/30"
									: "border-border focus:ring-primary/20"
							}`}
							value={customer.address}
							onChange={(e) => updateCustomerField("address", e.target.value)}
							placeholder={dict.checkout.enterAddress || "Calle, número, edificio, apartamento..."}
						/>
						{errors.address && (
							<p className="text-xs text-destructive font-medium mt-1">{errors.address}</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium flex items-center gap-1">
							{dict.checkout.city || "Ciudad"} <span className="text-destructive">*</span>
						</label>
						<input
							type="text"
							className={`w-full rounded-md border bg-background px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
								errors.city
									? "border-destructive focus:ring-destructive/30"
									: "border-border focus:ring-primary/20"
							}`}
							value={customer.city}
							onChange={(e) => updateCustomerField("city", e.target.value)}
							placeholder={dict.checkout.enterCity || "Ej: Caracas, Valencia..."}
						/>
						{errors.city && (
							<p className="text-xs text-destructive font-medium mt-1">{errors.city}</p>
						)}
					</div>

					{saveSuccess && (
						<div className="mt-4 flex items-center gap-2 rounded-md bg-green-100 p-3 text-sm text-green-800">
							<CheckCircle2 className="h-4 w-4 shrink-0" />
							<span>{saveSuccess}</span>
						</div>
					)}

					{saveError && (
						<div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
							{saveError}
						</div>
					)}

					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Button
							type="submit"
							className="flex-1 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold h-12"
						>
							<MessageSquare className="h-5 w-5" />
							{dict.checkout.whatsappButton || "Completar orden por WhatsApp"}
						</Button>

						<Button
							type="button"
							variant="outline"
							onClick={handleSaveOrder}
							disabled={isSaving}
							className="gap-2 font-semibold h-12 border-primary text-primary hover:bg-primary/5"
						>
							<Save className="h-4 w-4" />
							{isSaving ? (dict.checkout.saving || "Guardando...") : (dict.checkout.saveOrder || "Guardar orden")}
						</Button>
					</div>
				</form>
			</div>

			<div>
				<div className="bg-secondary/50 rounded-xl p-6 sticky top-24">
					<h3 className="text-xl font-semibold mb-6">{dict.checkout.orderSummary || "Resumen del Pedido"}</h3>
					<ul className="space-y-4 mb-6">
						{cartData.lines.map((line, index) => (
							<li key={index} className="flex justify-between items-center text-sm">
								<span className="flex items-center gap-2">
									<span className="bg-background w-6 h-6 rounded flex items-center justify-center font-medium border border-border text-xs">
										{line.quantity}
									</span>
									<span className="font-medium text-muted-foreground">{line.productName}</span>
								</span>
								<span>{formatMoney(line.price * line.quantity, cartData.currency)}</span>
							</li>
						))}
					</ul>

					<div className="border-t border-border pt-4">
						<div className="flex justify-between items-center text-lg font-bold">
							<span>{dict.cart.total || "Total"}</span>
							<span>{formatMoney(cartData.totalPrice, cartData.currency)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
