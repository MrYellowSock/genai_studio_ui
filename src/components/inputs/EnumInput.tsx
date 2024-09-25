import { Button, Col, Form, Row } from "react-bootstrap"

interface EnumInputProp {
	title: string
	placeholder: string
	value: string[]
	onChange: (enums: string[]) => void
}
export default function EnumInput({ value, onChange, title, placeholder }: EnumInputProp) {
	const handleEnumChange = (index: number, key: string) => {
		const newEnumValues = [...value];
		newEnumValues[index] = key;
		onChange(newEnumValues);
	};

	const addEnumValue = () => {
		onChange([...value, ""]);
	};

	const removeEnumValue = (index: number) => {
		const newEnumValues = value.filter((_, i) => i !== index);
		onChange(newEnumValues);
	};
	return (
		<Form.Group className="mb-3" >
			<Form.Label>{title}</Form.Label>
			{value.map((value, index) => (
				<Row key={index} className="mb-2">
					<Col>
						<Form.Control
							type="text"
							value={value}
							onChange={(e) => handleEnumChange(index, e.target.value)}
							placeholder={`${placeholder} ${index + 1}`}
						/>
					</Col>
					<Col xs="auto">
						<Button
							variant="danger"
							onClick={() => removeEnumValue(index)}
						>
							Remove
						</Button>
					</Col>
				</Row>
			))}
			<Button variant="secondary" onClick={addEnumValue}>
				{`Add ${placeholder}`}
			</Button>
		</Form.Group>
	)
}

