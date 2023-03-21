import {RatingForm} from "../models/Rating";
import React, {useState} from "react";
import {PiRating} from "../shared/pi-rating";
import PiTextrea from "../shared/pi-textrea";
import {PiButton} from "../shared/pi-button";
import PiImagePicker from "../shared/pi-image-picker";

interface Props {
    onFormSubmit: (value: string) => void;
    loading: boolean;
}
export const CommentForm = (props: Props) => {
    const [form, setForm] = useState<string>('');
    const [inValidFeedback, setInValidFeedback] = useState<boolean>(false);

    const feedbackInputOnChange = (data: any) => {
        setForm(data)
    }

    const onSubmitHandler = (event?: any) => {
        event.preventDefault();
        if (form.length === 0) {
            setInValidFeedback(true);
            return;
        }
        props.onFormSubmit(form);
    }

    return (
        <>
            <PiTextrea rows={3} placeholder={'Write your comment'} rounded={'rounded'} label={'Leave your comment'} invalid={inValidFeedback} required={true} id={'Description'} value={form} onChange={feedbackInputOnChange} />
           <div className={'mt-4'}>
               <PiButton loading={props.loading} type={'primary'} size={'small'} rounded={'rounded'} onClick={onSubmitHandler}>
                   Post
               </PiButton>
           </div>
        </>
    )
}