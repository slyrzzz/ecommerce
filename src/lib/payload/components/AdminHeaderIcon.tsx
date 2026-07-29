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
				const customUrl = doc?.logo?.url || doc?.logoInverted?.url || doc?.favicon?.url;
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
					alt="Logotipo Tienda"
					style={{
						height: "32px",
						width: "auto",
						maxWidth: "160px",
						objectFit: "contain",
						display: "block",
					}}
				/>
			) : (
				<svg
					width="26"
					height="26"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{ color: "#3b82f6", shrink: 0 }}
				>
					<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
					<path d="M3 6h18" />
					<path d="M16 10a4 4 0 0 1-8 0" />
				</svg>
			)}
			<a
				href="/panel-secreto"
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
				<span>🏠</span>
				<span>Ir al Dashboard Principal</span>
			</a>
		</div>
	);
};

