/**
 * Payload CMS Search Implementation
 *
 * Uses local MongoDB Payload CMS products and respects published status.
 */

import { getProducts } from "@/lib/payload";
import type { SearchProduct, SearchResult, SearchPagination } from "./types";
import { localeConfig } from "@/config/locale";

interface SearchOptions {
	query: string;
	channel: string;
	limit?: number;
	cursor?: string;
	direction?: "forward" | "backward";
	sortBy?: "relevance" | "price-asc" | "price-desc" | "name" | "newest";
}

/**
 * Search products using local Payload CMS database.
 */
export async function searchProducts(options: SearchOptions): Promise<SearchResult> {
	const { query, limit = 20, sortBy = "relevance" } = options;

	try {
		const products = await getProducts({ query });

		let searchProducts: SearchProduct[] = products.map((node) => ({
			id: node.id,
			name: node.name,
			slug: node.slug,
			thumbnailUrl: node.thumbnail?.url,
			thumbnailAlt: node.thumbnail?.alt,
			price: node.pricing?.priceRange?.start?.gross.amount ?? 0,
			currency: node.pricing?.priceRange?.start?.gross.currency ?? localeConfig.fallbackCurrency,
			categoryName: node.category?.name,
		}));

		if (sortBy === "price-asc") {
			searchProducts.sort((a, b) => a.price - b.price);
		} else if (sortBy === "price-desc") {
			searchProducts.sort((a, b) => b.price - a.price);
		} else if (sortBy === "name") {
			searchProducts.sort((a, b) => a.name.localeCompare(b.name));
		}

		const pagination: SearchPagination = {
			totalCount: searchProducts.length,
			hasNextPage: false,
			hasPreviousPage: false,
		};

		return {
			products: searchProducts.slice(0, limit),
			pagination,
		};
	} catch (error) {
		console.error("[Search] Failed to search products in Payload:", error);
		return {
			products: [],
			pagination: { totalCount: 0 },
		};
	}
}

