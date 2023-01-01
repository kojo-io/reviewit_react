import PiInput from "../../shared/pi-input";
import {useState} from "react";
import PiSelectList from "../../shared/pi-select-list";
import PiTextrea from "../../shared/pi-textrea";
import PiImagePicker from "../../shared/pi-image-picker";

const OrgReviewForm = () => {
    const [form, setForm] = useState(
        {
            reviewType: '',
            name: '',
            description: '',
            image: '',
            allowPhoto: false
        });

    const data = [
        {
            id: 1,
            value: 'Boy'
        },
        {
            id: 2,
            value: 'Yam'
        }
    ]

    let files: any[] = [];

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

    const getFiles = (images: any[]) => {
      files = images;
    }

    return (
        <>
            <div className="flex flex-col h-full w-full ">
                <form className="space-y-3">
                    <div>
                        <PiSelectList label={'What do you want to review ?'} dataValue={'id'} dataLabel={'value'} data={data} onValueChange={getReviewType} />
                    </div>
                    <div>
                        <PiInput label={'Name'} value={form.name} onChange={nameInputOnChange} />
                    </div>
                    <div>
                        <PiTextrea label={'Description'} value={form.description} onChange={descriptionInputOnChange} />
                    </div>
                    <div>
                        <PiImagePicker type={'multiple'} label={'Select Image'} onImageAdded={getFiles} files={files} />
                    </div>
                </form>
            </div>
        </>
    )
}

export default OrgReviewForm
