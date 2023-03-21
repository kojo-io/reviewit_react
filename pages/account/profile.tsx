import {Account} from "../../components/shared/account";
import {environment} from "../../components/shared/environment";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../components/store/auth-provider";
import {ContextInterface} from "../../components/models/context-interface";
import PiInput from "../../components/shared/pi-input";
import {User} from "../../components/models/User";
import PiImagePicker from "../../components/shared/pi-image-picker";
import {PiButton} from "../../components/shared/pi-button";
import {ApiResponse} from "../../components/models/ApiResponse";
import {LoginResponseModel} from "../../components/models/LoginResponseModel";
import {BaseService} from "../../components/shared/base.service";
import {MessageProps, PiMessage} from "../../components/shared/pi-message";

export default function Profile() {
    const context = useContext(AuthContext);
    const invalidDefault = { invalidFirstName: false, invalidLastName: false};
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
    const firstNameInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, firstName: event}
        });
    }

    const lastNameInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, lastName: event}
        });
    }

    const getFiles = (images: Array<any>) => {
        if (images.length > 0) {
            setForm((prevState) => {
                return {...prevState, image: images.map(image => image.file)[0]}
            });
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

    const loginHandler = async () => {
        let errorCount = 0;
        if (form.firstName.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidFirstName: true}
            });
        }
        if (form.lastName.length === 0) {
            errorCount ++;
            setInValidForm(prevState => {
                return {...prevState, invalidLastName: true}
            });
        }
        if (errorCount > 0) {
            return;
        }
        setLoading(true);
        const url = environment.apiUrl;
        fetch(`${url}Account/UpdateProfile`, {
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
                return {...prevState, lastName: context.user?.lastName, firstName: context.user?.firstName, image: context.user?.image}
            })
        }
    }, [auth]);

    return (
        <Account>
            {
                openDialog.open && <PiMessage onClose={closeMessageHandler} message={openDialog.message} type={openDialog.type}/>
            }
            <div className={'w-full p-4'}>
                <label className={'text-2xl font-bold'}>Update your info</label>
                <div className={'flex w-full justify-center'}>
                    <div className={'w-[100px] h-[100px] rounded-full bg-center bg-cover bg-no-repeat border dark:border-gray-700 overflow-hidden relative'} style={{backgroundImage: `url(${form.image ?? `/user.png`})`}}>
                        <div className={'absolute bottom-0 left-0 right-0 h-8 bg-gray-800/70 flex items-center justify-center py-2'}>
                            <PiImagePicker id={'image-picker'} icon={'pi pi-pencil'} onImageAdded={getFiles} type={'single'} files={[`${form.image}`]} simple={true}/>
                        </div>
                    </div>
                </div>
                <div className={'w-full p-4'}>
                    <div>
                        <PiInput
                            rounded={'rounded'}
                            name={'Firstname'}
                            invalid={inValidForm.invalidFirstName}
                            label={'Enter your firstname'}
                            value={form.firstName}
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
                            value={form.lastName}
                            onChange={lastNameInputOnChange}
                            required={true}
                            type={'text'}
                            placeholder={'Your lastname'} id={'lastname'}/>
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