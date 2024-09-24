import { Badge, BadgeProps } from "react-bootstrap";

interface EnvBadgeProps extends BadgeProps {
	env: "alpha" | "beta" | "pro";
}

export default function EnvBadge({ env, ...props }: EnvBadgeProps) {
	const getColor = (env: string) => {
		switch (env) {
			case "alpha":
				return "danger"; // red
			case "beta":
				return "warning"; // yellow
			case "pro":
				return "success"; // green
			default:
				return "secondary"; // default grey
		}
	};

	return (
		<Badge bg={getColor(env)} {...props}>
			{env}
		</Badge>
	);
}

