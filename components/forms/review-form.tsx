import React, { useEffect, useState} from "react";
import PiImagePicker from "../shared/pi-image-picker";
import {PiButton} from "../shared/pi-button";
import {PiRating} from "../shared/pi-rating";
import {RatingForm} from "../models/Rating";
import PiTextrea from "../shared/pi-textrea";

interface Props {
    editState: boolean;
    formData: RatingForm;
    image?: any;
    onFormSubmit: (value: RatingForm, editState: boolean) => void;
    loading: boolean;
    showImagePicker: true;
}

export const ReviewForm  = (props: Props) => {
    const [form, setForm] = useState<RatingForm>(props.formData);

    const [inValidFeedback, setInValidFeedback] = useState<boolean>(false);

    const [image, setImage] = useState<{file: Array<string>}>({file: []});

    const clearImage = (index: number) => {
        let nimage: Array<any> = [...image.file];
        nimage.splice(index, 1);
        setImage(prevState => {
            return {...prevState, file: nimage}
        });
        setForm((prevState) => {
            return {...prevState, images: nimage}
        });
    }

    const feedbackInputOnChange = (data: any) => {
        setForm((prevState) => {
            return {...prevState, feedback: data};
        })
    }

    const rateInputOnChange = (data: any) => {
        setForm((prevState) => {
            return {...prevState, rating: data};
        })
    }

    const anonymousOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, anonymous: event.target.checked}
        });
    }

    const getFiles = (images: Array<any>) => {
        if (images.length > 0) {
            setForm((prevState) => {
                return {...prevState, images: images.map(image => image.file)}
            });
        }
    }

    const onSubmitHandler = (event?: any) => {
        event.preventDefault();
        let errorCount = 0;
        if (form.feedback.length === 0) {
            errorCount ++;
            setInValidFeedback(true);
        }
        if (errorCount === 0) {
            props.onFormSubmit(form, props.editState);
        }
    }

    useEffect(() => {
       setForm(props.formData);
    }, [props.formData]);


    useEffect(() => {
        if (form.images.length > 0) {
            setImage(prevState => {
                return {...prevState, file: form.images}
            });
        }
    }, [form]);



    return (
        <>
            <div className="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <span className={'p-2 block'}>Please leave a review and a rating </span>
                <div
                    className=" bg-white dark:bg-gray-800">
                    <div className={'flex justify-center w-full'}>
                        <PiRating size={'large'} value={form.rating} onSelectChange={rateInputOnChange}/>
                    </div>
                    <PiTextrea rows={3} placeholder={'Write a review'} invalid={inValidFeedback} required={true} id={'Description'} value={form.feedback} onChange={feedbackInputOnChange} />
                    {
                       image.file.length > 0 &&
                        <div className="overflow-x-auto flex space-x-3 h-full items-center">
                            {image.file.map((image: any, i: number) =>  <div
                                key={i}
                                className={'h-[100px] min-w-[100px] bg-contain bg-center bg-no-repeat border dark:border-gray-700 relative'} style={{backgroundImage: `url(${image})`}}>
                                <div className="absolute top-0 right-0">
                                    <i className={'bg-red-600 p-1 pi pi-times text-white text-base'} onClick={(e) => {clearImage(i); e.stopPropagation()} }></i>
                                </div>
                            </div>)}
                        </div>
                    }
                    {/*<div className={'pl-1.5 py-2'}>*/}
                    {/*    <PiCheckbox label={`Anonymous`} value={form.anonymous} position={'right'} onChange={anonymousOnChange}/>*/}
                    {/*    <i className={'text-xs'}>This hides your name from us</i>*/}
                    {/*</div>*/}
                </div>
                <div
                    className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                    <PiButton loading={props.loading} type={'primary'} size={'small'} rounded={'rounded'} onClick={onSubmitHandler}>
                        Post
                    </PiButton>
                    {
                        props.showImagePicker &&
                        <div className="flex pl-0 space-x-1 sm:pl-2">
                            <PiImagePicker onImageAdded={getFiles} type={'multiple'} files={image.file} simple={true} id={'image-picker'}/>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
