import {useEffect, useRef} from "react";

interface Props {
    children?: any;
    dropParentId: string;
}
export const PiDropdown = (props: Props) => {
    const ele = document.getElementById(props.dropParentId);
    const elementRef = useRef<HTMLElement>(ele as HTMLElement);

    return(
        <>
            <div
                style={{top: elementRef.current.offsetTop + elementRef.current.offsetHeight - 20, left: elementRef.current.offsetLeft, minWidth: elementRef.current.offsetWidth}}
                className={'h-40 fixed bg-gray-500'}>
            </div>
        </>
    )
}