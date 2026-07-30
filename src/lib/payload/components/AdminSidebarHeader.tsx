"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface StoreIdentityData {
	siteName?: string;
	tagline?: string;
	logo?: {
		url?: string;
	};
	logoInverted?: {
		url?: string;
	};
	favicon?: {
		url?: string;
	};
}

export const AdminSidebarHeader: React.FC = () => {
	const [storeData, setStoreData] = useState<StoreIdentityData>({
		siteName: "Tienda Online",
		tagline: "Panel de Administración",
	});
	const [logoUrl, setLogoUrl] = useState<string | null>(null);

	useEffect(() => {
		async function fetchIdentity() {
			try {
				const res = await fetch("/api/globals/store-identity", { cache: "no-store" });
				if (!res.ok) return;
				const doc = await res.json();
				const fetchedSiteName = doc?.siteName || "Tienda Online";
				const fetchedTagline = doc?.tagline || "Panel de Administración";
				const customUrl = doc?.logo?.url || doc?.logoInverted?.url || doc?.favicon?.url;

				setStoreData({
					siteName: fetchedSiteName,
					tagline: fetchedTagline,
				});

				if (customUrl) {
					setLogoUrl(customUrl);
				}
			} catch (e) {
				// Fallback silencioso a valores por defecto
			}
		}
		fetchIdentity();
	}, []);

	const storeInitial = (storeData.siteName && storeData.siteName.charAt(0).toUpperCase()) || "T";

	return (
		<div
			style={{
				padding: "4px 0 18px 0",
				marginBottom: "14px",
				borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
				display: "flex",
				flexDirection: "column",
				gap: "14px",
			}}
		>
			{/* 1. Logotipo de la Tienda (Si el usuario cargó una imagen de logo) */}
			{logoUrl && (
				<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "0 2px" }}>
					<img
						src={logoUrl}
						alt="Logotipo Tienda"
						style={{
							maxHeight: "38px",
							width: "auto",
							maxWidth: "180px",
							objectFit: "contain",
							display: "block",
						}}
					/>
				</div>
			)}

			{/* 2. Tarjeta de Identidad de Tienda (Estilo Foto 3 sin gradientes: Slate profesional) */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					padding: "10px 12px",
					backgroundColor: "rgba(255, 255, 255, 0.05)",
					border: "1px solid rgba(255, 255, 255, 0.1)",
					borderRadius: "12px",
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
					overflow: "hidden",
				}}
			>
				{/* Badge/Insignia con inicial */}
				<div
					style={{
						width: "38px",
						height: "38px",
						borderRadius: "10px",
						backgroundColor: "#1e293b",
						border: "1px solid rgba(255, 255, 255, 0.15)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#ffffff",
						fontWeight: 700,
						fontSize: "17px",
						flexShrink: 0,
						boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
					}}
				>
					{storeInitial}
				</div>

				{/* Nombre de Tienda y Eslogan */}
				<div style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
					<span
						style={{
							color: "#ffffff",
							fontWeight: 600,
							fontSize: "15px",
							lineHeight: "1.25",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
						title={storeData.siteName}
					>
						{storeData.siteName}
					</span>
					<span
						style={{
							color: "#94a3b8",
							fontSize: "12px",
							lineHeight: "1.3",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
						title={storeData.tagline}
					>
						{storeData.tagline}
					</span>
				</div>
			</div>

			{/* 3. Botón "Ir al Dashboard Principal" */}
			<Link
				href="/admin"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: "10px",
					padding: "11px 14px",
					backgroundColor: "#2563eb",
					color: "#ffffff",
					borderRadius: "10px",
					textDecoration: "none",
					fontWeight: 600,
					fontSize: "14px",
					boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
					transition: "all 0.2s ease",
					cursor: "pointer",
					width: "100%",
				}}
			>
				<span>Ir al Dashboard Principal</span>
			</Link>
		</div>
	);
};
