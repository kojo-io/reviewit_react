import PiInput from "../../shared/pi-input";
import React, {useCallback, useEffect, useRef, useState} from "react";
import PiSelectList from "../../shared/pi-select-list";
import PiTextrea from "../../shared/pi-textrea";
import PiImagePicker from "../../shared/pi-image-picker";
import PiCheckbox from "../../shared/pi-checkbox";
import {PiButton} from "../../shared/pi-button";
import {ReviewItem, ReviewItemForm} from "../../models/review item";

interface Props {
    editState: boolean;
    listData: any;
    formData: any;
    image?: any;
    onFormSubmit: (value: ReviewItemForm) => void
}

const OrgReviewForm = (props: Props) => {
    const [form, setForm] = useState<ReviewItemForm>(
        {
            active: false,
            id: "",
            imageId: "",
            organisationId: "",
            ratingType: 0,
            name: '',
            description: '',
            image: '',
            allowPhoto: false,
            reviewType: ''
        });

    const [inValidDescription, setInValidDescription] = useState<boolean>(false);
    const [inValidName, setInValidName] = useState<boolean>(false);
    const [inValidListData, setInValidListData] = useState<boolean>(false);
    const [inValidImage, setInValidImage] = useState<boolean>(false);

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
        setForm((prevState) => {
            if (images.length > 0) {
                return {...prevState, image: images[0]?.file}
            } else {
                return {...prevState, image: ''}
            }
        });
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
        if (form.image.length === 0) {
            errorCount ++;
            setInValidImage(true);
        }
        if (errorCount === 0) {
            props.onFormSubmit(form);
        }
    }

    useEffect(() => {

    }, [form]);

    return (
        <>
            <div className="flex flex-col h-full w-full ">
                <form className="space-y-3">
                    <div>
                        <PiSelectList allowSearch={false} invalid={inValidListData} required={true} label={'What do you want to review ?'} dataValue={'id'} dataLabel={'name'} data={props.listData} onValueChange={getReviewType} />
                    </div>
                    <div>
                        <PiInput invalid={inValidName} required={true} id={'name'} label={'Name'} value={form.name} onChange={nameInputOnChange} />
                    </div>
                    <div>
                        <PiTextrea invalid={inValidDescription} required={true} id={'Description'} label={'Description'} value={form.description} onChange={descriptionInputOnChange} />
                    </div>
                    <div>
                        <PiImagePicker invalid={inValidImage} required={true} type={'single'} label={'Select Image'} onImageAdded={getFiles} files={props.image} />
                    </div>
                    <div>
                        <PiCheckbox position={'right'} value={form.allowPhoto} label={'Allow users to add photo evidence'} onChange={allowPhotoOnChange}/>
                    </div>
                    <div className="flex w-full">
                        <PiButton onClick={onSubmitHandler}>Submit</PiButton>
                    </div>
                </form>
            </div>
        </>
    )
}

export default OrgReviewForm
