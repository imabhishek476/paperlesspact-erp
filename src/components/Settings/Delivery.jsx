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
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import React, { useRef, useState } from "react";
import { Nunito } from "next/font/google";
import Link from "next/link";
const nunito = Nunito({ subsets: ["latin"] });
export const animals = [
    { label: "Current User", value: "Current User" },
    { label: "Bussiness Owner", value: "Bussiness Owner" },

];

const Delivery = () => {
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

            {/* Delivery */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Delivery</h1></div>
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
                            Attach completed document as PDF when sending completion email{" "}
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
                            Attach Audit Trail to completed PDF document when sending completion email{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2 pb-2">
                        <Tooltip
                            placement="top"
                            size="md"
                            className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                            content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5 font-[600]">
                            Contact Button Type{" "}
                        </label>
                    </div>
                    <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        defaultSelectedKeys={["Current User"]}
                        className="min-w-[300px] md:max-w-[300px]"
                    >
                        {animals.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select>



                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2 pb-2">
                        <Tooltip
                            placement="top"
                            size="md"
                            className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                            content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5 font-[600]">
                            Completed Document Prefix{" "}
                        </label>
                    </div>
                    <input
                        type="text"
                        value={"[Completed]"}
                        className="border w-full sm:w-[300px] py-1 px-3  min-h-[47px]"
                    />
                    <h1 className="text-[16px] py-2">Preview of the filename: [completed] my-document.pdf</h1>
                </div>
                <div className='border-t-2 text-[14px] p-5'>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2 pb-2">
                        <Tooltip
                            placement="top"
                            size="md"
                            className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                            content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5 font-[600]">
                            Custom Requester Email{" "}
                        </label>
                    </div>
                    <input
                        type="text"
                        placeholder="max@example.com"
                        className="border w-full sm:w-[300px] px-3 py-1 min-h-[47px]"
                    />

                </div>
            </div>
            {/* Sender */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Sender</h1></div>
                <div className="p-5  border-b flex flex-col gap-2 ">
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">

                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Be notified via email when a document is initially opened by a signer {" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">

                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Be notified via email when a document is declined by a signer{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>

                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">

                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Be notified via email when a document is reassigned by a signer to another person{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">

                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Be notified via email when a document is expired{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">

                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Be notified via email when a document is signed by a signer{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                    <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2">

                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Be notified via email when a document is completed{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>

            </div>
            {/* Signer */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Signer</h1></div>
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
                            Send "Document Signed" email to signers{" "}
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
                            Send "Document Expired" email to signers{" "}
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
                            Send "Document Cancelled" email to signers{" "}
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
                            Send "Document Reassigned" email to signers{" "}
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
                            Send "Document Reassigned" email to signers{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                    <div className=" border-t-2 flex items-start flex-row-reverse sm:justify-end justify-between gap-2 pt-2">
                        <Tooltip
                            placement="top"
                            size="md"
                            className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                            content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Template Links - Send "Document Completed" email to signer{" "}
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
                            Template Links - Enable document updates to signer{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>

            </div>
            {/* CC/Recipients */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1> CC/Recipients </h1></div>

                <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2 p-5">
                    <Tooltip
                        placement="top"
                        size="md"
                        className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                        content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                    >
                        <HelpCircle size={20} />
                    </Tooltip>
                    <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                        Send "Signature Request Sent" email to CCs{" "}
                    </label>
                    <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 aspect-square relative top-1"
                    />
                </div>
            </div>
        </div>
    )
}

export default Delivery
