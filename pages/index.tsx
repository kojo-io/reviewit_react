import Head from 'next/head'
import {PiButton} from "./shared/pi-button";
import {useRouter} from "next/router";
import {useState} from "react";
import PiInput from "./shared/pi-input";

export default function Home() {
    const router = useRouter();
    const [loginForm, setLoginValues] = useState({email: '', password: ''});

    const routeToOrganizationDashboard = () => {
        router.push('/organisation/org-dashboard');
    }

    const emailInputOnChange = (event: any) => {
        setLoginValues((prevState) => {
            return {...prevState, email: event.target.value}
        });
    }

    const passwordInputOnChange = (event: any) => {
        setLoginValues((prevState) => {
            return {...prevState, password: event.target.value}
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
                                                    label={'Enter your email'}
                                                    value={loginForm.email}
                                                    onChange={emailInputOnChange}
                                                    required={true}
                                                    type={'email'}
                                                    placeholder={'Your email'}>
                                                </PiInput>
                                            </div>
                                            <div>
                                                <PiInput
                                                    label={'Enter your password'}
                                                    required={true}
                                                    value={loginForm.password}
                                                    onChange={passwordInputOnChange}
                                                    type={'password'}
                                                    placeholder={'Your password'}>
                                                </PiInput>
                                            </div>
                                            <div>
                                                <PiButton onClick={routeToOrganizationDashboard}>
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
                                        <img src="/tollesoft.png" className={'w-24 h-[18px]'}  alt={'tollesoft.png'}/>
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
