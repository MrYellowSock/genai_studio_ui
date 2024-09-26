import { Button, Col, Form, Row } from "react-bootstrap";
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
	variant: 'playground' | 'creator'
	// for show in management
	readonly?: boolean
	genai_models: GenaiOption[]
}

export default function PromptConfigEditor({ genai_models }: PromptConfigEditorProp) {
	const [config, setconfig] = useState<any>({})

	const handleFieldEdit = (key: string, value: any) => {
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

	const fields = {
		"seed": (
			<Form.Group className="mb-3">
				<Form.Label>Seed</Form.Label>
				<Form.Control
					onChange={e => handleFieldEdit("seed", e.target.value)}
					value={config["seed"] || ''}
					type="number"
				/>
			</Form.Group>
		),
		"frequency_penalty": (
			<Form.Group className="mb-3">
				<Form.Label>Frequency Penalty</Form.Label>
				<Form.Control
					onChange={e => handleFieldEdit("frequency_penalty", e.target.value)}
					value={config["frequency_penalty"] || ''}
					type="number"
					step={0.01}
				/>
			</Form.Group>
		),
		"presence_penalty": (
			<EnumInput
				value={config["presence_penalty"] || []}
				onChange={value => handleFieldEdit("presence_penalty", value)}
				title={"Presence Penalty"}
				placeholder="keyword"
			/>
		),
		"candidate_count": (
			<Form.Group className="mb-3">
				<Form.Label>Candidate Count</Form.Label>
				<Form.Control
					value={config["candidate_count"] || ''}
					onChange={(e) => handleFieldEdit("candidate_count", e.target.value)}
					type="number"
				/>
			</Form.Group>
		),
		"stop_sequences": (
			<EnumInput
				value={config["stop_sequences"] || []}
				onChange={value => handleFieldEdit("stop_sequences", value)}
				title={"Stop Sequences"}
				placeholder="keyword"
			/>
		),
		"max_output_tokens": (
			<Form.Group className="mb-3">
				<Form.Label>Max Output Tokens</Form.Label>
				<Form.Control
					type="number"
					step={1}
					value={config["max_output_tokens"] || ''}
					onChange={(e) => handleFieldEdit("max_output_tokens", e.target.value)}
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
					onChange={(e) => handleFieldEdit("temperature", e.target.value)}
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
					onChange={(e) => handleFieldEdit("top_p", e.target.value)}
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
					onChange={(e) => handleFieldEdit("top_k", e.target.value)}
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
				<Form.Select value={config.genai_model} onChange={(e) => {
					handleFieldEdit("genai_model", e.target.value)
					setResponseFormat("text")
					// TODO : clear every config
				}}>
					{genai_models.map(m => <option value={m.name}>{m.name}</option>)}
				</Form.Select>
			</Form.Group>
			<Form.Group className="mb-3" >
				<Form.Label>Response format</Form.Label>
				<Form.Select value={responseFormat} onChange={event => {
					setResponseFormat(event.target.value)
					let { response_enum, response_json, ...rest } = config
					setconfig(rest)
				}}>
					{supportedFormats.map(format => <option value={format}>{format}</option>)}
				</Form.Select>
			</Form.Group>

			{/* Enum Input Section */}
			{
				responseFormat === "enum" && <EnumInput
					value={config.response_enum ?? []}
					onChange={enum2 => handleFieldEdit("response_enum", enum2)}
					title="Enum values"
					placeholder="Enum value"
				/>
			}
			{
				responseFormat === "json" && <JsonInput />
			}

			{
				Object.entries(fields).map(([name, element]) => {
					if (!currentModel?.supported_config_fields.includes(name as any))
						return <></>
					return element
				})
			}
		</Form>
	)
}
