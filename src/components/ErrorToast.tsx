import { useState } from "react";
import { Toast } from "react-bootstrap";
interface ErrorToastProps {
	error: string;
}
export default function ErrorToast({ error }: ErrorToastProps) {
	const [show, setshow] = useState(true)
	return (
		<Toast
			onClose={() => setshow(false)}
			show={show}
			delay={3000}
			autohide
			style={{
				position: "fixed",
				top: 20,
				right: 20,
				zIndex: 9999,
				minWidth: "250px",
			}}
		>
			<Toast.Header>
				<strong className="me-auto">Error! Please try again</strong>
			</Toast.Header>
			<Toast.Body>{error}</Toast.Body>
		</Toast>
	);
}

