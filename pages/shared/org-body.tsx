import {useContext, useEffect, useState} from "react";
import 'primeicons/primeicons.css';
import {BaseService} from "./base.service";
import Head from "next/head";
import {useRouter} from "next/router";
import {AuthContext} from "../store/auth-provider";


export const OrgBody = (props: any) => {
    const context = useContext(AuthContext);
    const [collapse, setCollapse] = useState<boolean>(true);

    const collapseMenu = () => {
        setCollapse(!collapse);
    }

    useEffect(() => {

    }, [context]);

    return (
        <>
            <Head>
                <title>Review It</title>
                <meta name="description" content="Powered by Tollesoft" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="h-screen w-screen bg-gray-100 dark:bg-gray-800/30">
                <div className="flex flex-col h-full w-full">
                    <div className="h-[95px] border bg-white dark:bg-gray-800 dark:border-gray-800/30 w-full px-5">
                        <div className="lg:block max-lg:hidden w-full h-full">
                            <div className="w-full h-full flex justify-between">
                                <div className="h-full flex space-x-5">
                                    <h1 className="h-full flex flex-wrap content-center text-2xl font-bold uppercase leading-3 text-gray-600 dark:text-white">
                                        {context?.user?.organization.name}
                                    </h1>
                                </div>

                                <div className="h-full flex space-x-3 text-gray-600 dark:text-white">
                                    <a href={'/organisation/org-dashboard'} className="h-full block flex cursor-pointer items-center hover:border-b-[3px] hover:border-blue-500 px-2" >
                                        <span className="leading-3 cursor-pointer">Dashboard</span>
                                    </a>
                                    <a href={'/organisation/org-review-items'} className="h-full block flex cursor-pointer items-center hover:border-b-[3px] hover:border-blue-500 px-2" >
                                        <span className="leading-3 cursor-pointer">Review Items</span>
                                    </a>
                                </div>

                                <div className="h-full flex space-x-3">
                                    <div className="flex flex-wrap content-center">
                                        <div
                                            className="flex justify-between border border-gray-300 dark:border-white px-2 py-1.5 items-center rounded-xl text-gray-300 dark:text-white w-[150px]">
                                            <label className="leading-3">Search</label>
                                            <i className="pi pi-search"></i>
                                        </div>
                                    </div>
                                    <div className="h-full flex flex-wrap content-center">
                                        <img src={context?.user?.image ?? `/user.png`} className={'block border w-[45px] h-[45px] p-1 rounded-full'}/>
                                    </div>
                                    <h1 onClick={context.canLogout} className={'h-full flex flex-wrap content-center text-base font-bold uppercase leading-3 cursor-pointer text-gray-600 dark:text-white'}>
                                        {context?.user?.firstName} {context?.user?.lastName}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden w-full h-full">
                            <div className="w-full h-full flex items-center">
                                <i className="pi pi-bars text-lg cursor-pointer" onClick={collapseMenu}></i>
                            </div>
                        </div>
                    </div>

                    <div className="grow h-full overflow-auto">
                        {props.children}
                    </div>
                </div>
            </div>

            {/*collapse menu*/}
            {
                !collapse &&
                <div className={'fixed inset-0 bg-gray-900/30 lg:hidden'}>
                    <div className="flex flex-col h-full w-[300px] bg-white dark:bg-gray-800 ">
                        <div className="h-auto w-full">
                            <div className="flex space-x-2 items-center px-2 py-4">
                                <h1 className="text-2xl font-bold uppercase leading-3 text-gray-600 dark:text-white w-full">
                                    {context?.user?.organization.name}
                                </h1>
                                <i className={'pi pi-times text-lg cursor-pointer'} onClick={collapseMenu}></i>
                            </div>
                            <div className="p-2">
                                <div
                                    className="flex justify-between border border-gray-300 px-2 py-1.5 items-center rounded-xl text-gray-300 w-full">
                                    <label className="leading-3">Search</label>
                                    <i className="pi pi-search"></i>
                                </div>
                            </div>
                        </div>

                        <div className="grow h-full">
                            <div className="text-gray-600 dark:text-white w-full pl-2">
                                <a className="block w-full cursor-pointer hover:border-r-[3px] hover:border-blue-500 py-2"
                                   href={'/organisation/org-dashboard'}>
                                    <span className="leading-3 cursor-pointer">Dashboard</span>
                                </a>
                                <a className="block w-full cursor-pointer hover:border-r-[3px] hover:border-blue-500 py-2"
                                   href={'/organisation/org-review-items'}>
                                    <span className="leading-3 cursor-pointer">Review Items</span>
                                </a>
                            </div>
                        </div>

                        <div className="flex space-x-2 p-2">
                            <div className="h-full flex flex-wrap content-center">
                                <img src={context?.user?.image ?? `/user.png`} className={'block border w-[45px] h-[45px] p-1 rounded-full'} alt={'user.png'}/>
                            </div>
                            <h1 className="h-full flex flex-wrap content-center text-base font-bold uppercase leading-3 cursor-pointer text-gray-600 dark:text-white">
                                {context?.user?.firstName} {context?.user?.lastName}
                            </h1>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}