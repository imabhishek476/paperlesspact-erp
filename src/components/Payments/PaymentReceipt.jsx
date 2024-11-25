import { Input, Textarea, Button } from '@nextui-org/react'
import { IndianRupee, Mail, Pencil, Phone } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

const PaymentReceipt = () => {
    const logoRef = useRef()
    const [userIconTitle, setUserIcontitle] = useState("easedraft.com")
    const [userIconData, setUserIconData] = useState(null)
    const [userError, setUserError] = useState({
        amount: null,
        phone: '',
        email: '',
        pageTitle: '',
        pageDes: ''
    })
    const [userInput, setUserInput] = useState({
        amount: '',
        phone: '',
        email: '',
        pageTitle: '',
        pageDes: '',
        finalAmount: '',
        platformCharge: 3
    })
    const calculateFinalAmount = (amount, charge) => {
        let newAmount = amount + ((amount * charge) / 100)
        console.log(newAmount)
        return newAmount + (newAmount * 0.18)
    }
    const calculateGstAmount = (amount, charge) => {
        let newAmount = amount + ((amount * charge) / 100)
        return Number(newAmount * 0.18).toFixed(2)
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        
        if (name === 'amount') {
            if (value === '') {
                setUserError({ ...userError, amount: "Please Enter Amount" })
            }
            else {
                setUserError({ ...userError, amount: "" })
            }
            console.log(isNaN(value))
            if (!isNaN(value)) {
                setUserInput({ ...userInput, amount: Number(value), finalAmount: calculateFinalAmount(Number(value), userInput.platformCharge) })

            }
        }
        else{
            setUserInput({ ...userInput, [name]: value })
        }
        // if (name === 'phone') {
        //     if (value === '') {
        //         setUserError({ ...userError, phone: "Please Enter Amount" })
        //     }
        //     else {
        //         setUserError({ ...userError, phone: "" })
        //     }
        //     setUserInput({ ...userInput, phone: value })
        // }
        // if (name === 'email') {
        //     if (value === '') {
        //         setUserError({ ...userError, email: "Please Enter Amount" })
        //     }
        //     else {
        //         setUserError({ ...userError, email: "" })
        //     }
        //     setUserInput({ ...userInput, email: value })
        // }
        // if (name === 'title') {
        //     setUserInput({ ...userInput, pageTitle: value })
        // }
        // if (name === 'des') {
        //     setUserInput({ ...userInput, pageDes: value })
        // }
    }
    const handleRemoveLogo = () => {
        if (userIconData) {
            setUserIconData(null);
        }
        logoRef.current.click()

    };
    console.log(userInput)
    return (
        <div className='sm:px-[35px] sm:pl-24 px-4'>
            <div className='block md:hidden bg-[#d7d7d9] border rounded-sm w-full p-1 mb-3 mt-5 px-[20px]'>
                Payments
            </div>
            <div className='px-4 w-full pt-5 flex flex-col items-center justify-center mt-5'>
                <div className='w-full lg:w-2/3'>
                    <div className='flex flex-row gap-5 items-center w-full lg:max-w-sm'>
                        <div className="relative shadow-md p-2">
                            <Image
                                className=""
                                src={
                                    userIconData ?
                                        (typeof userIconData === "string"
                                            ? userIconData
                                            : URL.createObjectURL(userIconData)) :
                                        '/images/logo-white.png'
                                }
                                width={50}
                                height={50}
                            ></Image>
                            <div
                                onClick={() => handleRemoveLogo()}
                                className=""
                            >
                                <Pencil color='#000' size={15} className='absolute top-0 left-[50px] text-black hover:cursor-pointer' />
                            </div>
                        </div>
                        {!userIconData && (
                            <div className="flex">
                                <input
                                    type="file"
                                    ref={logoRef}
                                    onChange={(event) => {
                                        console.log(event.target.files[0]);
                                        if (window.FileReader && event.target.files[0]) {
                                            const file = new FileReader();
                                            if (
                                                event.target.files[0] &&
                                                event.target.files[0].type.match("image.*")
                                            ) {
                                                file.onload = function () {
                                                    setUserIconData(event.target.files[0])
                                                };
                                                file.readAsDataURL(event.target.files[0]);
                                            }
                                        }
                                    }}
                                    accept=".jpeg,.png"
                                    className="hidden"
                                />
                            </div>
                        )}
                        <div className='w-full'>
                            <Input classNames={
                                {
                                    input: '!bg-transparent'
                                }
                            } variant='bordered' className='' value={userIconTitle} onChange={(e) => setUserIcontitle(e.target.value)} type='text' radius='none' size='sm' />
                        </div>
                    </div>
                </div>

                <div className='mt-10 flex flex-col lg:flex-row gap-5 w-full lg:w-2/3'>
                    <div className='flex flex-col gap-8 w-full '>
                        <Input classNames={
                            {
                                input: '!bg-transparent'
                            }
                        } variant='bordered' name='title' value={userInput.pageTitle} onChange={handleInputChange} radius='none' className='w-full lg:max-w-sm' placeholder='Enter payment title here' type='text' />
                        <div className='border-b-5 border-[#05686E] w-10 ml-1'></div>
                        <Textarea classNames={
                            {
                                input: '!bg-transparent'
                            }
                        } variant='bordered'
                            name='des' value={userInput.pageDes} onChange={handleInputChange}
                            minRows={7}
                            radius='none'
                            placeholder="Enter payment details here"
                            className="w-full lg:max-w-sm"
                        />
                    </div>

                    <div className='border rounded-md shadow-md w-full '>
                        <div className='p-5 flex flex-col gap-3'>
                            <h1 className='text-[16px] text-[#05686E] font-semibold'>Payment Details</h1>
                            <div className='border-b-5 border-[#05686E] w-10'></div>
                        </div>
                        <div className='flex flex-col gap-5 pb-6 px-5'>
                            <div className='flex flex-row  '>
                                <div className='bg-gray-200 py-3 px-2'>
                                    <IndianRupee />
                                </div>
                                <Input classNames={
                                    {
                                        input: '!bg-transparent'
                                    }
                                } variant='bordered'
                                maxLength={10}
                                    name='amount' placeholder='Amount' type='text' value={userInput.amount} onChange={handleInputChange} size='sm' radius='none' className='w-full ' />
                            </div>
                            {userInput.amount > 0 && !userError?.amount && <div className='flex flex-row gap-2 justify-end text-[12px]'>
                                <div className='flex flex-col gap-1 items-end'>
                                    <p className='font-semibold text-[12px] text-[#05686E]'>Platform Charges {userInput.platformCharge}% :</p>
                                    <p className='font-semibold text-[12px] text-[#05686E]'>GST 18% :</p>
                                </div>
                                <div className='flex flex-col gap-1 items-end'>

                                    <p className='font-semibold text-[12px] text-[#05686E]'>{Number(userInput.amount * userInput.platformCharge / 100).toFixed(2)}</p>
                                    <p className='font-semibold text-[12px] text-[#05686E]'>{calculateGstAmount(userInput.amount, userInput.platformCharge)}</p>
                                </div>


                            </div>}
                            {userError?.amount < 0 ? <p className='text-red-700 text-[12px]'>
                                {userError?.amount}
                            </p> : ''}
                            <div className='flex flex-row '>
                                <div className='bg-gray-200 py-3 px-2'>
                                    <Phone />
                                </div><Input maxLength={10} classNames={
                                    {
                                        input: '!bg-transparent'
                                    }
                                } variant='bordered' placeholder='Payee Phone Number' type='text' name='phone' value={userInput.phone} size='sm' radius='none' className='w-full' onChange={handleInputChange} />
                            </div>

                            <div className='flex flex-row '>
                                <div className='bg-gray-200 py-3 px-2'>
                                    <Mail />
                                </div><Input classNames={
                                    {
                                        input: '!bg-transparent'
                                    }
                                } variant='bordered' placeholder='Payee Email' type='email' name='email' value={userInput.email} size='sm' radius='none' className='w-full' onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className=' flex flex-row justify-between bg-[#E8EFF6]'>
                            <div className='flex flex-row gap-1'>

                            </div>
                            <div className='flex'>
                                <Button className='bg-[#05686E] text-white flex flex-row gap-1' radius='none' >
                                    Pay <IndianRupee size={14} /> {Number(userInput.finalAmount).toFixed(2)}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='w-full lg:w-2/3 pt-0 lg:pt-10'>
                    <div className='w-full pt-0 lg:pt-5'>
                        <div className='py-2 m-auto w-full'>
                            <div className='flex flex-col gap-1 mt-10 lg:mt-[-3rem] mb-5 text-[14px]'>
                                <p className='font-semibold'>Contact Us:</p>
                                <div className='flex flex-row gap-2 items-center '>
                                    <Mail size={12} />    <a href='mailto:connect@easedraft.com' >connect@easedraft.com</a>
                                </div>
                                <div className='flex flex-row gap-2 items-center'>
                                    <Phone size={12} />   <p>+91-9999999999</p>
                                </div>
                            </div>
                            <div className='flex w-full lg:max-w-sm text-[14px]'>
                                <p>You agree to share information entered on this page with easedraft.com {`(owner of this page)`} and Razorpay, adhering to applicable laws.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentReceipt
