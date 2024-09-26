import { Button, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import EnvBadge from "../components/EnvBadge";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDeployments } from "../utils/api";

export default function PromptManagement() {
	const { id } = useParams(); // Extract the id from the URL parameters
	const [deployments, setdeployments] = useState<any[] | undefined>(undefined)
	useEffect(() => {
		if (id)
			fetchDeployments(id).then(setdeployments)
	}, [id])
	return (
		<Container>
			<Row></Row>
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
						{deployments == null && <Spinner></Spinner>}
						{deployments != null && deployments.map(d => {
							return <tr >
								<td>
									{d.deploy_name}
								</td>
								<td>
									{d.deploy_version}
								</td>
								<td>
									<EnvBadge env={d.deploy_env}></EnvBadge>
								</td>
								<td>
									<Button>Playground</Button>
								</td>
							</tr>
						})}

					</tbody>
				</Table>
			</Row>
			<Row>
				<Col>
					<Button>fork model</Button>
				</Col>
				<Col>
					<Form.Select>
						<option>Select environment</option>
						<option>alpha</option>
						<option>beta</option>
					</Form.Select>
				</Col>
				<Col>
					<Button>deploy</Button>
				</Col>
			</Row>
		</Container>
	)
}

