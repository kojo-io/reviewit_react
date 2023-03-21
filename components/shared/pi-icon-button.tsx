import React, {ClassAttributes} from "react";
import {HtmlAttributes} from "csstype";

interface Prop {
    onClick: () => void,
    size?: 'extra small' | 'small' | 'normal' | 'large' | 'extra large';
    type?: 'primary' | 'success' | 'danger' | 'warning' | 'light' | 'dark';
    outline?: boolean;
    disabled?: boolean;
    icon: string;
    rounded?: 'rounded' | 'full';
}
export const PiIconButton = (props: Prop) => {
    const primaryCSS = 'focus:outline-none leading-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900';
    const successCSS = 'focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800';
    const dangerCSS = 'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900';
    const warningCSS = 'focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium dark:focus:ring-yellow-900';
    const darkCSS = 'text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700';
    const lightCSS = 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700';

    const primaryOutlineCSS = 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800';
    const successOutlineCSS = 'text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800';
    const dangerOutlineCSS = '"text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900';
    const warningOutlineCSS = 'text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium text-center dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900';
    const darkOutlineCSS = 'text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800';
    const lightOutlineCSS = 'text-white border border-white focus:outline-none hover:bg-white focus:ring-4 focus:ring-gray-200 font-medium dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-white/60 dark:hover:text-black dark:hover:border-white dark:focus:ring-gray-700';

    const extra_small = 'p-1.5 text-xs inline-flex';
    const small = 'p-2 text-sm inline-flex';
    const normal = 'text-sm p-2.5 inline-flex';
    const large = 'p-3 text-base inline-flex';
    const extra_large = 'text-base p-3.5 inline-flex';

    const roundedFullCSS = 'rounded-full';
    const roundedCSS = 'rounded-lg';

    return (
        <button type="button"
                onClick={props.onClick}
                disabled={props.disabled}
                className=
                    {`leading-none
                    ${props.type === 'primary' && `${props.outline ? primaryOutlineCSS : primaryCSS}`}
                    ${props.type === 'success' && `${props.outline ? successOutlineCSS : successCSS}`}
                    ${props.type === 'danger' && `${props.outline ? dangerOutlineCSS : dangerCSS}`}
                    ${props.type === 'warning' && `${props.outline ? warningOutlineCSS : warningCSS}`}
                    ${props.type === 'dark' && `${props.outline ? darkOutlineCSS : darkCSS}`}
                    ${props.type === 'light' && `${props.outline ? lightOutlineCSS : lightCSS}`}
                    
                    ${props.size === 'small' && small}
                    ${props.size === 'extra small' && extra_small}
                    ${props.size === 'extra large' && extra_large}
                    ${props.size === 'normal' && normal}
                    ${props.size === 'large' && large}
                    
                    ${props.rounded === 'rounded' && roundedCSS}
                    ${props.rounded === 'full' && roundedFullCSS}
                    `}
        >
            <i className={props.icon}></i>
        </button>
    );
}