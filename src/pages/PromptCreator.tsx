import { Button, Col, Container, Row, Spinner, Toast } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchLLMs, fetchModel, fetchRegisPrompt } from "../utils/api";
import ErrorToast from "../components/ErrorToast";
import RequiredInput from "../components/inputs/RequiredInput";
import PromptTemplateEditor from "../components/PromptTemplateEditor";
import { useLocation } from "react-router-dom";

// DO NEXT : ?ref for forkModel
export default function PromptCreator() {
	const [error, setError] = useState<string | null>(null); // State for handling errors
	const [success, setSuccess] = useState<boolean>(false);  // State for handling success message
	const [llms, setllms] = useState<any[] | undefined>(undefined);
	const [modelName, setmodelName] = useState<string>("")
	const [modelVer, setmodelVer] = useState<string>("")
	const [template, settemplate] = useState<any>(undefined)
	const [submitting, setsubmitting] = useState(false)

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const refTemplateId = searchParams.get('ref'); // Get the value of 'param'

	useEffect(() => {
		if (llms == null) {
			fetchLLMs()
				.then(setllms)
				.catch(err => setError(err.message));
		}
	}, [llms]);

	useEffect(() => {
		if (refTemplateId != null) {
			fetchModel(refTemplateId)
				.then((model) => {
					settemplate(model);
				})
				.catch(err => setError(err.message));
		}
	}, [refTemplateId]);

	const handleCreate = () => {
		if (modelName.length === 0 || modelVer.length === 0 || template == null) {
			return;
		}

		setsubmitting(true);
		setSuccess(false); // Reset success state
		fetchRegisPrompt(modelName, modelVer, template)
			.then(() => {
				setSuccess(true); // Show success message
			})
			.catch(err => setError(err.message))
			.finally(() => setsubmitting(false));
	};

	return (
		<Container fluid>
			{error != null && <ErrorToast error={error}></ErrorToast>}
			{llms != null &&
				<Row>
					<PromptTemplateEditor
						varaint="creator"
						llms={llms}
						template={template}
						onTemplateChange={settemplate}
					></PromptTemplateEditor>
				</Row>
				|| <Spinner></Spinner>}

			<Row>
				<Col></Col>
				<Col xs="auto">
					<RequiredInput name="Model name" value={modelName} onChange={setmodelName} />
				</Col>
				<Col xs="auto">
					<RequiredInput name="Model version" value={modelVer} onChange={setmodelVer} />
				</Col>
				<Col xs="auto">
					<Row>
						<Button onClick={handleCreate} disabled={submitting}>Create</Button>
					</Row>

					{submitting && <Row>
						<Spinner animation="border" />
					</Row>}
				</Col>
			</Row>

			{/* Success Toast */}
			<Toast
				onClose={() => setSuccess(false)}
				show={success}
				delay={3000}
				autohide
				style={{ position: 'fixed', top: 20, right: 20 }}
			>
				<Toast.Header>
					<strong className="mr-auto">Success</strong>
				</Toast.Header>
				<Toast.Body>Prompt created successfully!</Toast.Body>
			</Toast>
		</Container>
	);
}
