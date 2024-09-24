import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import EnvBadge from "../components/EnvBadge";

export default function PromptManagement() {
	return (
		<Container>
			<Row></Row>
			<Row>
				<h4>deployments</h4>
				<Table>
					<thead>
						<tr>
							<th>env</th>
							<th>action</th>
						</tr>
					</thead>
					<tbody>
						<tr >
							<td>
								<EnvBadge env="alpha"></EnvBadge>
							</td>
							<td>
								<Button>Playground</Button>
							</td>
						</tr>
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

