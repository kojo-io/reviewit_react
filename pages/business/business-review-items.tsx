import {OrgBody} from "../shared/org-body";
import {useContext, useEffect, useReducer, useState} from "react";
import OrgReviewForm from "../forms/org-review-form";
import PiTextrea from "../shared/pi-textrea";
import {environment} from "../shared/environment";
import {ApiResponse} from "../models/ApiResponse";
import {ItemType} from "../models/ItemType";
import {MessageProps} from "../shared/pi-message";
import {PiModal} from "../shared/pi-modal";
import {Paging} from "../models/paging";
import {ReviewItem, ReviewItemForm} from "../models/review item";
import {PiTruncate} from "../shared/pi-truncate";
import {AuthContext} from "../store/auth-provider";
import {ContextInterface} from "../models/context-interface";
import {PiRating} from "../shared/pi-rating";
import {PiButton} from "../shared/pi-button";
import {PiSkeleton} from "../shared/pi-skeleton";
import {useRouter} from "next/router";
import {PiSkeletonWrapper} from "../shared/pi-skeleton-wrapper";
import {Filter} from "../models/filter";
import {PagedResponse} from "../models/PagedResponse";
import {PiAvatar} from "../shared/pi-avatar";

export default function BusinessReviewItems() {
    const url = environment.apiUrl;
    const context = useContext(AuthContext);
    const router = useRouter();

    const createReviewText = '';

    const getDefault: ContextInterface = {
        canLogout: () => {},
        canLogin: () => {},
        isAuthenticated: false }

    const [auth, setAuth] = useState<ContextInterface>(getDefault);

    const [openModal, setOpenModal] = useState<boolean>(false);

    const [paging, setPaging] = useState<Paging>({ pageSize: 10, pageNumber: 1, totalPages: 0, totalRecords: 0, currentSize: 0 });

    const [filter, setFilter] = useState<Filter>({ });

    const [currentSize, setCurrentSize] = useState<number>(0);

    const [loadMore, setLoadMore] = useState<boolean>(false);

    const [bottom, setBottom] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [loadingList, setLoadingList] = useState<boolean>(false);

    const [itemType, setItemType] = useState<ItemType[]>();

    const [reviews, setReviews] = useState<ReviewItem[]>([])

    const [editState, setEditState] = useState<boolean>(false);

    const defaultForm: ReviewItemForm = {
        active: false,
        id: "",
        imageId: "",
        organisationId: "",
        ratingType: 0,
        name: '',
        description: '',
        image: '',
        allowPhoto: false,
        reviewType: ''
    };

    const [reviewItem, setReviewItem] = useState<ReviewItemForm>(defaultForm);

    const editForm = (form: ReviewItem) => {
        setReviewItem(prevState => {
            return { ...prevState,
                image: form.image,
                reviewType: form.reviewType?.id,
                ratingType: form.ratingType,
                active: form.active,
                id: form.id,
                imageId: form.imageId,
                organisationId: form.organisation.id,
                name: form.name,
                description: form.description,
                allowPhoto: form.allowPhoto
            }
        });
        setEditState(true);
    }

    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }

    const [openDialog, setOpenDialog] = useState(messageDialog);
    const openModalHandler = () => {
        setOpenModal(true);
    }

    const closeModalHandler = () => {
        setEditState(false);
        setOpenModal(false);
        setReviewItem(defaultForm);
    }

    const openMessageHandler = (options: MessageProps) => {
        setOpenDialog((prevState) => {
            return {...prevState, open: options.open, message: options.message, type: options.type }
        });
    }

    const closeMessageHandler = () => {
        setOpenDialog((prevState) => {
            return {...prevState, open: false }
        });
    }

    const loadMoreReviewsHandler = () => {
        setLoadMore(true);
        setPaging(prevState => {
            return {...prevState, pageNumber: prevState.pageNumber + 1}
        });
    }

    // get review item types
    const getItemsHandler = () => {
        fetch(`${url}Account/ItemTypes`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                setItemType(result.data);
            });

        }).catch((reason) => {
            openMessageHandler({type: "error", message: 'something went wrong please try again', open: true});
        });
    }

    const getAllReviewItemsHandler = () => {
        setLoadingList(true);
        fetch(`${url}ReviewItems/GetAllPaginated?pageSize=${paging.pageSize}&pageNumber=${paging.pageNumber}`, {
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
                setLoadingList(false);
            });

        }).catch((reason) => {
            openMessageHandler({type: "error", message: 'something went wrong please try again', open: true});
        });
    }

    const saveHandler = (form: ReviewItem, editState: boolean) => {
        if (editState) {
            updateReviewHandler(form);
        } else {
            saveReviewHandler(form);
        }
    }

    const saveReviewHandler = (form: ReviewItem) => {
        setLoading(true);
        fetch(`${url}ReviewItems`, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                if (result.status === 100) {
                    getAllReviewItemsHandler();
                    setOpenModal(false);
                    openMessageHandler({type: "success", message: result.message, open: true});
                } else {
                    openMessageHandler({type: "error", message: result.message, open: true});
                }
            }).finally(() => {
                setLoading(false);
            });

        }).catch((reason) => {
            openMessageHandler({type: "error", message: 'something went wrong please try again', open: true});
        });
    }

    const updateReviewHandler = (form: ReviewItem) => {
        setLoading(true);
        fetch(`${url}ReviewItems`, {
            method: 'PUT',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                if (result.status === 100) {
                    getAllReviewItemsHandler();
                    setOpenModal(false);
                    openMessageHandler({type: "success", message: result.message, open: true});
                } else {
                    openMessageHandler({type: "error", message: result.message, open: true});
                }
            }).finally(() => {
                setLoading(false);
            });

        }).catch((reason) => {
            openMessageHandler({type: "error", message: 'something went wrong please try again', open: true});
        });
    }

    const reviewAnalyticsRouteHandler = (reviewId: any) => {
        router.push(`/business/review/${reviewId}`);
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
            getItemsHandler();
        }
    }, [auth]);

    // open modal when edit is true
    useEffect(() => {
        if (editState) {
            setOpenModal(true);
        }
    }, [editState]);

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

    return(
        <>
            {
                openModal &&
                <PiModal fullScreen={false} onClose={closeModalHandler}>
                    <OrgReviewForm loading={loading} onFormSubmit={saveHandler} editState={editState} formData={reviewItem} listData={itemType}/>
                </PiModal>
            }
            <OrgBody showBackButton={false}>
                <div className="flex flex-col w-full h-full">
                    <div className="flex justify-center w-full h-full">
                        <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">

                            <div className="grid lg:grid-cols-7 gap-4 h-full relative w-full py-4 px-2">

                                <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden max-lg:px-2'}>
                                    <div className={'w-full bg-white dark:bg-gray-800 border dark:border-gray-800 rounded-xl p-4 sticky top-4'}>
                                        <img src={context?.user?.organization?.image ?? `/user.png`} className={'block m-auto max-w-[150px] h-auto p-1 rounded-lg'}/>
                                        <span className={'block text-2xl text-center mt-4'}>
                                            {context.user?.organization?.name}
                                        </span>
                                        <span className={'block text-lg dark:text-gray-500 text-center mt-0.5'}>
                                            {context.user?.organization?.address}
                                        </span>
                                        <span className={'block text-lg dark:text-gray-500 text-center mt-0.5'}>
                                            {context.user?.organization?.phoneNumber}
                                        </span>
                                    </div>
                                </div>

                                {/*review feed start*/}
                                <div className="grow h-full lg:columns-3 lg:col-span-3 flex overflow-auto mb-4 feed" id={'list-review-items'}>
                                    <div className={'h-full flex flex-col w-full'}>
                                        <div className={'rounded-2xl w-full dark:bg-gray-800 border dark:border-gray-800 bg-white'}>
                                            <div className={'p-4'}>
                                                <label className={'pb-2 block'}>Create Review</label>
                                                <div onClick={openModalHandler}>
                                                    <PiTextrea rounded={'rounded'} rows={2} readOnly={true} onChange={() => {}} id={'dummy'} value={createReviewText}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'py-4 space-y-4'}>
                                            {
                                                (reviews.length === 0 && loading) &&
                                                <>
                                                    <PiSkeletonWrapper>
                                                        <div key={1} className={'dark:bg-gray-800 bg-white border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
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
                                                        <div key={2} className={'dark:bg-gray-800 bg-white border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
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
                                                        <div key={3} className={'dark:bg-gray-800 border bg-white overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
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
                                                </>
                                            }
                                            {
                                                (reviews.length === 0 && !loading) &&
                                                <>
                                                    <div className={'w-full p-4 space-y-4'}>
                                                        <img src={'/empty-folder.png'} className={'w-[150px] h-[150px] m-auto'} />
                                                        <label className={'block text-center'}>You have no reviews posted yet.</label>
                                                    </div>

                                                </>
                                            }
                                            {
                                                (reviews.length > 0 && !loading) &&
                                                reviews.map((review) =>
                                                    <div key={review.id} className={'dark:bg-gray-800 bg-white border overflow-hidden dark:border-gray-800 rounded-2xl w-full'}>
                                                        <div className={'divide-y dark:divide-gray-700'}>
                                                            <div className={'w-full p-3 flex items-center space-x-3'}>
                                                                <PiAvatar image={context?.user?.organization?.image}></PiAvatar>
                                                                <div>
                                                                    <span className={'font-bold'}>{context.user?.organization?.name}</span>
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
                                                        <div className={'w-full p-3 border-t dark:border-gray-700 flex justify-between items-center'}>
                                                            <div className={'flex space-x-2'}>
                                                                <span className={'dark:text-gray-300 text-gray-500 text-3xl font-bold'}>{Math.floor(review.ratingAverage?.average).toFixed(1)}</span>
                                                                <div>
                                                                    <PiRating disabled={true} size={'small'} value={review.ratingAverage?.average} onSelectChange={() => {}}/>
                                                                    <span className={'text-[13px] pl-1 block leading-none'}>{`${review.ratingAverage?.totalReview} review${(review.ratingAverage?.totalReview > 0 || review.ratingAverage?.totalReview === 0) && 's'}`}</span>
                                                                </div>
                                                            </div>
                                                            <div className={'flex gap-2 items-center divide-x dark:divide-gray-600'}>
                                                                <div>
                                                                    <PiButton rounded={'rounded'} size={'extra small'} type={'primary'} onClick={() => {editForm(review)}}>EDIT</PiButton>
                                                                </div>
                                                                <div className={'pl-2'}>
                                                                    <PiButton rounded={'rounded'} size={'extra small'} type={'primary'} onClick={() => {reviewAnalyticsRouteHandler(review.id)}}>VIEW</PiButton>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/*review feed end*/}

                                <div className={'lg:columns-1 lg:col-span-2'}>
                                    <div className={'w-full sticky lg:top-4 mb-2'}>
                                        {/*<div className={'flex space-x-4 p-4 items-center w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl cursor-pointer'} onClick={context.canLogout}>*/}
                                        {/*    <i className={'pi pi-arrow-left text-xs'}></i>*/}
                                        {/*    <label className={'block text-lg'}>Log out</label>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </OrgBody>
        </>
    )
}