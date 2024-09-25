import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PromptConfigEditor from '../components/PromptConfigEditor';

export default function PromptPlayground() {

	return (
		<Container>
			<Row>
				<Col>
					<Form>
						<Form.Group className="mb-3" >
							<Form.Label>System instruction</Form.Label>
							<Form.Control as="textarea" rows={3} placeholder="Enter your text here" />
						</Form.Group>

						<Form.Group className="mb-3" >
							<Form.Label>Prompt content</Form.Label>
							<Form.Control as="textarea" rows={3} placeholder="Enter your text here" />
						</Form.Group>

						<Row>
							<Col>
								<Button variant="primary">Attach Files</Button>
							</Col>
							<Col>
								<Button variant="primary">Run</Button>
							</Col>
						</Row>
					</Form>
				</Col>
				<Col>
					<PromptConfigEditor
						variant="playground"
						genai_models={[
							{
								name: "jimmy",
								supported_config_fields: [
									"top_p",
								]
							},
							{
								name: "jimmy2",
								supported_config_fields: [
									"response_enum"
								]
							},
							{
								name: "jimmy3",
								supported_config_fields: [
									"response_json"
								]
							},
							{
								name: "jimmy5",
								supported_config_fields: [
									"response_json",
									"response_enum"
								]
							},
							{
								name: "super",
								supported_config_fields: [
									"seed",
									"frequency_penalty",
									"presence_penalty",
									"candidate_count",
									"stop_sequences",
									"max_output_tokens",
									"temperature",
									"top_p",
									"top_k",
									"response_json",
									"response_enum"

								]
							}

						]}
					></PromptConfigEditor>
				</Col>
			</Row>
		</Container>
	);
}

