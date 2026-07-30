import { LinkWithChannel } from "../atoms/link-with-channel";
import { ProductImageWrapper } from "@/ui/atoms/product-image-wrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";
import { hasDiscountInPriceRange } from "@/lib/pricing";
import { Badge } from "@/ui/components/ui/badge";

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	const isSale = hasDiscountInPriceRange(
		product.pricing?.priceRange,
		product.pricing?.priceRangeUndiscounted,
	);

	return (
		<li data-testid="ProductElement">
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id} prefetch={false}>
				<div>
					<div className="relative">
						{product?.thumbnail?.url && (
							<ProductImageWrapper
								loading={loading}
								src={product.thumbnail.url}
								alt={product.thumbnail.alt ?? ""}
								width={512}
								height={512}
								sizes={"512px"}
								priority={priority}
							/>
						)}
						{isSale && (
							<Badge variant="destructive" className="absolute left-3 top-3 z-10 text-xs shadow-md">
								Oferta
							</Badge>
						)}
					</div>
					<div className="mt-2 flex justify-between">
						<div>
							<h3 className="mt-1 text-sm font-semibold text-neutral-900">{product.name}</h3>
							<p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500" data-testid="ProductElement_Category">
								{(product as any).brand && (product as any).showBrandInCard && (
									<>
										<span className="font-medium text-neutral-700">{(product as any).brand}</span>
										{product.category?.name && <span className="text-neutral-300">•</span>}
									</>
								)}
								{product.category?.name && <span>{product.category?.name}</span>}
							</p>
						</div>
						<div className="mt-1 flex flex-col items-end" data-testid="ProductElement_PriceRange">
							<span className={`text-sm font-semibold ${isSale ? "text-destructive" : "text-neutral-900"}`}>
								{formatMoneyRange({
									start: product?.pricing?.priceRange?.start?.gross,
									stop: product?.pricing?.priceRange?.stop?.gross,
								})}
							</span>
							{isSale && product?.pricing?.priceRangeUndiscounted && (
								<span className="text-xs text-neutral-400 line-through">
									{formatMoneyRange({
										start: product.pricing.priceRangeUndiscounted.start?.gross,
										stop: product.pricing.priceRangeUndiscounted.stop?.gross,
									})}
								</span>
							)}
						</div>
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}
