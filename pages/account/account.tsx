import {UserBody} from "../shared/user-body";
import React from "react";
import {useRouter} from "next/router";

export const Account = (props: any) => {
    const router = useRouter();

    return (
        <UserBody>
            <div className="flex flex-col w-full h-full">
                <div className="flex justify-center w-full h-full">
                    <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">

                        <div className="grid lg:grid-cols-7 gap-4 h-full relative w-full py-4 px-2">

                            <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden max-lg:px-2'}>
                                <div className={'w-full sticky top-2 space-y-2'}>
                                    <div className={'flex space-x-4 p-4 bg-white items-center w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl cursor-pointer'} onClick={router.back}>
                                        <i className={'pi pi-arrow-left text-2xl cursor-pointer'}></i>
                                        <label className={'block text-lg cursor-pointer'}>Back</label>
                                    </div>
                                    <a className={'flex space-x-4 p-4 bg-white items-center w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl'} href={'/account/profile'}>
                                        <i className={'pi pi-user-edit text-2xl'}></i>
                                        <label className={'block text-lg cursor-pointer'}>Profile</label>
                                    </a>
                                    <a className={'flex space-x-4 p-4 bg-white items-center w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl'} href={'/account/change-email'}>
                                        <i className={'pi pi-envelope text-2xl'}></i>
                                        <label className={'block text-lg cursor-pointer'}>Change Email</label>
                                    </a>
                                    <a className={'flex space-x-4 p-4 bg-white items-center w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl'} href={'/account/change-password'}>
                                        <i className={'pi pi-lock text-2xl'}></i>
                                        <label className={'block text-lg cursor-pointer'}>Change Password</label>
                                    </a>
                                </div>
                            </div>

                            {/*review feed start*/}
                            <div className="grow h-full lg:columns-3 lg:col-span-5 flex pb-4 overflow-auto feed" id={'list-review-items'}>
                                <div className={'h-full flex flex-col w-full'}>
                                    <div className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full'}>
                                        {props.children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserBody>
    )

}