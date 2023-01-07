import {useEffect, useState} from "react";

interface Props {
    text: string;
    children?: any;
    length?: number;
}
export const PiTruncate = (props: Props) => {
    const [expand, setExpand] = useState<boolean>(false);

    const expandText = () => {
        setExpand(!expand);
    }

    return (
        <>
            {
                props.length &&
                <>
                    {
                        props.text.length > props.length &&
                        <>
                            {
                                (!expand) &&
                                <>
                                    {props.text.slice(0, props.length)}
                                    <span onClick={expandText} className={'cursor-pointer ml-4 text-blue-500 hover:underline'}>
                                        see more ...
                                    </span>
                                </>
                            }
                            {
                                expand &&
                                <>
                                    {props.text}
                                </>
                            }
                        </>
                    }
                    {
                        props.text.length < props.length &&
                        <>
                            {props.text}
                        </>
                    }
                </>
            }
            {
                (!props.length) &&
                <>
                    {
                        props.text.length > 100 &&
                        <>
                            {
                                (!expand) &&
                                <>
                                    {props.text.slice(0, 100)}
                                    <span onClick={expandText} className={'cursor-pointer ml-4 text-blue-500 hover:underline'}>
                                        see more ...
                                    </span>
                                </>
                            }
                            {
                                expand &&
                                <>
                                    {props.text}
                                </>
                            }
                        </>
                    }
                    {
                        props.text.length < 100 &&
                        <>
                            {props.text}
                        </>
                    }
                </>
            }
        </>
    )
}