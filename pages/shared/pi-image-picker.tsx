import React, { useRef, useState} from "react";
import {BaseService} from "./base.service";

const PiImagePicker = (props: any) => {
    const id = BaseService.uuid();
    let images: any[] = [];
    const [files, setFiles] = useState(props.files);
    const ele = document.getElementById(id);
    const imageInputRef = useRef<HTMLInputElement>(ele as HTMLInputElement);
    const singleFileSelected = (file: any) => {
        setFiles([]);
        if (file.target.files && file.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                if (props.output === 'file') {
                    setFiles([...files, {
                        file: file.target.files[0],
                        type: file.target.files[0].type,
                        ext: String(file.target.files[0].type).split('/')[1],
                        name: file.target.files[0].name
                    }]);
                    props.onImageAdded(files);
                } else {
                    setFiles([...files, {
                        file: file.target.result,
                        type: file.target.files[0].type,
                        ext: String(file.target.files[0].type).split('/')[1],
                        name: file.target.files[0].name
                    }]);
                    props.onImageAdded(files);
                }
            }

            reader.readAsDataURL(file.target.files[0]);
        } else {
            props.onImageAdded(files);
        }
    }

    const multipleFilesSelected = (file: any) => {
        let i = 0;
        images = files;
        for (const doc of file.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(doc);
            reader.onload = (event: any) => {
                if (props.output === 'file') {
                    images = [...images, {
                        type: doc.type,
                        ext: String(doc.type).split('/')[1],
                        name: doc.name,
                        file: doc,
                    }];
                    setFiles(images);
                } else {
                    images = [...images, {
                        type: doc.type,
                        ext: String(doc.type).split('/')[1],
                        name: doc.name,
                        file: event.target.result,
                    }]
                    setFiles(images);
                }
                i++;
                if (file.target.files.length === i) {
                    setFiles(images);
                    props.onImageAdded(images);
                }
            }
        }
    }

    const selectFiles = (file: any) => {
        if (props.type === 'single') {
            singleFileSelected(file);
        } else {
            multipleFilesSelected(file);
        }
    }

    const clearImages = () => {
        images = [];
        setFiles(images);
        imageInputRef.current.value = '';
        props.onImageAdded(files);
    }

    const selectImage = () => {
        imageInputRef.current.click();
    }

    const clearImage = (index: number) => {
        images = [...files];
        images.splice(index, 1);
        setFiles(images);
        if (files.length === 0) {
            imageInputRef.current.value = '';
        }
        props.onImageAdded(files);
    }

    return (
        <>
            {
                props.label &&
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {props.label}
                </label>
            }
            <input id={id} accept={'image/*'} hidden ref={imageInputRef} multiple={props.type === 'multiple'} type="file" onChange={(e) => selectFiles(e)} />
            <div className="w-full border border-dashed border-gray-500 h-auto divide-y">
                <div className="flex flex-wrap content-center justify-center w-full cursor-pointer h-36" onClick={selectImage}>
                    {files.length > 0 &&
                        <div className="overflow-x-auto flex space-x-3 p-2 h-full items-center">
                            {files.map((image: any, i: number) =>  <div
                                key={i}
                                className={'h-20 min-w-[5rem] bg-contain bg-center bg-no-repeat border relative'} style={{backgroundImage: `url(${image.file})`}}>
                                <div className="absolute top-0 right-0">
                                    <i className={'bg-red-600 p-1 pi pi-times text-white text-base'} onClick={(e) => {clearImage(i); e.stopPropagation()} }></i>
                                </div>
                            </div>)}
                        </div>
                    }
                    {files.length === 0 &&
                        <div className="text-center">
                            <i className="pi pi-images text-5xl text-gray-400"></i>
                            <span className="block cursor-pointer">click to select image</span>
                        </div>
                    }
                </div>
                <div className="text-blue-500 text-base w-full justify-between items-center flex px-3">
                    <span> {`${files.length} image${files.length > 1 ? 's' : ''} selected`}</span>
                    {
                        files.length > 0 &&
                        <i onClick={clearImages} className={'pi pi-times text-red-600 text-xs cursor-pointer'}>
                        </i>
                    }
                </div>
            </div>
        </>
    )
}

export default PiImagePicker;