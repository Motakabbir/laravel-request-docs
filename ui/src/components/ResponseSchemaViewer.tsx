import React from 'react';
import type { IResponseSchema } from '../libs/types';

interface Props {
    schemas: IResponseSchema[];
}

export default function ResponseSchemaViewer({ schemas }: Props) {
    if (!schemas || schemas.length === 0) {
        return null;
    }

    return (
        <div className="response-schemas mt-4">
            <h4 className="font-bold text-sm text-slate-500 mb-2">RESPONSE SCHEMAS</h4>
            {schemas.map((schema) => (
                <div key={schema.status_code} className="mb-4 border border-base-300 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`badge ${schema.status_code >= 200 && schema.status_code < 300
                                ? 'badge-success'
                                : schema.status_code >= 400
                                    ? 'badge-error'
                                    : 'badge-info'
                            }`}>
                            {schema.status_code}
                        </span>
                        <span className="text-sm font-semibold">{schema.description}</span>
                    </div>
                    <pre className="bg-base-200 p-3 rounded text-xs overflow-x-auto">
                        <code>{JSON.stringify(schema.schema, null, 2)}</code>
                    </pre>
                    {schema.examples && Object.keys(schema.examples).length > 0 && (
                        <div className="mt-2">
                            <p className="text-xs text-slate-500 mb-1">Examples:</p>
                            {Object.entries(schema.examples).map(([name, example]) => (
                                <div key={name} className="ml-2 mb-2">
                                    <p className="text-xs font-semibold">{name}</p>
                                    <pre className="bg-base-300 p-2 rounded text-xs overflow-x-auto">
                                        <code>{JSON.stringify(example, null, 2)}</code>
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
