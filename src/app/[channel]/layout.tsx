import { type ReactNode } from "react";
import { DefaultChannelSlug } from "@/app/config";
import "../globals.css";

/**
 * Generate static params for channel routes.
 * We only support one channel — the default one defined in env.
 * No Saleor API needed.
 */
export const generateStaticParams = async () => {
	const channel = DefaultChannelSlug || "default-channel";
	return [{ channel }];
};

export default function ChannelLayout({ children }: { children: ReactNode }) {
	return children;
}
