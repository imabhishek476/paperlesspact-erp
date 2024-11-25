import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { ChevronLeft, ChevronRight, Eye, MoreHorizontalIcon, SquarePen, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
const bgArray = ["#F2F8E9", "#FFEDDE", "#EBE5F3"];
const TeamCarousel = ({ data, popOpen, setPopOpen, capitalizeFirstLetterOfEachWord,handleEdit,handleDelete }) => {
    const router=useRouter()
    console.log(data)
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerPage = 1;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalPages);
    };
    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + totalPages) % totalPages);
    };
    const startIndex = currentSlide * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);
    return (
        <div className="relative pb-2">
           {data?.length>1 && <button className='absolute top-[43%] z-1 left-2 bg-gray-300 rounded-full p-1' onClick={prevSlide}>
                <ChevronLeft size={24} />
            </button>}
            <div className="transition-all duration-700 ">
                {data?.slice(startIndex, endIndex)?.map((item, index) => (
                    <>  
                        <Card
                            key={index}
                            className={`w-full bg-[${bgArray[currentSlide % bgArray.length]
                                }] border-2 rounded-md  rounded-t-none`}
                        >
                            <CardHeader className="flex flex-col items-center justify-center gap-3 relative">
                                <Popover showArrow placement="bottom">
                                    <PopoverTrigger className="absolute top-0 right-0 rounded-bl-lg rounded-tl-none rounded-br-none">
                                        <Button onClick={() => setPopOpen(true)} size="sm" className="bg-gray-50" isIconOnly ><MoreHorizontalIcon size={20} /></Button>
                                    </PopoverTrigger>
                                    {popOpen && <PopoverContent className="w-[120px] rounded-sm">
                                        <div className="p-1 flex flex-col w-full">
                                            <div onClick={() => handleEdit(item?._id)} className="bg-transparent flex flex-row  gap-3 items-center hover:bg-gray-100 hover:cursor-pointer py-2 px-1"><SquarePen size={18} />Edit</div>
                                            <div onClick={() => handleDelete(item?._id)} className="bg-transparent flex flex-row  gap-3 items-center hover:bg-gray-100 hover:cursor-pointer py-2 px-1" > <Trash2 size={18} /> Delete</div>
                                        </div>
                                    </PopoverContent>}
                                </Popover>

                                <Avatar
                                    showFallback
                                    name={item?.name?.substring(0, 2).toUpperCase()}
                                    className="bg-[#05686E] text-white border-white border-2"
                                    src={item?.teamIcon}
                                    size="lg"
                                />
                                <div className="flex flex-col">
                                    <p className="text-[18px] font-bold">
                                        {capitalizeFirstLetterOfEachWord(item.name?.slice(0, 22))}{item.name?.length > 22 && "..."}
                                    </p>
                                </div>
                            </CardHeader>
                            {/* <Divider /> */}
                            <CardBody className="flex flex-row px-5 gap-4 justify-around text-center border-t border-gray-300">
                                <div className="flex flex-col">
                                    <span className="text-[18px]">0</span>
                                    <span className="text-[12px] font-semibold">
                                        Templates
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[18px]"> 0</span>
                                    <span className="text-[12px] font-semibold">
                                        Projects
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[18px]">
                                        {item?.members ? item?.members?.length : 0}
                                    </span>
                                    <span className="text-[12px] font-semibold">
                                        Members
                                    </span>
                                </div>
                            </CardBody>
                            {/* <Divider /> */}
                            <CardFooter className="flex justify-center border-t-2 border-gray-300">
                                {/* <Link href={`/team/${item._id}`}> */}
                                <Button
                                    variant="light"
                                    size="sm"
                                    startContent={<Eye size={12} />}
                                    onClick={() => router.push(`/team/${item._id}`)}
                                >
                                    View Members
                                </Button>
                                {/* </Link> */}
                            </CardFooter>
                        </Card>
                    </>
                ))}
            </div>
        
           {data?.length>1 && <button className='absolute top-[43%] z-0 right-2 bg-gray-300 rounded-full p-1' onClick={nextSlide}>
                <ChevronRight size={24} />
            </button>}
        </div>
    );
}

export default TeamCarousel
