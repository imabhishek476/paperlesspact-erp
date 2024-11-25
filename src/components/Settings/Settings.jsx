import { Button } from '@nextui-org/react'
import { Clock, File, FileSignature, Send } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
export const settingLink = [
    {
        link: "/settings/main",
        title: "General Preferences",
        icon: <File   className="min-w-[20px]"/>,
    },
    {
        link: "/settings/signing",
        title: "Signing Preferences",
        icon: <FileSignature  className="min-w-[20px]" />,

    },
    {
        link: "/settings/delivery",
        title: "Delivery Preferences",
        icon: <Send  className="min-w-[20px]"/>,
    },
    {
        link: "/settings/schedule",
        title: "Expiration & Reminders",
        icon: <Clock  className="min-w-[20px]" />,
    },
    {
        link: "/settings/graphics",
        title: "Branding",
        icon: <ColorLensOutlinedIcon   className="min-w-[20px]"/>,
    }
];

const Settings = () => {
    const [bussinessName, setBussinessName] = useState("Ashish009")
    return (
        <div className='sm:px-[35px] sm:pl-24 px-4'>
                 <div className='block md:hidden bg-[#d7d7d9] border rounded-sm w-full p-1 mb-3 px-[20px] mt-4'>
                Bussiness Settings
                </div>
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Bussiness</h1></div>
                <div className='text-[16px] px-4 py-4' >
                    <h1 >All of the preferences below are directly associated with the current business ({bussinessName}) you are currently using.
                    </h1>
                    <h1> Changes on this page will only affect the current business.</h1>
                </div>
                <div className='border-t-2 text-[16px]'>
                    <div className="p-4 flex flex-col">
                        <label className='font-[600]' htmlFor="doctitle">Business Name <span className='text-red-700'>*</span> </label>
                        <input
                            type="text"
                            value={bussinessName}
                            onChange={(event) =>
                                setBussinessName(event.target.value)
                            }
                            className="border sm:w-[500px] py-1 px-3 mt-2 min-h-[47px]"
                        />
                    </div>
                </div>
                <div className='border-t-2 text-[16px] p-4'>
                    <Button
                        size="sm"
                        className="font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] px-5 min-w-[200px]"
                    >
                        Save Changes
                    </Button>
                </div>

            </div>
            <div className='flex flex-col border rounded-md  w-full mt-5 mb-[8rem]'>
                {settingLink?.map((item, index) => {
                   return <Link key={index} href={item?.link} className='bg-transperent border-b-1 rounder-md hover:bg-zinc-300 transition duration-200 p-4'>
                        <div className='flex flex-row gap-2 rounded-md text-[16px] text-[#151513]'>
                            {item.icon}   {item.title}
                        </div>
                    </Link>
                })}
            </div>
        </div>
    )
}

export default Settings
