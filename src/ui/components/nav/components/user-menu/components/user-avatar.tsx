import Image from "next/image";
export type BaseUser = {
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	avatar?: { url: string } | null;
};

type Props = {
	user: BaseUser;
};

export const UserAvatar = ({ user }: Props) => {
	const label =
		user.firstName && user.lastName
			? `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`
			: user.email.slice(0, 2);

	if (user.avatar) {
		return (
			<Image
				className="h-9 w-9 rounded-full border border-border object-cover"
				aria-hidden="true"
				src={user.avatar.url}
				width={36}
				height={36}
				alt=""
			/>
		);
	}

	return (
		<span
			className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-center text-xs font-bold uppercase text-foreground shadow-sm transition-colors"
			aria-hidden="true"
		>
			{label}
		</span>
	);
};
