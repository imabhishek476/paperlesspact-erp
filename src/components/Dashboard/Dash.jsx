import React, { useEffect, useState } from 'react';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Link from 'next/link';
import { Badge, ChevronLeft, ChevronRight, Divide } from 'lucide-react';

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

const Dash = () => {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(100);
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
    setProfileDetails(profile.data);
    setLoading(false);
  }
  async function getUserSignatureData() {
    const data = await getUserSignature();
    console.log(data);
    setUserSignature(data);
  }
  async function getSubscriptionData() {
    const data = await getSubscription(Cookies.get('accessToken'));
    console.log(data);
    setSubscriptionData(data.ref);
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
        setActivityPage({
          ...ActivityPage,
          maxPage: response?.totalPages,
        });
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

  useEffect(() => {
    console.log(activities);
  }, [activities]);

  useEffect(() => {
    getDashCount();
    getContactCount();
    getDrafts();
    profile();
    getUserSignatureData();
    getSubscriptionData();
    const { next } = router.query;

    if(next){
      console.log(next)
      const parsedLink = next.replace("%2F\g","/").replace("%3Eg","?").replace(">","?")
      console.log(parsedLink)

      router.push(parsedLink);
    } 
  }, []);
  useEffect(() => {
    getUserSignatureData();
  }, [update]);
  return Loading ? (
    <LoadingPage />
  ) : (
    <>
      <div className="flex flex-col gap-7 lg:px-[35px] lg:pl-24 px-4">
        <div className="block md:hidden bg-[#d7d7d9] border rounded-sm w-full p-1 mb-3 px-[20px] mt-3">
          Dashboard
        </div>
        <div className="flex flex-col md:flex-row gap-5 px-2 pt-0 md:pt-[1.75rem]">
          <div className="flex flex-col border rounded-md md:w-1/2 w-full">
            <div className="px-4 py-2 text-start bg-[#e8eff6]">
              <h1>Documents</h1>
            </div>
            <Link
              href={'/document?completed=false'}
              className="flex justify-between bg-[#e8eff6] mt-3 mx-4 rounder-md hover:bg-zinc-300 transition duration-200"
            >
              <div className="flex flex-row justify-center items-center gap-3 rounded-md text-[16px] text-[#151513]">
                <AccessTimeOutlinedIcon
                  sx={{
                    backgroundColor: '#7b8191',
                    fontSize: 40,
                    color: 'white',
                    padding: 0.5,
                    // borderTopLeftRadius: 2,
                    // borderBottomLeftRadius: 2,
                  }}
                />{' '}
                Waiting for others
              </div>
              <div className="flex">
                <div className="flex relative items-center mr-2">
                  <Badge
                    strokeWidth={1}
                    size={32}
                    className="fill-background"
                  />
                  <p className="absolute text-sm font-bold right-1/2 translate-x-1/2">
                    {dashCount?.incompleteCount}
                  </p>
                </div>
                <div className="flex justify-center items-center px-2 text-[14px] text-[#151513]">
                  Show all
                </div>
              </div>
            </Link>
            <Link
              href={'/document?completed=true'}
              className="flex justify-between bg-[#e8eff6] my-3 mx-4 rounder-md hover:bg-zinc-300 transition duration-200"
            >
              <div className="flex flex-row justify-center items-center gap-3 rounded-md text-[16px] text-[#151513]">
                <CheckCircleOutlineOutlinedIcon
                  sx={{
                    backgroundColor: '#056a70ff',
                    fontSize: 40,
                    color: 'white',
                    padding: 0.5,
                    borderTopLeftRadius: 2,
                    borderBottomLeftRadius: 2,
                  }}
                />{' '}
                Completed
              </div>
              <div className="flex">
                <div className="flex relative items-center mr-2">
                  <Badge
                    strokeWidth={1}
                    size={32}
                    className="fill-background"
                  />
                  <p className="absolute text-sm font-bold right-1/2 translate-x-1/2">
                    {dashCount?.completedCount}
                  </p>
                </div>
                <div className="flex justify-center items-center px-2 text-[14px] text-[#151513]">
                  Show all
                </div>
              </div>
            </Link>
          </div>
          <div className="flex flex-col border rounded-md md:w-1/2 w-full">
            <div className="flex flex-row justify-between  bg-[#e8eff6] px-4 py-2">
              <h1 className="text-[16px] text-[#151513]">Recent activity</h1>
              {/* <Link className="text-[14px] text-[#00083d]" href={""}>
								<p>View Activity Log</p>
							</Link> */}
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
                    className="border-b cursor-pointer p-4 px-[20px] text-[14px] text-[#0206A8]"
                    key={events[index]?._id}
                    onClick={() => handleActivityClick(events[index]?._id)}
                  >
                    <div className="flex items-center gap-5">
                      <p className="min-w-[30px]">
                        {index + 1 + ActivityPage.currentPage * 3 - 3}
                      </p>
                      <p>{`${formatDate(activity?.timestamp)} - ${
                        activity?.action
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
            {activities && activities.length > 0 && (
              <div className="flex flex-row justify-between">
                <div className="flex flex-row">
                  <ButtonGroup radius="none" className=" rounded-sm">
                    {/* <Button
										onClick={() => handleActivityPagePrev(5)}
										isIconOnly
										className="bg-cyan-50 border rounded-sm"
									>
										<ChevronLeft size={28} /> <ChevronLeft size={28} />
									</Button> */}
                    <Button
                      onClick={handleActivityPagePrev}
                      isIconOnly
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
                      className="bg-cyan-50 border rounded-sm"
                    >
                      <ChevronRight size={18} />
                    </Button>
                    {/* <Button
										onClick={() => handleActivityPageNext(5)}
										isIconOnly
										className="bg-cyan-50 border rounded-sm"
									>
										<ChevronRight size={28} />
										<ChevronRight size={28} />
									</Button> */}
                  </ButtonGroup>
                </div>
                {/* <div className="flex flex-row gap-2 justify-center items-center">
								<p className="hidden md:flex text-[14px] font-[600]">
									Number of Results :
								</p>{" "}
								<select
									onChange={(e) => {
										// console.log(e.currentTarget.value);
										handleActivitySize(e.currentTarget.value);
									}}
									className="w-[60px] h-[40px] pl-1.5 border rounded-sm bg-cyan-50"
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={30}>30</option>
									<option value={50}>50</option>
								</select>
							</div> */}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 px-2 ">
          <div className=" border rounded-md  w-full">
            <div className="grid grid-cols-3 ">
              {(update || !update) && (
                <div className="grid col-span-3 md:col-span-1 p-3 gap-4">
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
                          src={`${
                            userSignature?.signUrl
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
                          src={`${
                            userSignature?.initialsUrl
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
              {/* <Divider orientation='vertical' /> */}
              <div className="col-span-3 md:col-span-1 border-l-1 border-r-1 p-3">
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
                  {/* <SemiCircularProgressBar value={progress}  /> */}
                  {dashCount && subscriptionData && (
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
                          {/* {needle(value, data, cx, cy, iR, oR, "#d0d000")} */}
                        </PieChart>
                        {/* </ResponsiveContainer> */}
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
              {/* <Divider orientation='vertical' /> */}
              {/* <div className="col-span-3 flex flex-col md:col-span-1 border-t-1 md:border-t-0">
								<div className="flex flex-1 flex-col justify-start items-start px-4 py-3">
									<h1 className="text-[16px] font-[600]">Bussiness Account</h1>
									<p className="text-[14px] font-[500]">
										Bussiness Subscription : Free Plan
									</p>
									<p className="text-[14px] font-[500]">
										{" "}
										Logged in as : {profileDetails?.fullname}
									</p>
								</div>
								<Divider className="my-2" />
								<div className="flex flex-1 flex-col justify-start items-start px-4 py-3">
									<h1 className="text-[16px] font-[600]">
										{profileDetails?.fullname}
									</h1>
									<p className="text-[14px] font-[500]">
										Documents sent this month : {dashCount?.totalThisMonthCount}
									</p>
									<p className="text-[14px] font-[500]">
										Contacts : {contactCount}
									</p>
								</div>
								<Divider className="my-2" />
							<div className="flex flex-col justify-start items-start px-4 py-3">
								<h1 className="text-[16px] font-[600]">API</h1>
								<p className="text-[14px] font-[500]">
									API request this month : 0
								</p>
							</div>
							</div> */}
              <div className="col-span-3 flex flex-col md:col-span-1 border-t-1 md:border-t-0">
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
                            className="border-b flex-1 cursor-pointer py-[10px] px-[20px] text-[14px] text-[#0206A8]"
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
                          className="border-b cursor-pointer py-[10px] px-[20px] text-[14px] text-[#0206A8]"
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
                {drafts && drafts.length > 0 && (
                  <div className="flex flex-row lg:col-span-3 col-span-1 justify-between">
                    <div className="flex flex-row">
                      <ButtonGroup radius="none" className=" rounded-sm">
                        {/* <Button
												isIconOnly
												className="bg-cyan-50 border rounded-sm"
											>
												<ChevronLeft size={28} /> <ChevronLeft size={28} />
											</Button> */}
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
                        {/* <Button
												isIconOnly
												className="bg-cyan-50 border rounded-sm"
											>
												<ChevronRight size={28} />
												<ChevronRight size={28} />
											</Button> */}
                      </ButtonGroup>
                    </div>
                    {/* <div className="flex flex-row gap-2 justify-center items-center">
								<p className="hidden md:flex text-[14px] font-[600]">
									Number of Results :
								</p>{" "}
								<select className="w-[60px] h-[40px] pl-1.5 border rounded-sm bg-cyan-50">
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={30}>30</option>
									<option value={50}>50</option>
								</select>
							</div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
        <div className="flex flex-col md:flex-row gap-5 px-2">
          {/* <div className="flex flex-col border rounded-md md:w-1/2 w-full mb-5">
					<div className="px-4 py-2 text-start bg-[#e8eff6]">
						<h1>Most Used Templates</h1>
					</div>
				</div> */}
          {/* <div className="flex flex-col border rounded-md md:w-1/2 w-full mb-5">
						<div className="px-4 py-2 text-start bg-[#e8eff6]">
							<h1>Recent drafts</h1>
						</div>
						<div className="w-full">
							{drafts &&
								drafts.length > 0 &&
								drafts.map((draft, index) => {
									return (
										<div
											className="border-b cursor-pointer py-[10px] px-[20px] text-[14px] text-[#0206A8]"
											key={draft?._id}
											onClick={() => handleDraftClick(draft?._id)}
										>
											<div className="flex justify-between">
												<p>
													{draft?.agreements && draft?.agreements.length > 0
														? draft?.agreements[0]?.name
														: "No Document Added"}
												</p>
												<p>{formatDate(draft?.updatedDate)}</p>
											</div>
										</div>
									);
								})}
						</div>
						<div className="flex flex-row justify-between">
							<div className="flex flex-row">
								<ButtonGroup radius="none" className=" rounded-sm">
									<Button isIconOnly className="bg-cyan-50 border rounded-sm">
										<ChevronLeft size={28} /> <ChevronLeft size={28} />
									</Button>
									<Button isIconOnly className="bg-cyan-50 border rounded-sm">
										<ChevronLeft onClick={handleDraftPagePrev} size={18} />{" "}
									</Button>
									<Button isIconOnly className="bg-cyan-50 border rounded-sm">
										{DraftPage.currentPage}{" "}
									</Button>
									<Button isIconOnly className="bg-cyan-50 border rounded-sm">
										<ChevronRight onClick={handleDraftPageNext} size={18} />
									</Button>
									<Button isIconOnly className="bg-cyan-50 border rounded-sm">
										<ChevronRight size={28} />
										<ChevronRight size={28} />
									</Button>
								</ButtonGroup>
							</div>
							<div className="flex flex-row gap-2 justify-center items-center">
								<p className="hidden md:flex text-[14px] font-[600]">
									Number of Results :
								</p>{" "}
								<select className="w-[60px] h-[40px] pl-1.5 border rounded-sm bg-cyan-50">
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={30}>30</option>
									<option value={50}>50</option>
								</select>
							</div>
						</div>
					</div> */}
        </div>
      </div>
      <div className="fixed bottom-5 md:bottom-10 right-10">
        <HelpMenu />
      </div>
    </>
  );
};

export default Dash;
