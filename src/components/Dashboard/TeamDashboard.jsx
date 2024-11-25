import React, { useEffect, useState } from 'react'
import { getAllMyTeam } from '../../Apis/team'
import { useRouter } from 'next/router'
import {  Card,  Skeleton } from '@nextui-org/react'
import CreateTeamModal from '../Team/CreateTeamModal'
import TeamDeleteModel from '../Team/TeamDeleteModal'
import TeamCarousel from './TeamCarousel'

const TeamDashboard = ({ teamOpen, setTeamOpen }) => {
    const router = useRouter()
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState("")
    const [snackSuccess, setSnackSuccess] = useState("")
    const [popOpen, setPopOpen] = useState(false)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [teamId, setTeamId] = useState("")
    const [editMode, setEditMode] = useState(false)
    const [update, setUpdate] = useState(false)
    const [deleteOpen,setDeleteOpen]=useState(false)
    const getAllTeam = async () => {
        const res = await getAllMyTeam(1, 4)
        if (res) {
            console.log(res)
            setData(res?.ref)
        }
        setLoading(false)
    }
    useEffect(() => {
        getAllTeam()
    }, [update])
    function capitalizeFirstLetterOfEachWord(title) {
        return title.replace(/\b\w/g, (match) => match.toUpperCase());
    }
    const handleEdit = (id) => {
        setPopOpen(false)
        setTeamOpen(true)
        setEditMode(true)
        setTeamId(id)
    }
    const handleDelete = (id) => {
        setPopOpen(false)
        setDeleteOpen(true)
        setTeamId(id)
    }
    return (
        <div>
            {teamOpen && <CreateTeamModal
                editMode={editMode}
                setEditMode={setEditMode}
                isOpen={teamOpen}
                setSnackMessage={setSnackMessage}
                setSnackOpen={setSnackOpen}
                setSnackSuccess={setSnackSuccess}
                setUpdate={setUpdate}
                onOpen={setTeamOpen}
                fromDash={true}
                teamId={teamId}
                setTeamId={setTeamId}
            />}
            {
                deleteOpen && <TeamDeleteModel
                    isOpen={deleteOpen}
                    onOpen={setDeleteOpen}
                    setSnackMessage={setSnackMessage}
                    setSnackOpen={setSnackOpen}
                    setSnackSuccess={setSnackSuccess}
                    setUpdate={setUpdate}
                    teamId={teamId}
                    setTeamId={setTeamId}
                    fromDash={true}
                />
            }
            {loading && <>
                <div className="w-full pb-5">
                    {[...Array(1)].map((_, rowIndex) => {
                        return (
                            <Card key={rowIndex} className="max-w-[400px] space-y-5 p-4 border rounded-t-none" shadow='none' radius="md">
                                <Skeleton className="rounded-lg">
                                    <div className="h-24 rounded-lg bg-default-300"></div>
                                </Skeleton>
                                <Skeleton className="rounded-lg">
                                    <div className="h-12 rounded-lg bg-default-300"></div>
                                </Skeleton>
                                <Skeleton className="rounded-lg">
                                    <div className="h-12 rounded-lg bg-default-300"></div>
                                </Skeleton>
                            </Card>
                        );
                    })}
                </div>
            </>}
            {
                !loading && data?.length > 0 ?
                    <>
                        <TeamCarousel handleEdit={handleEdit} handleDelete={handleDelete} data={data} capitalizeFirstLetterOfEachWord={capitalizeFirstLetterOfEachWord} setPopOpen={setPopOpen} popOpen={popOpen} />
                        {/* <div className='grid grid-cols-6 px-4 py-2 border'>
                            <div className='col-span-1'>Sno</div>
                            <div className='col-span-3'>Team Name</div>
                            <div onClick={() => router.push("/team")} className='col-span-2 flex justify-end hover:cursor-pointer hover:underline hover:text-[#05686E]'>View All</div>
                        </div>
                        {data?.map((item, index) => {
                            return <div onClick={() => router.push(`/team/${item?._id}`)} key={item?._id} className='grid grid-cols-6  px-4 py-2 border hover:cursor-pointer hover:bg-gray-100'>
                                <div className='col-span-1'>{index + 1}</div>
                                <div className='col-span-5 text-ellipsis w-full'>{item?.name?.slice(0.30)}{item?.name?.length > 30 && "..."}</div>
                            </div>
                        })} */}
                    </>
                    : !loading && <div className='flex justify-center items-center h-20 border'>
                        <p>No Team Available</p>
                    </div>
            }
        </div>
    )
}

export default TeamDashboard
