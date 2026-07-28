"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/ui/components/ui/button";

interface OrderLine {
	productName: string;
	quantity: number;
	price: number;
}

interface CustomerInfo {
	firstName?: string;
	lastName?: string;
	phone?: string;
	address?: string;
	city?: string;
}

interface ResumeOrderProps {
	orderNumber: string;
	lines: OrderLine[];
	totalPrice: number;
	customer?: CustomerInfo;
	whatsappNumber?: string;
}

export function ResumeOrderWhatsAppButton({
	orderNumber,
	lines,
	totalPrice,
	customer,
	whatsappNumber = "584120000000",
}: ResumeOrderProps) {
	const handleResumeWhatsApp = () => {
		const itemsText = lines
			.map((line) => `- ${line.quantity}x ${line.productName} ($${line.price.toFixed(2)})`)
			.join("\n");

		const message = `*¡Hola! Quiero completar mi pedido guardado #${orderNumber}*\n\n*Productos:*\n${itemsText}\n\n*Total:* $${totalPrice.toFixed(2)}\n\n*Datos de Envío:*\nNombre: ${customer?.firstName || ""} ${customer?.lastName || ""}\nTeléfono: ${customer?.phone || ""}\nDirección: ${customer?.address || ""}, ${customer?.city || ""}`;

		const encodedMessage = encodeURIComponent(message);
		const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

		window.open(whatsappUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<Button onClick={handleResumeWhatsApp} className="gap-2 font-semibold">
			<MessageSquare className="h-4 w-4" />
			Completar orden por WhatsApp
		</Button>
	);
}
