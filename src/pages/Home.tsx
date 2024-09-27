import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import PromptListing from "../components/PromptListing";
import { fetchModels, fetchModelNames } from "../utils/api";
import { useNavigate } from "react-router-dom";
import ErrorToast from "../components/ErrorToast";

export default function Home() {
	const [names, setNames] = useState<string[] | undefined>(undefined);
	const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
	const [models, setModels] = useState([]);
	const [error, setError] = useState<string | null>(null); // State for handling errors
	const navigate = useNavigate(); // Initialize the navigate function

	useEffect(() => {
		if (!names) {
			fetchModelNames()
				.then(setNames)
				.catch((err) => {
					setError(err.message);
				});
		}
	}, [names]);

	useEffect(() => {
		if (selectedModel) {
			fetchModels(selectedModel)
				.then(setModels)
				.catch((err) => {
					setError(err.message);
				});
		}
	}, [selectedModel]);

	return <>
		{names != null && <PromptListing
			model_names={names}
			models={models}
			onExpand={setSelectedModel}
			onManage={(id) => {
				navigate(`/manage/${id}`); // Navigate to /manage and pass the id
			}}
		/> || <Spinner></Spinner>}


		{error &&
			<ErrorToast error={error}></ErrorToast>
		}
	</>
}

