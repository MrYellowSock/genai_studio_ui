import _ from 'lodash'
import { Col, Container, Form, Row } from "react-bootstrap";
import PromptInputEditor from "../components/PromptInputEditor";
import { useEffect, useState } from "react";
import PromptConfigEditor from "../components/PromptConfigEditor";
import { PromptRegisFull } from "../utils/api";
import TemplateStringInput from './inputs/TemplateStringInput';

interface PromptTemplateEditorProp {
	varaint?: 'creator' | 'viewer'
	template?: PromptRegisFull
	llms: any[]

	onTemplateChange?: (newInput: any) => void
}

function getConfig(template: PromptRegisFull | undefined) {
	let newConfig: any = {}
	for (let key in template?.input.configurable) {
		newConfig[key] = template.input.configurable[key]?.default ?? template.input.configurable[key]?.value
	}
	newConfig['genai_model'] = template?.genai_models[0]
	return newConfig
}

export default function PromptTemplateEditor({ template, varaint, llms, onTemplateChange }: PromptTemplateEditorProp) {
	const [creatorFixedField, setcreatorFixedField] = useState<Record<string, boolean>>({})
	const [systemMsg, setsystemMsg] = useState(template?.prompt_template.system_msg ?? "")
	const [promptMsg, setpromptMsg] = useState(template?.prompt_template.human_msg ?? "")
	const [config, setconfig] = useState(getConfig(template))
	const [input, setInput] = useState(template?.input.prompt ?? {})

	useEffect(() => {
		//generate the template
		const parsedGenai = config['genai_model'] ? [config['genai_model']] : []
		const parsedConfig: any = {}
		for (let key in config) {
			if (key !== 'genai_model') {
				parsedConfig[key] = {
					[creatorFixedField[key] ? 'default' : 'value']: config[key]
				}
			}
		}
		onTemplateChange?.({
			input: {
				prompt: input,
				configurable: parsedConfig
			},
			genai_models: parsedGenai,
			prompt_template: {
				system_msg: systemMsg,
				human_msg: promptMsg
			}
		})
	}, [systemMsg, promptMsg, config, input])

	return (
		<Container fluid>
			<Row>
				<Col xs={12} xxl={8}>
					<PromptInputEditor
						variant={varaint}
						value={input as any}
						onChange={setInput}
					></PromptInputEditor>
					<PromptConfigEditor
						variant={varaint}
						genai_models={llms}
						value={config}
						onChange={setconfig}
						creatorFieldFixedState={creatorFixedField}
						onCreatorFieldFixedChange={setcreatorFixedField}
					></PromptConfigEditor>
				</Col>
				<Col xs={12} xxl={4}>
					<Form.Group className="mb-3">
						<Form.Label>System instruction</Form.Label>
						<TemplateStringInput
							code={systemMsg}
							onChange={setsystemMsg}
							readOnly={varaint === 'viewer'}
						></TemplateStringInput>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Prompt content</Form.Label>
						<TemplateStringInput
							code={promptMsg}
							onChange={setpromptMsg}
							readOnly={varaint === 'viewer'}
						></TemplateStringInput>
					</Form.Group>
				</Col>
			</Row>
		</Container>
	);
}
