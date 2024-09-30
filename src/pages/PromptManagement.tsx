import { Button, Col, Container, Form, Row, Spinner, Table, Toast } from "react-bootstrap";
import EnvBadge from "../components/EnvBadge";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAddDeploy, fetchDeployableEnvs, fetchDeployments, fetchLLMs, fetchModel, PromptRegisFull } from "../utils/api";
import ErrorToast from "../components/ErrorToast";
import PromptTemplateEditor from "../components/PromptTemplateEditor";

export default function PromptManagement() {
	const { id } = useParams(); // Extract the id from the URL parameters
	const [deployments, setdeployments] = useState<any[] | undefined>(undefined)
	const [error, setError] = useState<string | null>(null); // State for handling errors
	const [template, settemplate] = useState<PromptRegisFull | undefined>(undefined)
	const [llms, setllms] = useState<any[] | undefined>(undefined)
	const navigate = useNavigate()
	const [selectedDeployEnv, setselectedDeployEnv] = useState("")
	const [deployableEnvs, setdeployableEnvs] = useState<string[] | undefined>(undefined)
	const [deploying, setdeploying] = useState(false)
	const [success, setSuccess] = useState(false); // State for handling success message

	const obtainDeployments = () => {
		if (id) {
			fetchDeployments(id)
				.then(setdeployments)
				.catch(err => setError(err.message));
			fetchDeployableEnvs(id)
				.then(setdeployableEnvs)
				.catch(err => setError(err.message));
		}
	}

	const handleDeploy = () => {
		console.log("deploying", selectedDeployEnv, id);
		setdeploying(true);
		setSuccess(false); // Reset success state
		fetchAddDeploy(id!, selectedDeployEnv)
			.then(() => {
				setSuccess(true); // Show success message on successful deploy
				// refetch deployments again
				setdeployments(undefined);
				setdeployableEnvs(undefined);
				obtainDeployments();
			})
			.catch(err => setError(err.message))
			.finally(() => setdeploying(false));
	};

	useEffect(() => {
		if (id) {
			// fetch other stuff
			fetchModel(id)
				.then((model) => {
					settemplate(model);
				})
				.catch(err => setError(err.message));
			fetchLLMs()
				.then(setllms)
				.catch(err => setError(err.message));
			obtainDeployments();
		}
	}, [id]);

	return (
		<Container fluid>
			<Row>
				{(llms != null && template != null &&
					<PromptTemplateEditor
						varaint="viewer"
						template={template}
						llms={llms}
					></PromptTemplateEditor>) || <Spinner></Spinner>
				}
			</Row>
			<Row>
				{error && <ErrorToast error={error}></ErrorToast>}
			</Row>
			<Row>
				<h4>deployments</h4>
				<Table>
					<thead>
						<tr>
							<th>name</th>
							<th>version</th>
							<th>env</th>
							<th>action</th>
						</tr>
					</thead>
					<tbody>
						{deployments != null && deployments.map(d => {
							return (
								<tr key={d.deploy_name}>
									<td>{d.deploy_name}</td>
									<td>{d.deploy_version}</td>
									<td><EnvBadge env={d.deploy_env}></EnvBadge></td>
									<td><Button>Playground</Button></td>
								</tr>
							);
						}) || <Spinner></Spinner>}
					</tbody>
				</Table>
			</Row>
			<Row>
				<Col>
					<Button onClick={() => navigate(`/create?ref=${id}`)}>fork model</Button>
				</Col>
				<Col>
					{deployableEnvs != null &&
						<Form.Select value={selectedDeployEnv} onChange={e => setselectedDeployEnv(e.target.value)}>
							<option value={""}>Select environment</option>
							{deployableEnvs.map(env => <option key={env} value={env}>{env}</option>)}
						</Form.Select>
						|| <Spinner></Spinner>
					}
				</Col>
				<Col>
					{deploying ? <Spinner></Spinner> : <Button onClick={handleDeploy}>deploy</Button>}
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
				<Toast.Body>Deployment successful!</Toast.Body>
			</Toast>
		</Container>
	);
}
