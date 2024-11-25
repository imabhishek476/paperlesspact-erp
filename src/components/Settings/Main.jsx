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
import Link from "next/link";
const nunito = Nunito({ subsets: ["latin"] });
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

export const animals = [
    { label: "Cat", value: "cat", description: "The second most popular pet in the world" },
    { label: "Dog", value: "dog", description: "The most popular pet in the world" },
    { label: "Elephant", value: "elephant", description: "The largest land animal" },
    { label: "Lion", value: "lion", description: "The king of the jungle" },
    { label: "Tiger", value: "tiger", description: "The largest cat species" },
    { label: "Giraffe", value: "giraffe", description: "The tallest land animal" },
    {
        label: "Dolphin",
        value: "dolphin",
        description: "A widely distributed and diverse group of aquatic mammals",
    },
];
const font = [
    { label: "Arial", value: "Arial", },
    { label: "Calibri", value: "Calibri", },
    { label: "Courier New", value: "Courier New", },
    { label: "Georgia", value: "Georgia", },
    { label: "Times New Roman", value: "Times New Roman", },
]
const dateFormat = [
    { label: "2023 Nov 23", value: "d1" },
    { label: "23 Nov 2023", value: "d2" },
    { label: "Nov 23 2023", value: "d3" },
    { label: "2023-11-23", value: "d4" },
    { label: "23-11-2023", value: "d5" },
    { label: "11-23-2023", value: "d6" },
]
const timeFormat = [
    { label: "12", value: "12" },
    { label: "24", value: "24" },

]
const language = [
    { label: "English", value: 'en' },
    { label: 'Hindi', value: "hn" }
]
const signerList=[
    {label:"Other Only",value:"Other Only"},
    {label:"Me & Other",value:"Me & Other"},
    {label:"Me Only",value:"Me Only"},
]
const docList=[
    {label:"All",value:"All"},
    {label:"Draft",value:"Draft"},
    {label:"Completed",value:"Completed"},
    {label:"In Process",value:"In Process"},
    {label:"I need to sign",value:"I need to sign"},
    {label:"Cancelled",value:"Cancelled"},
]
const Main = () => {
    const [value, setValue] = useState("cat")
    const [isOpen, setIsOpen] = React.useState(false);
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
            {/* Document Default Settings */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Document Default Settings</h1></div>
                <div className="p-5  border-b flex flex-col gap-2 ">
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
                            Always require all signers to sign to complete document {" "}
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
                            content={`If this option is enabled, files that are uploaded to "attachment" fields by signers will be appended to the final PDF document after the last page. Only the following after formats will be appended: DOC, DOCX, TXT, SVG, JPEG, PNG, PDF, XLS`}
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Append signer attachments to completed document PDF{" "}
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
                            content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Activate Signing Order by default{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">
                        <Tooltip
                            placement="top"
                            size="md"
                            className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                            content="The default font will appear in any field that have been added to a document where a font is present"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5 font-[600]">
                            Default Field Font  {" "}
                        </label>

                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["Arial"]}
                        className="min-w-[300px] md:max-w-[300px] mt-3"
                    >
                        {font.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {/* <Popover placement="bottom-start">
                        <PopoverTrigger>
                            <button className="flex gap-5 min-h-[47px] sm:w-[500px] mt-3 min-w-[300px] md:max-w-[300px] justify-between items-center border px-3 border-gray-500">
                                <div className="flex gap-1 items-center sm:py-0 py-1">
                                    Cat
                                </div>
                                <ChevronDownIcon size={18} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[290px]`}
                        >
                            <ul className="p-2 w-full">
                                {animals.map((e, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="text-[14px] flex justify-start px-2 py-2 gap-1 cursor-pointer hover:bg-cyan-100 w-full"
                                        >
                                            {e.value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </PopoverContent>
                    </Popover> */}
                </div>
            </div>
            {/* Template Default Settings */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Template Default Settings</h1></div>
                <div className="p-5  border-b flex flex-col gap-2 ">
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
                            Make new templates available to staff members  {" "}
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
                            content={`If this option is enabled, files that are uploaded to "attachment" fields by signers will be appended to the final PDF document after the last page. Only the following after formats will be appended: DOC, DOCX, TXT, SVG, JPEG, PNG, PDF, XLS`}
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Prevent staff members from modifying global templates{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>

            </div>
            {/* Date & Time */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Date & Time</h1></div>
                <div className='text-[16px] px-4 py-4' >
                    <h1 >The date and time formats below will be used for your documents, "Date Signed" document fields and Audit Trail documents.
                    </h1>
                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start justify-between ">
                        <h2 className="text-[14px] font-[600]">
                            Date Format  {" "}
                        </h2>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["d1"]}
                        className="min-w-[300px] md:max-w-[300px] mt-3"
                    >
                        {dateFormat.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {/* <Popover placement="bottom-start">
                        <PopoverTrigger>
                            <button className="flex gap-5 min-h-[47px] sm:w-[500px] mt-3 min-w-[300px] md:max-w-[300px] justify-between items-center border px-3 border-gray-500">
                                <div className="flex gap-1 items-center sm:py-0 py-1">
                                    Cat
                                </div>
                                <ChevronDownIcon size={18} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[290px]`}
                        >
                            <ul className="p-2 w-full">
                                {animals.map((e, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="text-[14px] flex justify-start px-2 py-2 gap-1 cursor-pointer hover:bg-cyan-100 w-full"
                                        >
                                            {e.value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </PopoverContent>
                    </Popover> */}
                    <div className="flex items-start justify-between mt-3">
                        <h2 className="text-[14px] font-[600]">
                            Time Format  {" "}
                        </h2>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none"
                        }}
                        defaultSelectedKeys={["12"]}
                        className="min-w-[300px] md:max-w-[300px] mt-3"
                    >
                        {timeFormat.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {/* <Popover placement="bottom-start">
                        <PopoverTrigger>
                            <button className="flex gap-5 min-h-[47px] sm:w-[500px] mt-3  min-w-[300px] md:max-w-[300px] justify-between items-center border px-3 border-gray-500">
                                <div className="flex gap-1 items-center sm:py-0 py-1">
                                    {value}
                                </div>
                                <ChevronDownIcon size={18} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[290px]`}
                        >
                            <ul className="p-2 w-full">
                                {animals.map((e, index) => {
                                    return (
                                        <li
                                            onClick={() => setValue(e.value)}
                                            key={index}
                                            className="text-[14px] flex justify-start px-2 py-2 gap-1 cursor-pointer hover:bg-cyan-100 w-full"
                                        >
                                            {e.value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </PopoverContent>
                    </Popover> */}

                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start justify-between ">
                        <h2 className="text-[14px] font-[600]">
                            Default Time Zone  {" "}
                        </h2>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["cat"]}
                        className="min-w-[300px] md:max-w-[300px] mt-3"
                    >
                        {animals.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {/* <Popover placement="bottom-start">
                        <PopoverTrigger>
                            <button className="flex gap-5 min-h-[47px] sm:w-[500px] mt-3  min-w-[300px] md:max-w-[300px] justify-between items-center border px-3 border-gray-500">
                                <div className="flex gap-1 items-center sm:py-0 py-1">
                                    Cat
                                </div>
                                <ChevronDownIcon size={18} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[290px]`}
                        >
                            <ul className="p-2 w-full">
                                {animals.map((e, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="text-[14px] flex justify-start px-2 py-2 gap-1 cursor-pointer hover:bg-cyan-100 w-full"
                                        >
                                            {e.value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </PopoverContent>
                    </Popover> */}

                </div>
            </div>
            {/* Language */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Language</h1></div>
                <div className='text-[16px] px-4 py-4' >
                    <h1 >The signing page for documents sent out from this business will appear in the default language below. This language can be overridden on a per-contact and on a per-document basis.
                    </h1>
                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start justify-between ">
                        <h2 className="text-[14px] font-[600]">
                            Default Language  {" "}
                        </h2>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["en"]}
                        className="min-w-[300px] md:max-w-[300px] mt-3"
                    >
                        {language.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {/* <Popover placement="bottom-start">
                        <PopoverTrigger>
                            <button className="flex gap-5 min-h-[47px] sm:w-[500px] mt-3 min-w-[300px] md:max-w-[300px] justify-between items-center border px-3 border-gray-500">
                                <div className="flex gap-1 items-center sm:py-0 py-1">
                                    Cat
                                </div>
                                <ChevronDownIcon size={18} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[290px]`}
                        >
                            <ul className="p-2 w-full">
                                {animals.map((e, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="text-[14px] flex justify-start px-2 py-2 gap-1 cursor-pointer hover:bg-cyan-100 w-full"
                                        >
                                            {e.value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </PopoverContent>
                    </Popover> */}

                </div>

            </div>
            {/* Document Setup & Management */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Document Setup & Management</h1></div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start justify-between ">
                        <h2 className="text-[14px] font-[600]">
                            Document List Default Tab  {" "}
                        </h2>
                    </div>
                    {/* <Popover placement="bottom-start">
                        <PopoverTrigger>
                            <button className="flex gap-5 min-h-[47px] sm:w-[500px] mt-3 min-w-[300px] md:max-w-[300px] justify-between items-center border px-3 border-gray-500">
                                <div className="flex gap-1 items-center sm:py-0 py-1">
                                    Cat
                                </div>
                                <ChevronDownIcon size={18} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[290px]`}
                        >
                            <ul className="p-2 w-full">
                                {animals.map((e, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="text-[14px] flex justify-start px-2 py-2 gap-1 cursor-pointer hover:bg-cyan-100 w-full"
                                        >
                                            {e.value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </PopoverContent>
                    </Popover> */}
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["All"]}
                        className="min-w-[300px] md:max-w-[300px] mt-3"
                    >
                        {docList.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>

                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start justify-between ">
                        <h2 className="text-[14px] font-[600]">
                            Default Signer Group  {" "}
                        </h2>
                    </div>
                    {/* <Popover placement="bottom-start">
                        <PopoverTrigger>
                            <button className="flex gap-5 min-h-[47px] sm:w-[500px] mt-3 min-w-[300px] md:max-w-[300px] justify-between items-center border px-3 border-gray-500">
                                <div className="flex gap-1 items-center sm:py-0 py-1">
                                    Cat
                                </div>
                                <ChevronDownIcon size={18} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[290px]`}
                        >
                            <ul className="p-2 w-full">
                                {animals.map((e, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="text-[14px] flex justify-start px-2 py-2 gap-1 cursor-pointer hover:bg-cyan-100 w-full"
                                        >
                                            {e.value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </PopoverContent>
                    </Popover> */}
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["Other Only"]}
                        className="min-w-[300px] md:max-w-[300px] mt-3"
                    >
                        {signerList.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>

                </div>
                <div className='flex flex-col border-t w-full my-auto'>
                    <div className="p-5  border-b flex flex-col gap-2 ">
                        <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">
                            <Tooltip
                                placement="top"
                                size="md"
                                className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                                content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                            >
                                <HelpCircle size={20} />
                            </Tooltip>
                            <label htmlFor="doctitle" className="sm:w-auto w-4/5 ">
                                Enable contact autocomplete when adding signers & CCs {" "}
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
                                content={`If this option is enabled, files that are uploaded to "attachment" fields by signers will be appended to the final PDF document after the last page. Only the following after formats will be appended: DOC, DOCX, TXT, SVG, JPEG, PNG, PDF, XLS`}
                            >
                                <HelpCircle size={20} />
                            </Tooltip>
                            <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                                Enable contact autosave when adding signers & CCs{" "}
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
                                content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                            >
                                <HelpCircle size={20} />
                            </Tooltip>
                            <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                                Enable hidden tags{" "}
                            </label>
                            <input
                                type="checkbox"
                                defaultChecked={false}
                                className="w-4 aspect-square relative top-1"
                            />
                        </div>
                        <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">
                            <Tooltip
                                placement="top"
                                size="md"
                                className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                                content={`If this option is enabled, files that are uploaded to "attachment" fields by signers will be appended to the final PDF document after the last page. Only the following after formats will be appended: DOC, DOCX, TXT, SVG, JPEG, PNG, PDF, XLS`}
                            >
                                <HelpCircle size={20} />
                            </Tooltip>
                            <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                                Enable third-party cloud storage integrations{" "}
                            </label>
                            <input
                                type="checkbox"
                                defaultChecked={true}
                                className="w-4 aspect-square relative top-1"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Main
