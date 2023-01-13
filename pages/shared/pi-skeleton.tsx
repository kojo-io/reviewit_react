
interface Props {
    shape: 'square' | 'rectangle' | 'circle';
    rounded?: boolean;
    height: string;
    width: string;
}
export const PiSkeleton = (props: Props) => {
    return (
        <>
            <div className={`bg-gray-200 dark:bg-gray-700 ${props.shape === 'circle' ? 'rounded-full p-4' : `${props.rounded ? 'rounded-lg' : ''}`}`} style={{width: props.width, height: props.height}}></div>
        </>
    )
}