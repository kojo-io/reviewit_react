import {useRouter} from "next/router";
import {environment} from "../../../components/shared/environment";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../components/store/auth-provider";
import {Paging} from "../../../components/models/paging";
import {Filter} from "../../../components/models/filter";
import {ReviewItem} from "../../../components/models/review item";
import {ApiResponse} from "../../../components/models/ApiResponse";
import {MessageProps} from "../../../components/shared/pi-message";
import {ContextInterface} from "../../../components/models/context-interface";
import {AdminBody} from "../../../components/shared/admin-body";
import {PiSkeletonWrapper} from "../../../components/shared/pi-skeleton-wrapper";
import {PiSkeleton} from "../../../components/shared/pi-skeleton";
import {PiTruncate} from "../../../components/shared/pi-truncate";
import {PiRating} from "../../../components/shared/pi-rating";
import {PiButton} from "../../../components/shared/pi-button";
import {Organization} from "../../../components/models/Organization";
import {PagedResponse} from "../../../components/models/PagedResponse"

export default function BusinessId() {
    const router = useRouter();

    const url = environment.apiUrl;

    const context = useContext(AuthContext);

    const [paging, setPaging] = useState<Paging>({ pageSize: 5, pageNumber: 1, totalPages: 0, totalRecords: 0, currentSize: 0 });

    const [filter, setFilter] = useState<Filter>({ organizationId: '' });

    const [currentSize, setCurrentSize] = useState<number>(0);

    const [loadMore, setLoadMore] = useState<boolean>(false);

    const [bottom, setBottom] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const defaultReviews: Array<ReviewItem> = [];

    const [reviews, setReviews] = useState<ReviewItem[]>(defaultReviews);

    const [organization, setOrganization] = useState<Organization>({name: '', address: '', phoneNumber: '', id: '', image: ''});

    const getDefault: ContextInterface = {
        canLogout: () => {},
        canLogin: () => {},
        isAuthenticated: false }

    const [auth, setAuth] = useState<ContextInterface>(getDefault);

    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }

    const [openDialog, setOpenDialog] = useState(messageDialog);

    const openMessageHandler = (options: MessageProps) => {
        setOpenDialog((prevState) => {
            return {...prevState, open: options.open, message: options.message, type: options.type }
        });
    }
    const getOrganization = () => {
        fetch(`${url}Organization/GetById/${filter.organizationId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                setOrganization(result.data);
            });
        }).catch((reason) => {

        });
    }

    const getAllReviewItemsHandler = () => {
        setLoading(true);
        fetch(`${url}Organization/GetAllOrganizationReviewPostings?pageSize=${paging.pageSize}&pageNumber=${paging.pageNumber}`, {
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
            openMessageHandler({type: "error", message: 'something went wrong please try again', open: true});
        });
    }

    const reviewAnalyticsRouteHandler = (reviewId: any) => {
        router.push(`/admin/business/review/${reviewId}?business=${filter.organizationId}`);
    }

    const loadMoreReviewsHandler = () => {
        setLoadMore(true);
        setPaging(prevState => {
            return {...prevState, pageNumber: prevState.pageNumber + 1}
        });
    }

    // check token
    useEffect(() => {
        setAuth((prevState) => {
            return {...prevState, user: context.user, accesstoken: context.accesstoken, isAuthenticated: true }
        });
    }, [context]);

    // update auth value
    useEffect(() => {
        if (auth.accesstoken?.token) {
            if (router.isReady) {
                const { businessId } = router.query;
                setFilter(prevState => {
                    return { ...prevState, organizationId: businessId as string}
                });
            }
        }
    }, [auth, router.isReady]);

    useEffect(() => {
        if (auth.accesstoken?.token) {
            getOrganization();
            getAllReviewItemsHandler();
        }
    }, [filter]);

    useEffect(() => {
        const ele = document.getElementById('list-org-items') as HTMLDivElement;
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
            console.log('paging', paging.totalRecords, currentSize);
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
        <AdminBody>
            <div className="flex flex-col w-full h-full">
                <div className="flex justify-center w-full h-full">
                    <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">

                        <div className="grid lg:grid-cols-7 gap-4 h-full relative w-full py-4 px-2">

                            <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden max-lg:px-2'}>
                                <div className={'sticky top-4'}>
                                    <div className={'w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl p-4'}>
                                        <img src={organization?.image ?? `/user.png`} className={'block m-auto max-w-[150px] h-auto p-1 rounded-lg'}/>
                                        <span className={'block text-2xl text-center mt-4'}>
                                        {organization?.name}
                                    </span>
                                        <span className={'block text-lg dark:text-gray-500 text-center mt-0.5'}>
                                        {organization?.address}
                                    </span>
                                        <span className={'block text-lg dark:text-gray-500 text-center mt-0.5'}>
                                        {organization?.phoneNumber}
                                    </span>
                                    </div>
                                    <div className={'mt-4 space-y-4'}>
                                        <a className={'flex space-x-4 p-4 items-centerw-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl group hover:cursor-pointer'} href={'/admin/business'}>
                                            <i className={'pi pi-building text-lg group-hover:cursor-pointer'}></i>
                                            <label className={'block text-lg leading-none group-hover:cursor-pointer'}>Organizations</label>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/*review feed start*/}
                            <div className="grow h-full lg:columns-3 lg:col-span-3 flex pb-4 overflow-auto feed" id={'list-org-items'}>
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
                                                <label className={'block text-center uppercase'}>{organization?.name} has no reviews posted yet.</label>
                                            </div>
                                        </>
                                    }
                                    {
                                        reviews.length > 0 &&
                                        <div className={'w-full space-y-4'}>
                                            {
                                                reviews.map((review) =>
                                                    <div key={review.id} className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full'}>
                                                        <div className={'divide-y dark:divide-gray-700'}>
                                                            <div className={'w-full p-3 flex items-center space-x-3'}>
                                                                <img src={review.organisation?.image ?? `/user.png`} className={'w-[40px] h-[40px] rounded-full'}/>
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
                                                        <div className={'w-full p-3 flex justify-between items-center'}>
                                                            <div className={'flex space-x-2'}>
                                                                <span className={'text-gray-300 text-3xl font-bold'}>{Math.floor(review.ratingAverage?.average).toFixed(1)}</span>
                                                                <div>
                                                                    <PiRating disabled={true} size={'small'} value={review.ratingAverage?.average} onSelectChange={() => {}}/>
                                                                    <span className={'text-[13px] pl-1 block leading-none'}>{`${review.ratingAverage?.totalReview} review${(review.ratingAverage?.totalReview > 0 || review.ratingAverage?.totalReview === 0) && 's'}`}</span>
                                                                </div>
                                                            </div>
                                                            <div className={'flex gap-2 items-center divide-x dark:divide-gray-600'}>
                                                                {/*<div>*/}
                                                                {/*    <PiButton rounded={'rounded'} size={'extra small'} type={'primary'} onClick={() => {}}>EDIT</PiButton>*/}
                                                                {/*</div>*/}
                                                                <div>
                                                                    <PiButton rounded={'rounded'} size={'extra small'} type={'primary'} onClick={() => {reviewAnalyticsRouteHandler(review.id)}}>VIEW</PiButton>
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
        </AdminBody>
    )
}