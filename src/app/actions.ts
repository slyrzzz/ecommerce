"use server";



export async function logout() {
	"use server";
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();
	cookieStore.delete("payload-token");
}


