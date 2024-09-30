import { sleep } from "./time";

interface PromptRegisEntryInput {
	type: string;
	file_types?: string[];
	required?: boolean;
	max_length?: number | null;
	max_file_size?: number | null;
}

interface PromptRegisEntryConfig<T> {
	default?: T | null;
	value?: T | null;
	required?: boolean;
	description?: string | null;
}
interface PromptRegisInput {
	prompt: { [key: string]: PromptRegisEntryInput };
	configurable?: { [key: string]: PromptRegisEntryConfig<any> };
}

interface PromptRegisMessage {
	system_msg?: string | null;
	human_msg: string;
}

export interface PromptRegisFull {
	input: PromptRegisInput;
	genai_models: string[];
	prompt_template: PromptRegisMessage;
}

// async function fetchApi(url: string, method: string) {
// 	const response = await fetch(url, { method: method });
// 	if (!response.ok) {
// 		throw new Error('Network response was not ok');
// 	}
// 	return await response.json()
// }

async function fetchMock(data: any) {
	console.log("requesting", data)
	const shouldError = Math.random() <= 0.3
	const waitTime = Math.random() * 2000
	await sleep(waitTime)
	if (shouldError) {
		throw new Error("OOPSIE DOOPSIE")
	}
	return data
}

export function fetchModelNames() {
	return fetchMock(["abc", "def"])
}

// this is actually two stepped, have to fetch deployment too
export function fetchModels(name: string) {
	if (name == 'abc')
		return fetchMock([
			{
				name: "abc",
				version: "1",
				id: "1",
				deploy_envs: ["beta", "pro"]
			},
			{
				name: "abc",
				version: "2",
				id: "2",
				deploy_envs: []
			}
		])
	else
		return fetchMock([
			{
				name: "def",
				version: "1",
				id: "1",
				deploy_envs: ["beta", "pro"]
			}
		])
}

export function fetchModel(id: string): Promise<PromptRegisFull> {
	return fetchMock({
		"input": {
			"prompt": {
				"shape_image": {
					"type": "file",
					"file_types": [
						".png",
						".jpeg",
						".tiff"
					],
					"required": false,
					"max_length": null,
					"description": null,
					"max_file_size": null
				}
			},
			"configurable": {
				"seed": null,
				"frequency_penalty": null,
				"presence_penalty": null,
				"candidate_count": null,
				"stop_sequences": null,
				"max_output_tokens": null,
				"temperature": {
					"default": 0,
					"value": null,
					"required": false,
					"description": null
				},
				"top_k": null,
				"top_p": null,
				"response_enum": null,
				"response_json": {
					"default": null,
					"value": {
						"type": "object",
						"properties": {
							"square": {
								"type": "integer"
							},
							"triangle": {
								"type": "integer"
							},
							"circle": {
								"type": "integer"
							}
						}
					},
					"required": false,
					"description": null
				}
			}
		},
		"genai_models": [
			"google-gemini-1.5-flash",
			"dummy",
			"vertex-gemini-1.5-flash"
		],
		"prompt_template": {
			"system_msg": null,
			"human_msg": "Count shapes inside the image {{shape_image}}"
		}
	})
}

export function fetchLLMs() {
	return fetchMock([
		{
			name: "jimmy",
			supported_config_fields: [
				"top_p",
			]
		},
		{
			name: "jimmy2",
			supported_config_fields: [
				"response_enum"
			]
		},
		{
			name: "jimmy3",
			supported_config_fields: [
				"response_json"
			]
		},
		{
			name: "jimmy5",
			supported_config_fields: [
				"response_json",
				"response_enum"
			]
		},
		{
			name: "super",
			supported_config_fields: [
				"seed",
				"frequency_penalty",
				"presence_penalty",
				"candidate_count",
				"stop_sequences",
				"max_output_tokens",
				"temperature",
				"top_p",
				"top_k",
				"response_json",
				"response_enum"

			]
		}

	])
}

export function fetchDeployments(model_id: string) {
	return fetchMock([
		{
			"deploy_env": "beta",
			"deploy_name": "def",
			"deploy_version": "2",

			"id": 1,
			"model_id": model_id,
		},
		{
			"deploy_env": "pro",
			"deploy_name": "def",
			"deploy_version": "2",

			"id": 2,
			"model_id": model_id,
		}
	])

}

export function fetchInfer() {

}

export function fetchRegisPrompt(name: string, version: string, template: PromptRegisFull) {
	return fetchMock({})
}
