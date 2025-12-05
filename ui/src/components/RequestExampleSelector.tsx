import React from 'react';
import type { IRequestExample } from '../libs/types';

interface Props {
    examples: Record<string, IRequestExample>;
    onSelectExample: (example: object) => void;
}

export default function RequestExampleSelector({ examples, onSelectExample }: Props) {
    if (!examples || Object.keys(examples).length === 0) {
        return null;
    }

    const exampleArray = Object.values(examples);

    return (
        <div className="example-selector mb-3">
            <label className="label">
                <span className="label-text text-sm">Load Example:</span>
            </label>
            <select
                className="select select-bordered select-sm w-full"
                onChange={(e) => {
                    const index = parseInt(e.target.value);
                    if (!isNaN(index) && exampleArray[index]) {
                        onSelectExample(exampleArray[index].value);
                    }
                }}
                defaultValue=""
            >
                <option value="" disabled>-- Select an example --</option>
                {exampleArray.map((ex, idx) => (
                    <option key={idx} value={idx}>
                        {ex.name} {ex.summary && `- ${ex.summary}`}
                    </option>
                ))}
            </select>
        </div>
    );
}
