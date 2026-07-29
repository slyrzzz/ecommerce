"use client";

import {
	Check,
	Layers,
	Ruler,
	Scale,
	ShieldCheck,
	Droplets,
	BatteryCharging,
	Cpu,
	Wifi,
	Bluetooth,
	Clock,
	Zap,
	Leaf,
	Package,
	Monitor,
	Volume2,
	Camera,
	HardDrive,
	Globe,
	Shield,
	Battery,
	Shirt,
	Wrench,
	Sparkles,
	Star,
} from "lucide-react";
import {
	Accordion,
	AccordionItemWithContext,
	AccordionTrigger,
	AccordionContent,
} from "@/ui/components/ui/accordion";
import { Badge } from "@/ui/components/ui/badge";
import { type ReactNode } from "react";

interface Attribute {
	name: string;
	value: string | boolean | string[];
	icon?: string | null;
}

interface ProductAttributesProps {
	/**
	 * Description as an array of HTML strings (from EditorJS via edjsHTML parser)
	 * Already sanitized with xss on the server
	 */
	descriptionHtml?: string[] | null;
	attributes?: Attribute[];
	careInstructions?: string | null;
}

function getSpecificationIcon(iconKey?: string | null): ReactNode {
	if (!iconKey || iconKey === "none") return null;
	const className = "h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-400";
	switch (iconKey.toLowerCase()) {
		case "check":
			return <Check className={className} />;
		case "material":
		case "layers":
			return <Layers className={className} />;
		case "dimensions":
		case "ruler":
			return <Ruler className={className} />;
		case "weight":
		case "scale":
			return <Scale className={className} />;
		case "shield":
			return <ShieldCheck className={className} />;
		case "water":
		case "droplets":
			return <Droplets className={className} />;
		case "battery":
			return <BatteryCharging className={className} />;
		case "cpu":
			return <Cpu className={className} />;
		case "wifi":
			return <Wifi className={className} />;
		case "bluetooth":
			return <Bluetooth className={className} />;
		case "clock":
			return <Clock className={className} />;
		case "zap":
			return <Zap className={className} />;
		case "eco":
		case "leaf":
			return <Leaf className={className} />;
		case "box":
			return <Package className={className} />;
		case "screen":
			return <Monitor className={className} />;
		case "sound":
			return <Volume2 className={className} />;
		case "camera":
			return <Camera className={className} />;
		case "storage":
			return <HardDrive className={className} />;
		case "global":
			return <Globe className={className} />;
		// Fallbacks for legacy saved specs
		case "star":
			return <Star className={className} />;
		case "wrench":
			return <Wrench className={className} />;
		case "shirt":
			return <Shirt className={className} />;
		case "sparkles":
			return <Sparkles className={className} />;
		default:
			return null;
	}
}

function formatValue(value: string | boolean | string[]): ReactNode {
	if (typeof value === "boolean") return value ? "Sí" : "No";
	if (Array.isArray(value)) {
		return (
			<div className="flex flex-wrap justify-end gap-1">
				{value.map((v) => (
					<Badge key={v} variant="secondary" className="font-normal">
						{v}
					</Badge>
				))}
			</div>
		);
	}
	return value;
}

export function ProductAttributes({
	descriptionHtml,
	attributes = [],
	careInstructions,
}: ProductAttributesProps) {
	// Filter out variant attributes that are shown elsewhere (Size, Color)
	const displayAttributes = attributes.filter((attr) => !["Size", "Color"].includes(attr.name));

	return (
		<Accordion type="multiple" defaultValue={["description", "details"]} className="w-full">
			{descriptionHtml && descriptionHtml.length > 0 && (
				<AccordionItemWithContext value="description" className="border-border">
					<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
						Descripción
					</AccordionTrigger>
					<AccordionContent>
						<div className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-foreground prose-strong:text-foreground">
							{descriptionHtml.map((html) => (
								<div key={html} dangerouslySetInnerHTML={{ __html: html }} />
							))}
						</div>
					</AccordionContent>
				</AccordionItemWithContext>
			)}

			{displayAttributes.length > 0 && (
				<AccordionItemWithContext value="details" className="border-border">
					<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
						Detalles del Producto
					</AccordionTrigger>
					<AccordionContent>
						<div className="grid gap-3">
							{displayAttributes.map((attr) => (
								<div key={attr.name} className="flex items-start justify-between gap-4 text-sm">
									<span className="flex items-center gap-2 text-muted-foreground">
										{getSpecificationIcon(attr.icon)}
										{attr.name}
									</span>
									<span className="text-right font-medium">{formatValue(attr.value)}</span>
								</div>
							))}
						</div>
					</AccordionContent>
				</AccordionItemWithContext>
			)}

			{careInstructions && (
				<AccordionItemWithContext value="care" className="border-border">
					<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
						Instrucciones de cuidado
					</AccordionTrigger>
					<AccordionContent className="leading-relaxed text-muted-foreground">
						{careInstructions}
					</AccordionContent>
				</AccordionItemWithContext>
			)}

			<AccordionItemWithContext value="shipping" className="border-border">
				<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
					Envío y Devoluciones
				</AccordionTrigger>
				<AccordionContent className="leading-relaxed text-muted-foreground">
					<p className="mb-2">Envío gratis en pedidos de más de $100. Entrega estándar en 3-5 días hábiles.</p>
					<p>Devoluciones gratis dentro de los 30 días posteriores a la compra. Los artículos deben estar sin usar y con etiquetas.</p>
				</AccordionContent>
			</AccordionItemWithContext>
		</Accordion>
	);
}
