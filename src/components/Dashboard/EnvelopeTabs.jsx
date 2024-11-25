import { Button, ButtonGroup, Card, CardBody, Link, Tab, Tabs, Tooltip, useDisclosure } from '@nextui-org/react'
import { ChevronLeft, ChevronRight, Mail, Plus, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { getRentalAgreementById, getcompletedDocList } from '../../Apis/legalAgreement';
import { formatDate } from '@/Utils/dateTimeHelpers';
import { useRouter } from 'next/router';
import { createTemplate, saveEnvelopeInTemplate } from '../../Apis/template';
import Cookies from 'js-cookie';
import CustomSkeleton from '../Skeleton/Skeleton';

const tabList = [
    {
        value: 'sent',
        title: 'Dcoument Sent'
    },
    {
        value: 'expired',
        title: 'Document Expired'
    },
    {
        value: 'viewed',
        title: 'Document Viewed'
    },
    {
        value: 'p-signed',
        title: 'Partial Signed'
    },
    {
        value: 'completed',
        title: 'Completed'
    },

]

const EnvelopeTabs = ({ countData, timeFilter,setLoading }) => {
    const router = useRouter()
    const fileRef = useRef(null);
    const modalDisc = useDisclosure();
    const [folderName, setFolderName] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [templateId, setTemplateId] = useState(null);
    const [files, setFiles] = useState([]);
    const [update, setUpdate] = useState(false)
    const [selected, setSelected] = React.useState("Sent");
    const [envelopeData, setEnvelopeData] = useState(null)
    const [envelopePage, setEnvelopePage] = useState({
        size: 5,
        currentPage: 1,
        maxPage: 1,
    })
    const handleCreateTemplate = async (folderName) => {
        const body = {
            fileJson: "{}",
            folderName: folderName,
            isFile: '1',
            parentId: 'root'
        };
        const response = await createTemplate(body);
        console.log(response);
        if (response) {
            console.log(response?.data?._id)
            setTemplateId(response?.data?._id)
            // router.push(`/template/new?id=${id}`);
        }
    };
    function handleFileChange(event) {
        console.log(event.target.files[0].name);
        if (event.target.files[0]) {
            let tempName = event.target.files[0].name.split('.').slice(0, -1).join('.').substring(0, 20)
            console.log(tempName)
            if (window.FileReader && event.target.files[0]) {
                handleCreateTemplate(tempName)
                setFiles([...files, ...event.target.files]);
            }
        }
    }
    const getDocDetails = async (files) => {
        console.log(files)
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${Cookies.get("accessToken")}`);
        myHeaders.append("x-api-key", "449772DE-2780-4412-B9F7-E49E48605875");
        myHeaders.append("Cache-Control", "");
        const formdata = new FormData();
        formdata.append("participants", 'me-only');
        formdata.append('signees', '[]')
        files?.map((e, i) => {
            { console.log(files) }
            if (e.type && !e.id) {
                { console.log(files[i]) }
                formdata.append(`files`, files[i], `file${i}`);
            }
        });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };
        console.log('inL')
      setLoading(true)
        let url = "https://api.lawinzo.com/node/legalAgreement/addAgreement";
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then(async (result) => {
                const data = JSON.parse(result);
                const id = data?.data?._id;
             
                console.log(data)
                if (id) {
                    
                    const res = await getRentalAgreementById(Cookies.get("accessToken"), id)
                    if (res?.agreements[0]?.imageUrls[0] !== undefined) {
                        const newData = await saveEnvelopeInTemplate({
                            templateId: templateId,
                            envelopeId: id
                        })
                        if (newData?.data) {
                            console.log(newData?.data?.ref?._id)
                            setFiles([])
                            router.push(`/template/new?id=${newData?.data?.ref?._id}`);
                        }
                    }
                }

            })
            .catch((error) => {
                console.log("error", error);
            });
    }
    const handleModalOpen = () => {
        console.log(modalDisc.onOpen());
        modalDisc.onOpen();
    }
    const handleTabChange = (item) => {
        setEnvelopePage({
            size: 5,
            currentPage: 1,
            maxPage: 1,
        })
        setSelected(item)
    }
    const handleNavigate = (id) => {
        router.push(`/document/preview?id=${id}`)
    }
    const getEnvelopeList = async (filter, envelopePage, timeFilter) => {
        const filterBy = {};
        console.log(timeFilter)
        setIsLoading(true)
        if (filter === 'sent') {
            filterBy.completed = "false"
        }
        if (filter === 'expired') {
            filterBy.isExpired = 1
        }
        if (filter === 'viewed') {
            filterBy.isViewed = 1
        }
        if (filter === 'p-signed') {
            filterBy.isPartiallySigned = 1
        }
        if (filter === 'completed') {
            filterBy.completed = "true"
        }
        // console.log(filterBy)
      
        const res = await getcompletedDocList(filterBy, envelopePage?.currentPage, envelopePage?.size, timeFilter===undefined? "0" : timeFilter)
        console.log(res)
        if (res) {
            setEnvelopeData(res)
            setEnvelopePage({
                ...envelopePage,
                maxPage: res?.totalPages,
                currentPage: 1
            });
        }
        setIsLoading(false)
    }
    const handleNext = async (skip) => {
        if (envelopePage.currentPage === envelopePage.maxPage) {
            return;
        }
        setUpdate((prev) => !prev)
        setEnvelopePage({
            ...envelopePage,
            currentPage: envelopePage.currentPage + 1,
        });
        console.log(selected)
        console.log(envelopePage?.currentPage + 1)
        console.log(envelopePage?.size)
        const response = await getcompletedDocList(selected, envelopePage?.currentPage + 1 , envelopePage?.size,timeFilter===undefined? "0" : timeFilter);
        if (response) {
            setEnvelopeData(response);

        }
    }
    const handlePrev = async (skip) => {
        if (envelopePage.currentPage === 1) {
            return;
        }
        setUpdate((prev) => !prev)
        setEnvelopePage({
            ...envelopePage,
            currentPage: envelopePage.currentPage - 1,
        });
        const response = await getcompletedDocList(selected,
            envelopePage.currentPage - 1,
            envelopePage.size,timeFilter===undefined? "0" : timeFilter
        );
        if (response) {
            setEnvelopeData(response)
        }


    }
    useEffect(() => {
        if (templateId && files) {
            getDocDetails(files)
        }
    }, [templateId])
    useEffect(() => {
        getEnvelopeList(selected, envelopePage, timeFilter || "0")
    }, [selected, timeFilter])
    console.log(envelopeData)
    return (
        <div className=''>
         {isLoading? <CustomSkeleton />: 
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
                        {envelopeData && envelopeData?.agreementDetails?.length > 0 ?
                            <div className='flex flex-col justify-between h-full min-h-[300px]'>
                                <div>
                                    {envelopeData?.agreementDetails?.length > 0 && <div className='border-y mt-2'>
                                        <div className='grid grid-cols-12 py-[11px] border-b text-[14px]'>
                                            <div className='col-span-2 lg:col-span-1 pl-2'>
                                                Sno
                                            </div>
                                            <div className='col-span-6 lg:col-span-3'>
                                                Title
                                            </div>
                                            <div className='hidden lg:grid lg:col-span-2'>
                                                Signees
                                            </div>
                                            <div className='hidden lg:grid lg:col-span-4'>
                                                Subject
                                            </div>
                                            <div className='col-span-4 lg:col-span-2 flex justify-end  pr-2 '>
                                                Date
                                            </div>
                                        </div>
                                    </div>}
                                    {envelopeData?.agreementDetails?.map((item, index) => {
                                        return <div key={item?._id}
                                            onClick={() => handleNavigate(item?._id)} className='grid grid-cols-12 text-[14px] text-black cursor-pointer py-[11px] border-b'>
                                            <div className='col-span-2 lg:col-span-1 pl-2'>
                                                {index + 1 + envelopePage.currentPage * 5 - 5}
                                            </div>
                                            <div className='col-span-6 lg:col-span-3'>
                                                {item?.draftName
                                                    ? <>{item?.draftName?.slice(0,25)}
                                                        {item?.draftName?.length > 25 && '...'}
                                                    </>
                                                    : 'Document'}
                                            </div>
                                            <div className='hidden lg:grid lg:col-span-2'>
                                                {
                                                    item?.signees?.length > 0 || item?.ccs?.length > 0 || item?.approvers?.length > 0 ?
                                                        <Tooltip
                                                            placement='right'
                                                            classNames={{
                                                                base: [
                                                                    "before:bg-neutral-400 dark:before:bg-white border-2 rounded-md",
                                                                ],
                                                                content: [
                                                                    "max-h-[300px] overflow",
                                                                    "py-2 px-4 shadow-xl",
                                                                    "text-black bg-white",
                                                                ],
                                                            }}
                                                            color='foreground' content={
                                                                <div className='flex flex-col
                                                                    gap-2'>
                                                                    <p className='text-[16px] pl-2 border-b pb-2 font-[700]'>Signees</p>
                                                                    {item?.signees?.map((el, index) => {
                                                                        return <div className='flex flex-col gap-2 border-b pb-1' key={index}>
                                                                            <div>
                                                                                <div className='flex flex-row gap-2 items-center'>
                                                                                    <User color='#05686E' size={15} strokeWidth={3} />
                                                                                    {el?.fullname}</div>
                                                                                <div className='flex flex-row gap-2 items-center'>
                                                                                    <Mail size={15} strokeWidth={3} color='#05686E' />
                                                                                    {el?.signersEmail}</div>
                                                                            </div>
                                                                        </div>
                                                                    })}
                                                                    {item?.ccs?.length > 0 && <p className='text-[16px] pl-2 border-y font-[700]'>CCs</p>}
                                                                    {item?.ccs?.map((el, index) => {
                                                                        return <div className='flex flex-col gap-2 border-b pb-1' key={index}>
                                                                            <div>
                                                                                <div className='flex flex-row gap-2 items-center'>
                                                                                    <User color='#05686E' size={15} strokeWidth={3} />
                                                                                    {el?.fullname}</div>
                                                                                <div className='flex flex-row gap-2 items-center'>
                                                                                    <Mail size={15} strokeWidth={3} color='#05686E' />
                                                                                    {el?.signersEmail}</div>
                                                                            </div>
                                                                        </div>
                                                                    })}
                                                                    {item?.approvers?.length > 0 && <p className='text-[16px] pl-2 border-y font-[700]'>Approvals</p>}
                                                                    {item?.approvers?.map((el, index) => {
                                                                        return <div className='flex flex-col gap-2 border-b pb-1' key={index}>
                                                                            <div>
                                                                                <div className='flex flex-row gap-2 items-center'>
                                                                                    <User color='#05686E' size={15} strokeWidth={3} />
                                                                                    {el?.fullname}</div>
                                                                                <div className='flex flex-row gap-2 items-center'>
                                                                                    <Mail size={15} strokeWidth={3} color='#05686E' />
                                                                                    {el?.signersEmail}</div>
                                                                            </div>
                                                                        </div>
                                                                    })}
                                                                </div>
                                                            } >
                                                            <div className='flex flex-row  gap-2'>
                                                                {item?.signees[0]?.fullname ? item?.signees[0]?.fullname : (
                                                                    item?.ccs[0]?.fullname ? item?.css[0]?.fullname : item?.approvers[0]?.fullname
                                                                )}
                                                                {item?.signees?.length > 1 || item?.ccs?.length > 1 || item?.approvers?.length > 1 ?
                                                                    <div className='flex flex-row gap-1'>
                                                                        +
                                                                        <div className='px-2 py2 border rounded-full'>

                                                                            {
                                                                                (item?.ccs?.length > 0 && item?.ccs?.length) + (item?.signees?.length > 0 && item?.signees?.length) + (item?.approvers?.length > 0 && item?.approvers?.length) - 1
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    : ''}
                                                            </div>
                                                        </Tooltip>
                                                        :
                                                        <p>No Signees</p>
                                                }
                                            </div>
                                            <div className='hidden lg:grid lg:col-span-4'>
                                                <p className='hidden lg:inline-flex'>
                                                    {item?.emailTemplate?.title ? item?.emailTemplate?.title?.slice(0, 30) : 'No subject'}
                                                    {item?.emailTemplate?.title?.length > 30 && '...'}
                                                </p>
                                            </div>
                                            <div className='col-span-4 lg:col-span-2 flex justify-end pr-2 '>
                                                {formatDate(item?.updatedDate)}
                                            </div>
                                        </div>
                                    })
                                    }
                                </div>
                                {envelopeData?.agreementDetails?.length > 0 && <div className="self-end flex flex-row lg:col-span-3 col-span-1 justify-between">
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
                                                {envelopePage.currentPage}{' '}
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
                                    <img width={'200px'} src='/images/noEnvelope.png' alt='noFiles' />
                                    <div className=' mt-2'>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            ref={fileRef}
                                        />
                                        <Button className="text-white bg-[#05686E] flex flex-row'" onClick={() => fileRef.current.click()}>
                                            <Plus size={20} />  Upload Document & Start Signing
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

export default EnvelopeTabs
