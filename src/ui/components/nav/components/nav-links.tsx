import { NavLink } from "./nav-link";
import { getCategories } from "@/lib/payload";
import { getServerDictionary } from "@/lib/i18n/server";

export const NavLinks = async ({ _channel: __channel }: { _channel: string }) => {
	const [categories, dict] = await Promise.all([
		getCategories(),
		getServerDictionary(),
	]);

	return (
		<>
			<NavLink href="/products">{dict.common.all || "Todos"}</NavLink>
			{categories.map((category) => (
				<NavLink key={category.id} href={`/categories/${category.slug}`}>
					{category.name}
				</NavLink>
			))}
		</>
	);
};

