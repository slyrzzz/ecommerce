"use client";

import React from "react";
import Link from "next/link";

export const AdminDashboardButton: React.FC = () => {
	return (
		<div
			style={{
				padding: "4px 0 16px 0",
				marginBottom: "12px",
				borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
			}}
		>
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
					borderRadius: "8px",
					textDecoration: "none",
					fontWeight: 600,
					fontSize: "14px",
					boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
					transition: "all 0.2s ease",
					cursor: "pointer",
				}}
			>
				<span>Ir al Dashboard Principal</span>
			</Link>
		</div>
	);
};
