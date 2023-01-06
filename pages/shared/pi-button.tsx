import React from "react";

interface Prop {
    onClick: () => void,
    children?: any;
}
export const PiButton = (props: Prop) => {
    return (
        <button type="button"
                onClick={props.onClick}
                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900">
            {props.children}
        </button>
    );
}