import { sleep } from "./time";

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
