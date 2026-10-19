type Props = {
	user: {
		email: string;
		firstName?: string | null;
		lastName?: string | null;
	};
};

export const UserInfo = ({ user }: Props) => {
	const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null;

	return (
		<p className="truncate px-5 py-2 text-xs text-muted-foreground">
			{userName && <span className="mb-0.5 block truncate font-bold text-foreground">{userName}</span>}
			{user.email}
		</p>
	);
};
