import "server-only";

/**
 * Auth stub — Saleor auth SDK has been removed.
 * This project uses Payload CMS for auth. No Saleor API URL is needed.
 * All functions return null / empty values so existing imports don't break.
 */

export const getServerAuthClient = async () => {
	return {
		signIn: async () => ({ data: null, errors: [] }),
		signOut: async () => {},
		getAccessToken: async () => null,
	};
};
