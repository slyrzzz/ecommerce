import { cookies } from "next/headers";
import { UserIcon } from "lucide-react";
import { UserMenu } from "./user-menu";
import { getCurrentUser } from "@/lib/payload/auth";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

export async function UserMenuContainer() {
	// During static generation, cookies() throws - skip user fetch entirely
	let hasCookies = false;
	try {
		const cookieStore = await cookies();
		hasCookies = Boolean(cookieStore.get("payload-token")?.value);
	} catch {
		// Static generation - no cookies available
	}

	// Only fetch user if we have cookies (runtime request with potential session)
	let user = null;
	if (hasCookies) {
		const currentUser = await getCurrentUser();
		if (currentUser) {
			user = {
				id: currentUser.id,
				email: currentUser.email,
				firstName: currentUser.firstName || "",
				lastName: currentUser.lastName || "",
				avatar: null,
			} as any;
		}
	}

	if (user) {
		return <UserMenu user={user} />;
	} else {
		return (
			<LinkWithChannel
				href="/login"
				className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
			>
				<UserIcon className="h-5 w-5" aria-hidden="true" />
				<span className="sr-only">Log in</span>
			</LinkWithChannel>
		);
	}
}
