import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import {UserBody} from "../../components/shared/user-body";
import {PiRating} from "../../components/shared/pi-rating";
import {environment} from "../../components/shared/environment";
import {PiLoading} from "../../components/shared/pi-loading";
import {Paging} from "../../components/models/paging";
import {Rating} from "../../components/shared/rating";
import {AuthContext} from "../../components/store/auth-provider";
import {PagedResponse} from "../../components/models/PagedResponse";
import {PiSkeleton} from "../../components/shared/pi-skeleton";
import {ContextInterface} from "../../components/models/context-interface";
import {ApiResponse} from "../../components/models/ApiResponse";
import {PiTruncate} from "../../components/shared/pi-truncate";
import {Filter} from "../../components/models/filter";
import {PiAvatar} from "../../components/shared/pi-avatar";
import {ReviewForm} from "../../components/forms/review-form";
import {RatingForm} from "../../components/models/Rating";
import {MessageProps, PiMessage} from "../../components/shared/pi-message";
import {PiModal} from "../../components/shared/pi-modal";
import {CommentForm} from "../../components/forms/comment-form";
interface Score {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
}


export default function ReviewId () {
    const router = useRouter();

    const url = environment.apiUrl;

    const context = useContext(AuthContext);

    const [paging, setPaging] = useState<Paging>({ pageSize: 10, pageNumber: 1, totalPages: 0, totalRecords: 0, currentSize: 0 });

    const [filter, setFilter] = useState<Filter>({});

    const [currentSize, setCurrentSize] = useState<number>(0);

    const [editState, setEditState] = useState<boolean>(false);

    const [loadMore, setLoadMore] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [myReview, setMyReview] = useState<Rating>();

    const defaultForm: RatingForm = {
        reviewId: "",
        id: "",
        feedback: '',
        rating: 0,
        anonymous: false,
        images: []
    };

    const [ratingForm, setRatingForm] = useState<RatingForm>(defaultForm);

    const defaultRating: Array<Rating> = [];

    const [ratings, setRatings] = useState<Array<Rating>>(defaultRating);

    const [score, setScore] = useState<Score>({
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0
    });

    const getDefault: ContextInterface = {
        canLogout: () => {},
        canLogin: () => {},
        isAuthenticated: false }

    const [auth, setAuth] = useState<ContextInterface>(getDefault);

    const [reviewItem, setReviewItem] = useState<any>();

    const [bottom, setBottom] = useState<boolean>(false);

    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }

    const [openDialog, setOpenDialog] = useState(messageDialog);

    const [openComment, setComment] = useState<{ratingId: string, open: boolean}>({ ratingId: '', open: false});

    const openMessageHandler = (options: MessageProps) => {
        setOpenDialog((prevState) => {
            return {...prevState, open: options.open, message: options.message, type: options.type }
        });
    }

    const openCommentHandler = (ratingId: string) => {
        setComment((prevState) => {
            return {...prevState, ratingId: ratingId, open: true}
        });
    }

    const closeCommentHandler = () => {
        setComment((prevState) => {
            return {...prevState, ratingId: '', open: false, comment: ''}
        });
    }

    const closeMessageHandler = () => {
        setOpenDialog((prevState) => {
            return {...prevState, open: false }
        });
    }

    const getReviewItem = () => {
        fetch(`${url}ReviewItems/GetById/${filter.reviewId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                setReviewItem(result.data);
            });

        }).catch((reason) => {

        });
    }

    const saveRatingHandler = (form: RatingForm) => {
        setLoading(true);
        const data = {
            ratings: {
                reviewId: filter.reviewId,
                feedback: form.feedback,
                rating: form.rating,
                anonymous: form.anonymous,
                id: form.id
            },
            images: form.images
        }
        fetch(`${url}ReviewItems/Rate`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                if (result.status === 100) {
                    getReviewItem();
                    getCurrentReviewRatingHandler();
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

    const saveRatingCommentHandler = (form: string) => {
        setLoading(true);
        const data = {
            comment: form,
            ratingId: openComment.ratingId
        }
        fetch(`${url}ReviewItems/Comment`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                if (result.status === 100) {
                    getReviewItem();
                    getCurrentReviewRatingHandler();
                    closeCommentHandler();
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

    const getReviewRatingHandler = () => {
        setLoading(true);
        fetch(`${url}ReviewItems/GetUserReviewRatings?pageSize=${paging.pageSize}&pageNumber=${paging.pageNumber}`, {
            body: JSON.stringify(filter),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: PagedResponse<Array<Rating>>) => {
                const data: Array<Rating> = [...ratings];
                result.data.forEach((rate) => {
                    const find = data.find(u => u.id === rate.id);
                    if (!find) {
                        data.push(rate)
                    }
                });
                const myRating = data.find(u => u.user?.id === auth.user?.id);
                if (myRating) {
                    setMyReview(myRating);
                }
                setRatings(data);
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

    const getCurrentReviewRatingHandler = () => {
        setLoading(true);
        fetch(`${url}ReviewItems/GetUserReviewRatings?pageSize=${paging.pageSize}&pageNumber=${paging.pageNumber}`, {
            body: JSON.stringify(filter),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: PagedResponse<Array<Rating>>) => {
                const data: Array<Rating> = [];
                result.data.forEach((rate) => {
                    data.push(rate);
                });
                const myRating = data.find(u => u.user.id === auth.user?.id);
                if (myRating) {
                    setMyReview(myRating);
                }
                setRatings(data);
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
    const loadMoreReviewsHandler = () => {
        setLoadMore(true);
        setPaging(prevState => {
            return {...prevState, pageNumber: prevState.pageNumber + 1}
        });
    }

    const getScoreRating = (score: Score) => {
        const totalScore: Score = {
            five: isNaN(score.five / scoreTotal(score) * 100) ? 0 : score.five / scoreTotal(score) * 100,
            four: isNaN(score.four / scoreTotal(score) * 100) ? 0 : score.four / scoreTotal(score) * 100,
            three: isNaN(score.three / scoreTotal(score) * 100) ? 0: score.three / scoreTotal(score) * 100,
            two: isNaN(score.two / scoreTotal(score) * 100) ? 0 : score.two / scoreTotal(score) * 100,
            one: isNaN(score.one / scoreTotal(score) * 100) ? 0 : score.one / scoreTotal(score) * 100
        };
        setScore(totalScore);
    }

    const scoreTotal = (score: Score): number =>  {
        return (score.five + score.four + score.three + score.two + score.one);
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
            if (router.isReady) {
                const { reviewId } = router.query;
                setFilter(prevState => {
                    return { ...prevState, reviewId: reviewId as string }
                });
            }
        }
    }, [auth, router.isReady]);

    // update auth value
    useEffect(() => {

        if (auth.accesstoken?.token) {
            getReviewItem();
            getReviewRatingHandler()
        }
    }, [filter]);

    useEffect(() => {
        if (reviewItem) {
            getScoreRating(reviewItem.ratingAverage.score);
        }
    }, [reviewItem]);

    // load more when 50px closer to bottom
    useEffect(() => {
        const ele = document.getElementById('list-review-items') as HTMLDivElement;
        const event = (event:any) => {
            const scroll = (ele.scrollHeight - ele.scrollTop);
            if (ele.clientHeight >= scroll - 50) {
                if (paging.totalRecords > currentSize) {
                    setBottom(true);
                } else  {
                    setBottom(false);
                }
            } else {
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
        if (paging.pageNumber > 1) {
            const size = paging.pageSize * paging.pageNumber - 1 + paging.currentSize;
            setCurrentSize(size);
        } else {
            setCurrentSize(paging.currentSize);
        }
    }, [paging]);

    useEffect(() => {
        if (loadMore) {
            getReviewRatingHandler();
        }
    }, [loadMore]);

    useEffect(() => {
        if (myReview) {
            setRatingForm(prevState => {
                return { ...prevState, rating: myReview?.rating, anonymous: myReview?.anonymous, feedback: myReview?.feedback, images: myReview?.images.map(image => image.image), id: myReview?.id}
            });
            setEditState(true);
        }
    }, [myReview])

    return (
        <>
            <UserBody showBackButton={true}>
                {
                    openDialog.open && <PiMessage onClose={closeMessageHandler} message={openDialog.message} type={openDialog.type}/>
                }
                {
                    openComment.open &&
                    <PiModal fullScreen={false} onClose={closeCommentHandler}>
                        <CommentForm onFormSubmit={(e) => {saveRatingCommentHandler(e)}} loading={loading}/>
                    </PiModal>
                }
                <div className="flex flex-col w-full h-full">
                    <div className="flex justify-center w-full h-full overflow-auto">
                        <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">

                            <div className="grid lg:grid-cols-7 gap-4 h-full relative w-full py-4 px-2 overflow-hidden">

                                <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden max-lg:px-2'}>
                                    <div className={'w-full sticky top-2'}>
                                        <div className={'w-full bg-white dark:bg-gray-800 border dark:border-gray-800 rounded-xl p-4'}>
                                            <img src={reviewItem?.organisation?.image ?? `/user.png`} className={'block m-auto max-w-[150px] h-auto p-1 rounded-lg'}/>
                                            <span className={'block text-2xl text-center mt-4'}>
                                                {reviewItem?.organisation?.name}
                                            </span>
                                            <span className={'block text-lg dark:text-gray-500 text-center mt-0.5'}>
                                                {reviewItem?.organisation?.address}
                                            </span>
                                            <span className={'block text-lg dark:text-gray-500 text-center mt-0.5'}>
                                                {reviewItem?.organisation?.phoneNumber}
                                            </span>
                                        </div>
                                        <a className={'flex space-x-4 p-4 bg-white items-center mt-4 w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl'} href={'/reviews/feed'}>
                                            <i className={'pi pi-arrow-left text-xs'}></i>
                                            <span className={'block text-lg cursor-pointer'}>Home</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="grow h-full lg:columns-3 lg:col-span-3 flex mb-4 overflow-auto feed" id={'list-review-items'}>
                                    <div className={'h-full flex flex-col w-full'}>
                                        <div className={'max-lg:py-2 max-lg:px-2 space-y-4'}>
                                            {
                                                !reviewItem &&
                                                <>
                                                    <div className={'dark:bg-gray-800 bg-white border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
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
                                                </>
                                            }
                                            {
                                                reviewItem &&
                                                <div key={reviewItem.id} className={'dark:bg-gray-800 bg-white border overflow-hidden dark:border-gray-800 rounded-2xl w-full'}>
                                                    <div className={'divide-y dark:divide-gray-700'}>
                                                        <div className={'w-full p-3 flex items-center space-x-3'}>
                                                            <PiAvatar image={reviewItem.organisation?.image}/>
                                                            <div>
                                                                <span className={'font-bold'}>{reviewItem.organisation?.name}</span>
                                                                <p className={'text-xs dark:text-gray-500 uppercase'}>
                                                                    {reviewItem.reviewType?.name} REVIEW
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={'w-full p-3'}>
                                                            <span className={'font-bold'}>{reviewItem.name}</span>
                                                            <p className={'text-[14px] dark:text-gray-400'}>
                                                                <PiTruncate text={reviewItem.description}/>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <img src={reviewItem.image ?? '/img-placeholder.png'} className={'min-w-full h-auto'}/>
                                                    <div className={'p-2'}>
                                                       <ReviewForm showImagePicker={reviewItem?.allowPhoto} editState={editState} formData={ratingForm} onFormSubmit={(e) => {saveRatingHandler(e)}} loading={loading}/>
                                                    </div>
                                                    <div className={'w-full p-4 space-y-4'}>
                                                        {
                                                           (ratings.length === 0 && loading) &&
                                                            <>
                                                                <div className={'flex space-x-2'}>
                                                                    <PiSkeleton shape={"circle"} height={"40px"} width={"40px"}/>
                                                                    <div className={'w-full'}>
                                                                        <div className={'flex justify-between items-center'}>
                                                                            <div className={'pb-2 space-y-2'}>
                                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                                <div className={'flex space-x-2'}>
                                                                                    <PiSkeleton rounded={true} shape={"square"} height={"20px"} width={"20px"}/>
                                                                                    <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                                </div>
                                                                            </div>
                                                                            <PiSkeleton rounded={true} shape={"square"} height={"20px"} width={"20px"}/>
                                                                        </div>
                                                                        <PiSkeleton rounded={true} shape={"rectangle"} height={"70px"} width={"100%"}/>
                                                                    </div>
                                                                </div>
                                                                <div className={'flex space-x-2'}>
                                                                    <PiSkeleton shape={"circle"} height={"40px"} width={"40px"}/>
                                                                    <div className={'w-full'}>
                                                                        <div className={'flex justify-between items-center'}>
                                                                            <div className={'pb-2 space-y-2'}>
                                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                                <div className={'flex space-x-2'}>
                                                                                    <PiSkeleton rounded={true} shape={"square"} height={"20px"} width={"20px"}/>
                                                                                    <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                                </div>
                                                                            </div>
                                                                            <PiSkeleton rounded={true} shape={"square"} height={"20px"} width={"20px"}/>
                                                                        </div>
                                                                        <PiSkeleton rounded={true} shape={"rectangle"} height={"70px"} width={"100%"}/>
                                                                    </div>
                                                                </div>
                                                                <div className={'flex space-x-2'}>
                                                                    <PiSkeleton shape={"circle"} height={"40px"} width={"40px"}/>
                                                                    <div className={'w-full'}>
                                                                        <div className={'flex justify-between items-center'}>
                                                                            <div className={'pb-2 space-y-2'}>
                                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                                <div className={'flex space-x-2'}>
                                                                                    <PiSkeleton rounded={true} shape={"square"} height={"20px"} width={"20px"}/>
                                                                                    <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                                </div>
                                                                            </div>
                                                                            <PiSkeleton rounded={true} shape={"square"} height={"20px"} width={"20px"}/>
                                                                        </div>
                                                                        <PiSkeleton rounded={true} shape={"rectangle"} height={"70px"} width={"100%"}/>
                                                                    </div>
                                                                </div>
                                                                <div className={'flex space-x-2'}>
                                                                    <PiSkeleton shape={"circle"} height={"40px"} width={"40px"}/>
                                                                    <div className={'w-full'}>
                                                                        <div className={'flex justify-between items-center'}>
                                                                            <div className={'pb-2 space-y-2'}>
                                                                                <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                                <div className={'flex space-x-2'}>
                                                                                    <PiSkeleton rounded={true} shape={"square"} height={"20px"} width={"20px"}/>
                                                                                    <PiSkeleton rounded={true} shape={"rectangle"} height={"20px"} width={"100px"}/>
                                                                                </div>
                                                                            </div>
                                                                            <PiSkeleton rounded={true} shape={"square"} height={"20px"} width={"20px"}/>
                                                                        </div>
                                                                        <PiSkeleton rounded={true} shape={"rectangle"} height={"70px"} width={"100%"}/>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            (ratings.length === 0 && !loading) &&
                                                            <>
                                                                <div className={'w-full p-4 space-y-4'}>
                                                                    <img src={'/empty-folder.png'} className={'w-[150px] h-[150px] m-auto'} />
                                                                    <label className={'block text-center uppercase'}>this {reviewItem.reviewType?.name} has no reviews yet.</label>
                                                                </div>

                                                            </>
                                                        }
                                                        {
                                                            ratings.length > 0 &&
                                                            ratings.map((rate) =>
                                                                <div key={rate.id} className={'flex space-x-2'}>
                                                                    <PiAvatar image={rate.user?.image} />
                                                                    <div className={'w-full'}>
                                                                        <div className={'flex justify-between items-center'}>
                                                                            <div className={'pb-2'}>
                                                                                {
                                                                                    !rate.notLoggedIn &&
                                                                                    <span className={'font-bold'}>{rate.anonymous ? 'Anonymous' : `${rate.user?.firstName} ${rate.user?.lastName}`}</span>
                                                                                }
                                                                                {
                                                                                    rate.notLoggedIn &&
                                                                                    <span className={'font-bold'}>{rate.anonymous ? 'Anonymous' : rate?.name}</span>
                                                                                }
                                                                                <div className={'flex space-x-2'}>
                                                                                    <span>{Math.floor(rate.rating).toFixed(1)}</span>
                                                                                    <PiRating disabled={true} size={'small'} value={rate.rating} onSelectChange={() => {}}/>
                                                                                </div>
                                                                            </div>
                                                                            <span className={'text-[13px]'}>{ formatDistanceToNowStrict(new Date(rate.date)) } ago</span>
                                                                        </div>
                                                                        <div className={'text-[15px] dark:bg-gray-700 dark:text-gray-100 bg-gray-200 p-3 w-full rounded-tr-lg rounded-b-lg'}>
                                                                            {rate.feedback ?? 'No feedback'}
                                                                            {
                                                                                rate.images.length > 0 &&
                                                                                <div className="overflow-x-auto flex space-x-3 items-center">
                                                                                    {
                                                                                        rate.images.map(img =>
                                                                                            <div key={img.id} className={'h-[100px] min-w-[100px] bg-contain bg-center bg-no-repeat dark:border-gray-700 relative'} style={{backgroundImage: `url(${img.image})`}}></div>)
                                                                                    }
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                        <div className={'flex justify-end py-2'}>
                                                                            <div onClick={() => {openCommentHandler(rate.id)}} className={'flex items-center space-x-2 group cursor-pointer'}>
                                                                                <i className={'pi pi-comments group-hover:cursor-pointer'}></i>
                                                                                <label className={'leading-none group-hover:cursor-pointer'}>
                                                                                    reply
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            rate.comments?.length > 0 &&
                                                                            <>
                                                                                {/*<span>Comments</span>*/}
                                                                                <div className={'ml-4'}>
                                                                                    {
                                                                                        rate.comments.map((comment: any) =>
                                                                                            <div key={comment.id} className={'flex space-x-2'}>
                                                                                                {
                                                                                                    comment.responseAsOrganization &&
                                                                                                    <PiAvatar image={comment.user?.organization?.image} />
                                                                                                }
                                                                                                {
                                                                                                    !comment.responseAsOrganization &&
                                                                                                    <PiAvatar image={comment.user?.image} />
                                                                                                }
                                                                                                <div className={'w-full'}>
                                                                                                    <div className={'flex justify-between items-center'}>
                                                                                                        <div className={'pb-2'}>
                                                                                                            {
                                                                                                                comment.responseAsOrganization &&
                                                                                                                <span className={'font-bold'}>{`${comment.user?.organization?.name}`}</span>
                                                                                                            }
                                                                                                            {
                                                                                                                !comment.responseAsOrganization &&
                                                                                                                <span className={'font-bold'}>{`${comment.user?.firstName} ${comment.user?.lastName}`}</span>
                                                                                                            }
                                                                                                        </div>
                                                                                                        <span className={'text-[13px]'}>{ formatDistanceToNowStrict(new Date(comment.date)) } ago</span>
                                                                                                    </div>
                                                                                                    <div className={'text-[15px] dark:bg-gray-700 dark:text-gray-100 bg-gray-200 p-3 w-full rounded-tr-lg rounded-b-lg'}>
                                                                                                        {comment.comment}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <PiLoading loading={loadMore}>
                                                        {
                                                            paging.totalRecords > currentSize &&
                                                            <div className={'flex justify-center w-full'}>
                                                                <label onClick={loadMoreReviewsHandler} className={'text-[13px] p-2 leading-none rounded hover:bg-gray-200 dark:hover:bg-gray-700 mb-3 cursor-pointer'}>Load more reviews</label>
                                                            </div>
                                                        }
                                                    </PiLoading>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className={'lg:columns-1 lg:col-span-2'}>
                                    <div className={'w-full sticky lg:top-2 mb-2'}>
                                        {
                                            reviewItem &&
                                            <div className={'space-y-3'}>
                                                <div className="p-2 border dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-800">
                                                    <label className="leading-3 font-bold text-base mb-4">Average Ratings</label>
                                                    <div className="h-auto flex space-x-4 items-center">
                                                        <h1 className="text-5xl font-bold">{Math.floor(reviewItem.ratingAverage.average).toFixed(1)}</h1>
                                                        <PiRating disabled={true} size={'default'} value={reviewItem.ratingAverage.average} onSelectChange={() => {}} />
                                                    </div>
                                                    <span className="text-gray-400 text-xs">Average rating for all reviews</span>
                                                </div>

                                                <div className="p-2 border dark:border-gray-800 rounded-2xl space-y-1 bg-white dark:bg-gray-800">
                                                    <label className="leading-3 font-bold text-base">Rating Score</label>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">5 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.five}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{Math.floor(score.five)}%</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">4 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.four}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{Math.floor(score.four)}%</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">3 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.three}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{Math.floor(score.three)}%</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">2 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.two}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{Math.floor(score.two)}%</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">1 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.one}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{Math.floor(score.one)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </UserBody>
        </>
    )
}