import Head from 'next/head'
import {PiButton} from "./shared/pi-button";
import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";
import PiInput from "./shared/pi-input";
import {ApiResponse} from "./models/ApiResponse";
import {LoginResponseModel} from "./models/LoginResponseModel";
import {MessageProps, PiMessage} from "./shared/pi-message";
import {environment} from "./shared/environment";
import {BaseService} from "./shared/base.service";
import {PiLoading} from "./shared/pi-loading";

export default function Home() {
    const router = useRouter();
    const [loginForm, setLoginValues] = useState({userName: '', password: ''});
    const [loading, setLoading] = useState<boolean>(false);
    const [inValidEmail, setInValidEmail] = useState<boolean>(false);
    const [inValidPassword, setInValidPassword] = useState<boolean>(false);


    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }
    const [openDialog, setOpenDialog] = useState(messageDialog);

    const loginHandler = async () => {
        setLoading(true);
        let errorCount = 0;
        if (!loginForm.userName) {
            errorCount ++;
            setInValidEmail(true);
        }
        if (!loginForm.password) {
            errorCount ++;
            setInValidPassword(true);
        }
        if (errorCount > 0) {
            return;
        }
        const url = environment.apiUrl;
        fetch(`${url}Account/AccountLogin`, {
            method: 'POST',
            body: JSON.stringify(loginForm),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<LoginResponseModel>) => {
                if (result.status === 100) {
                    // openMessageHandler({type: "success", message: result.message, open: true});
                    BaseService.setSessionData(result.data);
                    if (result.data.user?.role?.name === 'ORGANISATION') {
                        router.push('/organization/org-review-items').then();
                    }
                    if (result.data.user?.role?.name.toUpperCase() === 'SYSTEM ADMINISTRATOR') {
                        router.push('/admin/organizations').then();
                    }
                } else {
                    openMessageHandler({type: "error", message: result.message, open: true});
                }
            }).catch((e) => {
                openMessageHandler({type: "error", message: e.statusMessage, open: true});
            }).finally(() => setLoading(false))
        });
    }

    const emailInputOnChange = (event: any) => {
        setLoginValues((prevState) => {
            return {...prevState, userName: event}
        });
    }

    const openMessageHandler = (options: MessageProps) => {
        setOpenDialog((prevState) => {
            return {...prevState, open: options.open, message: options.message, type: options.type }
        });
    }

    const closeMessageHandler = () => {
        setOpenDialog((prevState) => {
            return {...prevState, open: false }
        });
    }

    const passwordInputOnChange = (event: any) => {
        setLoginValues((prevState) => {
            return {...prevState, password: event}
        });
    }

    return (
        <>
            <Head>
                <title>Review It</title>
                <meta name="description" content="Powered by Tollesoft" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                openDialog.open && <PiMessage onClose={closeMessageHandler} message={openDialog.message} type={openDialog.type}/>
            }
            <div className={'h-screen w-screen'}>
                <div className={'flex flex-col w-full h-full overflow-auto'}>
                    <div className={'grid md:grid-cols-1 lg:grid-cols-2 h-full'}>
                        <div className={'col-start-1 col-span-1 bg-slate-100 dark:bg-gray-800/30 h-full'}>
                            <div className={'flex flex-wrap content-center justify-center h-full w-full'}>
                                <div className={'w-5/6 lg:w-4/6 xl:w-3/6 2xl:2/6'}>
                                    <div className={'p-4'}>
                                        <div className={'space-y-4 z-0'}></div>
                                        <form className={'space-y-4'}>
                                            <h1 className={'font-bold text-xl'}>Sign in with your email</h1>
                                            <div>
                                                <PiInput
                                                    name={'Email'}
                                                    invalid={inValidEmail}
                                                    label={'Enter your email'}
                                                    value={loginForm.userName}
                                                    onChange={emailInputOnChange}
                                                    required={true}
                                                    type={'email'}
                                                    placeholder={'Your email'} id={'email'}/>
                                            </div>
                                            <div>
                                                <PiInput
                                                    name={'Password'}
                                                    invalid={inValidPassword}
                                                    label={'Enter your password'}
                                                    required={true}
                                                    value={loginForm.password}
                                                    onChange={passwordInputOnChange}
                                                    type={'password'}
                                                    placeholder={'Your password'} id={'password'}/>
                                            </div>
                                            <div>
                                                <PiButton loading={loading} type={'primary'} size={'normal'} rounded={'rounded'} onClick={loginHandler}>
                                                    Submit
                                                </PiButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-auto'}>
                            <div className={'flex flex-wrap content-center justify-center h-full w-full'}>
                                <div className={'space-y-2'}>
                                    <label className={'text-blue-600 text-6xl block font-light'}>
                                        review.it
                                    </label>
                                    <h1 className={'font-bold flex justify-end space-x-2'}>
                                        <span>Powered by</span>
                                        <img src="/tollesoft.png" className={'w-24 h-[18px]'} alt={'tollesoft.png'}/>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
