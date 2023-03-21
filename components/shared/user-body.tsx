import React, {useContext, useEffect, useState} from "react";
import 'primeicons/primeicons.css';
import {BaseService} from "./base.service";
import Head from "next/head";
import {useRouter} from "next/router";
import {AuthContext} from "../store/auth-provider";
import {LoginResponseModel} from "../models/LoginResponseModel";
import {PiButton} from "./pi-button";
import {PiIconButton} from "./pi-icon-button";
import {PiModal} from "./pi-modal";
import {CommentForm} from "../forms/comment-form";
import {FilterForm} from "../forms/filter-form";


export const UserBody = (props: any) => {
    const context = useContext(AuthContext);
    const router = useRouter();
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const openFilterHandler = () => {
        setOpenFilter(true);
    }

    const closeFilterHandler = () => {
        setOpenFilter(false);
        props.onModalClose(false);
    }

    useEffect(() => {
    }, [context]);

    useEffect(() => {
        const data = BaseService.getSessionData();
        if (!data) {
            router.push('/');
        } else {
            context.canLogin(data as LoginResponseModel);
        }
    }, []);

    useEffect(() => {
        if (props.closeModal) {
            closeFilterHandler();
        }
    }, [props.closeModal]);


    return (
        <>
            <Head>
                <title>Review It</title>
                <meta name="description" content="Powered by Tollesoft" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                openFilter &&
                <PiModal fullScreen={false} onClose={closeFilterHandler}>
                    <FilterForm onFormSubmit={(e) => {props.onFilterChange(e)}} loading={props.loading} params={props.params} listData={props.organizations}/>
                </PiModal>
            }
            <div className="h-screen w-screen bg-gray-100 dark:bg-gray-800/30">
                <div className="flex flex-col h-full w-full">
                    <div className="h-[95px] border bg-white dark:bg-gray-800 dark:border-gray-900 w-full px-5">
                        <div className="lg:block max-lg:hidden w-full h-full">
                            <div className="w-full h-full flex justify-between">
                                <div className="h-full flex space-x-5">
                                    <h1 className="h-full flex flex-wrap content-center text-2xl font-bold leading-3 text-gray-600 dark:text-white">
                                        Review.it
                                    </h1>
                                </div>

                                <div className="h-full flex space-x-6">
                                    {
                                        props.showSearch &&
                                        <div className="flex flex-wrap content-center">
                                            <div onClick={openFilterHandler}
                                                className="flex justify-between border border-gray-300 dark:border-white px-2 py-1.5 items-center rounded-xl text-gray-300 dark:text-white w-[150px]">
                                                <label className="leading-3">Search</label>
                                                <i className="pi pi-search"></i>
                                            </div>
                                        </div>
                                    }
                                    <a className="h-full flex flex-wrap content-center" href={'/account/profile'}>
                                        <div className={'flex items-center space-x-2'}>
                                            <div className={'w-[45px] h-[45px] rounded-full p-1 bg-center bg-cover bg-no-repeat border dark:border-gray-700 overflow-hidden relative'} style={{backgroundImage: `url(${context?.user?.image ?? `/user.png`})`}}>
                                            </div>
                                            {/*<img src={context?.user?.image ?? `/user.png`} className={'block border w-[45px] h-[45px] p-1 rounded-full'}/>*/}
                                            <span className={'text-base font-bold uppercase leading-3 cursor-pointer text-gray-600 dark:text-white'}>
                                                {context?.user?.firstName} {context?.user?.lastName}
                                            </span>
                                        </div>
                                    </a>
                                    <div className="h-full flex flex-wrap content-center">
                                        <PiButton onClick={context.canLogout} type={'danger'} size={'normal'} rounded={'rounded'}>Log out</PiButton>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden w-full h-full">
                            <div className="h-full flex items-center justify-between">
                                <div className="flex flex-wrap content-center">
                                    <div className={'space-x-4 flex items-center'}>
                                        {
                                            props.showBackButton &&
                                            <PiIconButton onClick={router.back} size={'small'} icon={'pi pi-arrow-left'}/>
                                        }
                                        <h1 className="h-full flex flex-wrap content-center text-base font-bold leading-3 text-gray-600 dark:text-white">
                                            Review.it
                                        </h1>
                                    </div>
                                </div>
                                <div className="h-full flex space-x-3">
                                    {
                                        props.showSearch &&
                                        <div className="flex flex-wrap content-center">
                                            <i className="pi pi-search"></i>
                                        </div>
                                    }
                                    <a href={'/account'} className="h-full flex flex-wrap content-center">
                                        <img src={context?.user?.image ?? `/user.png`} className={'block border w-[45px] h-[45px] p-1 rounded-full'}/>
                                    </a>
                                    <div className="h-full flex flex-wrap content-center">
                                        <PiButton onClick={context.canLogout} type={'danger'} size={'small'} rounded={'rounded'}>Log out</PiButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grow h-full overflow-auto">
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    );
}