import React, { useEffect, useState} from "react";
import PiInput from "../shared/pi-input";
import {PiButton} from "../shared/pi-button";;
import {User} from "../models/User";

interface Props {
    editState: boolean;
    formData: User;
    image?: any;
    onFormSubmit: (value: User, editState: boolean) => void;
    loading: boolean;
}

export const OrganizationUserForm  = (props: Props) => {
    const [form, setForm] = useState<User>(props.formData);

    const [inValidFirstName, setInValidFirstName] = useState<boolean>(false);
    const [inValidLastName, setInValidLastName] = useState<boolean>(false);
    const [inValidEmail, setInValidEmail] = useState<boolean>(false);

    const emailInputOnChange = (data: any) => {
        setForm((prevState) => {
            return {...prevState, email: data};
        })
    }

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

    const onSubmitHandler = (event?: any) => {
        event.preventDefault();
        let errorCount = 0;
        if (form.firstName .length === 0) {
            errorCount ++;
            setInValidFirstName(true);
        }
        if (form.lastName.length === 0 ) {
            errorCount ++;
            setInValidLastName(true);
        }
        if (form.email.length === 0 ) {
            errorCount ++;
            setInValidEmail(true);
        }
        // if (form.image.length === 0) {
        //     errorCount ++;
        //     setInValidImage(true);
        // }
        if (errorCount === 0) {
            props.onFormSubmit(form, props.editState);
        }
    }

    // useEffect(() => {
    //     if (form.image) {
    //         const images: Array<{file: string}> = []
    //         images.push({file: form.image});
    //         setImage(prevState => {
    //             return {...prevState, file: images}
    //         });
    //     }
    // }, [form]);

    return (
        <>
            <div className="flex flex-col h-full w-full ">
                <form className="space-y-3">
                    <div>
                        <PiInput rounded={'rounded'} invalid={inValidLastName} required={true} id={'firstName'} label={'First Name'} value={form.lastName} onChange={lastNameInputOnChange} />
                    </div>
                    <div>
                        <PiInput rounded={'rounded'} invalid={inValidFirstName} required={true} id={'lastName'} label={'Last Name'} value={form.firstName} onChange={firstNameInputOnChange} />
                    </div>
                    <div>
                        <PiInput rounded={'rounded'} value={form.email} label={'Email'} invalid={inValidEmail} required={true} id={'email'} onChange={emailInputOnChange}/>
                    </div>
                    {/*<div>*/}
                    {/*    <PiImagePicker invalid={inValidImage} required={true} type={'single'} label={'Select business logo'} onImageAdded={getFiles} files={[`${image.file}`]} />*/}
                    {/*</div>*/}
                    <div className="flex w-full">
                        <PiButton loading={props.loading} rounded={'rounded'} type={'primary'} size={'normal'} onClick={onSubmitHandler}>Submit</PiButton>
                    </div>
                </form>
            </div>
        </>
    )
}
