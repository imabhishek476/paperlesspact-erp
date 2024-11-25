import { Button, ButtonGroup, Card, CardBody, Tab, Tabs, Tooltip, useDisclosure } from '@nextui-org/react'
import { ChevronLeft, ChevronRight, Mail, Plus, User } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getcompletedTemplateList } from '../../Apis/legalAgreement';
import { formatDate } from '@/Utils/dateTimeHelpers';
import { createTemplate } from '../../Apis/template';
import TemplateModal from '../Template/TemplateComponents/TemplateModal';
import CustomSkeleton from '../Skeleton/Skeleton';
const tabList = [
    {
        value: 'in-progress',
        title: 'In-Progress'
    },
    {
        value: 'sfApproval',
        title: 'Sent for Approval'
    },
    {
        value: 'nmApproval',
        title: 'Needs My Approval'
    },
    {
        value: 'suggest-changes',
        title: 'Changes Suggested'
    },
    {
        value: 'approved',
        title: 'Approved'
    },
    {
        value: 'rejected',
        title: 'Rejected'
    },

]

const TemplateTabs = ({ countData, timeFilter }) => {
    const modalDisc = useDisclosure();
    const router = useRouter()
    const [selected, setSelected] = useState("in-progress");
    const [isLoading, setIsLoading] = useState(true);
    const [update, setUpdate] = useState(false)
    const [TemplateData, setTemplateData] = useState(null)
    const [TemplatePage, setTemplatePage] = useState({
        size: 5,
        currentPage: 1,
        maxPage: 1,
    })
    const [folderName, setFolderName] = useState();
    const handleModalOpen = () => {
        console.log(modalDisc.onOpen());
        modalDisc.onOpen();
    }
    const handleCreateTemplate = async (payload) => {
        const body = {
            fileJson: "{}",
            folderName: payload.folderName,
            type : payload.templateType,
            isFile: '1',
            parentId: 'root',
            pageSetup:{...payload.pageSetup},
        }
        const response = await createTemplate(body);
        console.log(response);
        if (response) {
            const id = response?.data?._id;
            router.push(`/template/new?id=${id}`);
        }
    };
    const handleTabChange = (item) => {
        setTemplatePage({
            size: 5,
            currentPage: 1,
            maxPage: 1,
        })
        setSelected(item)
    }
    const handleNavigate = (id, type) => {
        if(type==="document"){
            router.push(`/template/new?id=${id}`)
        }
        if(type==="presentation"){
            router.push(`/${type}/new?id=${id}`)
        }
    }
    const getTemplateList = async (filter, TemplatePage, timeFilter) => {
        const filterBy = {};
        console.log(filter)
        console.log(timeFilter)
        setIsLoading(true)
        // if (filter === 'in-progress') {
        //     filterBy.isApproval = 1
        // }
        if (filter === 'sfApproval') {
            filterBy.isApproval = 1
        }
        if (filter === 'nmApproval') {
            filterBy.isApprovalneeded = 1
        }
        if (filter === 'suggest-changes') {
            filterBy.isSuggested = 1
        }
        if (filter === 'approved') {
            filterBy.isApproved = 1
        }
        if (filter === 'rejected') {
            filterBy.isRejected = 1
        }
        // console.log(filterBy)
        // setTabLoading(true)
        const res = await getcompletedTemplateList(filterBy, 1, 5, timeFilter===undefined? "0" : timeFilter)
        console.log(res)
        if (res) {
            setTemplateData(res)
            setTemplatePage({
                ...TemplatePage,
                maxPage: res?.totalPages,
                currentPage: 1
            });
        }
        setIsLoading(false)
    }
    const handleNext = async (skip) => {
        if (TemplatePage.currentPage === TemplatePage.maxPage) {
            return;
        }
        setUpdate((prev) => !prev)
        setTemplatePage({
            ...TemplatePage,
            currentPage: TemplatePage.currentPage + 1,
        });
        console.log(TemplatePage?.currentPage)
        // const response = await getcompletedTemplateList(selected, TemplatePage?.currentPage + 1 + (skip ? skip : 0), TemplatePage?.size);
        const response = await getcompletedTemplateList(selected, (TemplatePage?.currentPage) + 1, TemplatePage?.size, timeFilter===undefined? "0" : timeFilter);
        if (response) {
            setTemplateData(response);
        }
    }
    const handlePrev = async (skip) => {
        if (TemplatePage.currentPage === 1) {
            return;
        }
        setUpdate((prev) => !prev)
        setTemplatePage({
            ...TemplatePage,
            currentPage: TemplatePage.currentPage - 1,
        });
        const response = await getcompletedTemplateList(selected,
            TemplatePage?.currentPage - 1,
            TemplatePage?.size,timeFilter===undefined? "0" : timeFilter
        );
        if (response) {
            setTemplateData(response)
        }


    }
    useEffect(() => {
        console.log(selected)
        getTemplateList(selected, TemplatePage, timeFilter || "0")
    }, [selected, timeFilter])
    console.log(TemplateData)
    return (
        <div className=''>
            <TemplateModal modalDisc={modalDisc} handleCreateTemplate={handleCreateTemplate} setFolderName={setFolderName} folderName={folderName} />
            {isLoading ? <CustomSkeleton /> :
                <Tabs
                    aria-label="Options"
                    selectedKey={selected}
                    onSelectionChange={handleTabChange}
                    variant='underlined'
                    radius='none'
                    size='md'
                    classNames={{
                        tabList: 'px-4 rounded-none bg-transparent gap-0 p-0 h-[60px]',
                        base: 'w-full ',
                        cursor: 'w-full border-2 border-[#05686E] rounded-none ',
                        tab: 'w-full h-full !opacity-100',
                        tabContent: 'group-data-[selected=true]:text-[#05686E] justify-start hover:text-[#05686E]',
                        panel: 'border-s-1 p-0',

                    }}
                >

                    {tabList?.map((element) => {
                        return <Tab key={element?.value} title={
                            <div className='flex flex-row gap-3 text-[14px]'>
                                <p>{element?.title}</p>
                                <div className={`border text-[12px] transition-all duration-300 ${selected === element?.value ? 'bg-[#E7713C] text-white' : 'bg-[#E8EFF6] text-black'}  rounded-full px-2`}>
                                    <p className='text-[12px'>{countData && countData[element?.value]}</p>
                                </div>
                            </div>
                        }>
                            {TemplateData && TemplateData?.ref?.length > 0 ?
                                <div className='flex flex-col justify-between h-full min-h-[300px]'>
                                    <div>
                                        {TemplateData?.ref?.length > 0 && <div className='border-y mt-2'>
                                            <div className='grid grid-cols-12 py-[11px] border-b text-[14px]'>
                                                <div className='col-span-2 lg:col-span-1 pl-2'>
                                                    Sno
                                                </div>
                                                <div className='col-span-6 lg:col-span-3'>
                                                    Title
                                                </div>
                                                <div className='hidden lg:grid lg:col-span-2'>
                                                    Participants
                                                </div>
                                                <div className='hidden lg:grid lg:col-span-4'>

                                                </div>
                                                <div className='col-span-4 lg:col-span-2 flex justify-end  pr-2 '>
                                                    Date
                                                </div>
                                            </div>
                                        </div>}
                                        {TemplateData?.ref?.map((item, index) => {
                                            return <div key={index}
                                                onClick={() => handleNavigate(item?._id, item?.type)} className='grid grid-cols-12 text-[14px] text-black cursor-pointer py-[11px] border-b'>
                                                <div className='col-span-2 lg:col-span-1 pl-2'>
                                                    {index + 1 + TemplatePage.currentPage * 5 - 5}
                                                </div>
                                                <div className='col-span-6 lg:col-span-3'>
                                                    {item?.name
                                                        ? <>{item?.name.slice(0, 25)}
                                                            {item?.name?.length > 25 && '...'}
                                                        </>
                                                        : 'Document'}
                                                </div>
                                                <div className='hidden lg:grid lg:col-span-2'>
                                                    {
                                                        item?.participants?.recipients?.length > 0 || item?.participants?.collablorators?.length > 0 || item?.approvers?.length > 0 ?
                                                            <Tooltip
                                                                placement='right'
                                                                classNames={{
                                                                    base: [
                                                                        "before:bg-neutral-400 dark:before:bg-white border-2 rounded-md",
                                                                    ],
                                                                    content: [
                                                                        "py-2 px-4 shadow-xl",
                                                                        "text-black bg-white",
                                                                    ],
                                                                }}
                                                                color='foreground' content={
                                                                    <div className='flex flex-col
                                                                    gap-2'>
                                                                        {item?.participants?.recipients?.length > 0 && <p className='text-[16px] pl-2 border-b pb-2 font-[700]'>Participants</p>}
                                                                        {item?.participants?.recipients?.map((el, index) => {
                                                                            return <div className='flex flex-col gap-2 border-b pb-1' key={index}>
                                                                                <div>
                                                                                    <div className='flex flex-row gap-2 items-center'>
                                                                                        <User color='#05686E' size={15} strokeWidth={3} />
                                                                                        <span className='truncate max-w-[200px]'>{el?.fullname}</span>
                                                                                        </div>
                                                                                    <div className='flex flex-row gap-2 items-center'>
                                                                                        <Mail size={15} strokeWidth={3} color='#05686E' />
                                                                                        {el?.email}</div>
                                                                                </div>
                                                                            </div>
                                                                        })}
                                                                        {item?.approvers?.length > 0 && <p className='text-[16px] pl-2 border-b pb-2 font-[700]'>Approvals</p>}
                                                                        {item?.approvers?.map((el, index) => {
                                                                            return <div className='flex flex-col gap-2 border-b pb-1' key={index}>
                                                                                <div>
                                                                                    <div className='flex flex-row gap-2 items-center'>
                                                                                        <User color='#05686E' size={15} strokeWidth={3} />
                                                                                        {el?.fullname}</div>
                                                                                    <div className='flex flex-row gap-2 items-center'>
                                                                                        <Mail size={15} strokeWidth={3} color='#05686E' />
                                                                                        {el?.email}</div>
                                                                                </div>
                                                                            </div>
                                                                        })}
                                                                        {item?.participants?.collablorators?.length > 0 && <p className='text-[16px] pl-2 border-b pb-2 font-[700]'>Collablorators</p>}
                                                                        {item?.participants?.collablorators?.map((el, index) => {
                                                                            return <div className='flex flex-col gap-2 border-b pb-1' key={index}>
                                                                                <div>
                                                                                    <div className='flex flex-row gap-2 items-center'>
                                                                                        <User color='#05686E' size={15} strokeWidth={3} />
                                                                                        {el?.fullname}</div>
                                                                                    <div className='flex flex-row gap-2 items-center'>
                                                                                        <Mail size={15} strokeWidth={3} color='#05686E' />
                                                                                        {el?.email}</div>
                                                                                </div>
                                                                            </div>
                                                                        })}
                                                                    </div>
                                                                } >
                                                                <div className='flex flex-row  gap-2'>
                                                                    <span className='truncate max-w-[200px]'>
                                                                    {
                                                                        item?.participants?.recipients?.[0]?.fullname ?
                                                                        item?.participants?.recipients?.[0]?.fullname : (
                                                                            item?.participants?.collablorators?.[0]?.fullname ?
                                                                            item?.participants?.collablorators?.[0]?.fullname : (
                                                                                item?.approvers?.[0]?.fullname ?
                                                                                item?.approvers?.[0]?.fullname : "No Participants"
                                                                                )
                                                                                )
                                                                            }
                                                                    </span>
                                                                    {item?.participants?.recipients?.length > 1 || item?.participants?.approvers?.length > 1 || item?.participants?.collablorators?.length > 1 ?
                                                                        <div className='flex flex-row gap-1'>
                                                                            +
                                                                            <div className='px-2 py2 border rounded-full'>
                                                                                {
                                                                                    (item?.participants?.recipients?.length > 0 && item?.participants?.recipients?.length) + (item?.approvers?.length > 0 && item?.approvers?.length) + (item?.participants?.collablorators?.length > 0 && item?.participants?.collablorators?.length) - 1
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        : ''}
                                                                </div>
                                                            </Tooltip>
                                                            :
                                                            <p>No Participants</p>
                                                    }
                                                </div>
                                                <div className='hidden lg:grid lg:col-span-4'>
                                                    <p className='hidden lg:inline-flex'>
                                                        {item?.emailTemplate?.title ? item?.emailTemplate?.title?.slice(0, 30) : ''}
                                                        {item?.emailTemplate?.title?.length > 30 && '...'}
                                                    </p>
                                                </div>
                                                <div className='col-span-4 lg:col-span-2 flex justify-end pr-2 '>
                                                    {formatDate(item?.createdAt)}
                                                </div>
                                            </div>
                                        })
                                        }
                                    </div>
                                    {TemplateData?.ref?.length > 0 && <div className="self-end flex flex-row lg:col-span-3 col-span-1 justify-between">
                                        <div className="flex flex-row">
                                            <ButtonGroup radius="none" className=" rounded-sm">
                                                <Button
                                                    onClick={handlePrev}
                                                    isIconOnly
                                                    className="bg-cyan-50 border rounded-sm"
                                                >
                                                    <ChevronLeft size={18} />{' '}
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    className="bg-cyan-50 border rounded-sm"
                                                >
                                                    {TemplatePage?.currentPage}{' '}
                                                </Button>
                                                <Button
                                                    onClick={handleNext}
                                                    isIconOnly
                                                    className="bg-cyan-50 border rounded-sm"
                                                >
                                                    <ChevronRight size={18} />
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    </div>}
                                </div>
                                :
                                <div className='flex justify-between items-center mb-5'>
                                    <div className='flex flex-col justify-center items-center gap-2 m-auto w-full  lg:w-2/6 text-center'>
                                        <img width={'200px'} src='/images/noTemplate.png' alt='noFiles' />
                                        <p className='text-[16px] text-black font-[700]'>Create Contracts in Minutes</p>
                                        <div className=' mt-2'>
                                            <Button size='sm' onClick={handleModalOpen} className='text-white bg-[#05686E] flex flex-row'>
                                                <Plus size={20} />  Create Template
                                            </Button>
                                        </div>

                                    </div>
                                </div>}
                        </Tab>
                    })}
                </Tabs>}
        </div>
    )
}

export default TemplateTabs
