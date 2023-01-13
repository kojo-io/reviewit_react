import React, {useEffect, useReducer, useRef, useState} from "react";
import {uuid} from "./base.service";

interface Props {
    label?: string;
    required?: boolean;
    placeholder?: string;
    onImageAdded: (event: any) => void;
    invalid?: boolean;
    type: 'single' | 'multiple';
    output?: 'file' | 'base64';
    files: Array<any>;
}
const PiImagePicker = (props: Props) => {
    const id = uuid();

    const ele = document.getElementById(id)
    const imageInputRef = useRef<HTMLInputElement>(ele as HTMLInputElement);
    const [inputTouched, setInputTouched] = useState<boolean>(false);
    const [inputIsValid, setInputIsValid] = useState<boolean>(false);
    const defaultClass = '"w-full border border-dashed h-auto divide-y rounded-lg';
    const inputValidClass = 'border-gray-500 ';
    const invalidClass = 'border-red-600'
    const [inputClass, setInputClass] = useState(defaultClass);
    const [inputIsInValid, setInputIsInValid] = useState<boolean | undefined>(false);
    const [images, setImage] = useState<{files: Array<any>}>({files: []});
    const [outImages, setOutImage] = useState<{files: Array<any>}>({files: []});

    const multipleFilesSelected = (file: any) => {
        let i = 0;
        let image: Array<any> = images.files;
        for (const doc of file.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(doc);
            reader.onload = (event: any) => {
                if (props.output === 'file') {
                    image = [...image, {
                        type: doc.type,
                        ext: String(doc.type).split('/')[1],
                        name: doc.name,
                        file: doc,
                    }];
                } else {
                    image = [...image, {
                        type: doc.type,
                        ext: String(doc.type).split('/')[1],
                        name: doc.name,
                        file: event.target.result,
                    }]
                }
                i++;
                if (file.target.files.length === i) {
                    // dispatchFiles({type: 'images', images: image})
                    setImage(prevState => {
                        return {...prevState, files: image}
                    });
                    setOutImage(prevState => {
                        return {...prevState, files: image}
                    });
                    if (image.length > 0) {
                        setInputIsValid(true);

                    } else{
                        setInputIsValid(false);
                    }

                    // props.onImageAdded(images.files);
                }
            }
        }
    }
    const singleFileSelected = (file: any) => {
        const image: Array<any> = [];
        if (file.target.files && file.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(file.target.files[0]);
            reader.onload = (event: any) => {
                if (props.output === 'file') {
                    image.push({
                        file: file.target.files[0],
                        type: file.target.files[0].type,
                        ext: String(file.target.files[0].type).split('/')[1],
                        name: file.target.files[0].name
                    });
                } else {
                    image.push({
                        file: event.target.result,
                        type: file.target.files[0].type,
                        ext: String(file.target.files[0].type).split('/')[1],
                        name: file.target.files[0].name
                    });
                }
                setImage(prevState => {
                    return {...prevState, files: image}
                });
                setOutImage(prevState => {
                    return {...prevState, files: image}
                });
                if (image.length > 0) {
                    setInputIsValid(true);

                } else{
                    setInputIsValid(false);
                }
                // props.onImageAdded(images.files);
            }
        } else {
            // dispatchFiles({type: 'images', images: []});
            setImage(prevState => {
                return {...prevState, files: []}
            })
            setOutImage(prevState => {
                return {...prevState, files: image}
            });
            // props.onImageAdded(images.files);
        }
    }
    const selectFiles = (file: any) => {
        if (file.target.files.length > 0) {
            setInputTouched(true);
        }
        if (file.target.files.length === 0) {
            setInputIsValid(false);
        } else {
            setInputIsValid(true);
        }

        if (props.type === 'single') {
            singleFileSelected(file);
        } else {
            multipleFilesSelected(file);
        }
    }
    const selectImage = () => {
        imageInputRef.current.click();
    }
    const clearImages = () => {
        setImage(prevState => {
            return {...prevState, files: []}
        })
        setOutImage(prevState => {
            return {...prevState, files: []}
        });
        imageInputRef.current.value = '';
    }

    const clearImage = (index: number) => {
        let image: Array<any> = [...images.files];
        image.splice(index, 1);
        if (image.length === 0) {
            imageInputRef.current.value = '';
        }
        setOutImage(prevState => {
            return {...prevState, files: image}
        });
        setImage(prevState => {
            return {...prevState, files: image}
        })
    }

    useEffect(() => {
        props.onImageAdded(outImages.files);
    }, [outImages.files]);

    useEffect(() => {
        setInputIsInValid(props.invalid);
    }, [props.invalid]);

    useEffect(() => {
        if (props.files.length > 0) {
            setImage({files: props.files});
        }
    }, [props.files])

    useEffect(() => {
        setInputIsInValid(!inputIsValid && inputTouched);
    }, [inputIsValid]);

    return (
        <>
            {
                props.label &&
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {props.label}
                    {
                        props.required &&
                        <>
                            <span className={'text-red-600 text-lg'}>*</span>
                        </>
                    }
                </label>
            }
            <input id={id} accept={'image/*'} hidden ref={imageInputRef} multiple={props.type === 'multiple'} type="file" onChange={(e) => selectFiles(e)} />
            <div className={`${defaultClass} ${inputIsInValid ? `${ props.required ? invalidClass : inputValidClass }` : inputValidClass}`}>
                <div className="flex flex-wrap content-center justify-center w-full cursor-pointer h-36" onClick={selectImage}>
                    {images.files.length > 0 &&
                        <div className="overflow-x-auto flex space-x-3 p-2 h-full items-center">
                            {images.files.map((image: any, i: number) =>  <div
                                key={i}
                                className={'h-20 min-w-[5rem] bg-contain bg-center bg-no-repeat border relative'} style={{backgroundImage: `url(${image.file})`}}>
                                <div className="absolute top-0 right-0">
                                    <i className={'bg-red-600 p-1 pi pi-times text-white text-base'} onClick={(e) => {clearImage(i); e.stopPropagation()} }></i>
                                </div>
                            </div>)}
                        </div>
                    }
                    {images.files.length === 0 &&
                        <div className="text-center">
                            <i className="pi pi-images text-5xl text-gray-400"></i>
                            <span className="block cursor-pointer">{ props.placeholder ?? 'click to select image'}</span>
                        </div>
                    }
                </div>
                <div className="text-blue-500 text-base w-full justify-between items-center flex px-3">
                    <span> {`${images.files.length} image${images.files.length > 1 ? 's' : ''} selected`}</span>
                    {
                        images.files.length > 0 &&
                        <i onClick={clearImages} className={'pi pi-times text-red-600 text-xs cursor-pointer'}>
                        </i>
                    }
                </div>
            </div>
            {
                inputIsInValid &&
                <>
                    {
                        props.required &&
                        <small className={'text-red-600'}>{props.label} is required *</small>
                    }
                </>
            }
        </>
    )
}

export default PiImagePicker;