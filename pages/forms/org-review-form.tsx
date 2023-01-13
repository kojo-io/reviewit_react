import PiInput from "../shared/pi-input";
import React, {useCallback, useEffect, useRef, useState} from "react";
import PiSelectList from "../shared/pi-select-list";
import PiTextrea from "../shared/pi-textrea";
import PiImagePicker from "../shared/pi-image-picker";
import PiCheckbox from "../shared/pi-checkbox";
import {PiButton} from "../shared/pi-button";
import {ReviewItem, ReviewItemForm} from "../models/review item";
import {PiLoading} from "../shared/pi-loading";

interface Props {
    editState: boolean;
    listData: any;
    formData: ReviewItemForm;
    image?: any;
    onFormSubmit: (value: ReviewItemForm, editState: boolean) => void;
    loading: boolean;
}

const OrgReviewForm = (props: Props) => {
    const [form, setForm] = useState<ReviewItemForm>(props.formData);

    const [inValidDescription, setInValidDescription] = useState<boolean>(false);
    const [inValidName, setInValidName] = useState<boolean>(false);
    const [inValidListData, setInValidListData] = useState<boolean>(false);
    const [inValidImage, setInValidImage] = useState<boolean>(false);

    const [image, setImage] = useState<{file: Array<{file: string}>}>({file: []});

    const getReviewType = (data: any) => {
        setForm((prevState) => {
            return {...prevState, reviewType: data};
        })
    }

    const nameInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, name: event}
        });
    }

    const descriptionInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, description: event}
        });
    }

    const allowPhotoOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, allowPhoto: event.target.checked}
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
        if (form.description .length === 0) {
            errorCount ++;
            setInValidDescription(true);
        }
        if (form.name.length === 0 ) {
            errorCount ++;
            setInValidName(true);
        }
        if (form.reviewType.length === 0) {
            errorCount ++;
            setInValidListData(true);
        }
        // if (form.image.length === 0) {
        //     errorCount ++;
        //     setInValidImage(true);
        // }
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
                        <PiSelectList value={form.reviewType} allowSearch={false} invalid={inValidListData} required={true} label={'What do you want to review ?'} dataValue={'id'} dataLabel={'name'} data={props.listData} onValueChange={getReviewType} />
                    </div>
                    <div>
                        <PiInput invalid={inValidName} required={true} id={'name'} label={'Name'} value={form.name} onChange={nameInputOnChange} />
                    </div>
                    <div>
                        <PiTextrea rows={6} invalid={inValidDescription} required={true} id={'Description'} label={'Description'} value={form.description} onChange={descriptionInputOnChange} />
                    </div>
                    <div>
                        <PiImagePicker invalid={inValidImage} required={false} type={'single'} label={'Select Image'} onImageAdded={getFiles} files={image.file} />
                    </div>
                    <div>
                        <PiCheckbox position={'right'} value={form.allowPhoto} label={'Allow users to add photo evidence'} onChange={allowPhotoOnChange}/>
                    </div>
                    <div className="flex w-full">
                        <PiButton loading={props.loading} rounded={'rounded'} type={'primary'} size={'normal'} onClick={onSubmitHandler}>Submit</PiButton>
                    </div>
                </form>
            </div>
        </>
    )
}

export default OrgReviewForm