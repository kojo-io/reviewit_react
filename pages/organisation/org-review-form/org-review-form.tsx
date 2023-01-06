import PiInput from "../../shared/pi-input";
import {useCallback, useEffect, useState} from "react";
import PiSelectList from "../../shared/pi-select-list";
import PiTextrea from "../../shared/pi-textrea";
import PiImagePicker from "../../shared/pi-image-picker";
import PiCheckbox from "../../shared/pi-checkbox";
import {PiButton} from "../../shared/pi-button";
import {ReviewItem} from "../../models/review item";

interface Props {
    editState: boolean;
    listData: any;
    formData: any;
    image?: any;
    onFormSubmit: (value: ReviewItem) => void
}

const OrgReviewForm = (props: Props) => {
    const [form, setForm] = useState<ReviewItem>(
        {
            active: false,
            id: "",
            imageId: "",
            organisationId: "",
            ratingType: 0,
            name: '',
            description: '',
            image: '',
            allowPhoto: false
        });

    const [files, setFiles] = useState<Array<any>>([]);

    useCallback(() => {
        // if (props.editState) {
        //     setForm((prevState) => {
        //         return {...prevState,
        //             allowPhoto: props.formData.allowPhoto,
        //             name: props.formData.name,
        //             image: props.formData.image,
        //             reviewType: props.formData.reviewType,
        //             description: props.formData.description
        //         }
        //     });
        //
        //     const image : Array<any> = [];
        //     image.push(props.formData.image);
        //     setFiles(image);
        // }
    }, []);


    const getReviewType = (data: any) => {
        setForm((prevState) => {
            return {...prevState, reviewType: data};
        })
    }

    const nameInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, name: event.target.value}
        });
    }

    const descriptionInputOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, description: event.target.value}
        });
    }

    const allowPhotoOnChange = (event: any) => {
        setForm((prevState) => {
            return {...prevState, allowPhoto: event.target.checked}
        });
    }

    const getFiles = (images: Array<any>) => {
        setForm((prevState) => {
            return {...prevState, image: images[0]?.file}
        });
    }


    const onSubmitHandler = () => {
        props.onFormSubmit(form);
    }

    return (
        <>
            <div className="flex flex-col h-full w-full ">
                <form className="space-y-3">
                    <div>
                        <PiSelectList label={'What do you want to review ?'} dataValue={'id'} dataLabel={'name'} data={props.listData} onValueChange={getReviewType} />
                    </div>
                    <div>
                        <PiInput label={'Name'} value={form.name} onChange={nameInputOnChange} />
                    </div>
                    <div>
                        <PiTextrea label={'Description'} value={form.description} onChange={descriptionInputOnChange} />
                    </div>
                    <div>
                        <PiImagePicker type={'single'} label={'Select Image'} onImageAdded={getFiles} files={props.image} />
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
