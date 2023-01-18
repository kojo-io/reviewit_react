
import {Filter} from "../models/filter";
import React, {useState} from "react";
import PiSelectList from "../shared/pi-select-list";
import PiInput from "../shared/pi-input";
import {PiButton} from "../shared/pi-button";
import {Organization} from "../models/Organization";

interface Props {
    onFormSubmit: (value: Filter) => void;
    loading: boolean;
    listData: Array<Organization>;
    params?: Array<any>
}
export const FilterForm = (props: Props) => {
    const [form, setForm] = useState<Filter>({ search: '', params: 0});
    const [inValidOrganization, setInValidOrganization] = useState<boolean>(false);

    const searchInputOnChange = (data: any) => {
        setForm((prevState) => {
            return {...prevState, search: data};
        })
    }

    const getOrganization = (data: any) => {
        setForm((prevState) => {
            return {...prevState, organizationId: data};
        })
    }

    const getParam = (data: any) => {
        setForm((prevState) => {
            return {...prevState, params: data};
        })
      if (data > 0) {
          setInValidOrganization(false);
      }
    }

    const onSubmitHandler = (event?: any) => {
        event.preventDefault();
        if (form.params === 1) {
            if (form.organizationId?.length === 0 ) {
                setInValidOrganization(true);
                return;
            }
        }
        props.onFormSubmit(form);
    }

    return (
        <>
            <div className="flex flex-col h-full w-full ">
                <form className="space-y-3">
                    <div>
                        <PiInput rounded={'rounded'} id={'search'} name={'Search'} placeholder={'Type here'} value={form.search ?? ''} onChange={searchInputOnChange} />
                    </div>
                    <div className={'w-full py-2'}>
                        <label>Filter by:</label>
                        <div className={'w-full flex justify-between divide-x dark:divide-gray-700'}>
                            {
                                props.params?.map(item =>
                                    <div onClick={() => {getParam(item.id)}} className={`w-full cursor-pointer flex justify-center px-2`} key={item.id}>
                                        <span className={`${form.params === item.id && 'rounded-lg bg-blue-500/70 w-full text-center px-1.5'}`}>{item.name}</span>
                                    </div>)
                            }
                        </div>
                    </div>
                    {
                        form.params === 1 &&
                        <div>
                            <PiSelectList rounded={'rounded'} value={form.organizationId} allowSearch={true} invalid={inValidOrganization} required={true} name={'Organization'} label={'Select organization'} dataValue={'id'} dataLabel={'name'} data={props.listData} onValueChange={getOrganization} />
                        </div>
                    }
                    <div className="flex w-full">
                        <PiButton loading={props.loading} rounded={'rounded'} type={'primary'} size={'normal'} onClick={onSubmitHandler}>Submit</PiButton>
                    </div>
                </form>
            </div>
        </>
    )
}