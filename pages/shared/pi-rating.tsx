import {useEffect, useState} from "react";

interface Props {
    disabled?: boolean;
    size: 'small'|'default'|'large';
    value: number;
    onChange?: (event: any) => void;
}
export const PiRating = (props: Props) => {
    const range = [1, 2, 3, 4, 5];

    const [selectedRate, setSelectedRate] = useState<number>(0);

    const selectRate = (rate: number) => {
        setSelectedRate(rate);
    }

    useEffect(() => {
        setSelectedRate(props.value);
    }, [props.value]);

    return (
        <div className={'flex items-center'}>
            {
                range.map((item) =>
                    <svg key={item} aria-hidden="true"
                         className={`
                         ${item <= selectedRate ? 'text-yellow-400' : 'text-gray-300'}
                         ${!props.disabled && 'hover:text-yellow-400 cursor-pointer'}
                         ${props.size === 'small' && 'w-5 h-5'}
                         ${props.size === 'default' && 'w-7 h-7'}
                         ${props.size === 'large' && 'w-10 h-10'}
                         `}
                         onClick={() => selectRate(item)}
                         fill="currentColor"
                         viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <title>{item}</title>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                )
            }
        </div>
    )
}