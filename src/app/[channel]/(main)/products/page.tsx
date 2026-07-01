import { Suspense } from "react";
import { getProducts } from "@/lib/payload";
import { ProductList } from "@/ui/components/product-list";

export const metadata = {
	title: "Products",
	description: "Browse all products in our store.",
};

type PageProps = {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{ q?: string; sort?: string }>;
};

export default async function Page(props: PageProps) {
	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="mb-6 text-2xl font-semibold">All Products</h1>
			<Suspense fallback={<ProductsGridSkeleton />}>
				<ProductsContent searchParams={props.searchParams} />
			</Suspense>
		</div>
	);
}

async function ProductsContent({ searchParams }: { searchParams: PageProps["searchParams"] }) {
	const sp = await searchParams;
	const products = await getProducts({ query: sp.q });

	if (!products || products.length === 0) {
		return <p className="text-muted-foreground">No products found.</p>;
	}

	return <ProductList products={products} />;
}

function ProductsGridSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="animate-pulse">
					<div className="mb-4 aspect-[3/4] rounded-xl bg-secondary" />
					<div className="h-4 w-3/4 rounded bg-secondary" />
				</div>
			))}
		</div>
	);
}
