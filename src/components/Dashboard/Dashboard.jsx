import React, { useEffect, useRef, useState } from 'react';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Link from 'next/link';
import { Album, Badge, BookText, Building2, ChevronLeft, ChevronRight, Combine, CreditCard, Divide, FileStack, FileType2, HandCoins, Leaf, Mails, Plus, PlusSquare, Trash2 } from 'lucide-react';

import {
    Button,
    ButtonGroup,
    Divider,
    Tooltip,
    Modal,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Card, CardBody, Tab, Tabs, Select, SelectItem, Chip
} from '@nextui-org/react';

import SemiCircularProgressBar from '../ProgressBar/SemiCircularProgressBar';
import HelpMenu from './HelpMenu';
import {
    PieChart,
    Pie,
    Cell,
    DefaultTooltipContent,
    Tooltip as ChartTip,
    ResponsiveContainer,
} from 'recharts';
import { getUserProfile } from '@/Apis/login';
import Cookies from 'js-cookie';
import {
    getDashboardCount,
    getDocumentDrafts,
    getUserSignature,
    getcontactCount,
} from '@/Apis/legalAgreement';
import { useRouter } from 'next/router';
import { formatDate } from '@/Utils/dateTimeHelpers';
import { useEnv } from '../Hooks/envHelper/useEnv';
import LoadingPage from '../LoadingPage/loadingPage';
import SignModal from './signModal';
import { getSubscription } from '@/Apis/subscription';
import { Alert } from '@mui/material';
import PaymentTabs from './PaymentTabs';
import TemplateTabs from './TemplateTabs';
import EnvelopeTabs from './EnvelopeTabs';
import CustomSkeleton from '../Skeleton/Skeleton';
import Image from 'next/image';
import { getcompletedDocList } from '../../Apis/legalAgreement';
import { getAllDashboardCount } from '../../Apis/template';
import TeamDashboard from './TeamDashboard';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const FilterMonth = [
    {
        value: '0',
        label: 'This Week'
    },
    {
        value: '1',
        label: 'Today'
    },
    {
        value: '2',
        label: 'Last Week'
    },
    {
        value: '3',
        label: 'This Month'
    },
    {
        value: '4',
        label: 'Previous Month'
    },
    {
        value: '5',
        label: 'Three Months'
    },
    {
        value: '6',
        label: 'This Year'
    },
]
const Dashboard = () => {
    const router = useRouter();
    const [Loading, setLoading] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [update, setUpdate] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [ActivityPage, setActivityPage] = useState({
        size: 3,
        currentPage: 1,
        maxPage: 1,
    });
    const [DraftPage, setDraftPage] = useState({
        size: 3,
        currentPage: 1,
        maxPage: 1,
    });
    const [dashCount, setDashCount] = useState();
    const [contactCount, setContactCount] = useState();
    const [profileDetails, setProfileDetails] = useState(null);
    const [activities, setActivities] = useState([]);
    const [events, setEvents] = useState([]);
    const [field, setField] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [image, setImage] = useState(null);
    const [userSignature, setUserSignature] = useState(null);
    const inDevEnvironment = useEnv();
    const [selected, setSelected] = React.useState("template");
    const [bussinessName, setBussinessName] = useState("")
    const [countData, setCountData] = useState(null)
    const [timeFilter, setTimeFilter] = useState(new Set(["0"]))
    const logoRef = useRef()
    const [teamOpen, setTeamOpen] = useState(false)
    function sortEvents(activities) {
        const events = [];
        console.log(activities);
        for (const activity of activities) {
            if (activity?.isDraft !== 1) {
                events.push(
                    activity?.events?.sort(
                        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                    )[0]
                );
            }
        }
        console.log(events);
        events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return events;
    }
    async function profile() {
        setLoading(true);
        const profile = await getUserProfile(Cookies.get('accessToken'));
        if (inDevEnvironment) {
            // Cookies.set("email", profile.data.email);
            // Cookies.set("name", profile.data.fullname);
        } else {
            // Cookies.set("email", profile.data.email, {
            // 	expires: 1,
            // 	domain: ".easedraft.com",
            // });
            // Cookies.set("name", profile.data.fullname, {
            // 	expires: 1,
            // 	domain: ".easedraft.com",
            // });
        }
        console.log(profile);
        setBussinessName(profile?.data?.fullname )
        setProfileDetails(profile?.data);
        setLoading(false);
    }
    async function getUserSignatureData() {
        const data = await getUserSignature();
        console.log(data);
        setUserSignature(data);
    }
    async function getAllCount(timeFilter) {
        console.log(timeFilter)
        const data = await getAllDashboardCount(timeFilter);
        console.log(data)
        if (data) {
            setCountData(data.ref);
        }
    }
    async function getSubscriptionData() {
        const data = await getSubscription(Cookies.get('accessToken'));
        console.log(data);
        setSubscriptionData(data?.ref);
    }
    const handleDraftClick = (id) => {
        router.push(`/document/new?id=${id}`);
    };
    const handleActivityClick = (id) => {
        router.push(`/document/preview?id=${id}`);
    };
    async function handleActivitySize(value) {
        console.log(value);
        setActivityPage({
            ...ActivityPage,
            size: value,
        });
        const response = await getDocumentDrafts(
            ActivityPage.currentPage,
            ActivityPage.size
        );
        setActivities(response?.agreementDetails);
    }
    async function handleActivityPageNext(skip) {
        console.log(ActivityPage.currentPage)
        console.log(ActivityPage.maxPage)
        if (ActivityPage.currentPage === ActivityPage.maxPage) {
            return;
        }
        setActivityPage({
            ...ActivityPage,
            currentPage: ActivityPage.currentPage + 1,
        });
        const response = await getDocumentDrafts(
            ActivityPage.currentPage + 1 + (skip ? skip : 0),
            ActivityPage.size
        );
        const events = sortEvents(response?.agreementDetails);
        console.log(events);
        setActivities(events);
        setEvents(response?.agreementDetails);
    }
    async function handleDraftPageNext(skip) {
        if (DraftPage.currentPage === DraftPage.maxPage) {
            return;
        }
        setDraftPage({
            ...DraftPage,
            currentPage: DraftPage.currentPage + 1,
        });
        const response = await getDocumentDrafts(
            DraftPage.currentPage + 1 + (skip ? skip : 0),
            DraftPage.size
        );
        setDrafts(response?.agreementDetails);
    }
    async function handleActivityPagePrev(skip) {
        if (ActivityPage.currentPage === 1) {
            return;
        }
        setActivityPage({
            ...ActivityPage,
            currentPage: ActivityPage.currentPage - 1,
        });
        const response = await getDocumentDrafts(
            ActivityPage.currentPage - 1 - (skip ? skip : 0),
            ActivityPage.size
        );
        const events = sortEvents(response?.agreementDetails);
        setActivities(events);
        setEvents(response?.agreementDetails);
    }
    async function handleDraftPagePrev(skip) {
        if (DraftPage.currentPage === 1) {
            return;
        }
        setDraftPage({
            ...DraftPage,
            currentPage: DraftPage.currentPage - 1,
        });
        const response = await getDocumentDrafts(
            DraftPage.currentPage - 1 - (skip ? skip : 0),
            DraftPage.size
        );
        setDrafts(response?.agreementDetails);
    }
    const getDrafts = async () => {
        try {
            const response = await getDocumentDrafts(1, 3);
            console.log(response);
            if (response) {
                setDraftPage({
                    ...ActivityPage,
                    maxPage: response?.totalPages,
                });
                setDrafts(response?.agreementDetails);
            
                const events = sortEvents(response?.agreementDetails);
                console.log(events);
                setActivities(events);
                setEvents(response?.agreementDetails);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const getDashCount = async () => {
        try {
            const response = await getDashboardCount(Cookies.get('accessToken'));
            console.log('count', response);
            setDashCount(response);
        } catch (err) {
            console.log(err);
        }
    };
    const getContactCount = async () => {
        try {
            const response = await getcontactCount();

            setContactCount(response);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSelectionChange = (selectedKeys) => {
        console.log(selectedKeys.currentKey)
        if (selectedKeys.size > 0) {
            setTimeFilter(selectedKeys);
        }
    };

    useEffect(() => {
        // console.log(activities?.length)
       if(activities.lengh>3){
        setActivityPage({
            ...ActivityPage,
            maxPage: Math.floor(activities?.length/3),
        });
       }
    }, [activities?.length]);

    useEffect(() => {
        getAllCount(timeFilter?.currentKey || "0")
    }, [timeFilter])

    useEffect(() => {
        getDashCount();
        getContactCount();
        getDrafts();
        profile();
        getUserSignatureData();
        getSubscriptionData();
        const { next } = router.query;

        if (next) {
            console.log(next)
            const parsedLink = next.replace("%2F\g", "/").replace("%3Eg", "?").replace(">", "?")
            console.log(parsedLink)

            router.push(parsedLink);
        }
    }, []);
    useEffect(() => {
        getUserSignatureData();
    }, [update]);

    console.error(profileDetails)
    return Loading ? (
        <LoadingPage />
    ) : (
        <div className="flex flex-col gap-2 lg:px-[35px] lg:pl-[6.5rem] px-4 pb-5">
            <div className="block lg:hidden bg-[#d7d7d9] border rounded-sm w-full p-1 mb-3 px-[20px] mt-3">
                Dashboard
            </div>
            <div className='grid grid-cols-8 lg:gap-[25px] gap-[14px] lg:pt-[25px] pt-0 w-full'>
                <div className='col-span-8 lg:col-span-6'>
                    <div className='flex flex-col gap-5 lg:flex-row justify-between'>
                        <div  className='border rounded-md p-4 bg-[#F2F8E9] transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:shadow-sm w-full lg:w-1/3'>
                            <div className='flex flex-row gap-5 justify-start lg:justify-center  items-center'>
                                <div >
                                    <Combine size={30} />
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-[16px] font-[700] capitalize' >Contract generation & approval in minutes</p>
                                    <p className='text-[12px] pt-2'>Create a reusable master copy for efficient and streamlined distribution.</p>
                                </div>
                            </div>
                        </div>
                        <div  className='border rounded-md p-4 bg-[#FFEDDE] transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:shadow-sm w-full lg:w-1/3'>
                            <div className='flex flex-row gap-5 justify-start lg:justify-center items-center'>
                                <div >
                                    <Building2 size={30} />
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-[16px] font-[700] capitalize' >Complete Control: Review & Sign</p>
                                    <p className='text-[12px] pt-2'>Enhance security and instill trust with integrated e-signatures with certificate for an audit.</p>
                                </div>
                            </div>
                        </div>
                        <div  className='relative border rounded-md p-4 bg-[#EBE5F3] transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:shadow-sm w-full lg:w-1/3'>
                            <div className='flex flex-row gap-5 justify-start lg:justify-center  items-center'>
                                <div >
                                    <HandCoins size={30} />
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-[16px] font-[700] capitalize' >Collect payments instantly</p>
                                    <p className='text-[12px] pt-2'>Slash the average payment time to just 1 day and skyrocket your close rate by an impressive 56%.</p>
                                </div>
                            </div>
                            <div className='absolute top-[-10px] right-[-10px] text-white'>
                            <Chip className='p-2 font-semibold bg-[#181819] text-white' >Coming Soon</Chip>
                            {/* <p className='px-2 py-1 text-[10px] font-semibold'>Coming Soon</p> */}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end items-end py-5'>
                        <Select
                            items={FilterMonth}
                            size='sm'
                            radius='none'
                            defaultSelectedKeys={["0"]}
                            selectedKeys={timeFilter}
                            onSelectionChange={handleSelectionChange}
                            className="max-w-[200px]"
                            classNames={{
                                trigger: 'bg-[#E8EFF6] !min-h-[2rem] h-8'
                            }}
                        >
                            {(item) => <SelectItem key={item?.value}>{item?.label}</SelectItem>
                            }
                        </Select>
                    </div>
                    <Tabs
                        classNames={{
                            tabList: 'w-full border-0 rounded-none bg-[#E8EFF6] h-[60px] gap-0 p-0',
                            base: 'w-full ',
                            cursor: 'border-1 w-full border-1 border-b-0  border-[#4A9B9F] rounded-none  ',
                            tab: 'border-1 data-[selected=true]:border-b-0  rounded-none w-full h-full border-b-1 border-b-[#4A9B9F]',
                            tabContent: ' group-data-[selected=true]:text-[#05686E] ',
                            panel: 'border-1 border-[#4A9B9F] border-t-0 p-0',
                        }}
                        aria-label="Options"
                        selectedKey={selected}
                        onSelectionChange={setSelected}
                    >
                        <Tab key="template" title={
                            <div className="flex items-center space-x-2 text-[16px]">
                                <FileStack />
                                <span>Templates</span>
                            </div>
                        }>
                            <div className='min-h-[350px] border rounded'>
                                {/* {tabLoading ?
                                    <>
                                        <CustomSkeleton />
                                    </>
                                    : */}
                                <TemplateTabs countData={countData?.template} timeFilter={timeFilter.currentKey} />
                                {/* } */}
                            </div>
                        </Tab>
                        <Tab key="envelope" title={
                            <div className="flex items-center space-x-2">
                                <Mails />
                                <span>Documents For Signing</span>
                            </div>
                        }>
                            <div className='min-h-[350px] border rounded'>
                                {/* {tabLoading ?
                                    <>
                                        <CustomSkeleton />
                                    </>
                                    : */}
                                <EnvelopeTabs setLoading={setLoading} countData={countData?.envelope} timeFilter={timeFilter.currentKey} />
                                {/* } */}
                            </div>

                        </Tab>
                        <Tab
                            key="payment" title={
                                <div className="flex items-center space-x-2">
                                    <CreditCard />
                                    <span>Payments</span>
                                </div>
                            }>
                            <div className='min-h-[350px] border rounded'>
                                <PaymentTabs />
                            </div>
                        </Tab>
                    </Tabs>
                    <div className='flex flex-col lg:flex-row  w-full gap-5 pt-5 justify-between'>
                        <div className='border rounded-md w-full'>
                            <div className='flex flex-col justify-between h-full'>
                                <div>
                                    <div className="flex flex-col justify-between  bg-[#e8eff6] px-4 py-2">
                                        <h1 className="text-[16px] text-[#151513]">Recent activity</h1>
                                    </div>
                                    {activities && activities.length > 0 && (
                                        <div className="border-b flex-1 cursor-pointer py-[10px] px-[20px] text-[14px] text-foreground">
                                            <div className="flex items-center gap-5">
                                                <p>S No</p>
                                                <p>Activity</p>
                                            </div>
                                        </div>
                                    )}
                                    {activities && activities.length > 0 ? (
                                        activities.map((activity, index) => {
                                            return (
                                                <div
                                                    className="border-b cursor-pointer px-[20px] py-[10px] text-[14px] text-text"
                                                    key={events[index]?._id}
                                                    onClick={() => handleActivityClick(events[index]?._id)}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <p className="min-w-[30px]">
                                                            {index + 1 + ActivityPage.currentPage * 3 - 3}
                                                        </p>
                                                        <p>{`${formatDate(activity?.timestamp)} - ${activity?.action
                                                            } ${activity?.user ? `by ${activity?.user}` : ''}`}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-7 flex justify-center items-center self-center m-auto">
                                            <h1 className="text-[14px] text-[#151513]">
                                                Nothing to display here -{' '}
                                                <Link
                                                    className="text-[14px] text-[#0206a8]"
                                                    href={'/document/new'}
                                                >
                                                    send your first document
                                                </Link>
                                            </h1>
                                        </div>
                                    )}
                                </div>
{/* {console.log(activities?.length)} */}
                                {activities && activities.length > 3  && (
                                    <div className="flex flex-row justify-end">
                                        <div className="flex flex-row">
                                            <ButtonGroup radius="none" className=" rounded-sm">
                                                <Button
                                                    onClick={handleActivityPagePrev}
                                                    isIconOnly
                                                    aria-label='prev_page'
                                                    className="bg-cyan-50 border rounded-sm"
                                                >
                                                    <ChevronLeft size={18} />{' '}
                                                </Button>
                                                <Button isIconOnly className="bg-cyan-50 border rounded-sm">
                                                    {ActivityPage.currentPage}{' '}
                                                </Button>
                                                <Button
                                                    onClick={handleActivityPageNext}
                                                    isIconOnly
                                                    aria-label='next_Page'
                                                    className="bg-cyan-50 border rounded-sm"
                                                >
                                                    <ChevronRight size={18} />
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className='border rounded-md w-full'>
                            <div className="px-4 py-2 text-start bg-[#e8eff6]">
                                <h1>Recent drafts</h1>
                            </div>
                            <div className="w-full flex-1 flex flex-col">
                                {drafts && drafts.length > 0 && (
                                    <div className="border-b cursor-pointer py-[10px] px-[20px] text-[14px] text-foreground">
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-3">
                                                <p>S No</p>
                                                <p>Draft Title</p>
                                            </div>
                                            <p>Date</p>
                                        </div>
                                    </div>
                                )}
                                {drafts && drafts.length > 0 ? (
                                    drafts.map((draft, index) => {
                                        if (drafts.length > 2) {
                                            return (
                                                <div
                                                    className="border-b flex-1 cursor-pointer py-[10px] px-[20px] text-[14px] text-black"
                                                    key={draft?._id}
                                                    onClick={() => handleDraftClick(draft?._id)}
                                                >
                                                    <div className="flex justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <p className="min-w-[30px]">
                                                                {index + 1 + DraftPage.currentPage * 3 - 3}
                                                            </p>
                                                            <p>
                                                                {draft?.draftName
                                                                    ? draft?.draftName.slice(0, 20)
                                                                    : 'Document'}
                                                            </p>
                                                        </div>

                                                        <p>{formatDate(draft?.updatedDate)}</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                className="border-b cursor-pointer py-[10px] px-[20px] text-[14px] text-black"
                                                key={draft?._id}
                                                onClick={() => handleDraftClick(draft?._id)}
                                            >
                                                <div className="flex justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <p className="min-w-[30px]">
                                                            {index + 1 + DraftPage.currentPage * 3 - 3}
                                                        </p>
                                                        <p>
                                                            {draft?.draftName
                                                                ? draft?.draftName.slice(0, 25)
                                                                : 'Document'}
                                                        </p>
                                                    </div>

                                                    <p>{formatDate(draft?.updatedDate)}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-7 flex justify-center items-center self-center m-auto">
                                        <h1 className="text-[14px] text-[#151513]">
                                            Nothing to display here -{' '}
                                            <Link
                                                className="text-[14px] text-[#0206a8]"
                                                href={'/document/new'}
                                            >
                                                send your first document
                                            </Link>
                                        </h1>
                                    </div>
                                )}
                            </div>
                            {drafts && drafts.length > 3 && (
                                <div className="flex flex-row lg:col-span-3 col-span-1 justify-end">
                                    <div className="flex flex-row">
                                        <ButtonGroup radius="none" className=" rounded-sm">
                                            <Button
                                                onClick={handleDraftPagePrev}
                                                isIconOnly
                                                className="bg-cyan-50 border rounded-sm"
                                            >
                                                <ChevronLeft size={18} />{' '}
                                            </Button>
                                            <Button
                                                isIconOnly
                                                className="bg-cyan-50 border rounded-sm"
                                            >
                                                {DraftPage.currentPage}{' '}
                                            </Button>
                                            <Button
                                                onClick={handleDraftPageNext}
                                                isIconOnly
                                                className="bg-cyan-50 border rounded-sm"
                                            >
                                                <ChevronRight size={18} />
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='col-span-8 lg:col-span-2 lg:border-l-2 lg:border-t-0 border-t-2 pl-0 lg:pl-4'>
                    <div className='flex flex-col justify-between gap-4'>
                    <div className='flex flex-col'>
                            <div className='flex flex-col border rounded-md rounded-b-none w-full my-auto'>
                                <div className='px-4 py-2 flex flex-row justify-between items-center text-start bg-[#e8eff6] text-[16px] font-[500]'>
                                    <div className='flex flex-row gap-2 items-center'>
                                    <h1> Team Settings</h1>
                                    <Tooltip radius='none' placement='bottom' content='Add Team'>
                                        <Button onClick={() => setTeamOpen(true)} className='hover:bg-transparent' size='sm' variant='light' isIconOnly aria-label='Add Team'><PlusSquare color='#05686E' /></Button>
                                    </Tooltip>
                                    </div>
                                 <Link className='text-sm' href="/team">View All</Link>
                                </div>
                            </div>
                            <TeamDashboard teamOpen={teamOpen} setTeamOpen={setTeamOpen} />
                        </div>
                        <div className='w-full border rounded-md p-3'>
                            <div className="flex flex-row justify-between">
                                <h1>
                                    Documents sent <br /> this {months[new Date().getMonth()]}{' '}
                                    month
                                </h1>
                                <Button
                                    // disabled={true}
                                    as={Link}
                                    href="/upgrade"
                                    color="primary"
                                    variant="bordered"
                                    className="rounded-full opacity-60 hover:opacity-60 border-[#056a70ff] text-[#056a70ff]"
                                >
                                    Upgrade
                                </Button>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                {dashCount && (
                                    <>
                                        {dashCount?.totalThisMonthCount >=
                                            subscriptionData?.currentPlan?.quota && (
                                                <div className="w-full mt-4">
                                                    <Alert severity="error">
                                                        You have reached current month's quota. Please
                                                        upgrade to enjoy more services!
                                                    </Alert>
                                                </div>
                                            )}
                                        <div className="h-full items-center">
                                            {/* <ResponsiveContainer width="100%" height="100%"> */}
                                            <PieChart width={250} height={150}>
                                                <Pie
                                                    dataKey="value"
                                                    startAngle={180}
                                                    endAngle={0}
                                                    data={[
                                                        {
                                                            name: 'Completed',
                                                            value: dashCount?.completedThisMonthCount,
                                                            color: '#ff0000',
                                                        },
                                                        {
                                                            name: 'In-progress',
                                                            value:
                                                                dashCount?.totalThisMonthCount -
                                                                dashCount?.completedThisMonthCount,
                                                            label: dashCount?.totalThisMonthCount,
                                                            color: '#ECFEFF',
                                                        },
                                                        {
                                                            name: 'Remaining',
                                                            value:
                                                                subscriptionData?.currentPlan?.quota -
                                                                dashCount?.totalThisMonthCount,
                                                            color: '#00ff00',
                                                        },
                                                    ]}
                                                    // cx={150}
                                                    cy={130}
                                                    innerRadius={50}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    stroke="none"
                                                >
                                                    <Cell
                                                        className="cursor-pointer"
                                                        fill={'#05686E'}
                                                        onClick={() =>
                                                            router.push('/document?completed=true')
                                                        }
                                                    />
                                                    <Cell
                                                        className="cursor-pointer"
                                                        fill={'#05686E'}
                                                        fillOpacity={0.55}
                                                        onClick={() =>
                                                            router.push('/document?completed=false')
                                                        }
                                                    />
                                                    <Cell
                                                        className="cursor-pointer"
                                                        fill={'#05686E'}
                                                        fillOpacity={0.25}
                                                        onClick={() => router.push('/document/new')}
                                                    />
                                                </Pie>
                                                <ChartTip />
                                            </PieChart>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between w-[180px] flex-row relative  ">
                                    <h1>0</h1>
                                    <div className="text-[10px] text-center">
                                        <h1>{dashCount?.completedThisMonthCount}</h1>
                                        <h1>Document Completed</h1>
                                    </div>
                                    <h1>{subscriptionData?.currentPlan?.quota}</h1>
                                </div>
                            </div>
                        </div>
                        <div className=''>
                            {(update || !update) && (
                                <div className="grid col-span-3 md:col-span-1 py-3 gap-4">
                                    <div className="flex flex-row gap-2 border justify-between rounded-md bg-[#e8eff6] p-5">
                                        <div className="flex flex-row justify-between">
                                            <div>
                                                {' '}
                                                <h1>My Signature</h1>
                                                <Button
                                                    onClick={() => {
                                                        setField('Signature');
                                                        onOpen();
                                                    }}
                                                    variant="flat"
                                                    size="sm"
                                                    className="bg-transparent m-0 ps-0 justify-start"
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center p-2">
                                            {userSignature?.signUrl && (
                                                <img
                                                    src={`${userSignature?.signUrl
                                                        }?up=${performance.now()}`}
                                                    fill
                                                    className="object-contain !relative"
                                                    alt=""
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 border justify-between rounded-md bg-[#e8eff6] p-5">
                                        <div className="flex flex-row justify-between">
                                            <div>
                                                {' '}
                                                <h1>My Initials</h1>
                                                <Button
                                                    onClick={() => {
                                                        setField('Initials');
                                                        onOpen();
                                                    }}
                                                    variant="flat"
                                                    size="sm"
                                                    className="bg-transparent m-0 ps-0 justify-start"
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center p-2">
                                            {userSignature?.initialsUrl && (
                                                <img
                                                    src={`${userSignature?.initialsUrl
                                                        }?up=${performance.now()}`}
                                                    fill
                                                    className="object-contain !relative"
                                                    alt=""
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                                <SignModal
                                    onClose={onClose}
                                    field={field}
                                    fullname={profileDetails?.fullname}
                                    setImage={setImage}
                                    fromDashboard={true}
                                    setUpdate={setUpdate}
                                />
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="fixed bottom-1  lg:bottom-5 right-1 lg:right-5">
                <HelpMenu />
            </div> */}
        </div>
    )
}

export default Dashboard
