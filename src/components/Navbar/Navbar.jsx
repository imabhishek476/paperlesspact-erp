import React, { use, useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import BackupTableOutlinedIcon from "@mui/icons-material/BackupTableOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Navbar as NextUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	DropdownTrigger,
	Select,
	SelectItem,
	Divider,
	Avatar,
	DropdownSection,
	User,
	Accordion,
	AccordionItem,
	Popover,
	PopoverTrigger,
	PopoverContent,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Badge,
} from "@nextui-org/react";
import NextLink from "next/link";
import Image from "next/image";
import { getServices } from "@/Apis/Services";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { getUserProfile } from "@/Apis/login";
import { getBareActsList } from "@/Apis/BareActs";
import { usePathname } from "next/navigation";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });
import {
	Contact2,
	CreditCard,
	Trash,
	Facebook,
	File,
	Grid,
	Grid2X2,
	Home,
	Instagram,
	Linkedin,
	Menu,
	Settings,
	Twitter,
	Youtube,
	FileStack,
	FileText,
	Users,
	Presentation,
	Contact,
	ArrowRight,
	MoreHorizontalIcon,
} from "lucide-react";
import NavAccordion from "../Shared/NavAccordion/NavAccordion";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { useEnv } from "../Hooks/envHelper/useEnv";
import { getDocumentDrafts } from "@/Apis/legalAgreement";
import { formatDate,formatTimestamp } from "@/Utils/dateTimeHelpers";
import HelpMenu from "../Dashboard/HelpMenu";
import { getNotifyEvents, updateNotifyEvent } from "../../Apis/notifyEvent";

export default function Navbar({
	hideLogo,
	content,
	footer,
	navbar,
	fromNewDocumentPage,
	handleSubmit,
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [modOpen, setModOpen] = useState(false);
	const inDevEnvironment = useEnv();
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const [Notifications, setNotifications] = useState();
	const [totalNotification,setTotalNotification] =useState({
		total:0,
		unRead:0
	})
	const [events, setEvents] = useState([]);
	const [services, setServices] = useState();
	const [searchQuery, setSearchQuery] = useState();
	const [serviceName, setServiceName] = useState("SERVICES");
	const [details, setDetails] = useState(null);
	const [value, setValue] = React.useState(new Set(["English"]));
	const [bareAct, setBareAct] = useState([]);
	const [update,setUpdate] =useState(false)
	const [popOpen,setPopOpen] =useState(false)
	const [pageSize,setPageSize] =useState(5)
	const accessToken = Cookies.get("accessToken");
	const {isOpen, onOpen, onOpenChange} = useDisclosure();

	const navLinks = [
		// [
		// 	{
		// 		icon: <Home />,
		// 		title: "Home",
		// 		link: "/home",
		// 		subtitle: "Visit Home",
		// 	},
		// ],
		[
			{
				icon: <Grid2X2 />,
				title: "Dashboard",
				link: "/dashboard",
				subtitle: "See Your Contracts Overview",
			},
		],
		[
			{
				icon: <File className="text-black" />,
				title: "Document",
				subtitle: "Create Document",
			},
			{
				title: "New Document",
				link: "/document/new",
			},
			{
				title: "Document List",
				link: "/document",
			},
		],
		[
			{
				icon: <FileStack className="text-black" />,
				title: "Template",
				subtitle: "Use predefine templates",
				link: "/template",
			},
		],
		// [
		// 	{
		// 		icon: <CreditCard className="text-black" />,
		// 		title: "Payment",
		// 		subtitle: "Payments",
		// 		link: "/payment",
		// 	},
		// ],
		
		[
			{
				icon: <Contact2 className="text-black" />,
				title: "Contact",
				subtitle: "Create Contact",
			},
			{
				title: "Contact",
				link: "/contacts",
			},
			// {
			// 	title: "Create Contact",
			// 	link: "/contect/new",
			// },
		],
		[
			{
				icon: (
					<GroupsOutlinedIcon sx={{ fontSize: 28 }} className="text-black" />
				),
				title: "Team",
				subtitle: "Create Team",
			},
			{
				title: "Team",
				link: "/team",
			},
			// {
			// 	title: "Create Team",
			// 	link: content?.cta?.title==="Create Team" && content?.cta?.onOpen,
			// 	action:content?.cta?.title==="Create Team" && content?.cta?.onOpen
			// },
		],	
		[
			{
				icon: <Trash sx={{ fontSize: 28 }} className="text-black" />,
				title: "Trash",
				subtitle: "Trash",
				link: "/trash",
			},
		],
		// [
		// 	{
		// 		icon: <Settings className="text-black" />,
		// 		title: "Setting",
		// 		subtitle: "Configure Settings",
		// 	},
		// 	{
		// 		title: "General Preferences",
		// 		link: "/settings/main",
		// 	},
		// 	{
		// 		link: "/settings/signing",
		// 		title: "Signing Preferences",
		// 	},
		// 	{
		// 		link: "/settings/delivery",
		// 		title: "Delivery Preferences",
		// 	},
		// 	{
		// 		link: "/settings/schedule",
		// 		title: "Expiration & Reminders",
		// 	},
		// 	{
		// 		link: "/settings/graphics",
		// 		title: "Branding",
		// 	},
		// ],
	];

	const notificationTypeIcon={
		document:<FileText />,
		file:<FileText />,
		agreement:<FileText />,
		presentation: <Presentation />,
		team:<Users />,
		contact:<Contact />,
	}

	const logOut = () => {
		if (inDevEnvironment) {
			Cookies.remove("accessToken");
			Cookies.remove("assignedRole");
			Cookies.remove("isLoggedIn");
			Cookies.remove("onbording");
			console.log("in me");

		} else {
			Cookies.remove("accessToken", { domain: ".easedraft.com" });
			Cookies.remove("assignedRole", { domain: ".easedraft.com" });
			Cookies.remove("isLoggedIn", { domain: ".easedraft.com" });
			Cookies.remove("onbording", { domain: ".easedraft.com" });
			console.log("in me");
		}
		router.reload();
	};

	function sortEvents(activities) {
		const events = [];
		activities.map((e) => {
			const reverse = e.events.reverse();
			return events.push(reverse[0]);
		});
		console.log(events);
		events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
		return events;
	}

	const handleSelectionChange = (e) => {
		setValue(new Set([e.target.value]));
		if (inDevEnvironment) {
			Cookies.set("language", e.target.value);
		} else {
			Cookies.set("language", e.target.value, { domain: ".easedraft.com" });
		}
		router.reload();
	};

	const getNotication = async () => {
		try {
			const response = await getDocumentDrafts(1, 3);
			const events = sortEvents(response?.agreementDetails);

			const ref = await getNotifyEvents(1,pageSize)
			setNotifications(ref?.ref)
			setTotalNotification({
				total:ref?.totalItems,
				unRead:ref?.totalUnreadItems
			})
			console.log(ref)
			setEvents(events);
			// setNotifications(response?.agreementDetails);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(()=>{
		getNotication()
	},[update,pageSize])

	const handleNotifyClick =  async(eventId,isAll) =>{
		try{
			console.log(eventId)
			const body ={
				eventId:eventId,
				isRead:'1'
			}
			if(isAll){
				body.isAll=isAll
				if(totalNotification.unRead===0){
					body.isRead='0'
				}
			}
			const ref = await updateNotifyEvent(body)
			setUpdate(prev => !prev)
		} catch(error){
			console.log(error);
		}
	}

	const fetchData = async (value) => {
		const res = await getBareActsList(0, 1041);
		if (res) {
			const result = res?.content?.filter((searchData) => {
				return (
					value &&
					searchData &&
					searchData.title &&
					searchData.title.toLowerCase().includes(value)
				);
			});

			setBareAct(result);
		}
	};
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const userProfile = await getUserProfile(accessToken);
				setDetails(userProfile);
			} catch (error) {
				console.error("Error fetching user profile:", error);
			}
		};

		fetchUserProfile();
	}, []);
	useEffect(() => {
		const langauge = Cookies.get("language");
		if (langauge) {
			setValue(new Set([Cookies.get("language")]));
		}
	}, []);
	const getAllService = async () => {
		const response = await getServices();
		if (response) {
			setServices(response);
		}
	};
	useEffect(() => {
		getAllService();
		getNotication();
		const { enquiry } = router.query;
		if (enquiry) {
			setServiceName(enquiry);
		}
	}, []);
	const pathname = usePathname();
	return (
		<>
			<NextUINavbar
				isBlurred={false}
				isBordered
				onMenuOpenChange={setIsMenuOpen}
				className="xxl:px-[20px] px-5 [&>header]:p-0 [&>header]:gap-0 lg:[&>header]:gap-0"
				maxWidth="full"
			>
				<div className="fixed bottom-1  lg:bottom-5 right-1 lg:right-5">

				</div>
				<NavbarContent justify="start" className={""}>
					<NavbarMenuToggle
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						className="lg:hidden"
					/>
					<NavbarBrand>
						<Image
							src={"/images/Colibri.png"}
							alt={"Lawinzo Logo"}
							height={40}
							width={180}
							className={`min-w-[180px] ${hideLogo ? "hidden" : ""}`}
						/>
					</NavbarBrand>
				</NavbarContent>
				{content && (
					<div className="lg:flex md:pl-[80px] pl-[20px] md:pr-5 items-center w-full justify-between hidden">
						<div className="flex flex-row gap-5">
							{content?.back && (
								<Link
									className="font-semibold text-[16px] rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] px-5"
									href={content?.back?.link}
								>
									<ArrowBackIosNewOutlinedIcon
										sx={{ fontSize: 15, marginRight: 0.5 }}
									/>
									{content?.back?.title}
								</Link>
							)}
							<h1 className="flex items-center font-bold text-xl text-[#05686E] truncate max-w-[40vw] ">
								{content?.title}
							</h1>
						</div>
						<ul className="flex items-center gap-2">
							{content?.links?.map((e, i) => {
								if (i === 0) {
									return (
										<li key={i}>
											<div className="">
												<Button
													onClick={() => handleSubmit(e.title)}
													size="md"
													className="font-semibold rounded-full bg-[#05686E] text-white px-5"
												>
													{e.title}
												</Button>
											</div>
										</li>
									);
								}
								return (
									<li key={i}>
										<Button
											onClick={() => handleSubmit(e.title)}
											size="sm"
											className="font-semibold rounded-full bg-[#05686E] text-background px-5"
										>
											{e.title}
										</Button>
									</li>
								);
							})}
						</ul>
					</div>
				)}

				<NavbarContent
					justify="end"
					className="align-center gap-2 lg:gap-1 me-2 lg:me-0 justify-end"
				>
					{content?.comp && (
						<NavbarItem className="flex px-4">					
							<Popover placement="bottom" showArrow={true} style={{zIndex:10}}>
								<PopoverTrigger>
								<Button className="bg-transprent hidden md:flex ">
									<Badge className="top-[20%]" content={totalNotification.unRead>1000?'999+':totalNotification.unRead} color="secondary" shape="circle">
										<NotificationsIcon sx={{ fontSize: 30 }} />
									</Badge>
									</Button>
								</PopoverTrigger>
								<PopoverContent>
									<div className="w-full flex items-center justify-between text-[20px] p-4">
										Notifications
										{
											totalNotification && totalNotification.total>0 && (
												<div>
													<Popover showArrow placement="left">
										<PopoverTrigger className=" rounded-tl-none rounded-br-none">
											<Button onClick={() => setPopOpen(true)} size="sm" className="bg-gray-50" isIconOnly ><MoreHorizontalIcon size={20} /></Button>
										</PopoverTrigger>
										<PopoverContent className="w-fit rounded-sm p-2">
											<div onClick={()=>{handleNotifyClick(e?.id,true)}} className="cursor-pointer">Mark all as {totalNotification.unRead >0 ?'read' :'unread'}</div>
										</PopoverContent>
										</Popover>
												</div>
											)
										}
									</div>
									
								<div className="max-h-[350px] min-h-[250px] min-w-[calc(300px-1rem)] overflow-scroll">
								{Notifications && Notifications.length > 0 ? (
										Notifications.map((e, i) => {
											// console.log(e)
											const icon = notificationTypeIcon[e.type]
											return (
												<div 
												key={i}
												onClick={()=>{handleNotifyClick(e?._id)}}
												// onClick={()=>{console.log(e)}}
												className={`flex flex-row justify-between gap-5 w-[calc(300px-1rem)] md:w-[calc(400px-1rem)] p-4 border-b-2 cursor-pointer hover:bg-gray-300 ${e.isRead==='0'? 'bg-cyan-50':''}`}
												>
													
													<h1 className="text--[24px] flex items-center gap-2">
													{icon && <span>{icon}</span>}
														{e?.action}
													</h1>
													
													<h1 className="text-[14px] font-[400] pr-2">
														{formatTimestamp(e?.timestamp)}
													</h1>
												</div>
											);
										})
									) : (
										<div className="h-[200px] flex items-center justify-center">

										<h1 className="my-5 text-[14px] font-[500]">
													No Notification
										</h1>
										</div>
									)}
								</div>
									{
										Notifications && Notifications.length > 0 && pageSize <=Notifications.length && (
											// <div  className="flex items-center text-[16px] p-4 cursor-pointer w-full justify-center">
											// </div>
												<div className="m-auto hover:cursor-pointer flex justify-center w-full mt-2 hover:bg-gray-100 py-1" onClick={() => setPageSize((prev) => prev + 5)} >Load More</div>
										)
									}
									{/* {
										Notifications && Notifications.length > 0 && (
											<div onClick={onOpen} className="flex items-center text-[16px] p-4 cursor-pointer w-full justify-center">
												View All
												<span><ArrowRight size={20} /></span>
											</div>
										)
									} */}
									
								</PopoverContent>
							</Popover>
							<Dropdown className="border rounded-sm text-[16px] ">
								<DropdownTrigger>
									<Button
										onClick={() => setModOpen(!modOpen)}
										variant={"solid"}
										className="capitalize rounded-full text-white font-[600] bg-[#056a70ff]"
									>
										Quick Actions{" "}
										<ExpandMoreIcon
											className={modOpen ? "rotate-180" : "rotate-0"}
										/>
									</Button>
								</DropdownTrigger>
								<DropdownMenu className="">
									<DropdownItem className="hover:border rounded-sm" key="new">
										<Link
											as={NextLink}
											href="/document/new"
											className="flex flex-row gap-3 text-black"
										>
											<NoteAddOutlinedIcon />{" "}
											<h1 className="text-[14px]">Sign</h1>
										</Link>
									</DropdownItem>
									{/* <DropdownItem className="hover:border rounded-sm " key="copy">
										<Link href="" className="flex flex-row gap-3 text-black">
											<PersonAddAlt1OutlinedIcon />{" "}
											<h1 className="text-[14px]"> New Template</h1>
										</Link>
									</DropdownItem> */}
									<DropdownItem className="hover:border rounded-sm " key="edit">
										<Link
											as={NextLink}
											href="/contacts"
											// href="/contacts?add=true"
											className="flex flex-row gap-3 text-black"
										>
											<BackupTableOutlinedIcon />{" "}
											<h1 className="text-[14px]"> New Contact</h1>
										</Link>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</NavbarItem>
					)}
					{content?.save && (
						<Link
							href={content?.save?.link}
							className="hidden md:flex font-semibold rounded-full bg-[#05686E] border-1 text-white px-[20px] py-[8px] mr-4 w-max"
						>
							{content?.save?.title}
						</Link>
					)}
					{content?.add && (
						<button
						onClick={content?.add?.handleAdd}
							className="hidden md:flex font-semibold rounded-full bg-[#05686E] text-background px-[20px] py-[5px] mr-4 w-max"
						>
							{content?.add?.title}
						</button>
					)}
					{content?.cta && (
						<button
						
						onClick={content?.cta?.onOpen}
						className="hidden md:flex font-semibold rounded-full bg-[#05686E] text-background px-[20px] py-[5px] mr-4 w-max"
					>
						{content?.cta.title}
					</button>
						
						
					)}

					{details?.data && (
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar
									as="button"
									className="border-3 rounded-full border-[#E8713C]"
									classNames={{
										base: "bg-[#05686E] text-white text-[16px]",
									}}
									name={
										details?.data?.fullname
											? details?.data?.fullname.slice(0, 1)
											: ""
									}
									size="md"
									showFallback 
									src={details?.data?.userProfileImageLink}
								/>
							</DropdownTrigger>
							<DropdownMenu aria-label="Profile Actions" variant="flat">
								<DropdownSection aria-label="Profile & Actions" showDivider>
									<DropdownItem
										isReadOnly
										key="profile"
										className="h-14 gap-2 opacity-100"
									>
										<User
											name={details?.data?.fullname}
											description={details?.data?.phone}
											classNames={{
												name: "text-default-600",
												description: "text-default-500",
											}}
											avatarProps={{
												size: "lg",
												src: details?.data?.userProfileImageLink?.present && details?.data?.userProfileImageLink,
												name: details?.data?.fullname
													? details?.data?.fullname.slice(0, 1)
													: "",
												className: "text-[18px]",
												fallback: details?.data?.fullname
												&& details?.data?.fullname.slice(0, 1)
											}}
										/>
									</DropdownItem>
								</DropdownSection>

								<DropdownItem key="dashboard">
									<NextLink href="/dashboard"> Dashboard</NextLink>
								</DropdownItem>
								<DropdownItem
									key="logout"
									onClick={() => logOut()}
									// color="warning"
									className="hover:!bg-[#E8713C] hover:!text-white"
								>
									<p>Log Out</p>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					)}
				</NavbarContent>
				<br />
				{/* side bar menu mobile */}
				<NavbarMenu
					className={`z-50 ${nunito.className} p-0 flex flex-col justify-between font-bold hover:text-green-800`}
				>
					<div className="">
						<>
							{navLinks.map((e, i) => {
								if (e.length === 1) {
									return (
										<NavbarMenuItem key={i} className="border-b">
											<Link
												as={NextLink}
												className="text-[13px] gap-3 w-full py-4 px-7 text-lg  text-[#161C2D] font-bold tracking-widest leading-5"
												color="foreground"
												href={e[0].link}
											>
												{e[0].icon}
												<div className="flex flex-col">
													{e[0].title}
													<p className="text-xs font-light">{e[0].subtitle}</p>
												</div>
											</Link>
										</NavbarMenuItem>
									);
								}
								{console.log(e)}
								return (
									<div className="border-b" key={i}>
										<Accordion className="" itemClasses={{}}>
											<AccordionItem
												startContent={e[0].icon}
												title={e[0].title}
												subtitle={
													<p className="text-xs font-medium tracking-wide text-black">
														{e[0].subtitle}
													</p>
												}
												className="px-5"
											>
												{e.map((e, i) => {
													if (i === 0) {
														return;
													}
													{console.log(e)}
													return (
														<NavbarMenuItem key={i} className="pl-9 pt-0">
															<Link
																as={NextLink}
																className="text-[13px] hover:text-[#EABF4E] pb-4 w-full text-lg  text-[#161C2D] tracking-widest leading-5"
																color="foreground"
																href={e.link}
															>
																{e.title}
															</Link>
														</NavbarMenuItem>
													);
												})}
											</AccordionItem>
										</Accordion>
									</div>
								);
							})}
						</>
					</div>

					<div className="py-10 px-6 pr-16">
						<Link href={"/"}>
							<Image
								src={"/images/Colibri.png"}
								width={210}
								height={70}
								alt="logo"
								className="w-52  relative -left-3"
							></Image>
						</Link>
						<div className="mt-2">
							<address>{footer?.address[0].address}</address>
							<h3 className="mt-3">
								<Link
									href={`mailto:${footer?.address[0].contact.split("/")[0]}`}
									className="text-black"
								>
									{footer?.address[0].contact.split("/")[0]}
								</Link>
								<br />
								<Link
									href={`tel:${footer?.address[0].contact.split("/")[1]}`}
									className="text-black"
								>
									{footer?.address[0].contact.split("/")[1]}
								</Link>
							</h3>
						</div>
						<ul className="flex justify-between mt-5">
							<li>
								<Linkedin fill="black" className="text-black" size={18} />
							</li>
							<li>
								<Youtube size={18} className="text-black" />
							</li>
							<li>
								<Twitter fill="black" className="text-black" size={18} />
							</li>
							<li>
								<Facebook fill="black" className="text-black" size={18} />
							</li>
							<li>
								<Instagram size={18} className="text-black" />
							</li>
						</ul>
					</div>
				</NavbarMenu>
			</NextUINavbar>
		</>
	);
}
