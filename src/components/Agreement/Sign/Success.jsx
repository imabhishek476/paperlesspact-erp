import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Table,
	TableHeader,
	useDisclosure,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	getKeyValue,
	Tooltip,
	Accordion,
	AccordionItem,
	User,
	DropdownSection,
	Avatar,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@nextui-org/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
	ArrowDown,
	ArrowLeft,
	CircleDot,
	Download,
	FileBadge,
	FileText,
	ListOrdered,
	Mail,
	MousePointerClick,
	Share,
	User2,
	X,
} from "lucide-react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { getRentalAgreementById } from "@/Apis/legalAgreement";
import { getUserProfile } from "@/Apis/login";
import Link from "next/link";
import DocumentPreviewFrame from "../Prepare/DocumentPreviewFrame";
import { Alert, Snackbar } from "@mui/material";
import { useLogout } from "@/components/Navbar/Hooks/Logout/useLogout";
import { useDownload } from "@/components/Hooks/Download/useDownload";

const ctaArray = [
	{
		name: "Download",
		icon: <Download className="w-[10px] h-[10px]" />,
	},
	{
		name: "Share",
		icon: <Share className="w-[10px] h-[10px]" />,
	},
];

const Success = () => {
	const [agreement, setAgreement] = useState(null);
	const [signees, setSignees] = useState(null);
	const router = useRouter();
	const [details, setDetails] = useState(null);
	const accessToken = Cookies.get("accessToken");
	const { id } = router.query;
	const [selectedKeys, setSelectedKeys] = React.useState(new Set(["exp"]));
	const [action, setAction] = useState(-1);

	const logOut = useLogout();
	const { downloadS3Link } = useDownload();

	// const handleDownload = ()=>{
	//   if(agreement&&agreement?.agreements&&agreement?.agreements.length>0){

	//   }
	// }

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const userProfile = await getUserProfile(accessToken); // Make the API call to getUserProfile
				setDetails(userProfile);
				// console.log("User profile data fetched:", userProfile);
			} catch (error) {
				console.error("Error fetching user profile:", error);
			}
		};

		fetchUserProfile();
	}, [accessToken]);
	useEffect(() => {
		// const index = id && id.includes("-") ? id.split("-")[1] : -1;
		const extractedId = id && id.includes("-") ? id.split("-")[0] : id;
		const getAgreement = async () => {
			try {
				if (!id || !accessToken) {
					throw Error("No id or accessToken provided");
				}
				const response = await getRentalAgreementById(accessToken, extractedId);
				console.log(response);
				if (response) {
					setAgreement(response);
					if (response.signees) {
						console.log(
							response.signees.map((signee, index) => {
								return { ...signee, key: index };
							})
						);
						setSignees(
							response.signees.map((signee, index) => {
								return { ...signee, key: index };
							})
						);
					}
				}

				return response;
			} catch (err) {
				console.log(err);
			}
		};
		getAgreement();
	}, [id]);
	// <Mail />
	return (
		<>
			<Navbar
				height={"7vh"}
				maxWidth="full"
				className="xxl:px-[20px] px-5 [&>header]:p-0 [&>header]:gap-0 sm:[&>header]:gap-4 "
				isBordered
			>
				<NavbarBrand>
					<p className="flex h-full items-center font-bold text-xl md:ms-3  text-[#05686E]">
						<Image
							width={52}
							height={52}
							src="/images/favicon.ico"
							className={`py-2 pe-2 transition-opacity ${"opacity-100"}`}
							alt=""
						/>
						Success
					</p>
				</NavbarBrand>
				<NavbarContent justify="end">
					<NavbarItem className="flex gap-2">
						{/* <Popover placement="bottom">
              <PopoverTrigger> */}
						{/* <Button
                  // onClick={() => handleDownload()}
                  size="sm"
                  // endContent={<ArrowDown size={"14px"} />}
                  endContent={<Download size={"14px"} />}
                  className="hidden md:flex font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] "
                >
                  Download
                </Button>
                <Button
                  onClick={() => {}}
                  size="sm"
                  // endContent={<ArrowDown size={"14px"} />}
                  endContent={<Share size={"14px"} />}
                  className="hidden md:flex font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] "
                >
                  Share
                </Button> */}
						{/* </PopoverTrigger>
              <PopoverContent
                className={`rounded-none  bg-white text-foreground p-0 rounded-lg`}
              > */}
						{/* <ul className="p-2">
                  {actions.map((e, index) => {
                    return (
                      <li
                        onClick={() => {
                          setAction(index);
                        }}
                        key={index}
                        className="flex px-2 py-2 gap-1 cursor-pointer hover:bg-gray-300 items-center w-[90px] text-[12px] rounded-lg"
                      >
                        {e.icon} {e.name}
                      </li>
                    );
                  })}
                </ul> */}
						{/* </PopoverContent>
            </Popover> */}
					</NavbarItem>
					<NavbarItem>
						{details?.data && (
							<Dropdown placement="bottom-end">
								<DropdownTrigger>
									<Avatar
										// isBordered
										as="button"
										className="border-3 rounded-full border-[#E8713C]"
										classNames={{
											base: "bg-[#05686E] text-white",
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
										<Link href="/dashboard"> Dashboard</Link>
									</DropdownItem>
									<DropdownItem key="logout" 
									// color="warning"
									className="hover:!bg-[#E8713C] hover:!text-white"
									>
										<p onClick={() => logOut()}>Log Out</p>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						)}
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			{/* <div className="flex sm:hidden items-stretch justify-between gap-3 sm:py-2 py-3 mb-4 px-5 shadow-lg sticky top-[60px] bg-background border-b z-50 ">
				<Image
					src={
						"https://static-00.iconduck.com/assets.00/document-add-icon-2047x2048-3rwd3gx6.png"
					}
					width={32}
					height={32}
					className="w-[5px] h-[5px]"
				></Image>
				<ul className="flex items-center gap-2">
					{ctaArray.map((e, i) => {
						if (i === 0) {
							return (
								<li key={i}>
									<Button
                  endContent={e.icon}
										// onClick={() => handleSubmit(e.title)}
										className="font-semibold  rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] sm:px-5 sm:text-base px-2 h-8 text-xs"
									>
										{e.name}
									</Button>
								</li>
							);
						}
						return (
							<li key={i}>
								<Button
                  endContent={e.icon}
									className="font-semibold  rounded-full bg-[#05686E] text-background sm:px-5 sm:text-base px-2 h-8 text-xs"
									// onClick={() => handleSubmit(e.title)}
								>
									{e.name}
								</Button>
							</li>
						);
					})}
				</ul>
			</div> */}
			<div className="sm:px-[35px] flex justify-center px-3">
				<section className="lg:w-[50vw]">
					<div className="flex flex-col bg-white border-1 mx-2 rounded-lg mt-4 p-3">
						<Alert severity="success" className=" mb-2  rounded-lg">
							Sucessfully Signed.
						</Alert>
						<div className="px-2  py-4 border-b-1">
							<p className="text-sm">
								You have successfully signed this document. A copy of the final
								PDF document has been sent to your email address. Should you
								have any questions or concerns about this document, please
								contact {agreement?.user?.fullname} at the following email
								address: &nbsp;
								<a
									className="text-[#05686e]"
									href={`mailto:${agreement?.user?.email}`}
								>
									{agreement?.user?.email}
								</a>
								.
							</p>
						</div>
						<div className="flex justify-between mt-2 px-2">
							<span>This document has been saved in your account.</span>
							<Button
								as={Link}
								href="/dashboard"
								size="sm"
								startContent={<ArrowLeft />}
								className="hidden md:flex font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] "
							>
								Go To Dashboard
							</Button>
						</div>
					</div>
					{agreement?.agreements && (
						<Accordion
							variant="splitted"
							selectedKeys={selectedKeys}
							onSelectionChange={setSelectedKeys}
							defaultExpandedKeys={["exp"]}
							itemClasses={{
								base: "px-0 my-3 w-full",
								content: "text-small px-0 shadow-none rounded-sm",
								title: "w-full flex justify-between items-center",
							}}
						>
							{agreement?.agreements?.map((document, index) => {
								return (
									<AccordionItem
										key={index === 0 ? "exp" : index}
										aria-label="Accordion 1"
										className="rounded-none shadow-none px-0"
										startContent={<FileText />}
										title={
											<>
												<span className="flex gap-2 items-center text-lg mx-2 font-bold">
													<p>
														{document.name.slice(0, 40)}
														{document.name.length > 40 ? "..." : ""}
													</p>
													<Button
														isIconOnly
														className="bg-[#fff]"
														onPress={() => downloadS3Link(document.URL)}
													>
														<Download size={18} />
													</Button>
												</span>
												<span className="text-sm mx-2">
													Pages: {document?.imageUrls?.length}
												</span>
											</>
										}
									>
										<DocumentPreviewFrame url={document.URL} height={"640px"} />
									</AccordionItem>
								);
							})}
						</Accordion>
					)}
				</section>
			</div>
		</>
	);
};

export default Success;
