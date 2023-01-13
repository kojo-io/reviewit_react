import {useRouter} from "next/router";
import {OrgBody} from "../../shared/org-body";
import {PiSkeleton} from "../../shared/pi-skeleton";
import {PiTruncate} from "../../shared/pi-truncate";
import {PiRating} from "../../shared/pi-rating";
import {environment} from "../../shared/environment";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../store/auth-provider";
import {ContextInterface} from "../../models/context-interface";
import {ApiResponse} from "../../models/ApiResponse";
import {Paging} from "../../models/paging";
import {Filter} from "../../models/filter";
import {Rating} from "../../shared/rating";
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import {PagedResponse} from "../../models/PagedResponse";
import {PiLoading} from "../../shared/pi-loading";

interface Score {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
}


export default function ReviewId () {
    const router = useRouter();

    const { reviewId } = router.query;

    const url = environment.apiUrl;

    const context = useContext(AuthContext);

    const [paging, setPaging] = useState<Paging>({ pageSize: 5, pageNumber: 1, totalPages: 0, totalRecords: 0, currentSize: 0 });

    const [filter, setFilter] = useState<Filter>({ search: reviewId as string });

    const [currentSize, setCurrentSize] = useState<number>(0);

    const [loadMore, setLoadMore] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

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

    const getReviewItem = () => {
        fetch(`${url}ReviewItems/GetById/${reviewId}`, {
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

    const getReviewRatingHandler = () => {
        setLoading(true);
        fetch(`${url}ReviewItems/GetReviewRatings?pageSize=${paging.pageSize}&pageNumber=${paging.pageNumber}`, {
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
        setFilter(prevState => {
            return { ...prevState, search: reviewId as string}
        });
    }, [context, reviewId]);

    // update auth value
    useEffect(() => {
        if (auth.accesstoken?.token) {
            getReviewItem();
            getReviewRatingHandler();
        }
    }, [auth]);

    useEffect(() => {
        if (reviewItem) {
            getScoreRating(reviewItem.ratingAverage.score);
        }
    }, [reviewItem]);


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

    return (
        <>
            <OrgBody>
                <div className="flex flex-col w-full h-full">
                    <div className="flex justify-center w-full h-full">
                        <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">

                            <div className="grid lg:grid-cols-7 gap-4 h-full relative w-full pt-4 px-2">

                                <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden max-lg:px-2'}>
                                    <div className={'w-full sticky top-4'}>
                                        <div className={'w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl p-4'}>
                                            <img src={context?.user?.organization?.image ?? `/user.png`} className={'block border m-auto w-[100px] h-[100px] p-1 rounded-full'}/>
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
                                        <a className={'flex space-x-4 p-4 items-center mt-4 w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl'} href={'/organization/org-review-items'}>
                                            <i className={'pi pi-arrow-left text-xs'}></i>
                                            <label className={'block text-lg'}>Home</label>
                                        </a>
                                    </div>
                                </div>

                                <div className="grow h-full lg:columns-3 lg:col-span-3 flex mb-4">
                                    <div className={'h-full flex flex-col w-full'}>
                                        <div className={'max-lg:py-2 max-lg:px-2 space-y-4'}>
                                            {
                                                !reviewItem &&
                                                <>
                                                    <div className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
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
                                                <div key={reviewItem.id} className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full'}>
                                                    <div className={'divide-y dark:divide-gray-700'}>
                                                        <div className={'w-full p-3 flex items-center space-x-3'}>
                                                            <img src={reviewItem.organisation?.image ?? `/user.png`} className={'w-[40px] h-[40px] rounded-full'}/>
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
                                                                    <img src={`/user.png`} className={'w-[40px] h-[40px] rounded-full'}/>
                                                                    <div className={'w-full'}>
                                                                        <div className={'flex justify-between items-center'}>
                                                                            <div className={'pb-2'}>
                                                                                <span className={'font-bold'}>{rate.anonymous ? 'Anonymous' : rate.name}</span>
                                                                                <div className={'flex space-x-2'}>
                                                                                    <span>{Math.floor(rate.rating).toFixed(1)}</span>
                                                                                    <PiRating disabled={true} size={'small'} value={rate.rating}/>
                                                                                </div>
                                                                            </div>
                                                                            <span className={'text-[13px]'}>{ formatDistanceToNowStrict(new Date(rate.date)) } ago</span>
                                                                        </div>
                                                                        <div className={'text-[15px] dark:bg-gray-700 dark:text-gray-100 bg-gray-200 p-3 w-full rounded-tr-lg rounded-b-lg'}>
                                                                            {rate.feedback ?? 'No feedback'}
                                                                        </div>
                                                                        {
                                                                            rate.images.length > 0 &&
                                                                            <div className={'w-32 p-4 rounded mt-2 border dark:border-gray-700 border-gray-200 h-24 bg-center bg-cover'} style={{backgroundImage: `url(${rate.images[0].image})`}}></div>
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
                                    <div className={'w-full sticky lg:top-4 mb-2'}>
                                        {
                                            reviewItem &&
                                            <div className={'space-y-3'}>
                                                <div className="p-2 border dark:border-gray-600 rounded-2xl">
                                                    <label className="leading-3 font-bold text-base mb-4">Average Ratings</label>
                                                    <div className="h-auto flex space-x-4 items-center">
                                                        <h1 className="text-5xl font-bold">{reviewItem.ratingAverage.average}</h1>
                                                        <PiRating disabled={true} size={'default'} value={reviewItem.ratingAverage.average}  />
                                                    </div>
                                                    <span className="text-gray-400 text-xs">Average rating for all reviews</span>
                                                </div>

                                                <div className="p-2 border dark:border-gray-600 rounded-2xl space-y-1">
                                                    <label className="leading-3 font-bold text-base">Rating Score</label>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">5 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.five}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{score.five}%</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">4 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.four}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{score.four}%</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">3 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.three}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{score.three}%</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">2 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.two}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{score.two}%</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">1 star</span>
                                                        <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                            <div className="h-2 bg-yellow-400 rounded" style={{ width: `${score.one}%`}}></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{score.one}%</span>
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
            </OrgBody>
        </>
    )
}