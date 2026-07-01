import { Suspense } from "react";
import { type Metadata } from "next";
import { getCollectionProducts, getAllCategorySlugs } from "@/lib/payload";
import { ProductList } from "@/ui/components/product-list";

export async function generateStaticParams() {
	const slugs = await getAllCategorySlugs();
	return slugs.map((slug) => ({ slug }));
}

type PageProps = {
	params: Promise<{ slug: string; channel: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const params = await props.params;
	return { title: `Collection: ${params.slug}` };
}

export default function Page(props: PageProps) {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<CollectionContent params={props.params} />
		</Suspense>
	);
}

async function CollectionContent({ params: paramsPromise }: { params: PageProps["params"] }) {
	const params = await paramsPromise;
	const products = await getCollectionProducts(params.slug);

	if (!products || products.length === 0) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<h1 className="mb-6 text-2xl font-semibold capitalize">{params.slug.replace(/-/g, " ")}</h1>
				<p className="text-muted-foreground">No products found in this collection.</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="mb-6 text-2xl font-semibold capitalize">{params.slug.replace(/-/g, " ")}</h1>
			<ProductList products={products} />
		</div>
	);
}

function PageSkeleton() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-6 h-8 w-48 animate-pulse rounded bg-secondary" />
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="mb-4 aspect-[3/4] rounded-xl bg-secondary" />
						<div className="h-4 w-3/4 rounded bg-secondary" />
					</div>
				))}
			</div>
		</div>
	);
}
