"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, CheckCircle2, AlertCircle, ShoppingBag, MapPin, User as UserIcon } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { ResumeOrderWhatsAppButton } from "@/ui/components/account/resume-order-whatsapp-button";

interface AccountDashboardProps {
	user: {
		id: string;
		email: string;
		firstName?: string;
		lastName?: string;
		phone?: string;
		address?: string;
		city?: string;
	};
	initialOrders: any[];
	channel: string;
	whatsappNumber?: string;
}

export function AccountDashboard({
	user,
	initialOrders,
	channel,
	whatsappNumber = "584120000000",
}: AccountDashboardProps) {
	const [userProfile, setUserProfile] = useState(user);
	const [orders, setOrders] = useState<any[]>(initialOrders);

	// Edición de perfil
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		firstName: user.firstName || "",
		lastName: user.lastName || "",
		phone: user.phone || "",
		address: user.address || "",
		city: user.city || "",
	});
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const [profileSuccess, setProfileSuccess] = useState("");
	const [profileError, setProfileError] = useState("");

	// Eliminación de órdenes
	const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
	const [orderSuccess, setOrderSuccess] = useState("");
	const [orderError, setOrderError] = useState("");

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSavingProfile(true);
		setProfileSuccess("");
		setProfileError("");

		try {
			const res = await fetch("/api/auth/update-profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			if (!res.ok || data.error) {
				setProfileError(data.error || "No se pudo actualizar tu información");
			} else {
				setUserProfile((prev) => ({
					...prev,
					...formData,
				}));
				setIsEditing(false);
				setProfileSuccess("¡Tu información personal y dirección han sido actualizadas!");
				setTimeout(() => setProfileSuccess(""), 5000);
			}
		} catch {
			setProfileError("Error de red al guardar los cambios.");
		} finally {
			setIsSavingProfile(false);
		}
	};

	const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
		if (!window.confirm(`¿Estás seguro de que deseas eliminar el pedido guardado ${orderNumber}?`)) {
			return;
		}

		setDeletingOrderId(orderId);
		setOrderSuccess("");
		setOrderError("");

		try {
			const res = await fetch("/api/auth/delete-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId }),
			});

			const data = await res.json();
			if (!res.ok || data.error) {
				setOrderError(data.error || "No se pudo eliminar el pedido.");
			} else {
				setOrders((prev) => prev.filter((o) => o.id !== orderId));
				setOrderSuccess(`El pedido ${orderNumber} ha sido eliminado correctamente.`);
				setTimeout(() => setOrderSuccess(""), 5000);
			}
		} catch {
			setOrderError("Error de red al intentar eliminar el pedido.");
		} finally {
			setDeletingOrderId(null);
		}
	};

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
			case "processing":
				return (
					<span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
						En Proceso
					</span>
				);
			case "completed":
				return (
					<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
						Completado
					</span>
				);
			case "cancelled":
				return (
					<span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
						Cancelado
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
		<div className="mx-auto max-w-5xl px-4 py-12">
			{/* Encabezado Superior */}
			<div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Mi Cuenta</h1>
					<p className="mt-1 text-muted-foreground">
						Bienvenido de nuevo, {userProfile.firstName || userProfile.email}
					</p>
				</div>
				{!isEditing && (
					<Button
						variant="outline"
						onClick={() => setIsEditing(true)}
						className="gap-2 font-medium"
					>
						<Pencil className="h-4 w-4" />
						Editar Información y Dirección
					</Button>
				)}
			</div>

			{/* Alertas Globales de Perfil */}
			{profileSuccess && (
				<div className="mb-6 flex items-center gap-2 rounded-lg bg-green-100 p-4 text-sm font-medium text-green-800">
					<CheckCircle2 className="h-5 w-5 shrink-0" />
					<span>{profileSuccess}</span>
				</div>
			)}
			{profileError && (
				<div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
					<AlertCircle className="h-5 w-5 shrink-0" />
					<span>{profileError}</span>
				</div>
			)}

			{/* Modo Edición de Perfil y Dirección */}
			{isEditing ? (
				<form onSubmit={handleSaveProfile} className="mb-12 rounded-xl border bg-card p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
						<Pencil className="h-5 w-5 text-primary" />
						Editar Perfil y Dirección de Envío
					</h2>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-4">
							<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
								Información Personal
							</h3>
							<div className="space-y-2">
								<label className="text-sm font-medium">Nombre</label>
								<input
									type="text"
									required
									className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
									value={formData.firstName}
									onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Apellido</label>
								<input
									type="text"
									required
									className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
									value={formData.lastName}
									onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Teléfono / WhatsApp</label>
								<input
									type="tel"
									required
									className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
									value={formData.phone}
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
								/>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
								Dirección Predeterminada
							</h3>
							<div className="space-y-2">
								<label className="text-sm font-medium">Dirección de entrega</label>
								<input
									type="text"
									required
									className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
									value={formData.address}
									onChange={(e) => setFormData({ ...formData, address: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Ciudad</label>
								<input
									type="text"
									required
									className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
									value={formData.city}
									onChange={(e) => setFormData({ ...formData, city: e.target.value })}
								/>
							</div>
						</div>
					</div>

					<div className="mt-8 flex items-center justify-end gap-3 border-t pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setIsEditing(false);
								setFormData({
									firstName: userProfile.firstName || "",
									lastName: userProfile.lastName || "",
									phone: userProfile.phone || "",
									address: userProfile.address || "",
									city: userProfile.city || "",
								});
							}}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSavingProfile}>
							{isSavingProfile ? "Guardando..." : "Guardar Cambios"}
						</Button>
					</div>
				</form>
			) : (
				/* Vista de Solo Lectura (Perfil y Dirección) */
				<div className="mb-14 grid gap-6 md:grid-cols-2">
					<div className="rounded-xl border bg-card p-6 shadow-sm">
						<div className="mb-4 flex items-center gap-2">
							<UserIcon className="h-5 w-5 text-primary" />
							<h2 className="text-lg font-semibold">Información Personal</h2>
						</div>
						<dl className="space-y-3 text-sm">
							<div>
								<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Nombre completo
								</dt>
								<dd className="mt-0.5 font-medium text-foreground">
									{userProfile.firstName} {userProfile.lastName}
								</dd>
							</div>
							<div>
								<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Correo electrónico
								</dt>
								<dd className="mt-0.5 font-medium text-foreground">{userProfile.email}</dd>
							</div>
							<div>
								<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Teléfono / WhatsApp
								</dt>
								<dd className="mt-0.5 font-medium text-foreground">
									{userProfile.phone || "No configurado"}
								</dd>
							</div>
						</dl>
					</div>

					<div className="rounded-xl border bg-card p-6 shadow-sm">
						<div className="mb-4 flex items-center gap-2">
							<MapPin className="h-5 w-5 text-primary" />
							<h2 className="text-lg font-semibold">Dirección Predeterminada</h2>
						</div>
						<dl className="space-y-3 text-sm">
							<div>
								<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Dirección
								</dt>
								<dd className="mt-0.5 font-medium text-foreground">
									{userProfile.address || "No configurada"}
								</dd>
							</div>
							<div>
								<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Ciudad
								</dt>
								<dd className="mt-0.5 font-medium text-foreground">
									{userProfile.city || "No configurada"}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			)}

			{/* SECCIÓN INFERIOR: MIS PEDIDOS Y ÓRDENES GUARDADAS */}
			<div className="border-t pt-10">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					<div>
						<h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
							<ShoppingBag className="h-6 w-6 text-primary" />
							Mis Pedidos y Órdenes Guardadas
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Administra tus pedidos, retoma órdenes en WhatsApp o elimina compras pendientes que ya no necesites.
						</p>
					</div>
				</div>

				{/* Alertas de Orden */}
				{orderSuccess && (
					<div className="mb-6 flex items-center gap-2 rounded-lg bg-green-100 p-4 text-sm font-medium text-green-800">
						<CheckCircle2 className="h-5 w-5 shrink-0" />
						<span>{orderSuccess}</span>
					</div>
				)}
				{orderError && (
					<div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
						<AlertCircle className="h-5 w-5 shrink-0" />
						<span>{orderError}</span>
					</div>
				)}

				{orders.length === 0 ? (
					<div className="rounded-xl border bg-card p-12 text-center shadow-sm">
						<h3 className="text-lg font-semibold">No tienes pedidos en este momento</h3>
						<p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
							Cuando guardes una orden en el Checkout para después o realices un pedido, aparecerá aquí automáticamente.
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
							<div
								key={order.id}
								className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
							>
								<div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
									<div>
										<div className="flex flex-wrap items-center gap-3">
											<span className="text-lg font-bold">{order.orderNumber}</span>
											{getStatusBadge(order.status)}
										</div>
										<p className="mt-1 text-xs text-muted-foreground">
											Creado el {new Date(order.createdAt).toLocaleDateString("es-ES")}
										</p>
									</div>
									<div className="text-right">
										<span className="text-xs text-muted-foreground block">Total:</span>
										<span className="text-xl font-bold">
											${Number(order.totalPrice || 0).toFixed(2)}
										</span>
									</div>
								</div>

								<div className="my-4">
									<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
										Productos ({order.lines?.length || 0})
									</h4>
									<ul className="divide-y text-sm">
										{order.lines?.map((line: any, index: number) => (
											<li key={index} className="flex justify-between py-2.5">
												<span>
													<span className="font-semibold">{line.quantity}x</span> {line.productName}
												</span>
												<span className="font-medium">
													${Number(line.price || 0).toFixed(2)}
												</span>
											</li>
										))}
									</ul>
								</div>

								{/* Botones de acción: Retomar WhatsApp / Eliminar Pedido Guardado */}
								{order.status === "saved" ? (
									<div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t pt-4">
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
											disabled={deletingOrderId === order.id}
											className="gap-1.5 font-medium bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
										>
											<Trash2 className="h-4 w-4" />
											{deletingOrderId === order.id ? "Eliminando..." : "Eliminar pedido"}
										</Button>

										<ResumeOrderWhatsAppButton
											orderNumber={order.orderNumber}
											lines={order.lines || []}
											totalPrice={Number(order.totalPrice || 0)}
											customer={order.customer}
											whatsappNumber={whatsappNumber}
										/>
									</div>
								) : (
									<div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t pt-4">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
											disabled={deletingOrderId === order.id}
											className="gap-1.5 text-muted-foreground hover:text-destructive"
										>
											<Trash2 className="h-4 w-4" />
											{deletingOrderId === order.id ? "Eliminando..." : "Eliminar del historial"}
										</Button>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
