import { useState, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// TODO : json lint
// enum lint
// the rest of supported input
// events,props
export default function PromptPlayground() {
	const [responseFormat, setResponseFormat] = useState("text");
	const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setAttachedFiles(Array.from(event.target.files));
		}
	};

	return (
		<Container>
			<Row>
				<Col>
					<Row>
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
									<input
										type="file"
										multiple
										style={{ display: 'none' }}
										ref={fileInputRef}
										onChange={handleFileChange}
									/>
									<Button variant="primary" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
										Attach Files
									</Button>
									{attachedFiles.length > 0 && (
										<ul>
											{attachedFiles.map((file, index) => (
												<li key={index}>{file.name}</li>
											))}
										</ul>
									)}
								</Col>
								<Col>
									<Button variant="primary">
										Run
									</Button>
								</Col>
							</Row>
						</Form>
					</Row>
					<Row>
						<Form.Group className="mb-3" >
							<Form.Label>Result</Form.Label>
							<Form.Control as="textarea" rows={3} readOnly />
						</Form.Group>
					</Row>
					<Row>
						<Col>
							<Form.Group className="mb-3" >
								<Form.Label>input token</Form.Label>
								<Form.Control readOnly />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className="mb-3" >
								<Form.Label>output token</Form.Label>
								<Form.Control readOnly />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className="mb-3" >
								<Form.Label>response time</Form.Label>
								<Form.Control readOnly />
							</Form.Group>
						</Col>
					</Row>
				</Col>
				<Col>
					<Form>
						<Form.Group className="mb-3" >
							<Form.Label>Model</Form.Label>
							<Form.Select>
								<option value="model1">Model 1</option>
								<option value="model2">Model 2</option>
								<option value="model3">Model 3</option>
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3" >
							<Form.Label>Response format</Form.Label>
							<Form.Select value={responseFormat} onChange={event => setResponseFormat(event.target.value)}>
								<option value="text">text</option>
								<option value="json">json</option>
								<option value="enum">enum</option>
							</Form.Select>
						</Form.Group>
						{
							responseFormat === "json" && <Form.Group className="mb-3" >
								<Form.Label>Json schema</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter your text here" />
							</Form.Group>
						}
						{
							responseFormat === "enum" && <Form.Group className="mb-3" >
								<Form.Label>Enum schema</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter your array" />
							</Form.Group>
						}
						<Form.Group className="mb-3" >
							<Form.Label>Temperature</Form.Label>
							<Form.Range min={0} max={1} step={0.01} />
							<Form.Text>0.5</Form.Text>
						</Form.Group>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

