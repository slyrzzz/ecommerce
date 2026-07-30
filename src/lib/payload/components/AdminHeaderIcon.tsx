"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const AdminHeaderIcon: React.FC = () => {
	const [iconUrl, setIconUrl] = useState<string | null>(null);
	const pathname = usePathname();

	const isAuthPage =
		pathname?.endsWith("/login") ||
		pathname?.includes("/login") ||
		pathname?.includes("/logout") ||
		pathname?.includes("/create-first-user") ||
		pathname?.includes("/forgot");

	useEffect(() => {
		async function fetchIdentity() {
			try {
				const res = await fetch("/api/globals/store-identity", { cache: "no-store" });
				if (!res.ok) return;
				const doc = await res.json();
				// Mostrar en el breadcrumb ÚNICAMENTE el favicon. Si no hay favicon, mostrar por defecto el icono de Payload.
				const customUrl = doc?.favicon?.url;
				if (customUrl) {
					setIconUrl(customUrl);
				}
			} catch (e) {
				// Ignorar errores y usar icono por defecto
			}
		}
		fetchIdentity();
	}, []);

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
			{iconUrl ? (
				<img
					src={iconUrl}
					alt="Favicon Tienda"
					style={{
						height: "26px",
						width: "26px",
						objectFit: "contain",
						display: "block",
						borderRadius: "4px",
					}}
				/>
			) : (
				<svg
					width="26"
					height="26"
					viewBox="0 0 25 25"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{ shrink: 0, display: "block" }}
				>
					<path
						d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0ZM17.1875 18.75H13.4375L7.8125 7.5H11.5625L17.1875 18.75Z"
						fill="#ffffff"
						fillOpacity="0.85"
					/>
				</svg>
			)}
			{!isAuthPage && (
				<a
					href="/admin"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
						padding: "6px 12px",
						backgroundColor: "#2563eb",
						color: "#ffffff",
						borderRadius: "6px",
						fontSize: "13px",
						fontWeight: 600,
						textDecoration: "none",
						boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
						whiteSpace: "nowrap",
					}}
					title="Ir a las Colecciones del Dashboard Principal"
				>
					<span>Ir al Dashboard Principal</span>
				</a>
			)}
		</div>
	);
};


