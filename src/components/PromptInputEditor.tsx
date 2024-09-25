import { Button, Col, Form, Row } from "react-bootstrap";

interface PromtRegisEntryInput {
	type: 'string' | 'file' | 'files'
	file_types?: string[]
	max_length?: number
	max_file_size?: number
	// kinda pointless
	// description?:string
	// required?:boolean
}

interface PromptInputEditorProp {
	value: Record<string, PromtRegisEntryInput>
	onChange: (newValue: Record<string, PromtRegisEntryInput>) => void
}
export default function PromptInputEditor({ value: input, onChange: setInput }: PromptInputEditorProp) {
	const handleInputTypeChange = (name: string, value: string) => {
		setInput({
			...input,
			[name]: {
				"type": value,
			} as any,
		});
	}

	const handleFieldChange = (name: string, field: string, value: any) => {
		if (field == "type")
			handleInputTypeChange(name, value)
		else
			setInput({
				...input,
				[name]: {
					...input[name],
					[field]: value,
				},
			});
	};

	const handleNameChange = (oldName: string, newName: string) => {
		const { [oldName]: oldValue, ...rest } = input;
		setInput({
			...rest,
			[newName]: oldValue,
		});
	};

	const handleRemoveField = (name: string) => {
		const { [name]: _, ...rest } = input;
		setInput(rest);
	};

	const handleAddField = () => {
		setInput({ ...input, "": { type: "string" } })
	}

	return (
		<Row>
			<h4>Input</h4>
			{Object.entries(input).map(([name, value], index) => {
				return (
					<Row key={index} className="align-items-center">
						<Col xs={2}>
							<Form.Group className="mb-3">
								<Form.Label>
									Name <span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Form.Control
									value={name}
									required
									onChange={(e) => handleNameChange(name, e.target.value)}
									isInvalid={!name}
								/>
								<Form.Control.Feedback type="invalid">
									Name is required.
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={2}>
							<Form.Group className="mb-3">
								<Form.Label>Type</Form.Label>
								<Form.Select
									value={value.type}
									onChange={(e) => handleFieldChange(name, "type", e.target.value)}
								>
									<option value="string">string</option>
									<option value="file">file</option>
									<option value="files">files</option>
								</Form.Select>
							</Form.Group>
						</Col>
						{value.type.startsWith("file") && (
							<>
								<Col xs={2}>
									<Form.Group className="mb-3">
										<Form.Label>Maximum File Size</Form.Label>
										<Form.Control
											type="number"
											value={value.max_file_size || ""}
											onChange={(e) =>
												handleFieldChange(
													name,
													"max_file_size",
													Number(e.target.value)
												)
											}
										/>
									</Form.Group>
								</Col>
								<Col xs={2}>
									<Form.Group className="mb-3">
										<Form.Label>File Types</Form.Label>
										<Form.Control
											value={value.file_types?.join(" ") || ""}
											onChange={(e) =>
												handleFieldChange(
													name,
													"file_types",
													e.target.value.split(" ")
												)
											}
										/>
									</Form.Group>
								</Col>
							</>
						)}
						{value.type === "files" && (
							<Col xs={2}>
								<Form.Group className="mb-3">
									<Form.Label>Max Attached Files</Form.Label>
									<Form.Control
										type="number"
										value={value.max_length || ""}
										onChange={(e) =>
											handleFieldChange(
												name,
												"max_length",
												Number(e.target.value)
											)
										}
									/>
								</Form.Group>
							</Col>
						)}
						<Col></Col>
						<Col xs="auto">
							<Button
								variant="danger"
								onClick={() => handleRemoveField(name)}
							>
								-
							</Button>
						</Col>
					</Row>
				);
			})}
			<Row>
				<Col></Col>
				<Col xs={"auto"}>
					<Button onClick={handleAddField}>+</Button>
				</Col>
			</Row>
		</Row>
	);

}

