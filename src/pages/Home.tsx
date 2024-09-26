import { useEffect, useState } from "react";
import { Spinner, Toast } from "react-bootstrap";
import PromptListing from "../components/PromptListing";
import { fetchModelMetas, fetchModelNames } from "../utils/api";

export default function Home() {
	const [names, setNames] = useState<string[] | undefined>(undefined);
	const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
	const [models, setModels] = useState([]);
	const [error, setError] = useState<string | null>(null); // State for handling errors
	const [showToast, setShowToast] = useState(false); // State for controlling the toast visibility

	useEffect(() => {
		if (!names) {
			fetchModelNames()
				.then(setNames)
				.catch((err) => {
					setError(err.message);
					setShowToast(true); // Show the toast on error
				});
		}
	}, [names]);

	useEffect(() => {
		if (selectedModel) {
			fetchModelMetas(selectedModel)
				.then(setModels)
				.catch((err) => {
					setError(err.message);
					setShowToast(true); // Show the toast on error
				});
		}
	}, [selectedModel]);

	if (names == null)
		return <Spinner></Spinner>
	else
		return (
			<>
				<PromptListing
					model_names={names!}
					models={models}
					onExpand={setSelectedModel}
					onManage={console.log}
				/>

				{/* Toast component for showing error messages */}
				<Toast
					onClose={() => setShowToast(false)}
					show={showToast}
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
						<strong className="me-auto">Error</strong>
					</Toast.Header>
					<Toast.Body>{error}</Toast.Body>
				</Toast>
			</>
		);
}

