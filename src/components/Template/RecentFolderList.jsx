import { CornerUpRight, Edit, File, FileText, Folder, FolderOpen, Link, MoreHorizontal, Star, StarOff, Trash } from 'lucide-react';
import React, { useEffect } from 'react'
import { Avatar, Popover, PopoverContent, PopoverTrigger, Skeleton, Spinner } from '@nextui-org/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Image from 'next/image';

const RecentFolderList = ({
    nodes,
    setCurrentPage,
    parentId,
    setParentId,
    fetchfolderStructureByPath,
    isActiveLoading,
    setActions,
    onOpen,
    actionList,
    addToFavvv,
    deleteNodeee,
    setNode,
    Loading
}) => {
    const [isOpenPop, setIsOpenPop] = React.useState({});
    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handlePopoverOpen = (nodeId) => {
        setIsOpenPop({ [nodeId]: nodeId });
    };

    const handleContextMenu = (event, nodeId) => {
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
    console.log(nodes)
    return (
        <div className={`flex flex-row gap-10 flex-wrap items-start`}>
            {nodes && !Loading && nodes.length > 0 ?
                nodes?.map((node) => (
                    <Popover
                        offset={node?.isFile === '1' ? -40 : -60}
                        // showArrow
                        key={node?._id}
                        placement="bottom-start"
                        isOpen={isOpenPop[node?._id] || false}
                        onOpenChange={() => handlePopoverOpen(node?._id)}
                    >
                        <PopoverTrigger>
                            <div onContextMenu={(event) => handleContextMenu(event, node?._id)} key={node?._id} className="popover-container">
                                <div onClick={() => {
                                    handleClickOpen(node)

                                }} className={`flex justify-center items-center flex-col cursor-pointer max-w-[100px]`}>
                                    {node?.isFile === "0" ? <FolderOpen size={80} color='#05686E' /> : <Image alt='file' src="images/tSample.svg" width={80} height={20} />}
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
                    {/* {Loading ?  */}
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
                        <div className='flex flex-col justify-center items-center gap-2 m-auto'>
                            {/* <img width={'120px'} src='/images/NoCaseImage.png' alt='noFiles' /> */}
                            <Image alt='file' src="images/tSample.svg" width={80} height={20} />
                            <p className='text-[15px] text-black '>No recent activities</p>
                        </div>}

                </>


            }
        </div>
    )
}

export default RecentFolderList
