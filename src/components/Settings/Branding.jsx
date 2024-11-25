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
import demoIng from '../../../public/images/lawinzo/lawyers-ico.png'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Image from "next/image";
const Branding = () => {
    const fileRef = useRef();
    const [preview, setPreview] = useState(null);
    function handleFileChange(event) {
        console.log(event.target.files[0]);
        if (window.FileReader && event.target.files[0]) {
            // setFiles([...files, ...event.target.files]);
            const file = new FileReader();
            if (
                event.target.files[0] &&
                event.target.files[0].type.match("image.*")
            ) {
                file.onload = function () {
                    console.log(file.result)
                    setPreview(file.result);
                };
                file.readAsDataURL(event.target.files[0]);
            }
        }
    }

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
            {/* Icon */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Icon</h1></div>
                <div className='text-[16px] px-4 py-4' >
                    <h1 >Your logo will be used primarily in your control panel and log-in screens.
                    </h1>

                </div>
                <div className='border-t-2 text-[14px] px-5 pt-5 pb-1 flex flex-row gap-3'>
                <Image
                        width={64}
                        height={64}
                        alt="NextUI hero Image"
                        className="w-[64px] h-[64px]"
                        src={preview ? preview : demoIng}
                    />
                        <Image
                        width={64}
                        height={64}
                        className="w-[64px] h-[64px]"
                        alt="NextUI hero Image"
                        src={preview ? preview : demoIng}
                    />
               
                    <div className="">
                        <input
                            type="file"
                            accept=".png,.jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileRef}
                        />

                    </div>
                    <div className="flex flex-col md:flex-row gap-3 justify-end md:justify-normal">
                    {preview && <Button
                        // size="sm"
                        onClick={() => setPreview(null)}
                        className="font-semibold rounded-md border bg-red-500  text-white hover:opacity-70 sm:h-19 h-9 sm:px-5 px-3 self-end"
                    >
                        Remove
                    </Button>}
                    <Button
                        // size="sm"
                        onClick={() => fileRef.current.click()}
                        className="font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] sm:h-19 h-9 sm:px-5 px-3 self-end"
                    >
                        Upload
                    </Button>
                    </div>
                  
                </div>

                <p className="px-5 text-[14px] opacity-60 pb-5">64px x 64px, JPEG/PNG</p>

            </div>
            {/* Logo */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Logo </h1></div>
                <div className='text-[16px] px-4 py-4' >
                    <h1 >Your logo will be used primarily in your control panel and log-in screens.

                    </h1>
                </div>
                <div className='border-t-2 text-[14px] px-5 pt-5 pb-1 flex flex-row gap-3'>
                <Image
                        width={225}
                        height={225}
                        alt="NextUI hero Image"
                        className="w-[225px] h-[225px]"
                        src={preview ? preview : demoIng}
                    />
                 

                    <div className="">
                        <input
                            type="file"
                            accept=".png,.jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileRef}
                        />

                    </div>
                    <div className="flex flex-col md:flex-row gap-3 justify-end md:justify-normal">
                    {preview && <Button
                        // size="sm"
                        onClick={() => setPreview(null)}
                        className="font-semibold rounded-md border bg-red-500  text-white hover:opacity-70 sm:h-19 h-9 sm:px-5 px-3 self-end"
                    >
                        Remove
                    </Button>}
                    <Button
                        // size="sm"
                        onClick={() => fileRef.current.click()}
                        className="font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] sm:h-19 h-9 sm:px-5 px-3 self-end"
                    >
                        Upload
                    </Button>
                    </div>
                </div>

                <p className="px-5 text-[14px] opacity-60 pb-5">225px x 225px, JPEG/PNG</p>

            </div>
            {/* Email Logo */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Email Logo </h1></div>
                <div className='text-[16px] px-4 py-4' >
                    <h1 >Your email logo will be shown on the header section of outgoing emails.
                    </h1>

                </div>
                <div className='border-t-2 text-[14px] px-5 pt-5 pb-1 flex flex-row gap-3'>
                    <Image
                        width={225}
                        height={225}
                        alt="NextUI hero Image"
                        src={preview ? preview : demoIng}
                        className="w-[225px] h-[225px]"
                    />


                    <div className="">
                        <input
                            type="file"
                            accept=".png,.jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileRef}
                        />

                    </div>
                    <div className="flex flex-col md:flex-row gap-3 justify-end md:justify-normal">
                    {preview && <Button
                        // size="sm"
                        onClick={() => setPreview(null)}
                        className="font-semibold rounded-md border bg-red-500  text-white hover:opacity-70 sm:h-19 h-9 sm:px-5 px-3 self-end"
                    >
                        Remove
                    </Button>}
                    <Button
                        // size="sm"
                        onClick={() => fileRef.current.click()}
                        className="font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] sm:h-19 h-9 sm:px-5 px-3 self-end"
                    >
                        Upload
                    </Button>
                    </div>
                </div>

                <p className="px-5 text-[14px] opacity-60 pb-5">225px x 225px, JPEG/PNG</p>

            </div>
            {/* Audit Trail Logo */}
            <div className='flex flex-col border rounded-md  w-full my-auto mt-[2rem]'>
                <div className='px-4 py-2 text-start bg-[#e8eff6] text-[16px] font-[500]'><h1>Audit Trail Logo </h1></div>
                <div className='text-[16px] px-4 py-4' >
                    <h1 >Your logo will be shown on the header section of your audit trails.
                    </h1>

                </div>
                <div className='border-t-2 text-[14px] px-5 pt-5 pb-1 flex flex-row gap-3'>
                <Image
                        width={225}
                        height={225}
                        alt="NextUI hero Image"
                        src={preview ? preview : demoIng}
                        className="w-[225px] h-[225px]"
                    />

                    <div className="">
                        <input
                            type="file"
                            accept=".png,.jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileRef}
                        />

                    </div>
                    <div className="flex flex-col md:flex-row gap-3 justify-end md:justify-normal">
                    {preview && <Button
                        // size="sm"
                        onClick={() => setPreview(null)}
                        className="font-semibold rounded-md border bg-red-500  text-white hover:opacity-70 sm:h-19 h-9 sm:px-5 px-3 self-end"
                    >
                        Remove
                    </Button>}
                    <Button
                        // size="sm"
                        onClick={() => fileRef.current.click()}
                        className="font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] sm:h-19 h-9 sm:px-5 px-3 self-end"
                    >
                        Upload
                    </Button>
                    </div>
                </div>

                <p className="px-5 text-[14px] opacity-60 pb-5">225px x 225px, JPEG/PNG</p>

            </div>
        </div>
    )
}

export default Branding
