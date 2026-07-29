"use client";

import React, { useEffect, useState } from "react";

export const AdminHeaderIcon: React.FC = () => {
	const [iconUrl, setIconUrl] = useState<string | null>(null);

	useEffect(() => {
		async function fetchIdentity() {
			try {
				const res = await fetch("/api/globals/store-identity", { cache: "no-store" });
				if (!res.ok) return;
				const doc = await res.json();
				const customUrl = doc?.favicon?.url || doc?.logo?.url;
				if (customUrl) {
					setIconUrl(customUrl);
				}
			} catch (e) {
				// Ignorar errores y usar icono por defecto
			}
		}
		fetchIdentity();
	}, []);

	if (iconUrl) {
		return (
			<img
				src={iconUrl}
				alt="Store Icon"
				style={{
					height: "26px",
					width: "auto",
					maxWidth: "36px",
					objectFit: "contain",
					display: "block",
				}}
			/>
		);
	}

	// Icono de tienda e-commerce por defecto
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			style={{ color: "#3b82f6" }}
		>
			<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
			<path d="M3 6h18" />
			<path d="M16 10a4 4 0 0 1-8 0" />
		</svg>
	);
};
