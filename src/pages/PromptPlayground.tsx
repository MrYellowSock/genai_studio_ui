import { Col, Container, Row, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PromptConfigEditor from '../components/PromptConfigEditor';
import { useEffect, useState, useRef } from 'react';
import { fetchDirectInfer, fetchLLMs } from '../utils/api';
import ErrorToast from '../components/ErrorToast';

export default function PromptPlayground() {
	const [llms, setllms] = useState<any[] | undefined>(undefined);
	const [error, setError] = useState<string | null>(null); // State for handling errors
	const [config, setconfig] = useState<any>({});
	const [systemMsg, setsystemMsg] = useState("")
	const [promptMsg, setpromptMsg] = useState("")
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // State for selected files
	const [output, setoutput] = useState("")
	const [inferenceTime, setinferenceTime] = useState("")
	const [totalTime, settotalTime] = useState("")
	const [loading, setloading] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

	useEffect(() => {
		if (llms == null) {
			fetchLLMs().then(setllms).catch(err => setError(err.message));
		}
	}, [llms]);

	useEffect(() => {
		console.log(config);
	}, [config]);

	const handleRun = () => {
		// call infer api
		let input = {
			systemMsg: systemMsg,
			promptMsg: promptMsg,
			config: config,
			files: selectedFiles
		}
		console.log("Run with", input);
		setoutput("")
		setinferenceTime("")
		settotalTime("")
		setloading(true)
		fetchDirectInfer(input).then((res) => {
			setoutput(res.output);
			setinferenceTime(res.genai_response_time_ms.toString())
			settotalTime("9999")
		}).catch(err => setError(err.message)).finally(() => setloading(false));
	};

	const handleAttachFiles = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click(); // Trigger file input click
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedFiles(event.target.files); // Update state with selected files
	};

	return (
		<Container>
			<Row>
				<Col>
					<Form>
						<Form.Group className="mb-3">
							<Form.Label>System instruction</Form.Label>
							<Form.Control
								value={systemMsg}
								onChange={e => setsystemMsg(e.target.value)}
								as="textarea"
								rows={3}
								placeholder="Enter your text here" />
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Prompt content</Form.Label>
							<Form.Control
								value={promptMsg}
								onChange={e => setpromptMsg(e.target.value)}
								as="textarea"
								rows={3}
								placeholder="Enter your text here" />
						</Form.Group>

						<Row>
							<Col>
								<Button variant="primary" onClick={handleAttachFiles}>Attach Files</Button>
								<input
									type="file"
									ref={fileInputRef}
									style={{ display: 'none' }}
									onChange={handleFileChange}
									multiple
								/>
								{selectedFiles && (
									<ul>
										{Array.from(selectedFiles).map((file, index) => (
											<li key={index}>{file.name}</li>
										))}
									</ul>
								)}
							</Col>
							<Col>
								{!loading ?
									<Button variant="primary" onClick={handleRun}>Run</Button> :
									<Spinner></Spinner>
								}
							</Col>
						</Row>

						<Row className='mt-3'>
							<Form.Control
								value={output}
								as="textarea"
								rows={3}
								readOnly={true}
							/>
							<span>Inference time took : {inferenceTime} ms</span>
							<span>Total API time took : {totalTime} ms</span>
						</Row>
					</Form>
				</Col>
				<Col>
					{error != null && <ErrorToast error={error}></ErrorToast>}
					{llms != null && (
						<PromptConfigEditor
							variant="playground"
							genai_models={llms}
							value={config}
							onChange={setconfig}
						></PromptConfigEditor>
					) || <Spinner></Spinner>}
				</Col>
			</Row>
		</Container>
	);
}

