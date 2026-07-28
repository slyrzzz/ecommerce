"use client";

import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/ui/components/cart/cart-context";
import { deleteCartLine, updateCartLineQuantity } from "@/ui/components/cart/actions";

interface AddToCartProps {
	price: string;
	compareAtPrice?: string | null;
	discountPercent?: number | null;
	disabled?: boolean;
	disabledReason?: "no-selection" | "out-of-stock";
	cartId?: string;
	merchandiseId?: string;
	initialQuantityInCart?: number;
}

function AddToCartButton({
	disabled,
	disabledReason,
	onAdd,
}: {
	disabled?: boolean;
	disabledReason?: "no-selection" | "out-of-stock";
	onAdd?: () => void;
}) {
	const { pending } = useFormStatus();

	const getButtonText = () => {
		if (pending) return "Adding...";
		if (!disabled) return "Add to bag";
		if (disabledReason === "out-of-stock") return "Out of stock";
		return "Select options";
	};

	return (
		<Button
			type="submit"
			size="lg"
			disabled={disabled || pending}
			onClick={() => {
				if (onAdd && !disabled && !pending) {
					setTimeout(() => {
						onAdd();
					}, 300);
				}
			}}
			className={cn("h-14 w-full text-base font-medium transition-all duration-200", pending && "opacity-80")}
		>
			<ShoppingBag className={cn("mr-2 h-5 w-5 transition-transform", pending && "scale-90")} />
			{getButtonText()}
		</Button>
	);
}

function QuantitySelector({
	cartId,
	merchandiseId,
	quantity,
}: {
	cartId: string;
	merchandiseId: string;
	quantity: number;
}) {
	const [isPending, startTransition] = useTransition();

	const handleUpdate = (newQty: number) => {
		startTransition(() => {
			if (newQty < 1) {
				deleteCartLine(cartId, merchandiseId);
			} else {
				updateCartLineQuantity(cartId, merchandiseId, newQty);
			}
		});
	};

	return (
		<div className="flex h-14 w-full items-center justify-between rounded-lg border-2 border-primary bg-secondary/40 px-2 transition-all duration-200">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				disabled={isPending}
				onClick={() => handleUpdate(quantity - 1)}
				className="h-10 w-10 rounded-md text-foreground hover:bg-secondary"
			>
				<Minus className="h-4 w-4" />
				<span className="sr-only">Decrease quantity</span>
			</Button>

			<div className="flex items-center gap-2 text-base font-medium">
				<ShoppingBag className="h-4 w-4 text-primary" />
				<span>{isPending ? "Updating..." : `${quantity} in bag`}</span>
			</div>

			<Button
				type="button"
				variant="ghost"
				size="icon"
				disabled={isPending}
				onClick={() => handleUpdate(quantity + 1)}
				className="h-10 w-10 rounded-md text-foreground hover:bg-secondary"
			>
				<Plus className="h-4 w-4" />
				<span className="sr-only">Increase quantity</span>
			</Button>
		</div>
	);
}

export function AddToCart({
	price,
	compareAtPrice,
	discountPercent,
	disabled = false,
	disabledReason,
	cartId,
	merchandiseId,
	initialQuantityInCart = 0,
}: AddToCartProps) {
	const { openCart } = useCart();

	return (
		<div className="space-y-4">
			{/* Price Display */}
			<div className="flex items-baseline gap-3">
				<span className="text-2xl font-semibold tracking-tight">{price}</span>
				{compareAtPrice && (
					<>
						<span className="text-lg text-muted-foreground line-through">{compareAtPrice}</span>
						{discountPercent && (
							<span className="text-sm font-medium text-destructive">-{discountPercent}%</span>
						)}
					</>
				)}
			</div>

			{/* Add to Cart Button or Quantity Selector */}
			{!disabled && initialQuantityInCart > 0 && cartId && merchandiseId ? (
				<QuantitySelector cartId={cartId} merchandiseId={merchandiseId} quantity={initialQuantityInCart} />
			) : (
				<AddToCartButton
					disabled={disabled}
					disabledReason={disabledReason}
					onAdd={() => {
						openCart();
					}}
				/>
			)}

			{/* Trust Signals */}
			<div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
				<span className="flex items-center gap-1.5">
					<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
					Secure checkout
				</span>
				<span className="flex items-center gap-1.5">
					<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						<path d="M9 22V12h6v10" />
					</svg>
					Free delivery over €100
				</span>
			</div>
		</div>
	);
}
