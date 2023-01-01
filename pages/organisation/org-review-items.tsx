import {OrgBody} from "../shared/org-body";
import {PiButton} from "../shared/pi-button";
import {useState} from "react";
import {PiDrawer} from "../shared/pi-drawer";
import OrgReviewForm from "./org-review-form/org-review-form";

export default function OrgReviewItems() {
    const [openDrawer, setOpenDrawer] = useState(false);

    const openDrawerHandler = () => {
        setOpenDrawer(true);
    }

    const closeDrawerHandler = () => {
        setOpenDrawer(false);
    }
    return(
        <>
            {openDrawer && <PiDrawer position={'right'} title={'New Review Item'} onClose={closeDrawerHandler}> <OrgReviewForm/> </PiDrawer> }
            <OrgBody>
                <div className="flex flex-col w-full h-full">
                    <div className="h-auto w-full flex justify-between px-10 items-center py-4">
                        <span className="text-3xl text-blue-700 font-bold block">Review Items</span>
                        <PiButton onClick={openDrawerHandler}>Add new review item</PiButton>
                    </div>

                    <div className="grow h-full overflow-auto">
                        <div className="w-full flex flex-wrap h-full content-center">
                            <div className="flex justify-center w-full">
                                <div className="space-y-3">
                                    <img src="/empty-folder.png" className="w-48 h-48 m-auto"  alt='empty-folder'/>
           <span className="w-72 block text-center font-bold leading-[16px]">
             You do not have any items set up for review, please click on the add review item button to start.
           </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </OrgBody>
        </>
    )
}