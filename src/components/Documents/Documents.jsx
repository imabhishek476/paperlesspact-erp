import {
	Button,
	ButtonGroup,
	Checkbox,
	Select,
	SelectItem,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Spinner,
	Modal,
	ModalContent,
	ModalBody,
	ModalFooter,
	useDisclosure,
	ModalHeader,
} from "@nextui-org/react";
import {
	ChevronLeft,
	ChevronRight,
	Circle,
	Disc2,
	Download,
	ExternalLink,
	RotateCcw,
	Search,
	Trash,
	TrashIcon,
} from "lucide-react";
import ReplayIcon from "@mui/icons-material/Replay";
import React, { useState } from "react";
import { useEffect } from "react";
import {
	deletedDocument,
	getDocumentDrafts,
	getcompletedDocList,
	getcompletedDocListSearch,
} from "@/Apis/legalAgreement";
import { usePathname, useSearchParams } from "next/navigation";
import { formatDate } from "@/Utils/dateTimeHelpers";
import LoadingPage from "../LoadingPage/loadingPage";
import { getUserProfile } from "@/Apis/login";
import Cookies from "js-cookie";
import { useEnv } from "../Hooks/envHelper/useEnv";
import { useRouter } from "next/router";
import { Alert, Snackbar, Typography } from "@mui/material";
import Link from "next/link";
const columns = [
	{
		key: "sno",
		label: "S No",
	},
	{
		key: "drafts",
		label: "Drafts",
	},
	{
		key: "user",
		label: "User",
	},
	{
		key: "date",
		label: "Date",
	},
	{
		key: "status",
		label: "Status",
	},
	{
		key: "action",
		label: "",
	},
];
const list = [
	{
		label: "All",
		value: "1",
	},
	{
		label: "None",
		value: "0",
	},
];
const Documents = () => {
	const [alertSeverity, setAlertSeverity] = useState("success");
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("");
	const [isSearch, setIsSearch] = useState(false);
	const router = useRouter();
	const { pathname } = router;
	const [ActivityPage, setActivityPage] = useState({
		size: 3,
		currentPage: 1,
		maxPage: 1,
	});
	const [draftDetail, setDraftDetail] = useState();
	const [drafts, setDrafts] = useState([]);
	const { onOpenChange } = useDisclosure();
	const [deleteModel, setDeleteModel] = useState(false);
	const path = usePathname();
	const [Loading, setLoading] = useState(true);
	const queryParameters = useSearchParams();
	const inDevEnvironment = useEnv();
	const [deletedId, setDeletedId] = useState();
	const [update, setUpdate] = useState(false);
	const [profileDetails, setProfileDetails] = useState(null);
	function sortEvents(activities) {
		const events = [];
		activities.map((e) => events.push(...e.events.reverse()));
		console.log(events);
		return events;
	}
	async function getDocument() {
		const filter = {};
		if (queryParameters.get("completed")) {
			filter.completed = queryParameters.get("completed");
		}
		if (queryParameters.get("isDraft")) {
			filter.isDraft = queryParameters.get("isDraft");
		}
		const docs = await getcompletedDocList(filter, 1, 8);
		if (docs) {
			console.log(docs);
			setDraftDetail(docs);
			setActivityPage({
				...ActivityPage,
				maxPage: docs.totalPages,
				size: 8,
			});

			setDrafts(docs?.agreementDetails);
		}
	}
	const handleActivityClick = (id,isDraft) => {
		if(isDraft === 1){
			router.push(`/document/new?id=${id}`);
		} else {
			router.push(`/document/preview?id=${id}`);
		}
	};
	const handleSnackbarClose = () => {
		setOpenSnackBar(false);
	};

	const statusFinder = (doc) => {
		if (doc.isDraft === 1) {
			return "Draft";
		}
		if (doc?.events?.some((event) => event.action === "Document All Signed")) {
			return "Completed";
		} else {
			return "In Progress";
		}
	};

	async function handleActivityPageNext(skip) {
		if (ActivityPage.currentPage === ActivityPage.maxPage) {
			return;
		}
		const filter = {};
		if (queryParameters.get("completed")) {
			filter.completed = queryParameters.get("completed");
		}
		if (queryParameters.get("isDraft")) {
			filter.isDraft = queryParameters.get("isDraft");
		}

		const docs = await getcompletedDocList(
			filter,
			ActivityPage.currentPage + 1,
			8
		);
		setActivityPage({
			...ActivityPage,
			currentPage: ActivityPage.currentPage + 1,
		});

		setDraftDetail(docs);
		setDrafts(docs?.agreementDetails);
	}

	async function handleActivityPagePrev(skip) {
		if (ActivityPage.currentPage === 1) {
			return;
		}

		const filter = {};
		if (queryParameters.get("completed")) {
			filter.completed = queryParameters.get("completed");
		}
		if (queryParameters.get("isDraft")) {
			filter.isDraft = queryParameters.get("isDraft");
		}
		const docs = await getcompletedDocList(
			filter,
			ActivityPage.currentPage - 1,
			8
		);
		setActivityPage({
			...ActivityPage,
			currentPage: ActivityPage.currentPage - 1,
		});

		setDraftDetail(docs);
		setDrafts(docs?.agreementDetails);
	}

	async function handleSearch(searchQuery) {
		// const all = queryParameters.get("")
		const isDraft = queryParameters.get("isDraft")
		const completed = queryParameters.get("completed")
		// const completedFalse = queryParameters.get("completed=false")
		// if (pathname === '/document'){
		// 	console.log(pathname);
		// }

		let docs;
		if(completed === "true"){
			docs = await getcompletedDocListSearch(searchQuery, 1, 8,0, 0, completed);
		}
		else if(completed === "false"){
			docs = await getcompletedDocListSearch(searchQuery, 1, 8,0, 0, completed);
		}
		else if(isDraft){
			docs = await getcompletedDocListSearch(searchQuery, 1, 8,0, isDraft);
		}
		else{
			console.log("hello")
			docs = await getcompletedDocListSearch(searchQuery, 1, 8,0);
	    }

		// if (docs) {
			console.log(docs);
			setDraftDetail(docs);
			// setDraftDetail(docs);
			setDrafts(docs?.agreementDetails);
		// }
	}
	async function profile() {
		setLoading(true);
		const profile = await getUserProfile(Cookies.get("accessToken"));
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
	const deleteDoc = async (id) => {
		console.log(id);
		const deleted = await deletedDocument(id);
		if (deleted) {
			setUpdate((prev) => !prev);
			setAlertSeverity("success");
			setOpenSnackBar(true);
			setSnackbarMsg("Document moved to trash sucessfully");
		}
	};
	const handleDelete = (id) => {
		console.log(id);
		if (id) {
			setDeleteModel(true);
			setDeletedId(id);
		}
	};
	useEffect(() => {
		getDocument();
		profile();
	}, [update]);

	useEffect(() => {
		console.log(drafts, drafts.length);
	}, [drafts]);
	return  (
		<div className="lg:px-[35px] lg:pl-24 px-4">
			<div className="block md:hidden bg-[#d7d7d9] border rounded-sm w-full p-1 mb-3 mt-5 px-[20px]">
				Documents
			</div>
			{openSnackBar && (
				<Snackbar
					anchorOrigin={{ vertical: "top", horizontal: "right" }}
					open={openSnackBar}
					autoHideDuration={2000}
					onClose={handleSnackbarClose}
					sx={{ zIndex: 1000, mt: 5 }}
				>
					<Alert
						onClose={handleSnackbarClose}
						severity={alertSeverity}
						sx={{ width: "100%", pr: 3, pl: 3, borderRadius: "10px" }}
					>
						<Typography sx={{ fontSize: "14px" }} variant="h6">
							{snackbarMsg}
						</Typography>
					</Alert>
				</Snackbar>
			)}
			<Modal
				isOpen={deleteModel}
				onOpenChange={onOpenChange}
				onClose={() => setDeleteModel()}
				placement="top-center"
        		radius="lg"
        		classNames={{
        		  body: "mb-2 pb-2",
        		  backdrop: "bg-overlay/50 backdrop-opacity-40",
        		  base: "text-black w-[30%]",
        		  header: "pb-1",
        		  footer: "",
        		  closeButton: ""
        		}}
			>
				<ModalContent>
					<ModalHeader className="flex flex-col justify-center">Delete Contact</ModalHeader>
					<ModalBody className="">
						Are you sure want to trash this document ?
					</ModalBody>
					<ModalFooter>
						<Button
							color="danger"
							variant="light"
							onPress={() => {
								deleteDoc(deletedId);
								setDeleteModel(false);
							}}
						>
							Yes
						</Button>
						<Button
							className="bg-[#05686e] text-background"
							onPress={() => setDeleteModel(false)}
						>
							No
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<div className="mt-[2rem] w-full  flex flex-col md:flex-row gap-3 lg:justify-end justify-between">
				<div className="flex lg:hidden flex-row gap-3 justify-end mb-3">
					<Link href={"/document/new"}>
						<Button className="rounded-full border border-[#056a70ff] bg-transparent hover:bg-[#056a70ff] text-[#056a70ff] hover:text-background">
							Create New Document
						</Button>
					</Link>
				</div>
				<div>
					<div className="flex flex-row gap-2 border-1 rounded-sm py-2 px-2 w-full md:w-[400px]">
						<Search
							strokeWidth={2}
							className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
						/>{" "}
						<input
							onChange={(event) => {
								handleSearch(event.currentTarget.value);
							}}
							type="text"
							className="outline-0 flex-1"
							placeholder="Search Documents"
						/>
					</div>
				</div>
			</div>
			<div className="mt-5">
				<div className="flex flex-row justify-between">
					<div>
						<p className="text-[12px] hidden md:flex">
							Found {draftDetail?.totalItems} results
						</p>
					</div>
					<div className="flex flex-col md:flex-row justify-between flex-wrap w-full md:w-max gap-1 md:gap-0">
						{/* <ButtonGroup radius='none' className='border rounded-sm flex'> */}
						<Button
							onClick={() => router.replace("/document")}
							className={`${
								queryParameters.size === 0 ? "bg-background" : "bg-cyan-50"
							} border rounded-sm w-full md:w-max`}
						>
							All
						</Button>
						<Button
							onClick={() => router.replace("/document?isDraft=1")}
							className={`${
								queryParameters.get("isDraft") === "1"
									? "bg-background"
									: "bg-cyan-50"
							} border rounded-sm w-full md:w-max`}
						>
							Drafts
						</Button>
						<Button
							onClick={() => router.replace("/document?completed=true")}
							className={`${
								queryParameters.get("completed") === "true"
									? "bg-background"
									: "bg-cyan-50"
							} border rounded-sm w-full md:w-max`}
						>
							Completed
						</Button>
						<Button
							onClick={() => router.replace("/document?completed=false")}
							className={`${
								queryParameters.get("completed") === "false"
									? "bg-background"
									: "bg-cyan-50"
							} border rounded-sm w-full md:w-max`}
						>
							In Progress
						</Button>
						{/* <Button className="bg-cyan-50 border rounded-sm w-full md:w-max">
							I need to sign
						</Button> */}
						{/* <Button className="bg-cyan-50 border rounded-sm w-full md:w-max">
							Cancelled
						</Button> */}
						{/* </ButtonGroup> */}
					</div>
				</div>
				<div className="rounded-sm mt-5 md:mt-0">
					{/* <div className="min-h-[40dvh] overflow-x-scroll relative flex flex-col justify-start items-center">
						<div className="table w-full overflow-x-scroll">
							<div class="table-header-group border-b overflow-x-scroll flex-1 cursor-pointer text-[14px] text-foreground">
								<div class="table-row gap-5 border-b">
									<div class="table-cell text-left pl-5 w-[100px] py-3 border-b">
										S No
									</div>
									<div class="table-cell text-left py-3 lg:w-auto w-[300px] border-b">
										Drafts
									</div>
									<div class="table-cell text-left pr-5 py-3 border-b">
										User
									</div>
									<div class="table-cell text-left pr-5 py-3 border-b">
										Date
									</div>
									<div class="table-cell text-left pr-5 py-3 border-b">
										Status
									</div>
								</div>
							</div>
							{drafts && drafts.length > 0 ? (
								<div class="table-row-group">
									{drafts.map((activity, index) => {
										return (
											<div
												class="table-row border-b hover:shadow-lg  w-full cursor-pointer  text-[14px] text-[#0206A8]"
												key={activity?._id}
												onClick={() => handleActivityClick(activity?._id,activity?.isDraft)}
											>
												<div class="table-cell pl-7 py-4 border-b">
													{index + 1 + ActivityPage.currentPage * 8 - 8}
												</div>
												<div class="table-cell py-4 border-b">
													{activity?.draftName}
													by {activity?.user?.fullname}
												</div>
												<div class="table-cell py-4 border-b">
													{activity?.user?.fullname}
												</div>
												<div class="table-cell py-4 border-b pr-5">
													{formatDate(activity?.createdDate)}
												</div>
												<div class="table-cell py-4 border-b pr-5">
													{statusFinder(activity)}
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<h1 className="text-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-[600] text-gray-400">
									No Result To Display
								</h1>
							)}
						</div>
					</div> */}
					<div className="overflow-auto">
						{(update || !update) && (
							<Table
								isCompact={true}
								radius="none"
								shadow="none"
								layout="auto"
								className="md:border-1 rounded-sm p-0"
								removeWrapper={true}
								aria-label="Rows actions table example with dynamic content"
								// selectionMode="multiple"
								// selectedKeys={selectedKeys}
								// onSelectionChange={setSelectedKeys}
								// selectionBehavior={selectionBehavior}
								classNames={{
									th: [ "!rounded-none", "border-divider"],
									tr: "hover:bg-gray-200"
								}
								}
							>
								<TableHeader columns={columns}>
									{(column) => (
										<TableColumn
											className={
												column.key === "action"
													? "text-end border-none"
													: "text-start border-none"
											}
											key={column.key}
										>
											{column.label}
										</TableColumn>
									)}
								</TableHeader>
								<TableBody
									// loadingState={loadingState}
									isLoading={Loading}
									loadingContent={<Spinner />}
									emptyContent={
										<div className="mt-0">
											<div className="min-h-[40dvh] relative flex flex-col justify-start items-center">
												<h1 className="text-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-[600] text-gray-400">
													No Result To Display
												</h1>
											</div>
										</div>
									}
								>
									{drafts?.map((activity, index) => {
										return (
											<TableRow
												className="hover:shadow-lg h-10 cursor-pointer"
												key={activity._id}
											>
												<TableCell
													onClick={() => handleActivityClick(activity?._id,activity?.isDraft)}
													className="whitespace-nowrap"
												>
													{index + 1 + ActivityPage.currentPage * 8 - 8}
												</TableCell>
												<TableCell
													onClick={() => handleActivityClick(activity?._id,activity?.isDraft)}
													className="whitespace-nowrap"
												>
													{activity?.draftName?.slice(0, 40)}
													{activity?.draftName?.length > 40 && "..."}
												</TableCell>
												<TableCell
													onClick={() => handleActivityClick(activity?._id,activity?.isDraft)}
													className="whitespace-nowrap"
												>
													{activity?.user?.fullname.slice(0, 25)}{" "}
													{activity?.user?.fullname.length > 25 && "..."}
												</TableCell>
												<TableCell
													onClick={() => handleActivityClick(activity?._id,activity?.isDraft)}
													className="capitalize whitespace-nowrap"
												>
													{formatDate(activity?.createdDate)}
												</TableCell>
												<TableCell
													onClick={() => handleActivityClick(activity?._id,activity?.isDraft)}
													className="capitalize whitespace-nowrap"
												>
													{statusFinder(activity)}
												</TableCell>
												<TableCell className="capitalize relative z-0 whitespace-nowrap group flex justify-evenly">
													<Trash
														size={20}
														onClick={() => handleDelete(activity?._id)}
														className="hover:text-red-500"
													/>
													<ExternalLink
														className="hover:text-red-500"
														size={20}
														onClick={() => handleActivityClick(activity?._id,activity?.isDraft)}
													/>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						)}
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-between mt-5 mb-5">
				<div className="flex flex-row">
					<ButtonGroup radius="none" className="border rounded-sm">
						{/* <Button isIconOnly className="bg-cyan-50 border rounded-sm">
							<ChevronLeft size={28} /> <ChevronLeft size={28} />
						</Button> */}
						<Button
							onClick={handleActivityPagePrev}
							isIconOnly
							className="bg-cyan-50 border rounded-sm"
						>
							<ChevronLeft size={18} />{" "}
						</Button>
						<Button isIconOnly className="bg-cyan-50 border rounded-sm">
							{ActivityPage.currentPage}{" "}
						</Button>
						<Button
							onClick={handleActivityPageNext}
							isIconOnly
							className="bg-cyan-50 border rounded-sm"
						>
							<ChevronRight size={18} />
						</Button>
						{/* <Button isIconOnly className="bg-cyan-50 border rounded-sm">
							<ChevronRight size={28} />
							<ChevronRight size={28} />
						</Button> */}
					</ButtonGroup>
				</div>
				{/* <div className="flex flex-row gap-2 justify-center items-center">
					<p className="hidden md:flex text-[14px] font-[600]">
						Number of Results :
					</p>{" "}
					<select className="w-[60px] h-[40px] border rounded-sm bg-cyan-50">
						<option value={8}>8</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={30}>30</option>
						<option value={50}>50</option>
					</select>
				</div> */}
			</div>
		</div>
	);
};

export default Documents;
