import React, { useEffect, useState} from "react";
import PiImagePicker from "../shared/pi-image-picker";
import {PiLoading} from "../shared/pi-loading";
import PiInput from "../shared/pi-input";
import {PiButton} from "../shared/pi-button";
import PiTextrea from "../shared/pi-textrea";
import {Organization} from "../models/Organization";

interface Props {
    editState: boolean;
    formData: Organization;
    image?: any;
    onFormSubmit: (value: Organization, editState: boolean) => void;
    loading: boolean;
}

export const OrganizationForm  = (props: Props) => {
    const [form, setForm] = useState<Organization>(props.formData);

    const [inValidAddress, setInValidAddress] = useState<boolean>(false);
    const [inValidName, setInValidName] = useState<boolean>(false);
    const [inValidPhoneNumber, setInValidPhoneNumber] = useState<boolean>(false);
    const [inValidImage, setInValidImage] = useState<boolean>(false);

    const [image, setImage] = useState<{file: Array<{file: string}>}>({file: []});

    const phoneNumberInputOnChange = (data: any) => {
        setForm((prevState) => {
            return {...prevState, phoneNumber: data};
        })
    }

    const nameInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, name: event}
        });
    }

    const addressInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, address: event}
        });
    }

    const getFiles = (images: Array<any>) => {
        if (images.length > 0) {
            setForm((prevState) => {
                return {...prevState, image: images[0]?.file}
            });
        }
    }

    const onSubmitHandler = (event?: any) => {
        event.preventDefault();
        let errorCount = 0;
        if (form.address .length === 0) {
            errorCount ++;
            setInValidAddress(true);
        }
        if (form.name.length === 0 ) {
            errorCount ++;
            setInValidName(true);
        }
        if (form.phoneNumber.length === 0) {
            errorCount ++;
            setInValidPhoneNumber(true);
        }
        if (form.image.length === 0) {
            errorCount ++;
            setInValidImage(true);
        }
        if (errorCount === 0) {
            props.onFormSubmit(form, props.editState);
        }
    }

    useEffect(() => {
        if (form.image) {
            const images: Array<{file: string}> = []
            images.push({file: form.image});
            setImage(prevState => {
                return {...prevState, file: images}
            });
        }
    }, [form]);

    return (
        <>
            <div className="flex flex-col h-full w-full ">
                <form className="space-y-3">
                    <div>
                        <PiInput invalid={inValidName} required={true} id={'name'} label={'Name'} value={form.name} onChange={nameInputOnChange} />
                    </div>
                    <div>
                        <PiTextrea rows={4} invalid={inValidAddress} required={true} id={'Address'} label={'Address'} value={form.address} onChange={addressInputOnChange} />
                    </div>
                    <div>
                        <PiInput value={form.phoneNumber} label={'Phone number'} invalid={inValidPhoneNumber} required={true} id={'org-PhoneNumber'} onChange={phoneNumberInputOnChange}/>
                    </div>
                    <div>
                        <PiImagePicker invalid={inValidImage} required={true} type={'single'} label={'Select business logo'} onImageAdded={getFiles} files={image.file} />
                    </div>
                    <div className="flex w-full">
                        <PiButton loading={props.loading} rounded={'rounded'} type={'primary'} size={'normal'} onClick={onSubmitHandler}>Submit</PiButton>
                    </div>
                </form>
            </div>
        </>
    )
}
