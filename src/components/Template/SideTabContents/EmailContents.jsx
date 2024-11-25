import { Tooltip } from '@nextui-org/react';
import { Info, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

import { saveInfo } from '../../../Utils/Contstant';
import { Nunito } from 'next/font/google';
import { usePageDataStore } from '../stores/usePageDataStore';
const nunito = Nunito({ subsets: ["latin"] });
const EmailContents = ({   docDetails,
    setDocDetails,handleRemoveLogo,setdocumentDetail,documentDetail,userDetails,clientEmail,clientLogoForm, isApprover}) => {
    // console.log(documentDetail)
    const {isEditable} = usePageDataStore();
    return (
        <div className="w-full overflow-y-auto h-[calc(100vh-102px)]">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between w-full gap-3">
                        {/* <File size={20} /> */}
                        <span className="text-[14px] text-[#05686E]">Customise Email Title & Message</span>
                        <span className=" text-[#05686E] ">
                            <Tooltip
                                placement="top"
                                size="md"
                                className={`w-[250px]  bg-[#e3feff] p-3 ${nunito.className}`}
                                content={saveInfo}
                            >
                                <Info size={17} />
                            </Tooltip>
                        </span>
                        {/* <h1 className="text-[14px] font-bold">Title & Message</h1> */}
                    </div>
                </div>
            </div>
            <div className="flex  flex-col w-full">
                <div className="flex-1">
                    <div className="p-4 text-[14px] border-b flex flex-col">
                        <label htmlFor="doctitle">Email Subject</label>
                        <input
                            disabled={!isEditable}
                            onChange={(event) => {
                                setDocDetails({
                                    ...docDetails, emailTemplate: {
                                        ...docDetails?.emailTemplate,
                                        title: event.target.value,
                                    }
                                })
                                // setdocumentDetail({
                                //     ...documentDetail,
                                //     title: event.target.value,
                                // });
                            }}
                            style={{ border: '1px solid' }}
                            maxLength={80}
                            value={docDetails?.emailTemplate?.title}
                            type="text"
                            placeholder="Email Subject Text"
                            className="border rounded-[3px] w-full py-1 px-3 mt-2 "
                        />
                    </div>

                    <div className="p-4 text-[14px] flex flex-col w-full">
                        <label htmlFor="doctitle">Email Body</label>
                        {/* <h1 className="py-1 text-[12px] font-bold">
                                    {documentDetail.title
                                        ? documentDetail.title
                                        : "Email Subject"}
                                </h1> */}
                        <p className="opacity-60 text-[12px] py-2">{`Hi <Signer's Name>`}</p>
                        <textarea
                        disabled={!isEditable}
                           style={{border:'1px solid'}}
                            onChange={(event) => {
                                setDocDetails({
                                    ...docDetails, emailTemplate: {
                                        ...docDetails?.emailTemplate,
                                        message: event.target.value,
                                    }
                                })
                                // setdocumentDetail({
                                //     ...documentDetail,
                                //     message: event.target.value,
                                // });
                            }}
                            // onKeyDown={handleKeyDown}
                            value={docDetails?.emailTemplate?.message}
                            placeholder="Email Body Message"
                            className="aspect-[1/.8] py-1 px-3 mt-2 hideScroll border rounded-[3px]"
                        />
                        <div className="">
                            <div className="py-2">
                                <Tooltip
                                    placement="bottom"
                                    content="This will enabled in email"
                                    classNames={{
                                        base: [
                                            // arrow color
                                            "before:bg-neutral-400 dark:before:bg-white",
                                        ],
                                        content: [
                                            "py-1 px-4 shadow-md",
                                            "text-background bg-[#056a70ff]",
                                        ],
                                    }}
                                >
                                    <button
                                        disabled
                                        className="bg-blue-500 opacity-70 py-1 text-[12px] px-6 rounded-md text-background mt-3"
                                    >
                                        Sign Documents
                                    </button>
                                </Tooltip>

                                <p className="mt-3 text-[12px] opacity-60">
                                    If you have any questions or need assistance, feel free to
                                    reach out to sender.
                                </p>
                                <h3 className="mt-3 font-bold text-[12px] mb-2">
                                    Thanks & Regards, <br />
                                    {userDetails?.data && userDetails?.data.fullname}
                                    {/* <span className="text-[#056a70ff]">.</span> */}
                                </h3>
                                {docDetails?.clientFile ? (
                                    <div className="relative">
                                        <Image
                                            className="my-5"
                                            src={
                                                typeof docDetails?.clientFile === "string"
                                                    ? docDetails?.clientFile
                                                    : URL.createObjectURL(docDetails?.clientFile)
                                            }
                                            width={50}
                                            height={50}
                                        ></Image>
                                        <span>
                                            <Trash2
                                                className="absolute top-0 left-[55px] text-black hover:cursor-pointer"
                                                size={12}
                                                onClick={() => handleRemoveLogo()}
                                            />
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <input
                                        disabled={!isEditable}
                                            type="file"
                                            ref={clientLogoForm}
                                            onChange={(event) => {
                                                console.log(event.target.files[0]);
                                                if (window.FileReader && event.target.files[0]) {
                                                    const file = new FileReader();
                                                    if (
                                                        event.target.files[0] &&
                                                        event.target.files[0].type.match("image.*")
                                                    ) {
                                                        file.onload = function () {
                                                            setDocDetails({ ...docDetails, clientFile: event.target.files[0] })
                                                            // setClientEmail(event.target.files[0]);
                                                        };
                                                        file.readAsDataURL(event.target.files[0]);
                                                    }
                                                }
                                            }}
                                            accept=".jpeg,.png"
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => clientLogoForm.current.click()}
                                            className="w-[30px] aspect-square border-2 flex items-center justify-center"
                                        >
                                            <Plus size={20} className="hover:cursor-pointer" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="border-t flex flex-col items-end bg-gray-100 py-2 px-4 ">

                                <h4 className="font-bold text-[#056a70ff] mt-2 pr-1text-[12px]">
                                    Powered By
                                </h4>
                                <Image
                                    src={"/images/Colibri.png"}
                                    width={70}
                                    height={70}
                                ></Image>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="flex-1 group relative border-l border-t">
                    <div className="absolute opacity-0 z-10 top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2">
                        <button className="py-2 px-5 bg-[#056a70ff] text-background rounded-lg">
                            See Preview
                        </button>
                    </div>
                    <div className=" ">
                        <h1 className="py-5 lg:px-10 px-5 border-b text-lg font-bold">
                                    {documentDetail.title
                                        ? documentDetail.title
                                        : "Email Subject"}
                                </h1>

                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default EmailContents
