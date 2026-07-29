export interface CheckoutCustomerData {
	firstName: string;
	lastName: string;
	phone: string;
	address: string;
	city: string;
}

export interface CheckoutCartData {
	totalPrice: number;
	currency: string;
	lines: {
		productName: string;
		quantity: number;
		price: number;
	}[];
}

export interface ICheckoutStrategy {
	execute(customer: CheckoutCustomerData, cart: CheckoutCartData): void;
}

export class WhatsAppCheckoutStrategy implements ICheckoutStrategy {
	private sellerPhone: string;
	private messagePrefix: string;

	constructor(sellerPhone: string, messagePrefix: string = "¡Hola! Quiero completar mi pedido") {
		this.sellerPhone = sellerPhone;
		this.messagePrefix = messagePrefix;
	}

	execute(customer: CheckoutCustomerData, cart: CheckoutCartData): void {
		const prefix =
			this.messagePrefix && this.messagePrefix.trim() !== ""
				? this.messagePrefix.trim()
				: "¡Hola! Quiero completar mi pedido";
		let message = `${prefix}\n\n*Nuevo Pedido*\n\n`;
		
		message += `*Cliente:* ${customer.firstName} ${customer.lastName}\n`;
		message += `*Teléfono:* ${customer.phone}\n`;
		message += `*Dirección:* ${customer.address}, ${customer.city}\n\n`;

		message += `*Productos:*\n`;
		cart.lines.forEach((line) => {
			message += `- ${line.quantity}x ${line.productName} ($${line.price.toFixed(2)} c/u)\n`;
		});

		message += `\n*Total:* $${cart.totalPrice.toFixed(2)} ${cart.currency}\n`;

		const encodedMessage = encodeURIComponent(message);
		const whatsappUrl = `https://wa.me/${this.sellerPhone}?text=${encodedMessage}`;

		// Open WhatsApp in a new window/tab so the storefront session remains active
		window.open(whatsappUrl, "_blank", "noopener,noreferrer");
	}
}
