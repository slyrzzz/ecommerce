import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import configPromise from "@payload-config";

import { formatMoney, formatMoneyRange } from "@/lib/utils";
import { getDiscountInfo } from "@/lib/pricing";
import { type ProductDetailsQuery } from "@/gql/graphql";

import { AddToCart } from "./add-to-cart";
import { VariantSelectionSection } from "./variant-selection";
import { StickyBar } from "./sticky-bar";
import { Badge } from "@/ui/components/ui/badge";

type Product = NonNullable<ProductDetailsQuery["product"]>;

interface VariantSectionDynamicProps {
	product: Product;
	channel: string;
	searchParams: Promise<{ variant?: string }>;
}

export async function VariantSectionDynamic({ product, channel, searchParams }: VariantSectionDynamicProps) {
	const { variant: variantParam } = await searchParams;
	const variants = product.variants || [];

	const selectedVariantID = variantParam || (variants.length === 1 ? variants[0].id : undefined);
	const selectedVariant = variants.find(({ id }) => id === selectedVariantID);

	const isAvailable = variants.some((variant) => variant.quantityAvailable);
	const isAddToCartDisabled = !selectedVariantID || !selectedVariant?.quantityAvailable;
	const disabledReason = !selectedVariantID
		? ("no-selection" as const)
		: !selectedVariant?.quantityAvailable
			? ("out-of-stock" as const)
			: undefined;

	const price = selectedVariant?.pricing?.price?.gross
		? selectedVariant.pricing.price.gross.amount === 0
			? "FREE"
			: formatMoney(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)
		: formatMoneyRange({
				start: product.pricing?.priceRange?.start?.gross,
				stop: product.pricing?.priceRange?.stop?.gross,
			}) || "";

	const currentPrice = selectedVariant?.pricing?.price?.gross?.amount;
	const undiscountedPrice = (selectedVariant?.pricing as any)?.priceUndiscounted?.gross?.amount;
	const { isOnSale, discountPercent } = getDiscountInfo(currentPrice, undiscountedPrice);

	const compareAtPrice =
		isOnSale && (selectedVariant?.pricing as any)?.priceUndiscounted?.gross
			? formatMoney(
					(selectedVariant!.pricing as any).priceUndiscounted.gross.amount,
					(selectedVariant!.pricing as any).priceUndiscounted.gross.currency,
				)
			: null;

	// ── Payload Cart Server Action ────────────────────────────────────────────
	async function addToCartAction(data: { selectedVariantID: string; product: any }) {
		"use server";
		console.time("addToCartAction_total");

		try {
			const cookieStore = await cookies();
			let cartId = cookieStore.get("cartId")?.value;

			console.time("getPayload");
			const payload = await getPayload({ config: configPromise });
			console.timeEnd("getPayload");

			let cart = null;

			if (cartId) {
				console.time("findByID");
				try {
					cart = await payload.findByID({ collection: "carts", id: cartId });
				} catch {
					cart = null;
				}
				console.timeEnd("findByID");
			}

			console.time("updateCreateCart");
			if (cart) {
				const existingLineIndex = cart.lines?.findIndex(
					(line: any) => line.merchandiseId === data.product.id
				);

				let updatedLines = [...(cart.lines || [])];
				if (existingLineIndex !== undefined && existingLineIndex >= 0) {
					updatedLines[existingLineIndex].quantity += 1;
				} else {
					updatedLines.push({ merchandiseId: data.product.id, quantity: 1 });
				}

				await payload.update({
					collection: "carts",
					id: cartId as string,
					data: { lines: updatedLines },
				});
			} else {
				const newCart = await payload.create({
					collection: "carts",
					data: { lines: [{ merchandiseId: data.product.id, quantity: 1 }] },
				});
				cartId = newCart.id;
				cookieStore.set("cartId", newCart.id.toString());
			}
			console.timeEnd("updateCreateCart");
		} catch (error) {
			console.error("Failed to add to cart:", error);
		}

		console.time("revalidatePath");
		revalidatePath("/cart");
		revalidatePath("/");
		console.timeEnd("revalidatePath");
		console.timeEnd("addToCartAction_total");
	}

	const boundAddToCart = addToCartAction.bind(null, { selectedVariantID: selectedVariantID!, product });

	return (
		<>
			<div className="order-1 flex items-center gap-2">
				{product.category && <span className="text-sm text-muted-foreground">{product.category.name}</span>}
				{isOnSale && (
					<Badge variant="destructive" className="text-xs">
						Sale
					</Badge>
				)}
				{!isAvailable && (
					<Badge variant="secondary" className="text-xs">
						Out of stock
					</Badge>
				)}
			</div>

			<form action={boundAddToCart} className="order-3 mt-4 space-y-6">
				<VariantSelectionSection
					variants={variants}
					selectedVariantId={selectedVariantID}
					productSlug={product.slug}
					channel={channel}
				/>

				<AddToCart
					price={price}
					compareAtPrice={compareAtPrice}
					discountPercent={discountPercent}
					disabled={isAddToCartDisabled}
					disabledReason={disabledReason}
				/>

				<StickyBar productName={product.name} price={price} show={!isAddToCartDisabled} />
			</form>
		</>
	);
}

export function VariantSectionSkeleton() {
	return (
		<>
			<div className="order-1 h-4 w-20 animate-pulse animate-skeleton-delayed rounded bg-muted opacity-0" />
			<div className="order-3 mt-4 animate-pulse animate-skeleton-delayed space-y-6 opacity-0">
				<div className="space-y-4">
					<div className="h-4 w-16 rounded bg-muted" />
					<div className="flex gap-2">
						<div className="h-10 w-16 rounded bg-muted" />
						<div className="h-10 w-16 rounded bg-muted" />
						<div className="h-10 w-16 rounded bg-muted" />
					</div>
				</div>
				<div className="h-8 w-24 rounded bg-muted" />
				<div className="h-12 w-full rounded bg-muted" />
			</div>
		</>
	);
}
