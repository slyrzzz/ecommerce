import { cookies } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export interface PayloadUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export async function getCurrentUser(): Promise<PayloadUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("payload-token")?.value;
    if (!token) return null;

    const payload = await getPayload({ config: configPromise });
    const result = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`,
      }),
    });

    if (!result || !result.user) return null;
    return result.user as unknown as PayloadUser;
  } catch (err) {
    return null;
  }
}
