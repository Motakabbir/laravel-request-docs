import React, { useState, useEffect } from 'react';
import shortid from 'shortid';
import type { IAPIInfo } from '../libs/types'
import ApiInfoRules from './elements/ApiInfoRules'

interface Props {
    lrdDocsItem: IAPIInfo,
    method: string,
}
export default function ApiInfo(props: Props) {

    const { lrdDocsItem, method } = props

    const [hasFile, setHasFile] = useState(false)
    useEffect(() => {
        //check if lrdDocsItem has rules
        const files: any = []
        for (const [key, rule] of Object.entries(lrdDocsItem.rules)) {
            if (rule.length == 0) {
                continue
            }
            const theRule = rule[0].split("|")
            if (theRule.includes('file') || theRule.includes('image')) {
                files.push(key)
            }
        }
        setHasFile(files.length > 0)
    }, [])

    return (
        <>
            <h2 className='text-lg' id={method + lrdDocsItem.uri}>
                <span className={`badge badge-ghost rounded-none method-${method}`}>{method}</span>
                <span className='pl-5'>{lrdDocsItem.uri}</span>
                {lrdDocsItem.requires_auth && (
                    <span className="badge badge-warning gap-2 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Auth Required
                    </span>
                )}
            </h2>
            <h3 className='pt-4'>
                <span className='text-sm text-slate-500'>REQUEST SCHEMA</span>
                <br />
                <code className='text-xs'>
                    {hasFile ? (
                        'multipart/form-data'
                    ) : (
                        'application/json'
                    )}
                </code>
            </h3>
            {(Object.keys(lrdDocsItem.path_parameters).length > 0) && (
                <>
                    <h3 className='pt-4'>
                        <span className='text-sm text-slate-500'>
                            PATH PARAMETERS
                        </span>
                    </h3>
                    <div className='pt-4'>

                        <table className="table table-fixed table-compact w-full">
                            <tbody>
                                {Object.keys(lrdDocsItem.path_parameters).map((rule) => (
                                    <ApiInfoRules key={shortid.generate()} mainRule={rule} rules={lrdDocsItem.path_parameters[rule]} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>


            )}

            <h3 className='pt-4'>
                <span className='text-sm text-slate-500'>
                    {(method == 'POST' || method == 'PUT' || method == 'PATCH') ? 'REQUEST BODY PARAMETERS' : 'QUERY PARAMETERS'}
                </span>
                {(lrdDocsItem.rules && Object.keys(lrdDocsItem.rules).length == 0) && (
                    <div className='text-sm text-slate-500'>
                        No Rules Defined
                    </div>
                )}
            </h3>
            <div className='pt-4'>

                <table className="table table-fixed table-compact w-full">
                    <tbody>
                        {lrdDocsItem.rules && Object.keys(lrdDocsItem.rules).map((rule) => (
                            <ApiInfoRules key={shortid.generate()} mainRule={rule} rules={lrdDocsItem.rules[rule]} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
