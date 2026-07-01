"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetCloseButton } from "@/ui/components/ui/sheet";
import { useCart } from "./cart-context";
import { deleteCartLine, updateCartLineQuantity } from "./actions";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils";
import { localeConfig } from "@/config/locale";

interface PayloadCartLine {
	id: string;
	merchandiseId: string;
	quantity: number;
	totalPrice: number;
	product: any; // payload product
}

interface CartDrawerProps {
	cartId: string | null;
	lines: PayloadCartLine[];
	totalPrice: number;
	channel: string;
}

export function CartDrawer({ cartId, lines, totalPrice, channel }: CartDrawerProps) {
	const { isOpen, closeCart } = useCart();
	const [isPending, startTransition] = useTransition();

	const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
	const currency = localeConfig.fallbackCurrency;

	const handleRemove = (merchandiseId: string) => {
		if (!cartId) return;
		startTransition(() => {
			deleteCartLine(cartId, merchandiseId);
		});
	};

	const handleUpdateQuantity = (merchandiseId: string, newQuantity: number) => {
		if (!cartId || newQuantity < 1) return;
		startTransition(() => {
			updateCartLineQuantity(cartId, merchandiseId, newQuantity);
		});
	};

	const freeShippingThreshold = 100;
	const progressToFreeShipping = Math.min((totalPrice / freeShippingThreshold) * 100, 100);
	const amountToFreeShipping = Math.max(freeShippingThreshold - totalPrice, 0);

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent side="right" className="flex flex-col p-0">
				<SheetHeader className="justify-between border-b border-border px-6 py-4">
					<div className="flex items-center gap-3">
						<ShoppingBag className="h-5 w-5" />
						<SheetTitle>Your Bag</SheetTitle>
						<span className="text-sm text-muted-foreground">({itemCount} items)</span>
					</div>
					<SheetCloseButton className="static" />
				</SheetHeader>

				{lines.length > 0 && (
					<div className="bg-secondary/50 border-b border-border px-6 py-4">
						<div className="mb-2 flex items-center gap-2 text-sm">
							<Truck className={cn("h-4 w-4", amountToFreeShipping <= 0 && "text-success")} />
							{amountToFreeShipping > 0 ? (
								<span>
									Add <strong>{formatMoney(amountToFreeShipping, currency)}</strong> more for free shipping
								</span>
							) : (
								<span className="font-medium text-success">You qualify for free shipping!</span>
							)}
						</div>
						<div className="h-1.5 overflow-hidden rounded-full bg-border">
							<div
								className={cn(
									"h-full rounded-full transition-all duration-500 ease-out",
									amountToFreeShipping <= 0 ? "bg-success" : "bg-foreground",
								)}
								style={{ width: `${progressToFreeShipping}%` }}
							/>
						</div>
					</div>
				)}

				<div className="flex-1 overflow-y-auto">
					{lines.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center px-6 text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
								<ShoppingBag className="h-8 w-8 text-muted-foreground" />
							</div>
							<h3 className="mb-2 text-lg font-medium">Your bag is empty</h3>
							<p className="mb-6 text-sm text-muted-foreground">
								Looks like you haven&apos;t added anything to your bag yet.
							</p>
							<Link
								href={`/${channel}/products`}
								onClick={closeCart}
								className="hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors"
							>
								Start Shopping
							</Link>
						</div>
					) : (
						<ul className="divide-y divide-border">
							{lines.map((line) => {
								const product = line.product;
								const imageUrl = product.media?.[0]?.url;

								return (
									<li key={line.id} className="px-6 py-4">
										<div className="flex gap-4">
											<Link
												href={`/${channel}/products/${product.slug}`}
												onClick={closeCart}
												className="group relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
											>
												{imageUrl && (
													<Image
														src={imageUrl}
														alt={product.name}
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-105"
													/>
												)}
											</Link>

											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-2">
													<div>
														<Link
															href={`/${channel}/products/${product.slug}`}
															onClick={closeCart}
															className="line-clamp-1 text-sm font-medium hover:underline"
														>
															{product.name}
														</Link>
													</div>
													<Button
														variant="ghost"
														size="icon"
														className="-mr-2 -mt-1 h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
														onClick={() => handleRemove(line.merchandiseId)}
														disabled={isPending}
													>
														<Trash2 className="h-4 w-4" />
														<span className="sr-only">Remove {product.name}</span>
													</Button>
												</div>

												<div className="mt-3 flex items-center justify-between">
													<div className="flex items-center rounded-lg border border-border">
														<button
															type="button"
															onClick={() => handleUpdateQuantity(line.merchandiseId, line.quantity - 1)}
															disabled={line.quantity <= 1 || isPending}
															className="p-2 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
														>
															<Minus className="h-3 w-3" />
															<span className="sr-only">Decrease quantity</span>
														</button>
														<span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
														<button
															type="button"
															onClick={() => handleUpdateQuantity(line.merchandiseId, line.quantity + 1)}
															disabled={isPending}
															className="p-2 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
														>
															<Plus className="h-3 w-3" />
															<span className="sr-only">Increase quantity</span>
														</button>
													</div>

													<div className="text-right">
														<span className="text-sm font-medium">
															{formatMoney(line.totalPrice, currency)}
														</span>
													</div>
												</div>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</div>

				{lines.length > 0 && (
					<div className="border-t border-border bg-background">
						<div className="space-y-2 px-6 py-4">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatMoney(totalPrice, currency)}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Shipping</span>
								<span>{totalPrice >= freeShippingThreshold ? "Free" : "Calculated at checkout"}</span>
							</div>
							<div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
								<span>Total</span>
								<span>{formatMoney(totalPrice, currency)}</span>
							</div>
						</div>

						<div className="space-y-3 px-6 pb-6">
							<Link
								href={`/${channel}/checkout`}
								onClick={closeCart}
								className="hover:bg-primary/90 group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-base font-medium text-primary-foreground transition-colors"
							>
								<span>Checkout</span>
								<ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
							</Link>
							<Link
								href={`/${channel}/products`}
								onClick={closeCart}
								className="inline-flex h-12 w-full items-center justify-center rounded-md border border-border bg-transparent text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								Continue Shopping
							</Link>
						</div>

						<div className="flex items-center justify-center gap-6 border-t border-border px-6 pb-4 pt-4 text-xs text-muted-foreground">
							<span className="flex items-center gap-1.5">
								<Truck className="h-4 w-4" />
								Free delivery over {formatMoney(freeShippingThreshold, currency)}
							</span>
							<span className="flex items-center gap-1.5">
								<RotateCcw className="h-4 w-4" />
								30-day returns
							</span>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
