import { AlertCircleIcon, CheckCircleIcon, ClockIcon, XCircle } from "lucide-react";
import { PaymentChargeStatusEnum } from "@/gql/graphql";

type Props = {
	status: PaymentChargeStatusEnum;
};

export const PaymentStatus = async ({ status }: Props) => {
	switch (status) {
		case PaymentChargeStatusEnum.NotCharged:
			return (
				<p className="flex items-center gap-1 text-red-400">
					<XCircle className="h-4 w-4" aria-hidden />
					no pagado
				</p>
			);
		case PaymentChargeStatusEnum.Cancelled:
			return (
				<p className="flex items-center gap-1 text-red-400">
					<XCircle className="h-4 w-4" aria-hidden />
					cancelado
				</p>
			);
		case PaymentChargeStatusEnum.Refused:
			return (
				<p className="flex items-center gap-1 text-red-400">
					<XCircle className="h-4 w-4" aria-hidden />
					rechazado
				</p>
			);
		case PaymentChargeStatusEnum.FullyCharged:
			return (
				<p className="flex items-center gap-1 text-green-600">
					<CheckCircleIcon className="h-4 w-4" aria-hidden />
					pagado
				</p>
			);
		case PaymentChargeStatusEnum.FullyRefunded:
			return (
				<p className="flex items-center gap-1 text-green-600">
					<CheckCircleIcon className="h-4 w-4" aria-hidden />
					reembolsado
				</p>
			);
		case PaymentChargeStatusEnum.PartiallyCharged:
			return (
				<p className="flex items-center gap-1 text-yellow-500">
					<AlertCircleIcon className="h-4 w-4" aria-hidden />
					pago parcial
				</p>
			);
		case PaymentChargeStatusEnum.PartiallyRefunded:
			return (
				<p className="flex items-center gap-1 text-yellow-500">
					<AlertCircleIcon className="h-4 w-4" aria-hidden />
					reembolso parcial
				</p>
			);
		case PaymentChargeStatusEnum.Pending:
			return (
				<p className="flex items-center gap-1 text-yellow-500">
					<ClockIcon className="h-4 w-4" aria-hidden />
					pendiente
				</p>
			);
	}
};
