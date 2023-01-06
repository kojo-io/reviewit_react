import React from "react";

interface Props {
    id?: string;
    label?: string;
    rows?: number;
    name?: string;
    onChange: (event: any) => void;
    value?: string;
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
}
const PiTextrea = (props: Props) => {
    return (
        <div>
            {
                props.label &&
                <label htmlFor={props.id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {props.label}
                </label>
            }
            <textarea rows={props.rows} id={props.id} name={props.name}
                      onChange={props.onChange}
                      value={props.value}
                      readOnly={props.readOnly}
                      className="bg-gray-50 border
                    border-gray-300 text-gray-900 text-sm
                    rounded-lg focus:ring-blue-500 focus:border-blue-500
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={props.placeholder} required={props.required}></textarea>
        </div>
    )
}

export default PiTextrea;