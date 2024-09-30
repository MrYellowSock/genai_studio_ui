import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup'; // base language, since Jinja is close to HTML

// CSS for syntax highlighting (you can use any Prism.js theme)
import 'prismjs/themes/prism.css';

// Define Jinja-specific syntax
Prism.languages.jinja2 = Prism.languages.extend('markup', {
	'variable': {
		pattern: /{{\s*[\w\W]*?\s*}}/,
		inside: {
			'punctuation': /^{{|}}$/,
			'expression': {
				pattern: /[\s\S]+/,
				inside: Prism.languages.javascript, // You can use other languages if needed
			},
		},
	},
	'block': {
		pattern: /{%\s*[\w\W]*?\s*%}/,
		inside: {
			'punctuation': /^{%|%}$/,
			'expression': {
				pattern: /[\s\S]+/,
				inside: Prism.languages.javascript,
			},
		},
	},
});

interface TemplateStringInputProps {
	code: string;
	onChange: (newCode: string) => void;
}

export default function TemplateStringInput({ code, onChange }: TemplateStringInputProps) {
	const handleCodeChange = (newCode: string) => {
		onChange(newCode);
	};

	return (
		<>
			<Editor
				value={code}
				onValueChange={handleCodeChange}
				highlight={code => Prism.highlight(code, Prism.languages.jinja2, 'jinja2')}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 14,
					border: '1px solid #ced4da',
					borderRadius: '4px',
					minHeight: '150px',
				}}
			/>
		</>
	);
}

