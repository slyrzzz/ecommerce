export enum ProductOrderField {
  Collection = "COLLECTION",
  Name = "NAME",
  Price = "PRICE",
}

export enum OrderDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export type ProductListItemFragment = {
  id: string;
  slug: string;
  name: string;
  category?: { name: string; slug: string } | null;
  thumbnail?: { url: string; alt?: string | null } | null;
  pricing?: {
    priceRange?: {
      start?: { gross: { amount: number; currency: string } } | null;
      stop?: { gross: { amount: number; currency: string } } | null;
    } | null;
  } | null;
};

export type ProductDetailsQuery = {
  product?: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    category?: { name: string; slug: string } | null;
    thumbnail?: { url: string; alt?: string | null } | null;
    media?: Array<{ url: string; alt?: string | null; type: string }> | null;
    pricing?: {
      priceRange?: {
        start?: { gross: { amount: number; currency: string } } | null;
        stop?: { gross: { amount: number; currency: string } } | null;
      } | null;
    } | null;
    attributes?: Array<{
      attribute: { slug?: string | null; name?: string | null };
      values: Array<{ name?: string | null }>;
    }> | null;
    variants?: Array<{
      id: string;
      name?: string | null;
      quantityAvailable?: number;
      media?: Array<{ url: string; alt?: string | null; type: string }> | null;
      pricing?: {
        price?: { gross: { amount: number; currency: string } } | null;
      } | null;
      attributes?: Array<{
        attribute: { slug?: string | null; name?: string | null };
        values: Array<{ name?: string | null }>;
      }> | null;
    }> | null;
  } | null;
};

export type TypedDocumentString<TResult, TVariables> = string;

// Dummy exports to prevent errors if they import documents
export const ProductListByCollectionDocument = {};
export const ProductDetailsDocument = {};
export const CategoryProductsDocument = {};
export const SearchProductsDocument = {};
export const ChannelsListDocument = {};
export const CheckoutFindDocument = {};
export const CheckoutCreateDocument = {};
export const CheckoutDeleteLinesDocument = {};
export const CheckoutLinesUpdateDocument = {};
export const MenuGetBySlugDocument = {};
export const CurrentUserDocument = {};
