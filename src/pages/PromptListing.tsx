import { Accordion, Button, Spinner, Table } from "react-bootstrap";
import EnvBadge from "../components/EnvBadge";
import { useState } from "react";

interface PromptListingProp {
	model_names: string[];
	models: {
		name: string;
		version: string;
		id: string;
		deploy_envs: string[];
	}[];
	onExpand: (model_name: string) => void;
	onManage: (id: string) => void;
}

export default function PromptListing({ model_names, models, onExpand, onManage }: PromptListingProp) {
	const [activeKey, setActiveKey] = useState<string | null>(null);

	const handleSelect = (eventKey: string | null | undefined) => {
		if (typeof eventKey === 'string') {
			setActiveKey(eventKey);
			onExpand(model_names[parseInt(eventKey)]);
		}
	};

	return (
		<div>
			<Accordion activeKey={activeKey} onSelect={what => handleSelect(what?.toString())} alwaysOpen>
				{model_names.map((name, index) => {
					let matchModels = models.filter((m) => m.name === name)
					return <Accordion.Item eventKey={index.toString()} key={index}>
						<Accordion.Header>{name}</Accordion.Header>
						<Accordion.Body>
							<Table>
								<thead>
									<tr>
										<th>version</th>
										<th>env</th>
										<th>action</th>
									</tr>
								</thead>
								<tbody>
									{matchModels.length > 0 ? matchModels
										.map((a) => (
											<tr key={a.id}>
												<td>{a.version}</td>
												<td>
													{a.deploy_envs.map((e) => (
														<EnvBadge env={e as any} key={e}></EnvBadge>
													))}
												</td>
												<td>
													<Button className="p-1" onClick={() => onManage(a.id)}>
														manage
													</Button>
												</td>
											</tr>
										)) : <Spinner></Spinner>}
								</tbody>
							</Table>
						</Accordion.Body>
					</Accordion.Item>
				})}
			</Accordion>
			<Button className="m-2">create</Button>
		</div>
	);
}

