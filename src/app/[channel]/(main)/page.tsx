import { Suspense } from "react";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { ProductList } from "@/ui/components/product-list";
import { getProducts } from "@/lib/payload";

export const metadata = {
	title: "ACME Storefront, powered by Saleor & Next.js",
	description:
		"Storefront Next.js Example for building performant e-commerce experiences with Saleor - the composable, headless commerce platform for global brands.",
};

/**
 * Cached function to fetch featured products.
 * Returns [] on failure so the page always renders (never null).
 * Note: the empty array IS cached for the cacheLife duration —
 * on-demand revalidation via cacheTag is the intended recovery path.
 */
async function getFeaturedProducts(channel: string) {
	console.log("=== RUNNING getFeaturedProducts ===");
	try {
		const products = await getProducts({});
		console.log("=== RETRIEVED PRODUCTS ===", products.length);
		return products.slice(0, 12);
	} catch (error) {
		console.error(`[Homepage] Failed to fetch featured products:`, error);
		return [];
	}
}

/**
 * Page shell — renders immediately with a static section wrapper.
 * The async product grid streams inside its own Suspense boundary
 * so it doesn't rely on the layout's main Suspense for reconciliation.
 */
export default function Page(props: { params: Promise<{ channel: string }> }) {
	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h2 className="sr-only">Product list</h2>
			<Suspense
				fallback={
					<ul
						role="list"
						data-testid="ProductList"
						className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
					>
						{Array.from({ length: 12 }).map((_, i) => (
							<li key={i} className="animate-pulse">
								<div className="aspect-square overflow-hidden bg-secondary" />
								<div className="mt-2 flex justify-between">
									<div>
										<div className="mt-1 h-4 w-32 rounded bg-secondary" />
										<div className="mt-1 h-4 w-20 rounded bg-secondary" />
									</div>
									<div className="mt-1 h-4 w-16 rounded bg-secondary" />
								</div>
							</li>
						))}
					</ul>
				}
			>
				<FeaturedProducts params={props.params} />
			</Suspense>
		</section>
	);
}

async function FeaturedProducts({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;
	const products = await getFeaturedProducts(channel);

	return <ProductList products={products} />;
}
