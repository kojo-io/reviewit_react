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

export default function OrgReviewItems() {
    const url = environment.apiUrl;

    const getDefault: LoginResponseModel = { accesstoken: undefined, user: undefined };

    const [auth, setAuth] = useState<LoginResponseModel>(getDefault);

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const [filter, setFilter] = useState<Filter>({ pageSize: 10, pageNumber: 1 });

    const [itemType, setItemType] = useState<ItemType[]>();

    const [reviews, setReviews] = useState<ReviewItem[]>()

    const [editState, setEditState] = useState<boolean>(false);

    const [reviewItem, setReviewItem] = useState<ReviewItem>();

    const editForm = (form: ReviewItem) => {
        setReviewItem(form);
        setEditState(true);
        setOpenDrawer(true);
    }

    const messageDialog: MessageProps = {
        open: false,
        message: '',
        type: "success"
    }

    const [openDialog, setOpenDialog] = useState(messageDialog);
    const openDrawerHandler = () => {
        setOpenDrawer(true);
    }

    const closeDrawerHandler = () => {
        setOpenDrawer(false);
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
        console.log('ff', form);
    }

    useEffect(() => {
        let accessObj: LoginResponseModel = JSON.parse(localStorage.getItem(BaseService.key) as string) as LoginResponseModel;
        if (accessObj) {
            setAuth((prevState) => {
                return {...prevState, user: accessObj.user, accesstoken: accessObj.accesstoken }
            });
        }
    }, []);

    useEffect(() => {
        if (auth.accesstoken?.token) {
            getAllReviewItems();
            getItemsHandler();
        }
    }, [auth]);

    useEffect(() => {
    }, [reviews]);

    return(
        <>
            {
                openDrawer &&
                <PiModal fullScreen={false} onClose={closeDrawerHandler}>
                    <OrgReviewForm onFormSubmit={saveForm} editState={editState} formData={reviewItem} listData={itemType}/>
                </PiModal>
            }
            <OrgBody>
                <div className="flex flex-col w-full h-full">
                    <div className="flex justify-center w-full h-full">
                        <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">

                            <div className="grid lg:grid-cols-7 gap-4 h-full">

                                <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden'}></div>

                                {/*review feed start*/}
                                <div className="grow h-full overflow-auto lg:columns-3 lg:col-span-3 flex">
                                    <div className={'h-full flex flex-col w-full p-4'}>
                                        <div className={'rounded-2xl w-full dark:bg-gray-800 border dark:border-gray-800 bg-white'}>
                                            <div className={'p-4'} onClick={openDrawerHandler}>
                                                <label className={'pb-2 block'}>Create Review</label>
                                                <PiTextrea rows={2} readOnly={true} onChange={() => {}}/>
                                            </div>
                                        </div>
                                        <div className="w-full justify-center flex flex-wrap h-full content-center">
                                            <div className="space-y-3">
                                                <img src="/empty-folder.png" className="w-48 h-48 m-auto"  alt='empty-folder'/>
                                                <span className="w-72 block text-center font-bold leading-[16px]">
                                                You do not have any items set up for review, please click on the add review item button to start.
                                            </span>
                                            </div>
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