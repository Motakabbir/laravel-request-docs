import React from 'react';
import type { IErrorSchema } from '../libs/types';

interface Props {
    schemas: IErrorSchema[];
}

export default function ErrorSchemaViewer({ schemas }: Props) {
    if (!schemas || schemas.length === 0) {
        return null;
    }

    return (
        <div className="error-schemas mt-4">
            <h4 className="font-bold text-sm text-slate-500 mb-2">ERROR RESPONSES</h4>
            {schemas.map((schema) => (
                <div key={schema.status_code} className="mb-3 border border-error rounded p-3 bg-error bg-opacity-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-error">
                            {schema.status_code}
                        </span>
                        <span className="text-sm font-semibold">{schema.description}</span>
                    </div>
                    <pre className="bg-base-200 p-3 rounded text-xs overflow-x-auto">
                        <code>{JSON.stringify(schema.schema, null, 2)}</code>
                    </pre>
                </div>
            ))}
        </div>
    );
}
