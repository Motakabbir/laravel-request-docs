import React, { useEffect, useState } from 'react';

import useLocalStorage from 'react-use-localstorage';
import {
    MagnifyingGlassIcon,
    Cog6ToothIcon,
    ArrowUpRightIcon,
    MoonIcon,
    SunIcon,
    XMarkIcon,
    Bars3BottomLeftIcon,
    RectangleGroupIcon,
    FunnelIcon,
    CircleStackIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { useAuth } from './AuthContext';
import AuthSettings from './AuthSettings';

interface Props {
    handleChangeSettings: (
        showGet: string,
        showPost: string,
        showDelete: string,
        showPut: string,
        showPatch: string,
        showHead: string,
        sort: string,
        groupby: string) => void
    handleSearch: (search: string) => void
}
export default function TopNav(props: Props) {

    const { handleChangeSettings, handleSearch } = props
    const { authState } = useAuth();
    const [showAuthSettings, setShowAuthSettings] = useState(false);
    const [theme, setTheme] = useLocalStorage('theme', '');
    const [sort, setSort] = useLocalStorage('sort', 'default');
    const [groupby, setGroupby] = useLocalStorage('groupby', 'default');
    const [showGet, setShowGet] = useLocalStorage('showGet', 'true');
    const [showPost, setShowPost] = useLocalStorage('showPost', 'true');
    const [showDelete, setShowDelete] = useLocalStorage('showDelete', 'true');
    const [showPut, setShowPut] = useLocalStorage('showPut', 'true');
    const [showPatch, setShowPatch] = useLocalStorage('showPatch', 'true');
    const [showHead, setShowHead] = useLocalStorage('showHead', 'false');
    const [savePreviousResponse, setSavePreviousResponse] = useLocalStorage('savePreviousResponse', 'false');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleChangeGroupby = (e: any) => {
        setGroupby(e.target.value)
        handleChangeSettings(showGet, showPost, showDelete, showPut, showPatch, showHead, sort, e.target.value)
    }
    const handleChangeSort = (e: any) => {
        setSort(e.target.value)
        handleChangeSettings(showGet, showPost, showDelete, showPut, showPatch, showHead, e.target.value, groupby)
    }
    const handleChangeGet = (e: any) => {
        setShowGet(e.target.checked)
        handleChangeSettings(e.target.checked, showPost, showDelete, showPut, showPatch, showHead, sort, groupby)
    }
    const handleChangePost = (e: any) => {
        setShowPost(e.target.checked)
        handleChangeSettings(showGet, e.target.checked, showDelete, showPut, showPatch, showHead, sort, groupby)
    }
    const handleChangeDelete = (e: any) => {
        setShowDelete(e.target.checked)
        handleChangeSettings(showGet, showPost, e.target.checked, showPut, showPatch, showHead, sort, groupby)
    }
    const handleChangePut = (e: any) => {
        setShowPut(e.target.checked)
        handleChangeSettings(showGet, showPost, showDelete, e.target.checked, showPatch, showHead, sort, groupby)
    }
    const handleChangePatch = (e: any) => {
        setShowPatch(e.target.checked)
        handleChangeSettings(showGet, showPost, showDelete, showPut, e.target.checked, showHead, sort, groupby)
    }
    const handleChangeHead = (e: any) => {
        setShowHead(e.target.checked)
        handleChangeSettings(showGet, showPost, showDelete, showPut, showPatch, e.target.checked, sort, groupby)
    }
    const handleSavePreviousResponse = (e: any) => {
        setSavePreviousResponse(e.target.checked)
    }

    const handleClearLocalStorage = () => {
        localStorage.clear()
        window.location.reload()
    }


    const toggleDarkMode = () => {
        const dataTheme = document.documentElement.getAttribute('data-theme');
        if (dataTheme === 'dark') {
            setTheme('light')
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            setTheme('dark')
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    useEffect(() => {
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
            return
        }
        const dataTheme = document.documentElement.getAttribute('data-theme');
        if (!dataTheme) {
            // check if dark mode is enabled for browser
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
        document.documentElement.setAttribute('data-theme', 'light');
    }, [])

    return (
        <header className="relative bg-none">
            <div className="navbar bg-base-200">
                <div className="flex-1">
                    <div className="normal-case text-xl">
                        <span className="pl-2">
                            <span className='title'>Laravel Request Docs</span>
                            <sup className='pl-2'>
                                <small>
                                    <a className="link link-info" href={`https://github.com/rakutentech/laravel-request-docs/releases/tag/${import.meta.env.PUBLIC_VERSION}`} target="_blank" rel="noreferrer">
                                        version {import.meta.env.PUBLIC_VERSION}
                                    </a>
                                </small>
                            </sup>
                        </span>
                    </div>
                </div>
                <div className="flex-none">
                    <div className="form-control">
                        <label htmlFor="search" className="relative text-gray-400 focus-within:text-gray-600 block">
                            <MagnifyingGlassIcon className="pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3" />
                            <input type="text" placeholder="Filter APIs" className="input pl-10 input-sm input-bordered" onChange={(e) => handleSearch(e.target.value)} />
                        </label>

                    </div>

                    {/* Auth Status Indicator */}
                    <div className="mr-4">
                        {authState.isAuthenticated ? (
                            <span className="badge badge-success gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                Authenticated
                            </span>
                        ) : (
                            <span className="badge badge-ghost gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Not Authenticated
                            </span>
                        )}
                    </div>

                    {/* Auth Settings Button */}
                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setShowAuthSettings(true)}
                        title="Authentication Settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    <div className="menu menu-horizontal px-6 ">
                        <label className="swap swap-rotate">
                            <input type="checkbox" onChange={toggleDarkMode} />
                            {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                        </label>
                    </div>
                    <div className="ml-1">
                        <a href="#modal-settings" className="btn btn-ghost btn-sm">
                            <span className="pr-1">
                                <Cog6ToothIcon className="h-6 w-6" />
                            </span>
                        </a>
                        <div className="modal" id="modal-settings">
                            <div className="modal-box">
                                <div className="modal-action float-right">
                                    <a href="#" className="btn btn-sm btn-ghost">
                                        <span className='text-error'> <XMarkIcon className="h-6 w-6 inline" /> Close</span>
                                    </a>
                                </div>
                                <h3 className="font-bold text-lg mt-7">
                                    <Cog6ToothIcon className="inline-block h-6 w-6 mr-1" />
                                    Settings
                                </h3>
                                <div className='divider'></div>
                                <h4 className="font-bold mt-10">
                                    <Bars3BottomLeftIcon className="inline-block h-6 w-6 mr-1" />
                                    Sort By
                                </h4>
                                <div className='divider'></div>
                                <div className="form-control">
                                    <label className="label">

                                        <input type="radio" onChange={handleChangeSort} value="default" className="radio" checked={sort == "default"} />
                                        <span className="label-text">Default</span>

                                        <input type="radio" onChange={handleChangeSort} value="route_names" className="radio" checked={sort == "route_names"} />
                                        <span className="label-text">Route Names</span>

                                        <input type="radio" onChange={handleChangeSort} value="method_names" className="radio" checked={sort == "method_names"} />
                                        <span className="label-text">HTTP Methods</span>
                                    </label>
                                </div>
                                <h4 className="font-bold mt-10">
                                    <RectangleGroupIcon className="inline-block h-6 w-6 mr-1" />
                                    Group By
                                </h4>
                                <div className='divider'></div>
                                <div className="form-control">
                                    <label className="label">

                                        <input type="radio" onChange={handleChangeGroupby} value="default" className="radio" checked={groupby == "default"} />
                                        <span className="label-text">Default</span>

                                        <input type="radio" onChange={handleChangeGroupby} value="api_uri" className="radio" checked={groupby == "api_uri"} />
                                        <span className="label-text">API Name</span>

                                        <input type="radio" onChange={handleChangeGroupby} value="controller_full_path" className="radio" checked={groupby == "controller_full_path"} />
                                        <span className="label-text">Controller Name</span>
                                    </label>
                                </div>
                                <h4 className="font-bold mt-10">
                                    <FunnelIcon className="inline-block h-6 w-6 mr-1" />
                                    Filter Settings
                                </h4>
                                <div className='divider'></div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">GET</span>
                                        <input type="checkbox" onChange={handleChangeGet} className="toggle toggle-success" checked={showGet == 'true'} />
                                    </label>
                                    <label className="label">
                                        <span className="label-text">POST</span>
                                        <input type="checkbox" onChange={handleChangePost} className="toggle toggle-success" checked={showPost == 'true'} />
                                    </label>
                                    <label className="label">
                                        <span className="label-text">DELETE</span>
                                        <input type="checkbox" onChange={handleChangeDelete} className="toggle toggle-success" checked={showDelete == 'true'} />
                                    </label>
                                    <label className="label">
                                        <span className="label-text">PUT</span>
                                        <input type="checkbox" onChange={handleChangePut} className="toggle toggle-success" checked={showPut == 'true'} />
                                    </label>
                                    <label className="label">
                                        <span className="label-text">PATCH</span>
                                        <input type="checkbox" onChange={handleChangePatch} className="toggle toggle-success" checked={showPatch == 'true'} />
                                    </label>
                                    <label className="label">
                                        <span className="label-text">HEAD</span>
                                        <input type="checkbox" onChange={handleChangeHead} className="toggle toggle-success" checked={showHead == 'true'} />
                                    </label>
                                </div>
                                <h4 className="font-bold mt-10">
                                    <CircleStackIcon className="inline-block h-6 w-6 mr-1" />
                                    Save Responses
                                </h4>
                                <div className='divider'></div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Save</span>
                                        <input type="checkbox" onChange={handleSavePreviousResponse} className="toggle toggle-success" checked={savePreviousResponse == 'true'} />
                                    </label>
                                    <small className='pl-1'>Should you want to save previous response on local storage</small>
                                </div>
                                <h4 className="font-bold mt-10">
                                    <CircleStackIcon className="inline-block h-6 w-6 mr-1" />
                                    Storage
                                </h4>
                                <div className='divider'></div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Clear localstorage
                                            <p><small>Delete localstorage data, request body and queries</small></p>
                                        </span>
                                        <button className="btn btn-sm btn-error" onClick={handleClearLocalStorage}>Clear</button>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ml-1 ">
                        <a className="btn btn-ghost btn-sm" href='/request-docs/api?openapi=true' target="_blank">
                            <span className="pr-1">
                                <ArrowUpRightIcon className="h-6 w-6" />
                            </span>
                            OpenAPI 3.0
                        </a>
                    </div>
                    <div className="ml-1 ">
                        <a className="btn btn-ghost btn-sm" href='https://github.com/rakutentech/laravel-request-docs/issues/new' target="_blank" rel="noreferrer">
                            <span className="pr-1">
                                <ChatBubbleLeftIcon className="h-6 w-6" />
                            </span>
                            Feature request
                        </a>
                    </div>
                </div>
            </div>

            {/* Auth Settings Modal */}
            {showAuthSettings && (
                <AuthSettings onClose={() => setShowAuthSettings(false)} />
            )}
        </header>
    )

}

