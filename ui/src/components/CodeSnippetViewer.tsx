import React, { useState, useEffect } from 'react';
import type { IAPIInfo } from '../libs/types';

interface Props {
    lrdDocsItem: IAPIInfo;
    host: string;
}

export default function CodeSnippetViewer({ lrdDocsItem, host }: Props) {
    const [language, setLanguage] = useState('curl');
    const [snippet, setSnippet] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        generateSnippet(language);
    }, [language, lrdDocsItem]);

    const generateSnippet = (lang: string) => {
        const method = lrdDocsItem.http_method.toUpperCase();
        const url = `${host}/${lrdDocsItem.uri}`;
        const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
        const examples = lrdDocsItem.request_examples;
        const firstExample = examples ? Object.values(examples)[0] : null;
        const exampleBody = firstExample ? JSON.stringify(firstExample.value, null, 2) : '{}';

        let code = '';

        switch (lang) {
            case 'curl':
                code = `curl -X ${method} \\\n  '${url}' \\\n  -H 'Content-Type: application/json' \\\n  -H 'Accept: application/json'`;
                if (lrdDocsItem.requires_auth) {
                    code += ` \\\n  -H 'Authorization: Bearer {token}'`;
                }
                if (hasBody && firstExample) {
                    code += ` \\\n  -d '${exampleBody.replace(/'/g, "\\'")}'`;
                }
                break;

            case 'javascript':
                code = `fetch('${url}', {\n  method: '${method}',\n  headers: {\n    'Content-Type': 'application/json',\n    'Accept': 'application/json'`;
                if (lrdDocsItem.requires_auth) {
                    code += `,\n    'Authorization': 'Bearer {token}'`;
                }
                code += `\n  }`;
                if (hasBody && firstExample) {
                    code += `,\n  body: JSON.stringify(${exampleBody})`;
                }
                code += `\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));`;
                break;

            case 'php':
                code = `use Illuminate\\Support\\Facades\\Http;\n\n$response = Http::`;
                if (lrdDocsItem.requires_auth) {
                    code += `withToken('{token}')\n    ->`;
                }
                code += `${method.toLowerCase()}('${url}'`;
                if (hasBody && firstExample) {
                    code += `, ${JSON.stringify(firstExample.value, null, 2)}`;
                }
                code += `);\n\n$data = $response->json();`;
                break;

            case 'python':
                code = `import requests\n\nurl = '${url}'\nheaders = {\n    'Content-Type': 'application/json',\n    'Accept': 'application/json'`;
                if (lrdDocsItem.requires_auth) {
                    code += `,\n    'Authorization': 'Bearer {token}'`;
                }
                code += `\n}\n\n`;
                if (hasBody && firstExample) {
                    code += `data = ${exampleBody}\n\nresponse = requests.${method.toLowerCase()}(url, headers=headers, json=data)\n`;
                } else {
                    code += `response = requests.${method.toLowerCase()}(url, headers=headers)\n`;
                }
                code += `print(response.json())`;
                break;
        }

        setSnippet(code);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-snippets mt-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-sm text-slate-500">CODE EXAMPLES</h4>
                <button
                    className="btn btn-xs btn-ghost"
                    onClick={copyToClipboard}
                >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
            </div>
            <div className="tabs tabs-boxed mb-2">
                <button
                    className={`tab ${language === 'curl' ? 'tab-active' : ''}`}
                    onClick={() => setLanguage('curl')}
                >
                    cURL
                </button>
                <button
                    className={`tab ${language === 'javascript' ? 'tab-active' : ''}`}
                    onClick={() => setLanguage('javascript')}
                >
                    JavaScript
                </button>
                <button
                    className={`tab ${language === 'php' ? 'tab-active' : ''}`}
                    onClick={() => setLanguage('php')}
                >
                    PHP
                </button>
                <button
                    className={`tab ${language === 'python' ? 'tab-active' : ''}`}
                    onClick={() => setLanguage('python')}
                >
                    Python
                </button>
            </div>
            <pre className="bg-base-200 p-3 rounded text-xs overflow-x-auto">
                <code>{snippet}</code>
            </pre>
        </div>
    );
}
