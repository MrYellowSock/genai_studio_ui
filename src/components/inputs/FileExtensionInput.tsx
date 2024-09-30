import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

interface FileExtensionInputProp {
	file_types: string[]
	readOnly: boolean
	onChange: (file_types: string[]) => void
}

export default function FileExtensionInput({ file_types, readOnly, onChange }: FileExtensionInputProp) {
	const [rawInput, setrawInput] = useState("")
	const handleChange = () => {
		let extensions = rawInput.split(" ").filter(extension => {
			return extension.length > 0 && extension.match(/^\.[a-zA-Z0-9]+$/)
		})
		console.log("input is", extensions)
		onChange(extensions)
	}
	useEffect(() => {
		setrawInput(file_types.join(" "))
	}, [file_types])
	return <Form.Group className="mb-3">
		<Form.Label>File Types</Form.Label>
		<Form.Control
			value={rawInput}
			onChange={e => setrawInput(e.target.value)}
			onBlur={handleChange}
			readOnly={readOnly}
		/>
	</Form.Group>
}

