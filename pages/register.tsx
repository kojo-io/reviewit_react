import {useRouter} from "next/router";
import React, {useState} from "react";
import {MessageProps, PiMessage} from "./shared/pi-message";
import {environment} from "./shared/environment";
import {ApiResponse} from "./models/ApiResponse";
import {LoginResponseModel} from "./models/LoginResponseModel";
import {BaseService} from "./shared/base.service";
import Head from "next/head";
import {PiIconButton} from "./shared/pi-icon-button";
import PiInput from "./shared/pi-input";
import {PiButton} from "./shared/pi-button";
import {Logo} from "./shared/logo";

export default function Register() {
    const router = useRouter();
    const [registerForm, setRegisterValues] = useState({firstName: '', lastName: '', email: '', password: '', confirmPassword: ''});
    const invalidDefault = { invalidFirstName: false, invalidLastName: false, invalidEmail: false, invalidPassword: false, invalidConfirmPassword: false};
    const [inValidForm, setInValidForm] = useState(invalidDefault);
    const [passwordNotMatching, setPasswordNotMatching] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }
    const [openDialog, setOpenDialog] = useState(messageDialog);

    const backRouteHandler = () => {
        router.back();
    }

    const loginHandler = async () => {
        let errorCount = 0;
        if (registerForm.firstName.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidFirstName: true}
            });
        }
        if (registerForm.lastName.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidLastName: true}
            });
        }
        if (registerForm.email.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidEmail: true}
            });
        }
        if (registerForm.password.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidPassword: true}
            });
        }
        if (registerForm.confirmPassword.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidConfirmPassword: true}
            });
        } else {
            if (registerForm.confirmPassword !== registerForm.password) {
                setPasswordNotMatching(true);
            } else{
                setPasswordNotMatching(false);
            }
        }
        if (errorCount > 0) {
            return;
        }
        setLoading(true);
        const url = environment.apiUrl;
        fetch(`${url}Account/CreateAccount`, {
            method: 'POST',
            body: JSON.stringify(registerForm),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<LoginResponseModel>) => {
                if (result.status === 100) {
                    // openMessageHandler({type: "success", message: result.message, open: true});
                    BaseService.setSessionData(result.data);
                    router.push('/reviews/feed').then();
                } else {
                    openMessageHandler({type: "error", message: result.message, open: true});
                }
            }).catch((e) => {
                openMessageHandler({type: "error", message: e.statusMessage, open: true});
            }).finally(() => setLoading(false))
        }).catch((e) => {
            setLoading(false);
            openMessageHandler({type: "error", message: "An error occurred while trying to complete your request, please try again or contact support.", open: true});
        });
    }

    const emailInputOnChange = (event: any) => {
        setRegisterValues((prevState) => {
            return {...prevState, email: event}
        });
    }

    const firstNameInputOnChange = (event: any) => {
        setRegisterValues((prevState) => {
            return {...prevState, firstName: event}
        });
    }

    const lastNameInputOnChange = (event: any) => {
        setRegisterValues((prevState) => {
            return {...prevState, lastName: event}
        });
    }

    const passwordInputOnChange = (event: any) => {
        setRegisterValues((prevState) => {
            return {...prevState, password: event}
        });
    }

    const confirmPasswordInputOnChange = (event: any) => {
        setRegisterValues((prevState) => {
            return {...prevState, confirmPassword: event}
        });

        if(event !== registerForm.password) {
            setPasswordNotMatching(true);
        } else{
            setPasswordNotMatching(false);
        }
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

    return (
        <>
            <Head>
                <title>Review It | Create Account</title>
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
                                            <PiIconButton onClick={backRouteHandler} icon={'pi pi-arrow-left'} type={'primary'} size={'normal'} outline={true} rounded={'rounded'}/>
                                            <h1 className={'font-bold text-xl'}>Create an account</h1>
                                            <div>
                                                <PiInput
                                                    rounded={'rounded'}
                                                    name={'Firstname'}
                                                    invalid={inValidForm.invalidFirstName}
                                                    label={'Enter your firstname'}
                                                    value={registerForm.firstName}
                                                    onChange={firstNameInputOnChange}
                                                    required={true}
                                                    type={'text'}
                                                    placeholder={'Your firstname'} id={'firstname'}/>
                                            </div>
                                            <div>
                                                <PiInput
                                                    rounded={'rounded'}
                                                    name={'Lastname'}
                                                    invalid={inValidForm.invalidLastName}
                                                    label={'Enter your lastname'}
                                                    value={registerForm.lastName}
                                                    onChange={lastNameInputOnChange}
                                                    required={true}
                                                    type={'text'}
                                                    placeholder={'Your lastname'} id={'lastname'}/>
                                            </div>
                                            <div>
                                                <PiInput
                                                    rounded={'rounded'}
                                                    name={'Email'}
                                                    invalid={inValidForm.invalidEmail}
                                                    label={'Enter your email'}
                                                    value={registerForm.email}
                                                    onChange={emailInputOnChange}
                                                    required={true}
                                                    type={'email'}
                                                    placeholder={'Your email'} id={'email'}/>
                                            </div>
                                            <div>
                                                <PiInput
                                                    rounded={'rounded'}
                                                    name={'Password'}
                                                    invalid={inValidForm.invalidPassword}
                                                    label={'Enter your password'}
                                                    required={true}
                                                    value={registerForm.password}
                                                    onChange={passwordInputOnChange}
                                                    type={'password'}
                                                    placeholder={'Your password'} id={'password'}/>
                                            </div>
                                            <div>
                                                <PiInput
                                                    rounded={'rounded'}
                                                    name={'Confirm password'}
                                                    invalid={inValidForm.invalidConfirmPassword}
                                                    label={'Enter your password confirmation'}
                                                    required={true}
                                                    value={registerForm.confirmPassword}
                                                    onChange={confirmPasswordInputOnChange}
                                                    type={'password'}
                                                    placeholder={'Confirm password'} id={'confirmpassword'}/>
                                                {
                                                    passwordNotMatching &&
                                                    <small className={'text-red-600'}>Confirmation password is not the same as password.</small>
                                                }
                                            </div>
                                            <div className={'pt-4'}>
                                                <PiButton loading={loading} block={true} type={'primary'} size={'large'} rounded={'rounded'} onClick={loginHandler}>
                                                    Submit
                                                </PiButton>
                                            </div>
                                            <div className={'pt-4 text-center'}>
                                                <span>{"Already have an account?"} <a className={'font-bold'} href={'/sign-in'}>Sign in to continue</a></span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-auto'}>
                            <div className={'flex flex-wrap content-center justify-center h-full w-full'}>
                                <Logo/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}