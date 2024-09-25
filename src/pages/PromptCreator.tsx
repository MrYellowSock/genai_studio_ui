import { Button, Col, Container, Form, Row } from "react-bootstrap";
import PromptInputEditor from "../components/PromptInputEditor";
import { useState } from "react";

export default function PromptCreator() {
	const [input, setInput] = useState<Record<string, any>>({
		images: {
			type: "files",
			file_types: [".png", ".jpeg", ".tiff"],
			required: false,
			max_length: 4,
			description: "sfaf",
		},
		file2: {
			type: "file",
			file_types: [".pdf"],
			max_file_size: 2000000,
		},
		msg: {
			type: "string",
		},
	});
	return (
		<Container>
			<PromptInputEditor
				value={input}
				onChange={setInput}
			></PromptInputEditor>
		</Container>
	);
}
