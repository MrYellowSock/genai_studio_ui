import { useEffect, useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json'; // Import JSON syntax for Prism
import 'prismjs/themes/prism.css'; // Import the Prism theme
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Initialize Ajv and add formats for JSON schema validation
const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Add support for formats like "date", "email", etc.

interface JsonInputProp {
	json: object;
	onChange: (json: object) => void;
}

export default function JsonInput({ json, onChange }: JsonInputProp) {
	const [rawJson, setrawJson] = useState("{}")
	const [error, setError] = useState<string | null>(null);
	const [parsedJson, setparsedJson] = useState({})

	useEffect(() => {
		setrawJson(JSON.stringify(json))
	}, [json])

	const handleJsonChange = (code: string) => {
		setrawJson(code);
		try {
			const newJson: object = JSON.parse(code); // Validate JSON syntax
			setparsedJson(newJson);

			// Validate JSON against JSON Schema Draft 7
			const validate = ajv.compile(newJson);
			const valid = validate(newJson);

			if (!valid) {
				const errors = validate.errors
					?.map((err) => `${err.instancePath} ${err.message}`)
					.join(', ');
				setError(`Invalid JSON schema: ${errors}`);
			} else {
				setError(null); // Clear error if JSON schema is valid
			}
		} catch (e) {
			setError('Invalid JSON format ' + e); // Show error if JSON is invalid
		}
	};

	return (
		<Form.Group className="mb-3">
			<Form.Label>JSON</Form.Label>
			<Editor
				onBlur={() => onChange(parsedJson)}
				value={rawJson}
				onValueChange={handleJsonChange}
				highlight={(code) => highlight(code, languages.json, 'json')}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 12,
					minHeight: '100px',
					border: error ? '1px solid red' : '1px solid #ced4da',
					borderRadius: '.25rem',
				}}
			/>
			{error && <Alert variant="danger" className="mt-2">{error}</Alert>}
		</Form.Group>
	);
}

