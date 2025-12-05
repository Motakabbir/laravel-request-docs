import React from 'react';
import type { IEnumValue } from '../libs/types';

interface Props {
    enums: Record<string, IEnumValue>;
}

export default function EnumValuesDisplay({ enums }: Props) {
    if (!enums || Object.keys(enums).length === 0) {
        return null;
    }

    return (
        <div className="enum-values mt-4">
            <h4 className="font-bold text-sm text-slate-500 mb-2">ALLOWED VALUES</h4>
            {Object.values(enums).map((enumVal) => (
                <div key={enumVal.field} className="mb-3">
                    <p className="text-sm font-semibold mb-1">{enumVal.field}:</p>
                    <div className="flex flex-wrap gap-2 mb-1">
                        {enumVal.values.map((val) => (
                            <span key={val} className="badge badge-info badge-sm">
                                {val}
                            </span>
                        ))}
                    </div>
                    {enumVal.description && (
                        <p className="text-xs text-slate-500">{enumVal.description}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
