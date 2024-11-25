import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
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

const Signing = () => {
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
            {/* General Settings */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>General Settings</h1></div>
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
                            Enable document signing status page for all documents {" "}
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
                            Show signer & CC email addresses on signing status page{" "}
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
                            Disable PDF document download for incomplete documents{" "}
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
                            content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Hide Xodo Sign branding on document signing page{" "}
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
                            content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Include the document hash on every page of completed documents{" "}
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
                            content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Disallow overage billing for Signer Authentication via SMS.{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>

            </div>
            {/* Signature Types */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Signature Types</h1></div>
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
                            Allow signatures to be drawn {" "}
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
                            Allow signatures to be typed{" "}
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
                            Allow signatures to be uploaded{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>

            </div>
            {/* Signers & Recipients */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1> Signers & Recipients</h1></div>
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
                            Allow signers to decline documents {" "}
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
                            Require the submission of a reason when a document is declined{" "}
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
                            content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Allow signers to reassign documents to someone else{" "}
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
                            Allow signers to view attachments uploaded by other signers{" "}
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
                            Require signers to complete each signature/initials field separately
                            {" "}
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
                            Require signers to skip through optional fields during the signing process {" "}
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
                            content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Enable one-click signing for signature/initials fields  {" "}
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
                            content="If this option is enabled, Signing Order is activated by default for new documents/templates upon creation"
                        >
                            <HelpCircle size={20} />
                        </Tooltip>
                        <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                            Enable recipients to set up an Xodo Sign account after signing a document {" "}
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
                            Enable autoscroll navigation for signers{" "}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            className="w-4 aspect-square relative top-1"
                        />
                    </div>
                </div>

            </div>
            {/* Disclaimer */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1> Disclaimer</h1></div>
                <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2 p-5">
                    <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                        Enable Custom Disclaimer Notice {" "}
                    </label>
                    <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 aspect-square relative top-1"
                    />
                </div>
                <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2 px-5 pt-5 border-t">
                    <Tooltip
                        placement="top"
                        size="md"
                        className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                        content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                    >
                        <HelpCircle size={20} />
                    </Tooltip>
                    <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                        Custom Disclaimer Notice {" "}
                    </label>
                </div>
                <div className="px-5 pb-5 pt-3 ">
                    <textarea
                        placeholder="Enter your custom disclaimer notice here"
                        className="border rounded-lg w-full md:w-[300px] aspect-[2/.6] py-2 px-3 "
                    />
                </div>

            </div>
            {/* Redirects */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-5'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1> Redirects</h1></div>
                <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2 px-5 pt-5">
                    <Tooltip
                        placement="top"
                        size="md"
                        className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                        content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                    >
                        <HelpCircle size={20} />
                    </Tooltip>
                    <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                        Post-Signature Completion Redirect URL {" "}
                    </label>
                </div>
                <div className="px-5 pb-5 pt-3">
                    <input
							type="text"
							placeholder="http://website.com"
							className="border w-full sm:w-[500px] py-1 px-3 mt-2 min-h-[47px]"
						/>
                    </div>
                <div className="flex items-start flex-row-reverse sm:justify-end justify-between gap-2 px-5 pt-5 border-t">
                    <Tooltip
                        placement="top"
                        size="md"
                        className={`w-[300px] bg-[#e3feff] p-3 ${nunito.className}`}
                        content="If this option is enabled, all signer must sign in order to complete a document. If at least one signer declines to sign, the document will be cancelled. This checkbox will also appear when creating a new documemnt and can be adjusted for individual documents."
                    >
                        <HelpCircle size={20} />
                    </Tooltip>
                    <label htmlFor="doctitle" className="sm:w-auto w-4/5">
                        Post-Signature Decline Redirect URL{" "}
                    </label>
                </div>
                <div className="px-5 pb-5 pt-3">
                    <input
							type="text"
							placeholder="http://website.com"
							className="border w-full sm:w-[500px] py-1 px-3 mt-2 min-h-[47px]"
						/>
                    </div>
            </div>
        </div>
    )
}

export default Signing
