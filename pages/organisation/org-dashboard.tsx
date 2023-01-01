import {OrgBody} from "../shared/org-body";
export default function OrgDashboard() {
    return (
        <>
            <OrgBody>
                <div className="flex flex-col h-full w-full p-4">
                    <div className="flex justify-center w-full h-full">
                        <div className="max-xl:w-full 2xl:w-4/6 space-y-4">

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">

                                <div className="p-2 border dark:border-gray-600 rounded-lg">
                                    <label className="leading-3 font-bold text-base mb-4">Total Review Items</label>
                                    <h1 className="text-5xl font-bold">0.0</h1>
                                    <span className="text-gray-400 text-xs">Number of items added for review</span>
                                </div>

                                <div className="p-2 border dark:border-gray-600 rounded-lg">
                                    <label className="leading-3 font-bold text-base mb-4">Average Ratings</label>
                                    <div className="h-auto flex space-x-4 items-center">
                                        <h1 className="text-5xl font-bold">0.0</h1>
                                        <div className="flex items-center">
                                            <svg aria-hidden="true" className="text-yellow-400 w-7 h-7"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg"><title>First star</title>
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                            <svg aria-hidden="true" className="text-yellow-400 w-7 h-7"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg"><title>Second star</title>
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                            <svg aria-hidden="true" className="text-yellow-400 w-7 h-7"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg"><title>Third star</title>
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                            <svg aria-hidden="true" className="text-yellow-400 w-7 h-7"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title>
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                            <svg aria-hidden="true" className="text-gray-300 w-7 h-7 dark:text-gray-500"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title>
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs">Average rating for all reviews</span>
                                </div>

                                <div className="p-2 border dark:border-gray-600 rounded-lg">
                                    <label className="leading-3 font-bold text-base mb-4">Total Reviews</label>
                                    <h1 className="text-5xl font-bold">0.0</h1>
                                    <span className="text-gray-400 text-xs">Number of reviews</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">

                                <div className="p-2 border dark:border-gray-600 rounded-lg">
                                    <div className="h-60 w-full flex justify-center items-center">
                                        <label>Line Chart</label>
                                    </div>
                                </div>

                                <div className="p-2 border dark:border-gray-600 rounded-lg">
                                    <div className="h-60 w-full flex justify-center items-center">
                                        <label>Bar Chart</label>
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