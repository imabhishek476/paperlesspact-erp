import { Button, Card, CardBody, Chip, Tab, Tabs } from '@nextui-org/react'
import { Plus } from 'lucide-react';
import React from 'react'

const PaymentTabs = () => {
    const [selected, setSelected] = React.useState("waiting");

    return (
        <div className=''>
             <div className='flex justify-between items-center my-5'>
                        <div className='flex flex-col justify-center items-center gap-2 m-auto w-2/6 text-center'>
                            <img width={'200px'} src='/images/noPayment.png' alt='noFiles' />
                            {/* <p className='text-[16px] text-black pl-12 font-[700]'>Keep tabs after you hit send</p>
                            <p className='text-[12px] text-black pl-12'>Check where each of your documents stand with status
                                reports you can view at a glance.</p> */}
                            <div className=''>
                                {/* <Button size='sm' className='text-white bg-[#05686E] flex flex-row'>
                                    <Plus size={20} />  Create Document
                                </Button> */}
                                 <Chip className='p-2 font-semibold' color="secondary">Coming Soon</Chip>
                            </div>
                        </div>
                    </div>
            {/* <Tabs
                aria-label="Options"
                selectedKey={selected}
                onSelectionChange={setSelected}
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
                <Tab key="waiting" title={
                    <div className='flex flex-row gap-3 text-[14px]'>
                        <p>Pending Payments</p>
                        <div className={`border text-[12px] transition-all duration-300 ${selected === 'waiting' ? 'bg-[#E7713C] text-white' : 'bg-[#E8EFF6] text-black'}  rounded-full px-2`}>
                            <p className='text-[12px'>0</p>
                        </div>
                    </div>
                }>
                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col justify-center items-center gap-2 m-auto w-2/6 text-center'>
                            <img width={'150px'} src='/images/NoCaseImage.png' alt='noFiles' />
                            <p className='text-[16px] text-black pl-12 font-[700]'>Keep tabs after you hit send</p>
                            <p className='text-[12px] text-black pl-12'>Check where each of your documents stand with status
                                reports you can view at a glance.</p>
                            <div className='pl-12'>
                                <Button size='sm' className='text-white bg-[#05686E] flex flex-row'>
                                    <Plus size={20} />  Create Document
                                </Button>
                            </div>

                        </div>
                    </div>
                </Tab>
                <Tab key="paid" title={
                    <div className='flex flex-row gap-3 text-[14px]'>
                        <p>Paid Payments</p>
                        <div className={`border text-[12px] transition-all duration-300 ${selected === 'paid' ? 'bg-[#E7713C] text-white' : 'bg-[#E8EFF6] text-black'}  rounded-full px-2`}>
                            <p className='text-[12px'>0</p>
                        </div>
                    </div>
                }>
                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col justify-center items-center gap-2 m-auto w-2/6 text-center'>
                            <img width={'150px'} src='/images/NoCaseImage.png' alt='noFiles' />
                            <p className='text-[16px] text-black pl-12 font-[700]'>Keep tabs after you hit send</p>
                            <p className='text-[12px] text-black pl-12'>Check where each of your documents stand with status
                                reports you can view at a glance.</p>
                            <div className='pl-12'>
                                <Button size='sm' className='text-white bg-[#05686E] flex flex-row'>
                                    <Plus size={20} />  Create Document
                                </Button>
                            </div>

                        </div>
                    </div>
                </Tab>
                <Tab key="withdraw" title={
                    <div className='flex flex-row gap-3 text-[14px]'>
                        <p>Withdrawal</p>
                        <div className={`border text-[12px] transition-all duration-300 ${selected === 'withdraw' ? 'bg-[#E7713C] text-white' : 'bg-[#E8EFF6] text-black'}  rounded-full px-2`}>
                            <p className='text-[12px'>0</p>
                        </div>
                    </div>
                }>
                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col justify-center items-center gap-2 m-auto w-2/6 text-center'>
                            <img width={'150px'} src='/images/NoCaseImage.png' alt='noFiles' />
                            <p className='text-[16px] text-black pl-12 font-[700]'>Keep tabs after you hit send</p>
                            <p className='text-[12px] text-black pl-12'>Check where each of your documents stand with status
                                reports you can view at a glance.</p>
                            <div className='pl-12'>
                                <Button size='sm' className='text-white bg-[#05686E] flex flex-row'>
                                    <Plus size={20} />  Create Document
                                </Button>
                            </div>

                        </div>
                    </div>
                </Tab>
            </Tabs> */}
        </div>
    )
}

export default PaymentTabs
