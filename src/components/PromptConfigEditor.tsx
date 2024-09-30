import { Col, Form, Row } from "react-bootstrap";
import { useState } from 'react';
import EnumInput from "./inputs/EnumInput";
import JsonInput from "./inputs/JsonInput";

type ConfigFieldKey = "seed" |
	"frequency_penalty" |
	"presence_penalty" |
	"candidate_count" |
	"stop_sequences" |
	"max_output_tokens" |
	"temperature" |
	"top_p" |
	"top_k" |
	"response_json" |
	"response_enum"
interface GenaiOption {
	name: string;
	supported_config_fields: ConfigFieldKey[]
}

interface PromptConfigEditorProp {
	// creator will have extra checkbox to fix each field
	variant?: 'playground' | 'creator' | 'viewer'
	genai_models: GenaiOption[]
	value: any
	onChange: (newValue: any) => void

	creatorFieldFixedState?: Record<string, boolean>
	onCreatorFieldFixedChange?: (fixedState: Record<string, boolean>) => void
}

export default function PromptConfigEditor({ variant, genai_models, value: config, onChange: setconfig, creatorFieldFixedState, onCreatorFieldFixedChange }: PromptConfigEditorProp) {
	const readOnly = variant === 'viewer'
	const isCreator = variant === 'creator'
	const handleCreatorFieldFixed = (key: string, fixed: boolean) => {
		onCreatorFieldFixedChange?.({
			...creatorFieldFixedState,
			[key]: fixed
		})
	}
	const handleFieldEdit = (key: string, value: any) => {
		if (readOnly)
			return
		if (key == "genai_model")
			setconfig({
				[key]: value
			})
		else
			setconfig({
				...config,
				[key]: value
			})
	}

	const handleResponseFormatChange = (format: string) => {
		setResponseFormat(format)
		let { response_enum, response_json, ...rest } = config
		setconfig(rest)
	}

	const fields = {
		"seed": (
			<Form.Group className="mb-3">
				<Form.Label>Seed</Form.Label>
				<Form.Control
					onChange={e => handleFieldEdit("seed", +e.target.value)}
					value={config["seed"] || ''}
					type="number"
					disabled={readOnly}
				/>
			</Form.Group>
		),
		"frequency_penalty": (
			<Form.Group className="mb-3">
				<Form.Label>Frequency Penalty</Form.Label>
				<Form.Control
					onChange={e => handleFieldEdit("frequency_penalty", +e.target.value)}
					value={config["frequency_penalty"] || ''}
					type="number"
					step={0.01}
					disabled={readOnly}
				/>
			</Form.Group>
		),
		"presence_penalty": (
			<EnumInput
				value={config["presence_penalty"] || []}
				onChange={value => handleFieldEdit("presence_penalty", value)}
				title={"Presence Penalty"}
				placeholder="keyword"
				disabled={readOnly}
			/>
		),
		"candidate_count": (
			<Form.Group className="mb-3">
				<Form.Label>Candidate Count</Form.Label>
				<Form.Control
					value={config["candidate_count"] || ''}
					onChange={(e) => handleFieldEdit("candidate_count", +e.target.value)}
					type="number"
					disabled={readOnly}
				/>
			</Form.Group>
		),
		"stop_sequences": (
			<EnumInput
				value={config["stop_sequences"] || []}
				onChange={value => handleFieldEdit("stop_sequences", value)}
				title={"Stop Sequences"}
				placeholder="keyword"
				disabled={readOnly}
			/>
		),
		"max_output_tokens": (
			<Form.Group className="mb-3">
				<Form.Label>Max Output Tokens</Form.Label>
				<Form.Control
					type="number"
					step={1}
					value={config["max_output_tokens"] || ''}
					onChange={(e) => handleFieldEdit("max_output_tokens", +e.target.value)}
					disabled={readOnly}
				/>
			</Form.Group>
		),
		"temperature": (
			<Form.Group className="mb-3">
				<Form.Label>Temperature</Form.Label>
				<Form.Control
					type="number"
					min={0}
					max={1}
					step={0.01}
					value={config["temperature"] || ''}
					onChange={(e) => handleFieldEdit("temperature", +e.target.value)}
					disabled={readOnly}
				/>
			</Form.Group>
		),
		"top_p": (
			<Form.Group className="mb-3">
				<Form.Label>Top P</Form.Label>
				<Form.Control
					type="number"
					step={0.01}
					value={config["top_p"] || ''}
					onChange={(e) => handleFieldEdit("top_p", +e.target.value)}
					disabled={readOnly}
				/>
			</Form.Group>
		),
		"top_k": (
			<Form.Group className="mb-3">
				<Form.Label>Top K</Form.Label>
				<Form.Control
					type="number"
					step={1}
					value={config["top_k"] || ''}
					onChange={(e) => handleFieldEdit("top_k", +e.target.value)}
					disabled={readOnly}
				/>
			</Form.Group>
		),
	}

	const [responseFormat, setResponseFormat] = useState("text");
	const currentModel = genai_models.find(model => model.name == config.genai_model)
	const supportedFormats = [
		"text",
		currentModel?.supported_config_fields.includes("response_json") ? "json" : "",
		currentModel?.supported_config_fields.includes("response_enum") ? "enum" : "",
	].filter(format => format.length > 0)

	return (
		<Form>
			<Form.Group className="mb-3" >
				<Form.Label>Model</Form.Label>
				<Form.Select disabled={readOnly} value={config.genai_model} onChange={(e) => {
					handleFieldEdit("genai_model", e.target.value)
					setResponseFormat("text")
				}}>
					<option value="">Select a model</option>
					{genai_models.map(m => <option value={m.name}>{m.name}</option>)}
				</Form.Select>
			</Form.Group>
			<Form.Group className="mb-3" >
				<Form.Label>Response format</Form.Label>
				<Form.Select disabled={readOnly} value={responseFormat} onChange={event => {
					handleResponseFormatChange(event.target.value)
				}}>
					{supportedFormats.map(format => <option value={format}>{format}</option>)}
				</Form.Select>
			</Form.Group>

			{
				responseFormat === "enum" && <EnumInput
					value={config.response_enum ?? []}
					onChange={enum2 => handleFieldEdit("response_enum", enum2)}
					title="Enum values"
					placeholder="Enum value"
					disabled={readOnly}
				/>
			}
			{
				responseFormat === "json" && <JsonInput
					json={config.response_json ?? {}}
					onChange={json => handleFieldEdit("response_json", json)}
				/>
			}
			{
				Object.entries(fields).map(([name, element]) => {
					if (!currentModel?.supported_config_fields.includes(name as any))
						return <></>
					if (isCreator || readOnly)
						return <Row className="align-items-center">
							<Col>
								{element}
							</Col>
							<Col xs="auto" className="text-center">
								<Form.Label>fixed</Form.Label>
								<Form.Check
									checked={creatorFieldFixedState?.[name] ?? true}
									onChange={e => handleCreatorFieldFixed(name, e.target.checked)}
								></Form.Check>
							</Col>
						</Row>
					return element
				})
			}
		</Form>
	)
}
