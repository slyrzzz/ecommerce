import { getPageBySlug } from "@/lib/payload";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

type Props = {
	params: Promise<{ channel: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const page = await getPageBySlug(slug);
	if (!page) {
		return { title: "Página no encontrada" };
	}
	return {
		title: page.title,
	};
}

export default async function Page({ params }: Props) {
	const { slug } = await params;
	const page = await getPageBySlug(slug);

	if (!page) {
		notFound();
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div className="border-b border-border pb-6 mb-8">
				<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					{page.title}
				</h1>
			</div>
			<div
				className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-foreground prose-a:underline hover:prose-a:opacity-80"
				dangerouslySetInnerHTML={{ __html: page.htmlContent }}
			/>
		</div>
	);
}
