import { CornerUpRight, Edit, File, FileText, Folder, FolderOpen, Link, MoreHorizontal, Star, StarOff, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatDate } from '../../Utils/dateTimeHelpers';
import { Avatar, Popover, PopoverContent, PopoverTrigger, Skeleton, Spinner } from '@nextui-org/react';
import dayjs from 'dayjs';
import FavFolderList from './FavFolderList';
import { Divider } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';

const ActiveFolderList = ({
    nodes,
    viewLayout,
    activeNode,
    parentId,
    setParentId,
    fetchfolderStructureByPath,
    isActiveLoading,
    setActions,
    onOpen,
    actionList,
    setCurrentPage,
    addToFavvv,
    deleteNodeee,
    setNode,
    Loading
}
) => {
    const [isOpenPop, setIsOpenPop] = React.useState({});
    const [size, setSize] = useState(80);
    const foldersArray = activeNode[parentId];
    const newfavList = foldersArray?.filter((fav) => {
        if (fav.isFavourite === '1') {
            return fav
        }
    })
    const newFolderArray = foldersArray?.filter((fav) => {
        if (fav.isFavourite === '0') {
            return fav
        }
    })
    // console.log(viewLayout)
    // console.log(foldersArray)
    useEffect(() => {
        if (viewLayout === 'list') {
            setSize(20);
        } else {
            setSize(80);
        }
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [viewLayout]);

    const handlePopoverOpen = (nodeId) => {
        setIsOpenPop({ [nodeId]: nodeId });
    };

    const handleContextMenu = (event, nodeId) => {
        console.log("yes")
        event.preventDefault();
        setIsOpenPop({ [nodeId]: nodeId });
    };

    const handleDocumentClick = (event) => {
        if (!event.target.closest('.popover-container')) {
            setIsOpenPop({});
        }
    };
    const router = useRouter()
    const handleClickOpen = (node) => {
        if (node?.isFile === '1') {
            console.log(node)
            if (node?.type === "presentation") {
                router.push(`/presentation/new?id=${node?._id}`)
            } else {
                router.push(`/template/new?id=${node?._id}`)
            }
        }
        else {
            console.log("in")
            fetchfolderStructureByPath(node && node._id ? node?._id : node);
            // setCurrentPage('folder')
            setParentId(node && node._id ? node?._id : node);
        }
    }
    return (
        viewLayout == 'list' ?
            <>
                <div className={`flex flex-col`}>
                    {foldersArray && foldersArray.length > 0 && <div className='grid grid-cols-12 px-2 pb-2 border-b-2 text-[14px] font-[600]'>
                        <div className='col-span-4 lg:col-span-3'>
                            Name
                        </div>
                        <div className='col-span-3'>
                            Owner
                        </div>
                        <div className='col-span-4'>
                            Last Modified
                        </div>
                        <div className='col-span-2'></div>
                    </div>}
                    {foldersArray && !Loading && foldersArray.length > 0 ?
                        foldersArray?.map((node) => (
                            <div className='hover:bg-[#d6d6d6] text-[14px] transition-all duration-300 cursor-pointer py-[4px] px-[5px] grid-cols-12 grid' key={node?._id}>
                                <div onClick={() => {
                                    handleClickOpen(node)
                                }} className={`col-span-4 lg:col-span-3 gap-1 items-center`}>
                                    <div className='flex flex-row gap-1 max-w-[100px] lg:max-w-full'>
                                        {node?.isFile === "0" ? <FolderOpen size={size} color='#05686E' /> :  <Image alt='file' src="images/tSample.svg" width={80} height={20} />}
                                        <p className='truncate'> {node?.name}</p>
                                    </div>
                                </div>
                                <div className={`col-span-3 gap-1 items-center`}>
                                    <div className='flex flex-row gap-2  max-w-[80px] lg:max-w-full'>
                                        <Avatar className='w-[20px] h-[20px] self-center' size='sm' color="warning" src={node?.createdByUser?.userProfileImageLink} />
                                        <p className='truncate'>
                                            {node?.createdByUser?.fullname}
                                        </p>
                                    </div>
                                </div>
                                <div className={`col-span-3 gap-1 items-center`}>
                                    <div className='flex flex-row gap-1'>
                                        {formatDate(node?.updatedAt)}
                                    </div>
                                </div>
                                <div className='col-span-1  self-center'>
                                    {node?.isFavourite != '0' && <Star size={15} />}
                                </div >
                                <div className={`col-span-1 lg:col-span-2 self-end`}>
                                    <div className='ml-[90%]'>
                                        <Popover
                                            placement="right"
                                            showArrow={true}
                                            isOpen={isOpenPop[node?._id] || false}
                                            onOpenChange={() => handlePopoverOpen(node?._id)}
                                        >
                                            <PopoverTrigger>
                                                <MoreHorizontal
                                                    size={18}
                                                    onClick={() => handlePopoverOpen(node?._id)}
                                                />
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <ul className="min-w-[200px] py-1">
                                                    <li
                                                        onClick={() => {
                                                            deleteNodeee(node);
                                                        }}
                                                        className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                                    >
                                                        <Trash size={18} /> Delete
                                                    </li>
                                                    <li
                                                        onClick={() => {
                                                            addToFavvv(node, node?.isFavourite === '0' ? '1' : '0');
                                                        }}
                                                        className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                                    >
                                                        {
                                                            node?.isFavourite === '0' ? (
                                                                <><Star size={18} /> Add to Favorites</>
                                                            )
                                                                : (
                                                                    <><StarOff size={18} color="#05686e" />Remove from Favorites</>
                                                                )
                                                        }
                                                    </li>
                                                    <li
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(node?.url);
                                                            setIsOpenPop(false);
                                                        }}
                                                        className={`${node?.isFile === '1' ? 'flex' : 'hidden'} items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg`
                                                        }>
                                                        <Link size={18} /> Copy link
                                                    </li>
                                                    <li
                                                        onClick={() => {
                                                            setNode(node);
                                                            setActions(actionList[0]);
                                                            onOpen();
                                                        }}
                                                        className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                                    >
                                                        <Edit size={18} /> Rename
                                                    </li>
                                                    <li
                                                        onClick={() => {
                                                            setNode(node);
                                                            setActions({
                                                                title: "MoveTo",
                                                            });
                                                            onOpen();
                                                        }}
                                                        className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                                    >
                                                        <CornerUpRight size={18} /> Move to
                                                    </li>
                                                </ul>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>


                        )) :
                        <>
                            {Loading ?
                                <div className="flex w-full gap-4 justify-start">
                                    {Array.from({ length: 5 }, (_, i) => <div key={i} className="flex flex-col gap-2 w-[10%] justify-start">
                                        <div className="h-[80px] w-[80px]">
                                            <Skeleton className="w-full h-full rounded-lg">
                                                <div className="h-full w-full rounded-lg bg-default-200"></div>
                                            </Skeleton>
                                        </div>
                                        <div className="w-[80px]">
                                            <Skeleton className="w-full rounded-lg">
                                                <div className="h-3 w-full rounded-lg bg-default-200"></div>
                                            </Skeleton>
                                        </div>
                                    </div>)}

                                </div> :
                                <div className='flex flex-col justify-center items-center gap-2 m-auto mt-10'>
                                    <img width={'200px'} src='/images/noTemplate.png' alt='noFiles' />
                                    <p className='text-[15px] text-black '>This folder is empty</p>
                                </div>}
                        </>
                    }

                </div>
            </>
            :
            <>
                {newfavList && newfavList?.length > 0 &&
                    <div className='flex flex-col'>
                        <h1 className="text-[15px] font-[600] mb-2">Favorites</h1>
                        <FavFolderList Loading={Loading} setNode={setNode} addToFavvv={addToFavvv} nodes={newfavList} setParentId={setParentId} fetchfolderStructureByPath={fetchfolderStructureByPath} setCurrentPage={setCurrentPage} parentId={parentId} isActiveLoading={isActiveLoading} setActions={setActions} onOpen={onOpen} actionList={actionList} deleteNodeee={deleteNodeee} />
                        <Divider className='mt-4' />
                    </div>
                }
                <div className={`flex flex-row gap-10 flex-wrap ${foldersArray?.length > 0 ? "items-start" : "items-center"} `}>
                    {foldersArray && !Loading && foldersArray.length > 0 ?
                        newFolderArray?.map((node) => (
                            <Popover
                                // showArrow
                                key={node?._id}
                                offset={node?.isFile === '1' ? -40 : -60}
                                // showArrow
                                placement="bottom-start"
                                isOpen={isOpenPop[node?._id] || false}
                            // onOpenChange={() => handlePopoverOpen(node?._id)}
                            >
                                <PopoverTrigger>
                                    <div onContextMenu={(event) => handleContextMenu(event, node?._id)} key={node?._id} className="popover-container flex items-start">
                                        <div onClick={() => {
                                          handleClickOpen(node)
                                        }} className={`flex justify-start items-center flex-col cursor-pointer max-w-[100px]`}>
                                            {node?.isFile === "0" ? <FolderOpen size={size} color='#05686E' /> :  <Image alt='file' src="images/tSample.svg" width={80} height={20} />}
                                            <p className='break-all w-full text-center'>  {node?.name}</p>
                                        </div>

                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <ul className="min-w-[200px] py-1">
                                        <li
                                            onClick={() => {
                                                deleteNodeee(node);
                                            }}
                                            className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                        >
                                            <Trash size={18} /> Delete
                                        </li>
                                        <li
                                            onClick={() => {
                                                addToFavvv(node, node?.isFavourite === '0' ? '1' : '0');
                                            }}
                                            className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                        >
                                            {
                                                node?.isFavourite === '0' ? (
                                                    <><Star size={18} /> Add to Favorites</>
                                                )
                                                    : (
                                                        <><StarOff size={18} color="#05686e" />Remove from Favorites</>
                                                    )
                                            }
                                        </li>
                                        <li
                                            onClick={() => {
                                                navigator.clipboard.writeText(node?.url);
                                                setIsOpenPop(false);
                                            }}
                                            className={`${node?.isFile === '1' ? 'flex' : 'hidden'} items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg`
                                            }>
                                            <Link size={18} /> Copy link
                                        </li>
                                        <li
                                            onClick={() => {
                                                setNode(node);
                                                setActions(actionList[0]);
                                                onOpen();
                                            }}
                                            className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                        >
                                            <Edit size={18} /> Rename
                                        </li>
                                        <li
                                            onClick={() => {
                                                setNode(node);
                                                setActions({
                                                    title: "MoveTo",
                                                });
                                                onOpen();
                                            }}
                                            className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                        >
                                            <CornerUpRight size={18} /> Move to
                                        </li>
                                    </ul>
                                    <div className="py-2 w-full">
                                        <h2 className="text-xs">
                                            Last edited by {node.createdByUser?.fullname}
                                        </h2>
                                        <h2 className="text-xs">
                                            Created at {dayjs(node.createdAt).format("DD/MM/YYYY")}
                                        </h2>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )) :
                        <>
                            {Loading ? <div className="flex w-full gap-4 justify-start">
                                {Array.from({ length: 5 }, (_, i) => <div key={i} className="flex flex-col gap-2 w-[10%] justify-start">
                                    <div className="h-[80px] w-[80px]">
                                        <Skeleton className="w-full h-full rounded-lg">
                                            <div className="h-full w-full rounded-lg bg-default-200"></div>
                                        </Skeleton>
                                    </div>
                                    <div className="w-[80px]">
                                        <Skeleton className="w-full rounded-lg">
                                            <div className="h-3 w-full rounded-lg bg-default-200"></div>
                                        </Skeleton>
                                    </div>
                                </div>)}

                            </div> :
                                <div className='flex flex-col justify-center items-center gap-2 m-auto mt-10'>
                                    <img width={'200px'} src='/images/noTemplate.png' alt='noFiles' />
                                    <p className='text-[15px] text-black'>This folder is empty</p>
                                </div>}
                        </>


                    }
                </div>
            </>
    );
};

export default ActiveFolderList;
