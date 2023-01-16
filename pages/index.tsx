import Head from 'next/head'
import {PiButton} from "./shared/pi-button";
import {useRouter} from "next/router";
import {Logo} from "./shared/logo";

export default function Home() {
    const router = useRouter();

    const businessRouteHandler = () => {
        router.push(`/business/sign-in`);
    }

    const userRouteHandler = () => {
        router.push(`/sign-in`);
    }

    return (
        <>
            <Head>
                <title>Review It</title>
                <meta name="description" content="Powered by Tollesoft" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={'h-screen w-screen'}>
                <div className={'flex flex-col w-full h-full overflow-auto'}>
                    <div className={'grid md:grid-cols-1 lg:grid-cols-2 h-full'}>
                        <div className={'col-start-1 col-span-1 bg-slate-100 dark:bg-gray-800/30 h-full'}>
                            <div className={'flex flex-wrap content-center justify-center h-full w-full'}>
                                <div className={'w-5/6 lg:w-4/6 xl:w-3/6 2xl:2/6'}>
                                    <div className={'p-4'}>
                                        <div className={'space-y-4 z-0'}></div>
                                        <div className={'space-y-4'}>
                                            <h1 className={'font-bold text-xl uppercase'}>Sign in as</h1>
                                            <div className={'divide-y dark:divide-gray-700'}>
                                                <div className={'py-4'}>
                                                    <PiButton block={true} type={'primary'} size={'large'} rounded={'rounded'} onClick={businessRouteHandler}>
                                                        A BUSINESS
                                                    </PiButton>
                                                </div>
                                                <div className={'py-4'}>
                                                    <PiButton block={true} type={'primary'} size={'large'} rounded={'rounded'} onClick={userRouteHandler}>
                                                        A USER
                                                    </PiButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col-auto'}>
                            <div className={'flex flex-wrap content-center justify-center h-full w-full'}>
                                <Logo/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
