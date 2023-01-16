import {UserBody} from "../shared/user-body";
import {environment} from "../shared/environment";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../store/auth-provider";
import {useRouter} from "next/router";
import {ContextInterface} from "../models/context-interface";
import {Paging} from "../models/paging";
import {Filter} from "../models/filter";
import {ReviewItem} from "../models/review item";
import {PagedResponse} from "../models/PagedResponse";
import PiTextrea from "../shared/pi-textrea";
import {PiSkeletonWrapper} from "../shared/pi-skeleton-wrapper";
import {PiSkeleton} from "../shared/pi-skeleton";
import {PiTruncate} from "../shared/pi-truncate";
import {PiRating} from "../shared/pi-rating";
import {PiButton} from "../shared/pi-button";
import {PiAvatar} from "../shared/pi-avatar";

export default function Feed() {
    const url = environment.apiUrl;
    const context = useContext(AuthContext);
    const router = useRouter();

    const getDefault: ContextInterface = {
        canLogout: () => {},
        canLogin: () => {},
        isAuthenticated: false }

    const [auth, setAuth] = useState<ContextInterface>(getDefault);

    const [paging, setPaging] = useState<Paging>({ pageSize: 10, pageNumber: 1, totalPages: 0, totalRecords: 0, currentSize: 0 });

    const [filter, setFilter] = useState<Filter>({ });

    const [currentSize, setCurrentSize] = useState<number>(0);

    const [loadMore, setLoadMore] = useState<boolean>(false);

    const [bottom, setBottom] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [reviews, setReviews] = useState<ReviewItem[]>([]);

    const reviewAnalyticsRouteHandler = (reviewId: any) => {
        router.push(`/reviews/${reviewId}`);
    }

    const loadMoreReviewsHandler = () => {
        setLoadMore(true);
        setPaging(prevState => {
            return {...prevState, pageNumber: prevState.pageNumber + 1}
        });
    }

    const getAllReviewItemsHandler = () => {
        setLoading(true);
        fetch(`${url}ReviewItems/GetAllReviews?pageSize=${paging.pageSize}&pageNumber=${paging.pageNumber}`, {
            method: 'POST',
            body: JSON.stringify(filter),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: PagedResponse<Array<ReviewItem>>) => {
                const data: Array<ReviewItem> = [...reviews];
                result.data.forEach((rate) => {
                    const find = data.find(u => u.id === rate.id);
                    if (!find) {
                        data.push(rate)
                    }
                });
                setReviews(data);
                setPaging(prevState => {
                    return { ...prevState, pageSize: result.pageSize, totalPages: result.totalPages, totalRecords: result.totalRecords, currentSize: result.data.length}
                });
            }).finally(() => {
                setLoadMore(false);
                setLoading(false);
            });

        }).catch((reason) => {
        });
    }

    // check token
    useEffect(() => {
        setAuth((prevState) => {
            return {...prevState, user: context.user, accesstoken: context.accesstoken }
        });
    }, [context]);

    // update auth value
    useEffect(() => {
        if (auth.accesstoken?.token) {
            getAllReviewItemsHandler();
        }
    }, [auth]);

    useEffect(() => {
        const ele = document.getElementById('list-review-items') as HTMLDivElement;
        const event = (event:any) => {
            const scroll = (ele.scrollHeight - ele.scrollTop);
            if (ele.clientHeight === scroll - 50) {
                if (paging.totalRecords > currentSize) {
                    setBottom(true);
                } else  {
                    setBottom(false);
                }
            }
        }

        ele.addEventListener('scroll', event);

        return () => window.removeEventListener('scroll', event);
    })

    useEffect(() => {
        if (bottom) {
            loadMoreReviewsHandler();
        }
    }, [bottom])

    useEffect(() => {
        if (!loading) {
            if (paging.pageNumber > 1) {
                const size = paging.pageSize * paging.pageNumber - 1 + paging.currentSize;
                setCurrentSize(size);
            } else {
                setCurrentSize(paging.currentSize);
            }
        }
    }, [paging]);

    useEffect(() => {
        if(!loading) {
            if (loadMore) {
                getAllReviewItemsHandler();
            }
        }
    }, [loadMore]);

    return (
        <UserBody>
            <div className="flex flex-col w-full h-full">
                <div className="flex justify-center w-full h-full">
                    <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">

                        <div className="grid lg:grid-cols-7 gap-4 h-full relative w-full py-4 px-2">

                            <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden max-lg:px-2'}>
                                {/*<div className={'w-full bg-white dark:bg-gray-800 border dark:border-gray-800 rounded-xl p-4 sticky top-4'}>*/}
                                {/*    <img src={context?.user?.organization?.image ?? `/user.png`} className={'block m-auto max-w-[150px] h-auto p-1 rounded-lg'}/>*/}
                                {/*    <span className={'block text-2xl text-center mt-4'}>*/}
                                {/*            {context.user?.organization?.name}*/}
                                {/*        </span>*/}
                                {/*    <span className={'block text-lg dark:text-gray-500 text-center mt-0.5'}>*/}
                                {/*            {context.user?.organization?.address}*/}
                                {/*        </span>*/}
                                {/*    <span className={'block text-lg dark:text-gray-500 text-center mt-0.5'}>*/}
                                {/*            {context.user?.organization?.phoneNumber}*/}
                                {/*        </span>*/}
                                {/*</div>*/}
                            </div>

                            {/*review feed start*/}
                            <div className="grow h-full lg:columns-3 lg:col-span-3 flex pb-4 overflow-auto feed" id={'list-review-items'}>
                                <div className={'h-full flex flex-col w-full'}>
                                    {
                                        (reviews.length === 0 && loading) &&
                                        <div className={'w-full space-y-4'}>
                                            <PiSkeletonWrapper>
                                                <div key={1} className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
                                                    <div className={'divide-y dark:divide-gray-700'}>
                                                        <div className={'w-full p-3 flex items-center space-x-3'}>
                                                            <PiSkeleton shape={"circle"} height={"50px"} width={"50px"}/>
                                                            <div className={'space-y-2'}>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            </div>
                                                        </div>
                                                        <div className={'w-full p-3 space-y-2'}>
                                                            <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            <PiSkeleton rounded={true} shape={"rectangle"} height={"30px"} width={"100%"}/>
                                                        </div>
                                                    </div>
                                                    <PiSkeleton shape={"rectangle"} height={"300px"} width={"100%"}/>
                                                    <div className={'w-full p-3 flex justify-between items-center'}>
                                                        <div className={'flex space-x-2'}>
                                                            <PiSkeleton rounded={true} shape={"square"} height={"40px"} width={"40px"}/>
                                                            <div className={'space-y-2'}>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            </div>
                                                        </div>
                                                        <PiSkeleton shape={"rectangle"} rounded={true} height={"30px"} width={"100px"}/>
                                                    </div>
                                                </div>
                                            </PiSkeletonWrapper>
                                            <PiSkeletonWrapper>
                                                <div key={2} className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
                                                    <div className={'divide-y dark:divide-gray-700'}>
                                                        <div className={'w-full p-3 flex items-center space-x-3'}>
                                                            <PiSkeleton shape={"circle"} height={"50px"} width={"50px"}/>
                                                            <div className={'space-y-2'}>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            </div>
                                                        </div>
                                                        <div className={'w-full p-3 space-y-2'}>
                                                            <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            <PiSkeleton rounded={true} shape={"rectangle"} height={"30px"} width={"100%"}/>
                                                        </div>
                                                    </div>
                                                    <PiSkeleton shape={"rectangle"} height={"300px"} width={"100%"}/>
                                                    <div className={'w-full p-3 flex justify-between items-center'}>
                                                        <div className={'flex space-x-2'}>
                                                            <PiSkeleton rounded={true} shape={"square"} height={"40px"} width={"40px"}/>
                                                            <div className={'space-y-2'}>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            </div>
                                                        </div>
                                                        <PiSkeleton shape={"rectangle"} rounded={true} height={"30px"} width={"100px"}/>
                                                    </div>
                                                </div>
                                            </PiSkeletonWrapper>
                                            <PiSkeletonWrapper>
                                                <div key={3} className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
                                                    <div className={'divide-y dark:divide-gray-700'}>
                                                        <div className={'w-full p-3 flex items-center space-x-3'}>
                                                            <PiSkeleton shape={"circle"} height={"50px"} width={"50px"}/>
                                                            <div className={'space-y-2'}>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            </div>
                                                        </div>
                                                        <div className={'w-full p-3 space-y-2'}>
                                                            <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            <PiSkeleton rounded={true} shape={"rectangle"} height={"30px"} width={"100%"}/>
                                                        </div>
                                                    </div>
                                                    <PiSkeleton shape={"rectangle"} height={"300px"} width={"100%"}/>
                                                    <div className={'w-full p-3 flex justify-between items-center'}>
                                                        <div className={'flex space-x-2'}>
                                                            <PiSkeleton rounded={true} shape={"square"} height={"40px"} width={"40px"}/>
                                                            <div className={'space-y-2'}>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"10px"} width={"100px"}/>
                                                            </div>
                                                        </div>
                                                        <PiSkeleton shape={"rectangle"} rounded={true} height={"30px"} width={"100px"}/>
                                                    </div>
                                                </div>
                                            </PiSkeletonWrapper>
                                        </div>
                                    }
                                    {
                                        (reviews.length === 0 && !loading) &&
                                        <>
                                            <div className={'w-full p-4 space-y-4'}>
                                                <img src={'/empty-folder.png'} className={'w-[150px] h-[150px] m-auto'} />
                                                <label className={'block text-center uppercase'}>We have no reviews posted yet.</label>
                                            </div>

                                        </>
                                    }
                                    {
                                        reviews.length > 0 &&
                                        <div className={'w-full space-y-4'}>
                                            {
                                                reviews.map((review) =>
                                                    <div key={review.id} className={'dark:bg-gray-800 border bg-white overflow-hidden dark:border-gray-800 rounded-2xl w-full'}>
                                                        <div className={'divide-y dark:divide-gray-700'}>
                                                            <div className={'w-full p-3 flex items-center space-x-3'}>
                                                                <PiAvatar image={review.organisation?.image}/>
                                                                <div>
                                                                    <span className={'font-bold'}>{review.organisation?.name}</span>
                                                                    <p className={'text-xs dark:text-gray-500 uppercase'}>
                                                                        {review.reviewType?.name} REVIEW
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className={'w-full p-3'}>
                                                                <span className={'font-bold'}>{review.name}</span>
                                                                <p className={'text-[14px] dark:text-gray-400'}>
                                                                    <PiTruncate text={review.description}/>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <img src={review.image ?? '/img-placeholder.png'} className={'min-w-full h-auto'}/>
                                                        <div className={'w-full border-t dark:border-gray-800 flex justify-between divide-x dark:divide-gray-700 items-center'}>
                                                            <div className={'flex p-3 space-x-2'}>
                                                                <span className={'dark:text-gray-300 text-gray-600 text-3xl font-bold'}>{Math.floor(review.ratingAverage?.average).toFixed(1)}</span>
                                                                <div>
                                                                    <PiRating disabled={true} size={'small'} value={review.ratingAverage?.average} onSelectChange={() => {}}/>
                                                                    <span className={'text-[13px] pl-1 block leading-none'}>{`${review.ratingAverage?.totalReview} review${(review.ratingAverage?.totalReview > 0 || review.ratingAverage?.totalReview === 0) && 's'}`}</span>
                                                                </div>
                                                            </div>
                                                            <div className={'flex p-3 items-center divide-x dark:divide-gray-600'}>
                                                                <div>
                                                                    <PiButton rounded={'rounded'} size={'extra small'} type={'primary'} onClick={() => {reviewAnalyticsRouteHandler(review.id)}}>REVIEW</PiButton>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            {/*review feed end*/}

                            <div className={'lg:columns-1 lg:col-span-2'}>
                                <div className={'w-full sticky lg:top-4 mb-2'}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserBody>
    )
}