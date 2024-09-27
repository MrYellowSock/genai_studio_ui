import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchLLMs } from "../utils/api";
import ErrorToast from "../components/ErrorToast";
import RequiredInput from "../components/inputs/RequiredInput";
import PromptTemplateEditor from "../components/PromptTemplateEditor";

export default function PromptCreator() {
	const [error, setError] = useState<string | null>(null); // State for handling errors
	const [llms, setllms] = useState<any[] | undefined>(undefined);
	const [modelName, setmodelName] = useState<string>("")
	const [modelVer, setmodelVer] = useState<string>("")
	const [template, settemplate] = useState<any>(undefined)

	useEffect(() => {
		if (llms == null) {
			fetchLLMs().then(setllms).catch(err => setError(err.message));
		}
	}, [llms]);
	return (
		<Container fluid>
			{error != null && <ErrorToast error={error}></ErrorToast>}
			{llms == null && <Spinner></Spinner>}
			{llms != null &&
				<Row>
					<PromptTemplateEditor
						varaint="creator"
						llms={llms}
						template={template}
						onTemplateChange={settemplate}
					></PromptTemplateEditor>
				</Row>
			}

			<Row >
				<Col></Col>
				<Col xs="auto">
					<RequiredInput name="Model name" value={modelName} onChange={setmodelName}>
					</RequiredInput>
				</Col>
				<Col xs="auto">
					<RequiredInput name="Model version" value={modelVer} onChange={setmodelVer}>
					</RequiredInput>
				</Col>
				<Col xs="auto" >
					<Button onClick={() => console.log("CREATE ME", template)}>Create</Button>
				</Col>
			</Row>
		</Container>
	);
}
