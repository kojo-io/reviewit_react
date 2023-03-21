import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../components/store/auth-provider";
import {ContextInterface} from "../../components/models/context-interface";
import {User} from "../../components/models/User";
import {MessageProps, PiMessage} from "../../components/shared/pi-message";
import {environment} from "../../components/shared/environment";
import {ApiResponse} from "../../components/models/ApiResponse";
import {LoginResponseModel} from "../../components/models/LoginResponseModel";
import {BaseService} from "../../components/shared/base.service";
import {Account} from "../../components/shared/account";
import PiImagePicker from "../../components/shared/pi-image-picker";
import PiInput from "../../components/shared/pi-input";
import {PiButton} from "../../components/shared/pi-button";

export default function ChangeEmail() {
    const context = useContext(AuthContext);
    const invalidDefault = { invalidEmail: false};
    const [inValidForm, setInValidForm] = useState(invalidDefault);
    const [loading, setLoading] = useState<boolean>(false);

    const getDefault: ContextInterface = {
        canLogout: () => {},
        canLogin: () => {},
        isAuthenticated: false }

    const [auth, setAuth] = useState<ContextInterface>(getDefault);

    const [form, setForm] = useState<User>({ firstName: '', image: '', id: '', email: '', lastName: ''});
    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }
    const [openDialog, setOpenDialog] = useState(messageDialog);
    const emailInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, email: event}
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

    const loginHandler = async () => {
        if (form.email.length === 0) {
            setInValidForm(prevState => {
                return {...prevState, invalidEmail: true}
            });
            return;
        }
        setLoading(true);
        const url = environment.apiUrl;
        fetch(`${url}Account/ChangeEmail`, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<LoginResponseModel>) => {
                if (result.status === 100) {
                    openMessageHandler({type: "success", message: result.message, open: true});
                    BaseService.setSessionData(result.data);
                    context.canLogin(result.data);
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

    // check token
    useEffect(() => {
        setAuth((prevState) => {
            return {...prevState, user: context.user, accesstoken: context.accesstoken }
        });
    }, [context]);

    // update auth value
    useEffect(() => {
        if (auth.accesstoken?.token) {
            setForm((prevState: any) => {
                return {...prevState, lastName: context.user?.lastName, firstName: context.user?.firstName, image: context.user?.image, email: context.user?.email}
            })
        }
    }, [auth]);
    return (
        <Account>
            {
                openDialog.open && <PiMessage onClose={closeMessageHandler} message={openDialog.message} type={openDialog.type}/>
            }
            <div className={'w-full p-4'}>
                <label className={'text-2xl font-bold'}>Change your email</label>
                <div className={'w-full p-4 mt-5'}>
                    <div>
                        <PiInput
                            rounded={'rounded'}
                            name={'Email'}
                            invalid={inValidForm.invalidEmail}
                            label={'Enter your new email'}
                            value={form.email}
                            onChange={emailInputOnChange}
                            required={true}
                            type={'text'}
                            placeholder={'Your email'} id={'email'}/>
                    </div>
                    <div className={'pt-4'}>
                        <PiButton loading={loading} type={'primary'} size={'large'} rounded={'rounded'} onClick={loginHandler}>
                            Submit
                        </PiButton>
                    </div>
                </div>
            </div>
        </Account>
    )
}