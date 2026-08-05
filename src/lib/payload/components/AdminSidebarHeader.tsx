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

	return (
		<div
			style={{
				padding: "4px 0 18px 0",
				marginBottom: "14px",
				borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
				display: "flex",
				flexDirection: "column",
				gap: "14px",
				boxSizing: "border-box",
				width: "100%",
				maxWidth: "100%",
			}}
		>
			{/* 1. Logotipo de la Tienda (Si el usuario cargó una imagen de logo) */}
			{logoUrl && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						padding: "4px 0",
					}}
				>
					<a 
						href="/?ref=admin_dashboard" 
						target="_blank" 
						rel="noopener noreferrer"
						style={{ textDecoration: "none", display: "inline-block" }}
						title="Visitar la tienda"
					>
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
					</a>
				</div>
			)}

			{/* 2. Tarjeta de Identidad de Tienda (Sin insignia de letra, solo Nombre y Eslogan) */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "10px 12px",
					backgroundColor: "rgba(255, 255, 255, 0.05)",
					border: "1px solid rgba(255, 255, 255, 0.1)",
					borderRadius: "12px",
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
					overflow: "hidden",
					boxSizing: "border-box",
					width: "100%",
					maxWidth: "100%",
				}}
			>
				<span
					style={{
						color: "#ffffff",
						fontWeight: 600,
						fontSize: "15px",
						lineHeight: "1.25",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "block",
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
						display: "block",
						marginTop: "2px",
					}}
					title={storeData.tagline}
				>
					{storeData.tagline}
				</span>
			</div>

			{/* 3. Botón "Ir al Dashboard Principal" adaptable para móvil y desktop */}
			<Link
				href="/admin"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "10px 10px",
					backgroundColor: "#2563eb",
					color: "#ffffff",
					borderRadius: "10px",
					textDecoration: "none",
					fontWeight: 600,
					fontSize: "13.5px",
					lineHeight: "1.25",
					boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
					transition: "all 0.2s ease",
					cursor: "pointer",
					boxSizing: "border-box",
					width: "100%",
					maxWidth: "100%",
					whiteSpace: "normal",
					textAlign: "center",
				}}
			>
				<span>Ir al Dashboard Principal</span>
			</Link>
		</div>
	);
};
