import React from 'react'
import { Form } from 'react-bootstrap'

interface RequiredInputProp {
	name: string
	value: string
	onChange: (newValue: string) => void
	readOnly?: boolean
}

export default function RequiredInput({ name, onChange, value, readOnly }: RequiredInputProp) {
	return (
		<Form.Group className='mb-3'>
			<Form.Label>
				{name} <span style={{ color: "red" }}>*</span>
			</Form.Label>
			<Form.Control
				value={value}
				required
				onChange={(e) => onChange(e.target.value)}
				isInvalid={!value}
				readOnly={readOnly}
			/>
			<Form.Control.Feedback type="invalid">
				{name} is required.
			</Form.Control.Feedback>
		</Form.Group>
	)
}

