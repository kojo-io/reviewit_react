import {uuid} from "./base.service";
import React from "react";
const PiCheckbox = (props: any) => {
    const id = uuid();

    return (
        <>
            <style jsx>
                {
                    `.container .mark:after {
  position: relative;
  width: 7px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.mark:after {
  content: "";
  display: none;
}
.container input:checked ~ .mark:after {
  display: block;
}`
                }
            </style>

            <label htmlFor={id} className={'flex items-center cursor-pointer container'}>
                {
                    props.position === 'left' && <label htmlFor={props.id} className="mr-2 text-sm font-medium text-gray-900 dark:text-white">
                        {props.label}
                    </label>
                }
                <input disabled={props.disabled} id={id} value={''} checked={props.value} onChange={props.onChange} type={'checkbox'} className={'sr-only peer'}/>
                <div className="mark bg-gray-200 w-6 h-6 rounded hover:bg-gray-300 peer-checked:bg-blue-600 after:top-1 after:left-[8px]"></div>
                {
                    props.position === 'right' && <label htmlFor={props.id} className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {props.label}
                    </label>
                }
            </label>
        </>
    )
}

export default PiCheckbox;