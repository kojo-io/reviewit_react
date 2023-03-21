
export const PiLoading = (props: {loading: boolean, children?: any, iconSize?:string}) => {
    return (
        <>
            <div className={'w-full'}>
                {
                    props.loading &&
                    <div className={'w-full flex justify-center p-2'}>
                        <i className={'pi pi-spin pi-spinner'} style={{fontSize: props.iconSize ?? '2rem'}}></i>
                    </div>
                }
                {
                    !props.loading &&
                    <>
                        {props.children}
                    </>
                }
            </div>
        </>
    )
}