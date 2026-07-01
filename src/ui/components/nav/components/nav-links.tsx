import { NavLink } from "./nav-link";
import { getCategories } from "@/lib/payload";

export const NavLinks = async ({ channel }: { channel: string }) => {
	const categories = await getCategories();

	return (
		<>
			<NavLink href="/products">All</NavLink>
			{categories.map((category) => (
				<NavLink key={category.id} href={`/categories/${category.slug}`}>
					{category.name}
				</NavLink>
			))}
		</>
	);
};
