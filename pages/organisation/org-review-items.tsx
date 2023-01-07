import {OrgBody} from "../shared/org-body";
import {useContext, useEffect, useReducer, useState} from "react";
import OrgReviewForm from "./org-review-form/org-review-form";
import PiTextrea from "../shared/pi-textrea";
import {environment} from "../shared/environment";
import {ApiResponse} from "../models/ApiResponse";
import {ItemType} from "../models/ItemType";
import {MessageProps} from "../shared/pi-message";
import {LoginResponseModel} from "../models/LoginResponseModel";
import {BaseService} from "../shared/base.service";
import {PiModal} from "../shared/pi-modal";
import {Filter} from "../models/filter";
import {ReviewItem} from "../models/review item";
import {PiTruncate} from "../shared/pi-truncate";
import {AuthContext} from "../store/auth-provider";
import {TokenModel} from "../models/TokenModel";
import {Organisation} from "../models/Organisation";
import {ContextInterface} from "../models/context-interface";

export default function OrgReviewItems() {
    const url = environment.apiUrl;
    const context = useContext(AuthContext);

    const dummy= '';

    const getDefault: ContextInterface = {
        canLogout: () => {},
        canLogin: () => {},
        isAuthenticated: false }

    const [auth, setAuth] = useState<ContextInterface>(getDefault);

    const [openModal, setOpenModal] = useState<boolean>(false);

    const [filter, setFilter] = useState<Filter>({ pageSize: 10, pageNumber: 1 });

    const [itemType, setItemType] = useState<ItemType[]>();

    const [reviews, setReviews] = useState<ReviewItem[]>([])

    const [editState, setEditState] = useState<boolean>(false);

    const [reviewItem, setReviewItem] = useState<ReviewItem>();

    const editForm = (form: ReviewItem) => {
        setReviewItem(form);
        setEditState(true);
        setOpenModal(true);
    }

    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }

    const [openDialog, setOpenDialog] = useState(messageDialog);
    const openDrawerHandler = () => {
        setOpenModal(true);
    }

    const closeDrawerHandler = () => {
        setOpenModal(false);
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

    const getAllReviewItems = () => {
        fetch(`${url}ReviewItems/GetAllPaginated?pageSize=${filter.pageSize}&pageNumber=${filter.pageNumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                setReviews(result.data);
            });

        }).catch((reason) => {
            openMessageHandler({type: "error", message: 'something went wrong please try again', open: true});
        });
    }

    const saveForm = (form: ReviewItem) => {
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
                    getAllReviewItems();
                    setOpenModal(false);
                    openMessageHandler({type: "success", message: result.message, open: true});
                } else {
                    openMessageHandler({type: "error", message: result.message, open: true});
                }
            });

        }).catch((reason) => {
            openMessageHandler({type: "error", message: 'something went wrong please try again', open: true});
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
            getAllReviewItems();
            getItemsHandler();
        }
    }, [auth]);

    // update reviews value
    useEffect(() => {
    }, [reviews]);

    return(
        <>
            {
                openModal &&
                <PiModal fullScreen={false} onClose={closeDrawerHandler}>
                    <OrgReviewForm onFormSubmit={saveForm} editState={editState} formData={reviewItem} listData={itemType}/>
                </PiModal>
            }
            <OrgBody>
                <div className="flex flex-col w-full h-full">
                    <div className="flex justify-center w-full h-full">
                        <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">

                            <div className="grid lg:grid-cols-7 gap-4 h-full">

                                <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden p-4'}>
                                    <div className={'w-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl p-4'}>
                                        <img src={context?.user?.organization?.image ?? `/user.png`} className={'block border m-auto w-[100px] h-[100px] p-1 rounded-full'}/>
                                        <span className={'block text-2xl text-center mt-4'}>
                                            {context.user?.organization?.name}
                                        </span>
                                        <span className={'block text-lg dark:text-gray-500 text-center mt-1'}>
                                            {context.user?.organization?.address}
                                        </span>
                                        <span className={'block text-lg dark:text-gray-500 text-center mt-1'}>
                                            {context.user?.organization?.phoneNumber}
                                        </span>
                                    </div>
                                </div>

                                {/*review feed start*/}
                                <div className="grow h-full overflow-auto lg:columns-3 lg:col-span-3 flex feed">
                                    <div className={'h-full flex flex-col w-full p-4'}>
                                        <div className={'rounded-2xl w-full dark:bg-gray-800 border dark:border-gray-800 bg-white'}>
                                            <div className={'p-4'}>
                                                <label className={'pb-2 block'}>Create Review</label>
                                                <div onClick={openDrawerHandler}>
                                                    <PiTextrea rows={2} readOnly={true} onChange={() => {}} id={'dummy'} value={dummy}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'py-4 space-y-4'}>
                                            {
                                                reviews.length === 0 &&
                                                <div className="w-full justify-center flex flex-wrap h-full content-center">
                                                    <div className="space-y-3">
                                                        <img src="/empty-folder.png" className="w-48 h-48 m-auto"  alt='empty-folder'/>
                                                        <span className="w-72 block text-center font-bold leading-[16px]">
                                                            You do not have any items set up for review, please click on the add review item button to start.
                                                        </span>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                reviews.length > 0 &&
                                                reviews.map((review) =>
                                                    <div key={review.id} className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
                                                        <div className={'divide-y dark:divide-gray-700'}>
                                                            <div className={'w-full p-3 flex items-center space-x-3'}>
                                                                <img src={context?.user?.organization?.image ?? `/user.png`} className={'w-[40px] h-[40px] rounded-full'}/>
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
                                                        <div className={'w-full p-3'}>
                                                            <span>{}</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/*review feed end*/}

                                <div className={'lg:columns-6 lg:col-span-2'}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </OrgBody>
        </>
    )
}