"use client";

import { useState } from "react";
import { CheckoutCustomerData, CheckoutCartData, WhatsAppCheckoutStrategy } from "@/checkout/strategy";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/ui/components/ui/button";

export function CheckoutForm({ cartData }: { cartData: CheckoutCartData }) {
	const [customer, setCustomer] = useState<CheckoutCustomerData>({
		firstName: "",
		lastName: "",
		phone: "",
		address: "",
		city: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// We instantiate the strategy with the seller's phone number
		// Replace with your actual WhatsApp business number
		const strategy = new WhatsAppCheckoutStrategy("1234567890"); 
		strategy.execute(customer, cartData);
	};

	if (cartData.lines.length === 0) {
		return (
			<div className="text-center py-12">
				<h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
				<p className="text-muted-foreground">Add some products to proceed to checkout.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<div>
				<h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">First Name</label>
							<input
								required
								type="text"
								className="w-full rounded-md border border-border bg-background px-3 py-2"
								value={customer.firstName}
								onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Last Name</label>
							<input
								required
								type="text"
								className="w-full rounded-md border border-border bg-background px-3 py-2"
								value={customer.lastName}
								onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
							/>
						</div>
					</div>
					
					<div className="space-y-2">
						<label className="text-sm font-medium">Phone Number (WhatsApp)</label>
						<input
							required
							type="tel"
							className="w-full rounded-md border border-border bg-background px-3 py-2"
							value={customer.phone}
							onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Address</label>
						<input
							required
							type="text"
							className="w-full rounded-md border border-border bg-background px-3 py-2"
							value={customer.address}
							onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">City</label>
						<input
							required
							type="text"
							className="w-full rounded-md border border-border bg-background px-3 py-2"
							value={customer.city}
							onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
						/>
					</div>

					<Button type="submit" className="w-full mt-8 bg-[#25D366] hover:bg-[#128C7E] text-white">
						Complete Order via WhatsApp
					</Button>
				</form>
			</div>

			<div>
				<div className="bg-secondary/50 rounded-xl p-6 sticky top-24">
					<h3 className="text-xl font-semibold mb-6">Order Summary</h3>
					<ul className="space-y-4 mb-6">
						{cartData.lines.map((line, index) => (
							<li key={index} className="flex justify-between items-center text-sm">
								<span className="flex items-center gap-2">
									<span className="bg-background w-6 h-6 rounded flex items-center justify-center font-medium border border-border text-xs">
										{line.quantity}
									</span>
									<span className="font-medium text-muted-foreground">{line.productName}</span>
								</span>
								<span>{formatMoney(line.price * line.quantity, cartData.currency)}</span>
							</li>
						))}
					</ul>
					
					<div className="border-t border-border pt-4">
						<div className="flex justify-between items-center text-lg font-bold">
							<span>Total</span>
							<span>{formatMoney(cartData.totalPrice, cartData.currency)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
