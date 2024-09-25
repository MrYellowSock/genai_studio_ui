import React from 'react'
import { Form } from 'react-bootstrap'

// TODO : highlighting
export default function JsonInput() {
	return (
		<Form.Group className="mb-3" >
			<Form.Label>JSON</Form.Label>
			<Form.Control as="textarea" rows={3} placeholder="Enter json here" />
		</Form.Group>
	)
}

