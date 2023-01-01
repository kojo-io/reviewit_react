import {Component} from "react";
import 'primeicons/primeicons.css';
export class OrgBody extends Component<any, any>{
    render() {
        return (
            <div className="h-screen w-screen bg-gray-50 dark:bg-gray-800/30">
                <div className="flex flex-col h-full w-full">
                    <div className="h-[95px] border dark:border-gray-800/30 w-full px-5">
                        <div className="lg:block max-lg:hidden w-full h-full">
                            <div className="w-full h-full flex justify-between">
                                <div className="h-full flex space-x-5">
                                    <h1 className="h-full flex flex-wrap content-center text-2xl font-bold uppercase leading-3 text-gray-600 dark:text-white">
                                        comp name
                                    </h1>
                                </div>

                                <div className="h-full flex space-x-3 text-gray-600 dark:text-white">
                                    <a href={'/organisation/org-dashboard'} className="h-full block flex cursor-pointer items-center hover:border-b-[3px] hover:border-blue-500 px-2" >
                                        <span className="leading-3 cursor-pointer">Dashboard</span>
                                    </a>
                                    <a href={'/organisation/org-review-items'} className="h-full block flex cursor-pointer items-center hover:border-b-[3px] hover:border-blue-500 px-2" >
                                        <span className="leading-3 cursor-pointer">Review Items</span>
                                    </a>
                                </div>

                                <div className="h-full flex space-x-3">
                                    <div className="flex flex-wrap content-center">
                                        <div
                                            className="flex justify-between border border-gray-300 dark:border-white px-2 py-1.5 items-center rounded-xl text-gray-300 dark:text-white w-[150px]">
                                            <label className="leading-3">Search</label>
                                            <i className="pi pi-search"></i>
                                        </div>
                                    </div>
                                    <div className="h-full flex flex-wrap content-center">
                                        <img src={'/user.png'} className={'block border w-[45px] h-[45px] p-1 rounded-full'}/>
                                    </div>
                                    <h1 className={'h-full flex flex-wrap content-center text-base font-bold uppercase leading-3 cursor-pointer text-gray-600 dark:text-white'}>my name</h1>
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden w-full h-full">
                            <div className="w-full h-full flex items-center">
                                <i className="pi pi-bars text-lg"></i>
                            </div>
                        </div>
                    </div>

                    <div className="grow h-full overflow-auto">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}