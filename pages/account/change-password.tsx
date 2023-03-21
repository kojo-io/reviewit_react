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

export default function ChangePassword() {
    const context = useContext(AuthContext);
    const invalidDefault = { invalidOldPass: false, invalidNewPass: false};
    const [inValidForm, setInValidForm] = useState(invalidDefault);
    const [loading, setLoading] = useState<boolean>(false);

    const getDefault: ContextInterface = {
        canLogout: () => {},
        canLogin: () => {},
        isAuthenticated: false }

    const [auth, setAuth] = useState<ContextInterface>(getDefault);

    const [form, setForm] = useState<{oldPassword: string, newPassword: string}>({ oldPassword: '', newPassword: ''});
    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }
    const [openDialog, setOpenDialog] = useState(messageDialog);
    const oldPasswordInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, oldPassword: event}
        });
    }

    const newPasswordInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, newPassword: event}
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
        let errorCount = 0;
        if (form.oldPassword.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidOldPass: true}
            });
        }
        if (form.newPassword.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidNewPass: true}
            });
        }
        if (errorCount > 0) {
            return;
        }
        setLoading(true);
        const url = environment.apiUrl;
        fetch(`${url}Account/ChangePassword`, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                console.log(result)
                if (result.status === 100) {
                    console.log(result.message);
                    openMessageHandler({type: "success", message: result.message, open: true});
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

    return (
        <Account>
            {
                openDialog.open && <PiMessage onClose={closeMessageHandler} message={openDialog.message} type={openDialog.type}/>
            }
            <div className={'w-full p-4'}>
                <label className={'text-2xl font-bold'}>Change your password</label>
                <div className={'w-full p-4 mt-5 space-y-3'}>
                    <div>
                        <PiInput
                            rounded={'rounded'}
                            name={'Old password'}
                            invalid={inValidForm.invalidOldPass}
                            label={'Enter your old password'}
                            value={form.oldPassword}
                            onChange={oldPasswordInputOnChange}
                            required={true}
                            type={'password'}
                            placeholder={'Your old password'} id={'oldpassword'}/>
                    </div>
                    <div>
                        <PiInput
                            rounded={'rounded'}
                            name={'New password'}
                            invalid={inValidForm.invalidNewPass}
                            label={'Enter your new password'}
                            value={form.newPassword}
                            onChange={newPasswordInputOnChange}
                            required={true}
                            type={'password'}
                            placeholder={'Your new password'} id={'newpassword'}/>
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