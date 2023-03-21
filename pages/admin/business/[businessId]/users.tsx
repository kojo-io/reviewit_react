import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {AdminBody} from "../../../../components/shared/admin-body";
import {environment} from "../../../../components/shared/environment";
import {AuthContext} from "../../../../components/store/auth-provider";
import {ContextInterface} from "../../../../components/models/context-interface";
import {Paging} from "../../../../components/models/paging";
import {Filter} from "../../../../components/models/filter";
import {Organization} from "../../../../components/models/Organization";
import {User} from "../../../../components/models/User";
import {PiModal} from "../../../../components/shared/pi-modal";
import {OrganizationForm} from "../../../../components/forms/organization-form";
import {MessageProps} from "../../../../components/shared/pi-message";
import {OrganizationUserForm} from "../../../../components/forms/organization-user-form";
import {PiSkeletonWrapper} from "../../../../components/shared/pi-skeleton-wrapper";
import {PiSkeleton} from "../../../../components/shared/pi-skeleton";
import {PiButton} from "../../../../components/shared/pi-button";
import {ApiResponse} from "../../../../components/models/ApiResponse";
import {PagedResponse} from "../../../../components/models/PagedResponse";
import {ReviewItem} from "../../../../components/models/review item";

export default function Users() {
    const router = useRouter();
    const url = environment.apiUrl;
    const context = useContext(AuthContext);

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

    const [users, setUsers] = useState<User[]>([]);

    const [currentSize, setCurrentSize] = useState<number>(0);

    const defaultForm: User = {
        id: "",
        firstName: '',
        lastName: '',
        image: '',
        email: ''
    };

    const [userForm, setUserForm] = useState<User>(defaultForm);

    const openModalHandler = () => {
        setOpenModal(true);
    }

    const closeModalHandler = () => {
        setEditState(false);
        setOpenModal(false);
        setUserForm(defaultForm);
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

    const [organization, setOrganization] = useState<Organization>({name: '', address: '', phoneNumber: '', id: '', image: ''});
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
    const saveOrganizationUsersHandler = (form: User) => {
        setLoading(true);
        fetch(`${url}Account/RegisterOrganizationUser`, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: ApiResponse<any>) => {
                if (result.status === 100) {
                    getOrganizationUsersHandler();
                    setOpenModal(false);
                    openMessageHandler({type: "success", message: result.message, open: true});
                } else {
                    openMessageHandler({type: "error", message: result.message, open: true});
                }
            }).finally(() => {
                setLoadMore(false);
                setLoading(false);
            });

        }).catch((reason) => {
            openMessageHandler({type: "error", message: 'something went wrong please try again', open: true});
        });
    }
    const getOrganizationUsersHandler = () => {
        setLoading(true);
        fetch(`${url}Account/GetOrganizationUsers?pageSize=${paging.pageSize}&pageNumber=${paging.pageNumber}`, {
            method: 'POST',
            body: JSON.stringify(filter),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.accesstoken?.token}`
            }
        }).then((response) => {
            response.json().then((result: PagedResponse<Array<User>>) => {
                const data: Array<User> = [...users];
                result.data.forEach((rate) => {
                    const find = data.find(u => u.id === rate.id);
                    if (!find) {
                        data.push(rate)
                    }
                });
                setUsers(data);
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
                setUserForm(prevState => {
                    return {...prevState, organisationId: businessId as string}
                });
            }
        }
    }, [auth, router.isReady]);

    useEffect(() => {
        if (auth.accesstoken?.token) {
            getOrganization();
            getOrganizationUsersHandler();
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
                // getAllReviewItemsHandler();
            }
        }
    }, [loadMore]);

    return (
       <>
           {
               openModal &&
               <PiModal fullScreen={false} onClose={closeModalHandler}>
                   <OrganizationUserForm loading={loading} onFormSubmit={saveOrganizationUsersHandler} editState={editState} formData={userForm}/>
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
                                           <div className={'flex space-x-4 p-4 items-centerw-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl group hover:cursor-pointer'} onClick={openModalHandler}>
                                               <i className={'pi pi-user text-lg group-hover:cursor-pointer'}></i>
                                               <label className={'block text-lg leading-none group-hover:cursor-pointer'}>New User</label>
                                           </div>
                                           <a className={'flex space-x-4 p-4 items-centerw-full dark:bg-gray-800 border dark:border-gray-800 rounded-xl group hover:cursor-pointer'} href={'/admin/businesses'}>
                                               <i className={'pi pi-building text-lg group-hover:cursor-pointer'}></i>
                                               <label className={'block text-lg leading-none group-hover:cursor-pointer'}>Organizations</label>
                                           </a>
                                       </div>
                                   </div>
                               </div>

                               <div className="grow h-full lg:columns-3 lg:col-span-3 flex mb-4" id={'list-org-items'}>
                                   <div className={'h-full flex flex-col w-full'}>
                                       {
                                           (users.length === 0 && loading) &&
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
                                           (users.length === 0 && !loading) &&
                                           <div className={'w-full p-4 space-y-4'}>
                                               <img src={'/empty-folder.png'} className={'w-[150px] h-[150px] m-auto'} />
                                               <label className={'block text-center'}>This organization has no users, please create one.</label>
                                           </div>
                                       }
                                       {
                                           users.length > 0 &&
                                           <div className={'w-full space-y-4'}>
                                               {
                                                   users.map((org) =>
                                                       <div key={org.id} className={'dark:bg-gray-800 border overflow-hidden dark:border-gray-800 rounded-2xl w-full over'}>
                                                           <div className={'divide-y dark:divide-gray-700'}>
                                                               <div className={'w-full p-3 flex items-center space-x-3'}>
                                                                   <img src={org.image ?? `/user.png`} className={'max-w-[60px] h-auto rounded'}/>
                                                                   <div>
                                                                       <span className={'font-bold'}>{org.firstName} {org.lastName}</span>
                                                                       <p className={'text-[15px] dark:text-gray-500'}>
                                                                           {org.email}
                                                                       </p>
                                                                   </div>
                                                               </div>
                                                               <div className={'w-full px-3 flex justify-end'}>
                                                                   <div className={'flex gap-2 items-center divide-x dark:divide-gray-700'}>
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