
import React, {useEffect, useState} from "react";
import 'primeicons/primeicons.css';
import {uuid} from "./base.service";
const PiSelectList = (props: any) => {
    const id = uuid();
    const [searchable, setSearchable] = useState(false);
    const [displayLabel, setDisplayLabel] = useState('');
    const [displayValue, setDisplayValue] = useState('');
    const data = props.data;

    const selectItem = (item: any) => {
        const find = data.find((u: any) => u === item);
        if (find) {
            setDisplayValue(find[props.dataValue]);
            setDisplayLabel(find[props.dataLabel]);
            props.onValueChange(find[props.dataValue]);
        }
    }

    const onDisplayModelChange = (event: any) => {
        setDisplayLabel(event.target.value);
    }

    useEffect(() => {

        window.addEventListener('click', (event) => {
            const ele = document.getElementsByClassName('select-list-container');
            for (let i = 0; i< ele.length;i++) {
                if (!ele.item(i)?.classList.contains('hidden')) {
                    ele.item(i)?.classList.add('hidden')
                }
            }
            document.getElementsByClassName(id).item(0)?.classList.remove('hidden');

            if (!document.activeElement?.attributes.getNamedItem('select-list')) {
                const ele = document.getElementsByClassName('select-list-container');
                for (let i = 0; i< ele.length;i++) {
                    if (!ele.item(i)?.classList.contains('hidden')) {
                        ele.item(i)?.classList.add('hidden')
                    }
                }
            }
        })
    })

    return (
        <div className="relative w-full">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {props.label}
            </label>
            <div className="relative">
                <input
                    select-list="pi-select-list"
                    placeholder={props.placeholder}
                    readOnly={searchable}
                    onChange={onDisplayModelChange}
                    value={displayLabel}
                    className="bg-gray-50 border
                    border-gray-300 text-gray-900 text-sm
                    rounded-lg focus:ring-blue-500 focus:border-blue-500
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id={id}  />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="flex flex-col">
                        <i className="pi pi-chevron-up text-gray-500 text-xs"></i>
                        <i className="pi pi-chevron-down text-gray-500 text-xs"></i>
                    </div>
                </div>
            </div>

            <div className={`absolute border mt-2 rounded-[5px] 
            min-w-full divide-y bg-white dark:bg-gray-700 z-10 
            dark:border-gray-600
            dark:divide-gray-600
            select-list-container shadow-2xl ${id} hidden`}>
                {(data.length > 0) && data.map( (item: any) =>
                    <div onClick={(() => selectItem(item))} className={`p-2 cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-200 ${displayValue === item[props.dataValue] && 'bg-gray-200'}`}
                        key={item[props.dataValue]}>
                        <span className="text-[14px] leading-[16px] font-[400]">{item[props.dataLabel]}</span>
                    </div> ) }
                {
                    (data.length === 0 &&
                        <div>
                            <div className="py-6 cursor-pointer text-center">
                                <span className="text-[14px] leading-[16px] font-[400]">List is empty</span>
                            </div>
                        </div>)
                }
            </div>
        </div>
    )
}

export default PiSelectList;