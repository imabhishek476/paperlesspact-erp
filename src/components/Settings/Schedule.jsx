import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectItem,
    Tooltip,
} from "@nextui-org/react";
import {
    ChevronDownIcon, HelpCircle,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Link from "next/link";
export const animals = [
    { label: "1 Day", value: "1d", description: "The second most popular pet in the world" },
    { label: "3 Days", value: "3d", description: "The most popular pet in the world" },
    { label: "2 Days", value: "2d", description: "The most popular pet in the world" },
    { label: "4 Days", value: "4d", description: "The most popular pet in the world" },
    { label: "5 Days", value: "5d", description: "The most popular pet in the world" },
    { label: "6 Days", value: "6d", description: "The most popular pet in the world" },
    { label: "7 Days", value: "7d", description: "The largest land animal" },
    { label: "2 Weeks", value: "2w", description: "The king of the jungle" },
    { label: "3 Weeks", value: "3w", description: "The largest cat species" },
    { label: "1 Month", value: "1m", description: "The tallest land animal" },
    {
        label: "3 Months",
        value: "3m",
        description: "A widely distributed and diverse group of aquatic mammals",
    },
    {
        label: "6 Months",
        value: "6m",
        description: "A widely distributed and diverse group of aquatic mammals",
    },
];
const Schedule = () => {
    return (
        <div className='sm:px-[35px] sm:pl-24 px-4'>
                 <div className='block md:hidden bg-[#d7d7d9] border rounded-sm w-full p-1 mb-3 px-[20px] mt-4'>
                Bussiness Settings
                </div>
                <div className="flex flex-row md:hidden justify-between py-2 px-5">
                <Link className="font-semibold text-[16px] rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] px-5 " href='/settings'  >
                    <ArrowBackIosNewOutlinedIcon sx={{ fontSize: 15, marginRight: 0.5 }} />	Settings
                </Link>
                <Button
                    size="sm"
                    className="font-semibold rounded-full bg-[#05686E] text-background px-5"
                >
                    Save Changes
                </Button>
            </div>
            {/* Expiration */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Expiration</h1></div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start justify-between ">
                        <h2 className="text-[14px] font-[600]">
                            Expire Document After {" "}
                        </h2>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["3m"]}
                        className="min-w-[300px] md:max-w-[300px] pt-3"
                    >
                        {animals.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className='border-t-2 text-[14px] p-5 flex flex-col gap-2 '>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">
                        <Tooltip
                            placement="top"
                            size="md"
                            className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                            content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Allow staff members to set document expiration date {" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">
                        <Tooltip
                            placement="top"
                            size="md"
                            className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                            content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Enable expiration reminders{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start justify-between ">
                        <h2 className="text-[14px] font-[600]">
                            Send Expiration Reminder ... Before Expiration{" "}
                        </h2>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["3d"]}
                        className="min-w-[300px] md:max-w-[300px] pt-3"
                    >
                        {animals.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>
            {/* Reminders */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Reminders</h1></div>
                <div className='border-t-2 text-[14px] p-5 flex flex-col gap-2 '>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">
                        <Tooltip
                            placement="top"
                            size="md"
                            className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                            content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Enable auto reminders {" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start justify-between ">
                        <h2 className="text-[14px] font-[600]">
                            Send First Reminder After{" "}
                        </h2>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["3d"]}
                        className="min-w-[300px] md:max-w-[300px] pt-3"
                    >
                        {animals.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                    <div className="flex items-start justify-between mt-3">
                        <h2 className="text-[14px] font-[600]">
                            Send Second Reminder After{" "}
                        </h2>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["7d"]}
                        className="min-w-[300px] md:max-w-[300px] pt-3"
                    >
                        {animals.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default Schedule
