import {AdminBody} from "../shared/admin-body";
import {environment} from "../shared/environment";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../store/auth-provider";
import {useRouter} from "next/router";
import {ContextInterface} from "../models/context-interface";
import {Paging} from "../models/paging";
import {PiModal} from "../shared/pi-modal";
import {Organization} from "../models/Organization";
import {OrganizationForm} from "../forms/organization-form";
import {PiSkeleton} from "../shared/pi-skeleton";
import {PiSkeletonWrapper} from "../shared/pi-skeleton-wrapper";
import {ApiResponse} from "../models/ApiResponse";
import {MessageProps} from "../shared/pi-message";
import {PagedResponse} from "../models/PagedResponse";
import {Filter} from "../models/filter";
import {PiButton} from "../shared/pi-button";

export default function Businesses() {
    const url = environment.apiUrl;
    const context = useContext(AuthContext);
    const router = useRouter();

    const getDefault: ContextInterface = {
        canLogout: () => {},
        canLogin: () => {},
        isAuthenticated: false }

    const [auth, setAuth] = useState<ContextInterface>(getDefault);

    const [openModal, setOpenModal] = useState<boolean>(false);

    const [paging, setPaging] = useState<Paging>({ pageSize: 5, pageNumber: 1, totalPages: 0, totalRecords: 0, currentSize: 0 });

    const [loadMore, setLoadMore] = useState<boolean>(false);

    const [bottom, setBottom] = useState<boolean>(false);

    const [filter, setFilter] = useState<Filter>({ search: '' });

    const [loading, setLoading] = useState<boolean>(false);

    const [editState, setEditState] = useState<boolean>(false);

    const [organizations, setOrganizations] = useState<Organization[]>([])

    const defaultForm: Organization = {
        id: "",
        name: '',
        address: '',
        image: '',
        phoneNumber: ''
    };

    const [organizationForm, setOrganizationForm] = useState<Organization>(defaultForm);
    const openModalHandler = () => {
        setOpenModal(true);
    }

    const closeModalHandler = () => {
        setEditState(false);
        setOpenModal(false);
        setOrganizationForm(defaultForm);
    }

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

    const closeMessageHandler = () => {
        setOpenDialog((prevState) => {
            return {...prevState, open: false }
        });
    }

    const saveReviewHandler = (form: Organization) => {
        setLoading(true);
        fetch(`${url}Organization`, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                if (result.status === 100) {
                    getAllOrganizationsHandler();
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

    const updateReviewHandler = (form: Organization) => {
        setLoading(true);
        fetch(`${url}Organization`, {
            method: 'PUT',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                if (result.status === 100) {
                    // getAllReviewItemsHandler();
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

    const saveHandler = (form: Organization, editState: boolean) => {
        if (editState) {
            updateReviewHandler(form);
        } else {
            saveReviewHandler(form);
        }
    }

    const getAllOrganizationsHandler = () => {
        setLoading(true);
        fetch(`${url}Organization/GetAllPaginated?pageSize=${paging.pageSize}&pageNumber=${paging.pageNumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: PagedResponse<Array<Organization>>) => {
                setOrganizations(result.data);
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

    const organizationReviewsPostsHandler = (organizationId: any) => {
        router.push(`/admin/business/${organizationId}`);
    }

    const organizationUsersHandler = (organizationId: any) => {
        router.push(`/admin/business/${organizationId}/users`);
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
            return {...prevState, user: context.user, accesstoken: context.accesstoken }
        });
    }, [context]);

    // update auth value
    useEffect(() => {
        if (auth.accesstoken?.token) {
            getAllOrganizationsHandler();
        }
    }, [auth]);

    // open modal when edit is true
    useEffect(() => {
        if (editState) {
            setOpenModal(true);
        }
    }, [editState]);

    return (
        <>
            {
                openModal &&
                <PiModal fullScreen={false} onClose={closeModalHandler}>
                    <OrganizationForm loading={loading} onFormSubmit={saveHandler} editState={editState} formData={organizationForm}/>
                </PiModal>
            }
            <AdminBody>
                <div className="flex flex-col w-full h-full">
                    <div className="flex justify-center w-full h-full">
                        <div className="max-xl:w-full xl:w-10/12 2xl:w-4/6 space-y-4">
                            <div className="grid lg:grid-cols-7 gap-4 h-full relative w-full pt-4 px-2">

                                <div className={'lg:columns-1 lg:col-span-2 max-lg:hidden max-lg:px-2'}>
                                    <div className={'sticky top-2'}>
                                        <div className={'space-y-4'}>
                                            <div className={'flex space-x-4 p-4 items-centerw-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl group hover:cursor-pointer'} onClick={openModalHandler}>
                                                <i className={'pi pi-building text-lg group-hover:cursor-pointer'}></i>
                                                <label className={'block text-lg leading-none group-hover:cursor-pointer'}>New Organization</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grow h-full lg:columns-3 lg:col-span-3 flex mb-4">
                                    <div className={'h-full flex flex-col w-full'}>
                                        {
                                            (organizations.length === 0 && loading) &&
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
                                                        <div className={'w-full px-3 pb-3 flex justify-end items-center'}>
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
                                                        <div className={'w-full px-3 pb-3 flex justify-end items-center'}>
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
                                                        <div className={'w-full px-3 pb-3 flex justify-end items-center'}>
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
                                                        <div className={'w-full px-3 pb-3 flex justify-end items-center'}>
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
                                                        <div className={'w-full px-3 pb-3 flex justify-end items-center'}>
                                                            <PiSkeleton shape={"rectangle"} rounded={true} height={"30px"} width={"100px"}/>
                                                        </div>
                                                    </div>
                                                </PiSkeletonWrapper>
                                            </div>
                                        }
                                        {
                                            (organizations.length === 0 && !loading) &&
                                            <div className={'w-full p-4 space-y-4'}>
                                                <img src={'/empty-folder.png'} className={'w-[150px] h-[150px] m-auto'} />
                                                <label className={'block text-center'}>You have no organizations, please create one.</label>
                                            </div>
                                        }
                                        {
                                            organizations.length > 0 &&
                                            <div className={'w-full space-y-4'}>
                                                {
                                                    organizations.map((org) =>
                                                        <div key={org.id} className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
                                                            <div className={'divide-y dark:divide-gray-700'}>
                                                                <div className={'w-full p-3 flex items-center space-x-3'}>
                                                                    <img src={org.image ?? `/user.png`} className={'max-w-[100px] h-auto rounded'}/>
                                                                    <div>
                                                                        <span className={'font-bold'}>{org.name}</span>
                                                                        <p className={'text-[15px] dark:text-gray-500'}>
                                                                            {org.phoneNumber}
                                                                        </p>
                                                                        <p className={'text-[14px] dark:text-gray-400'}>
                                                                            {org.address}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className={'w-full px-3 flex justify-end'}>
                                                                    <div className={'flex gap-2 items-center divide-x dark:divide-gray-700'}>
                                                                        <div className={'py-3'}>
                                                                            <PiButton rounded={'rounded'} size={'extra small'} type={'primary'} onClick={() => {organizationReviewsPostsHandler(org.id)}}>POSTS</PiButton>
                                                                        </div>
                                                                        <div className={'pl-2 py-3'}>
                                                                            <PiButton rounded={'rounded'} size={'extra small'} type={'primary'} onClick={() => {organizationUsersHandler(org.id)}}>USERS</PiButton>
                                                                        </div>
                                                                        <div className={'pl-2 py-3'}>
                                                                            <PiButton rounded={'rounded'} size={'extra small'} type={'success'} onClick={() => {}}>EDIT</PiButton>
                                                                        </div>
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

                                <div className={'lg:columns-1 lg:col-span-2'}>
                                    {/*<div className={'w-full sticky lg:top-4 mb-2 dark:bg-gray-800 border dark:border-gray-800 rounded-xl'}>*/}
                                    {/*    */}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminBody>
        </>
    )
}