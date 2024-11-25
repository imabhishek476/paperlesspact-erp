import { CheckBox, Preview } from "@mui/icons-material";
import {
	Button,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectItem,
	Switch,
	Tooltip,
	cn,
} from "@nextui-org/react";
import { PDFDocument } from "pdf-lib";
import { useSearchParams } from "next/navigation";

import {
	ChevronDownIcon,
	Computer,
	Cross,
	File,
	FileBadge,
	FileSignature,
	Fingerprint,
	Grip,
	GripVertical,
	HelpCircle,
	IndianRupee,
	Mail,
	MailCheck,
	MoveLeft,
	Plus,
	Settings,
	Stamp,
	Trash2,
	Undo2,
	UploadCloud,
	User,
	Users,
	Users2,
	X,
} from "lucide-react";
import Image from "next/image";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@nextui-org/react";
import { Nunito } from "next/font/google";
import Link from "next/link";
import GoogleDrivePicker from "../Providers/GoogleDrivePicker";
import GoogleDriveSwapper from "../Providers/GoogleDriveSwapper";
const nunito = Nunito({ subsets: ["latin"] });
import { Document, Page } from "react-pdf";
import { MergePdf } from "@/lib/pdfs/mergedpdf";

import Cookies from "js-cookie";
import { getUserProfile } from "@/Apis/login";
import { ValidateEmail } from "@/lib/validators/emailValidator";
import { getRentalAgreementById } from "@/Apis/legalAgreement";
import { Alert, InputAdornment, Snackbar, TextField } from "@mui/material";


const signingMethods = [
	{
		title: "email",
		icon: <Mail size={14} />,
	},
	{
		title: "aadhaar",
		icon: <Fingerprint size={14} />,
	},
];

function NewDocumentPage({
	width,
	setIsInstanceId,
	profileDetails,
	setProfileDetails,
	textareaValue,
	setTextareaValue,
	handleSubmit,
	actions,
	setAction,
	signers,
	setSigners,
	files,
	setFiles,
	documentDetail,
	setdocumentDetail,
	documentSettings,
	setdocumnetSettings,
	isStampRequired,
	setStampRequired,
	isSelectedStamp,
	setIsSelectedStamp,
	stampAmount,
	setStampAmount,
	stampFile,
	setStampFile,
	documentArray,
	setDocumentArray,
	handleSnackbarClose,
	snackbarOpen,
	snackbarMsg,
	clientEmail,
	setClientEmail,
	signingOrderActive,
	setSigningOrderActive,
	setDraftName,
	signMethod,
	setSignMethod,
	isContactSave,
	setIsContactSave,
	setSnackbarOpen,
	setSnackbarMsg,
	isInstance,
	setIsInstance,
}) {
	const [errorMail, setErrormail] = useState(false);
	const [numPages, setNumPages] = useState();
	const [pageNumber, setPageNumber] = useState(1);
	const queryParameters = useSearchParams();
	const [mergeLoading, setMergeLoading] = useState(false);
	const searchParams = useSearchParams();
	const id = searchParams.get("id");
	const accessToken = Cookies.get("accessToken");
	//   console.log(id);
	const [preview, setPreview] = useState([]);
	const clientLogoForm = useRef();
	const [modalfile, setModalFile] = useState(null);
	const [modalfiledetails, setModalFiledetails] = useState(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const googleDriveRef = useRef(null);
	const [filePickAction, setFilePickAction] = useState(false);
	// const content = {
	// 	title: "New Document",
	// 	links: [
	// 		{
	// 			title: "Save Draft",
	// 			action: "save-draft",
	// 			link: "/document/new?action=save-draft",
	// 		},
	// 		{
	// 			title: "Prepare",
	// 			action: "prepare",
	// 			link: "/document/new?action=prepare",
	// 		},
	// 		{
	// 			title: "Quick Send",
	// 			action: "quick-send",
	// 			link: "/document/new?action=quick-send",
	// 		},
	// 	],
	// };
	const content = useMemo(()=>{
		if(!isInstance){
			return {
					title: "New Document",
					links: [
						{
							title: "Save Draft",
							action: "save-draft",
							link: "/document/new?action=save-draft",
						},
						{
							title: "Prepare",
							action: "prepare",
							link: "/document/new?action=prepare",
						},
						{
							title: "Quick Send",
							action: "quick-send",
							link: "/document/new?action=quick-send",
						},
					],
				}
		}
		return {
			title:'EaseDraft-Envelope',
			links:[
					{
						title: "Save Draft",
						action: "save-draft",
						link: "/document/new?action=save-draft",
					},
					{
						title:'Send',
						action:'Send',
						link:'Send'
					}
			]
		}
	},[isInstance]);



	const dragSigner = useRef(0);
	const draggedOverSigner = useRef(0);

	function handleDrag() {
		// function dragAlgorithm(arr, sourceIndex, destinationIndex) {
		// 	// Ensure that source and destination indices are valid
		const signersClone = [...signers];

		// 	return arr;
		// }
		// const arr = dragAlgorithm(
		// 	signers,
		// 	dragSigner.current,
		// 	draggedOverSigner.current
		// );
		if (
			dragSigner.current >= 0 &&
			dragSigner.current < signersClone.length &&
			draggedOverSigner.current >= 0 &&
			draggedOverSigner.current < signersClone.length
		) {
			// Store the value of the element at the source index
			const draggedElement = signersClone[dragSigner.current];

			// If dragging to the right
			if (dragSigner.current < draggedOverSigner.current) {
				// Move elements to the left, leaving a space for the dragged element
				for (let i = dragSigner.current; i < draggedOverSigner.current; i++) {
					signersClone[i] = signersClone[i + 1];
				}
			}

			// If dragging to the left
			else if (dragSigner.current > draggedOverSigner.current) {
				// Move elements to the right, leaving a space for the dragged element
				for (let i = dragSigner.current; i > draggedOverSigner.current; i--) {
					signersClone[i] = signersClone[i - 1];
				}
			}

			// Place the dragged element at the destination index
			signersClone[draggedOverSigner.current] = draggedElement;
		}

		// signerClone[dragSigner.current] = signerClone[draggedOverSigner.current];
		// signerClone[draggedOverSigner.current] = temp;

		setSigners(signersClone);
	}
	const [sigerRole, setSignerRole] = useState({
		title: "Signer",
		icon: <FileSignature size={18} />,
	});
	const signerRoles = [
		{
			title: "Signer",
			icon: <FileSignature size={18} />,
		},
		{
			title: "CC",
			icon: <Mail size={18} />,
		},
		{
			title: "Approver",
			icon: (
				<CheckBox
					sx={{
						width: 18,
						height: 18,
					}}
				/>
			),
		},
	];
	const actionLink = [
		{
			icon: <User className="lg:w-[20px] w-24 " />,
			title: "Only Me",
			action: "only-me",
			description: "I am the sole signer",
		},
		{
			icon: (
				<div className="flex items-center gap-2">
					<User className="lg:w-[20px] w-6 " />
					<Users className="lg:w-[20px] w-6 " />
				</div>
			),
			title: "Me & Others",
			action: "me-others",
			description: "Others and I will sign",
		},
		{
			icon: (
				<div className="flex items-center gap-2">
					<Users className="lg:w-[20px] w-6 " />
					<Users className="lg:w-[20px] w-6 " />
				</div>
			),
			title: "Others only",
			action: "others",
			description: "Others will sign",
		},
	];
	const fileRef = useRef();
	const fileRefSwap = useRef();

	function handleFileStampChange(event) {
		setStampFile(event.target.files[0]);
	}

	function handleFileChange(event) {
		if (files.length > 0) {
			setSnackbarOpen(true);
			setSnackbarMsg("You can't select more than one document");
			return;
		}
		console.log(event.target.files[0]);
		if (window.FileReader && event.target.files[0]) {
			setFiles([...files, ...event.target.files]);
			const file = new FileReader();
			if (
				event.target.files[0] &&
				event.target.files[0].type.match("image.*")
			) {
				file.onload = function () {
					setPreview([...preview, file.result]);
				};
				file.readAsDataURL(event.target.files[0]);
			} else {
				setPreview([...preview, null]);
			}
		}
	}

	const getAgreement = async () => {
		try {
			console.log(id);
			const response = await getRentalAgreementById(accessToken, id);
			console.log(response);
			if (response) {
				if (response?.signees && response?.signees.length > 0) {
					setSigners([
						...response?.signees.map((signee) => {
							return {
								...signee,
								emailError: false,
								emailHelperText: "",
								nameError: false,
								nameHelperText: "",
								aadhaarError: false,
								aadhaarHelperText: "",
							};
						}),
						...(response?.ccs || [])?.map((signee) => {
							return {
								...signee,
								emailError: false,
								emailHelperText: "",
								nameError: false,
								nameHelperText: "",
								aadhaarError: false,
								aadhaarHelperText: "",
							};
						}),
						...(response?.approvers || [])?.map((signee) => {
							return {
								...signee,
								emailError: false,
								emailHelperText: "",
								nameError: false,
								nameHelperText: "",
								aadhaarError: false,
								aadhaarHelperText: "",
							};
						}),
					]);
				} else {
					if (response?.participants === "only-me") {
						const name = Cookies.get("name");
						console.log(profileDetails?.fullname);
						setSigners([
							{
								lang: "",
								signerRole: "Signer",
								signersEmail:
									profileDetails && profileDetails?.email
										? profileDetails?.email
										: "",
								fullname: name,
								emailError: false,
								emailHelperText: "",
								nameError: false,
								nameHelperText: "",
							},
						]);
					}
					if (response?.participants === "me-others") {
						// console.log(Cookies.get("name"));
						const name = Cookies.get("name");
						console.log(name);
						setSigners([
							{
								lang: "",
								signerRole: "Signer",
								signersEmail: Cookies.get("email"),
								fullname: name,
								emailError: false,
								emailHelperText: "",
								nameError: false,
								nameHelperText: "",
							},
							{
								fullname: "",
								signersEmail: "",
								signerRole: "Signer",
								lang: "",
								emailError: false,
								emailHelperText: "",
								nameError: false,
								nameHelperText: "",
							},
						]);
					}
					if (response?.participants === "others") {
						setSigners([
							{
								fullname: "",
								signersEmail: "",
								signerRole: "Signer",
								lang: "",
								emailError: false,
								emailHelperText: "",
								nameError: false,
								nameHelperText: "",
							},
						]);
					}
				}
				setIsInstance(response?.fromTemplate==='1'?true:false);
				setIsInstanceId(response?.instanceId?response?.instanceId:null);
				setAction(response?.participants ? response?.participants : null);
				setdocumentDetail(
					response?.emailTemplate
						? response?.emailTemplate
						: {
								title: documentDetail.title,
								message: `${
									response?.user?.fullname ? response?.user?.fullname : "User"
								} has requested your signature on document & it's ready for review and signing.\n\nKindly go through it and complete the signing process.\n\nClick on the link below to sign the document. Once all parties finish signing, You will receive a copy of the executed document`,
						  }
				);
				// console.log(response?.settings);
				setdocumnetSettings(
					response?.settings
						? response?.settings
						: {
								autoReminder: true,
								requiredAllSigners: true,
								expires: "3m",
						  }
				);
				setStampRequired(
					response?.stampAmount || response?.stampUrl ? true : false
				);
				setStampAmount(response?.stampAmount ? response?.stampAmount : "0");
				setFiles(response?.agreements ? response?.agreements : []);
				setDocumentArray(response?.documents ? response?.documents : []);

				// if(response?.fromTemplate==='1'&&!response?.draftName){
				// 	setDraftName('EaseDraft-Envelope');
				// }else{
				// }
				setDraftName(response?.draftName ? response?.draftName : "");
				setSigningOrderActive(response?.isSigningOrder === "1" ? true : false);
				setClientEmail(response?.user?.logo ? response?.user?.logo : null);
				if (response?.signMethod) {
					if (response?.signMethod === "aadhaar") {
						const index = signingMethods.findIndex(
							(ele) => ele.title === "aadhaar"
						);
						if (index !== -1) {
							setSignMethod(signingMethods[index]);
						}
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(()=>{
		console.log(isInstance);
	},[isInstance])

	const getSignerRoleIcon = (role) => {
		if (role === "Approver") {
			return (
				<CheckBox
					sx={{
						width: 18,
						height: 18,
					}}
				/>
			);
		}
		if (role === "Signer") {
			return <FileSignature size={18} />;
		}
		if (role === "CC") {
			return <Mail size={18} />;
		}
		return <FileSignature size={18} />;
	};

	const handleRemoveFile = (file, index) => {
		console.log(file, index);
		console.log(
			documentArray,
			documentArray.findIndex((ele) => ele === file?._id)
		);
		if (file?.URL) {
			const docIndex = documentArray.findIndex((ele) => ele === file?._id);
			if (docIndex !== -1) {
				setDocumentArray((prev) => {
					prev.splice(docIndex, 1);
					console.log(prev);
					return prev.map((ele) => ele);
				});
			}
		}
		setFiles((prev) => {
			prev.splice(index, 1);
			return prev.map((ele) => ele);
		});
	};

	const handleRemoveLogo = () => {
		setClientEmail(null);
	};

	useEffect(() => {
		if (!id) {
			if (actions === "only-me") {
				const name = Cookies.get("name");
				console.log(name);
				return setSigners([
					{
						lang: "",
						signerRole: "Signer",
						signersEmail:
							profileDetails && profileDetails?.email
								? profileDetails?.email
								: "",
						fullname:
							profileDetails && profileDetails?.fullname
								? profileDetails?.fullname
								: "",
						emailError: false,
						emailHelperText: "",
						nameError: false,
						nameHelperText: "",
						aadhaarNo: "",
						aadhaarError: false,
						aadhaarHelperText: "",
					},
				]);
			}
			if (actions === "me-others") {
				// console.log(Cookies.get("name"));
				const name = Cookies.get("name");
				console.log(name);
				return setSigners([
					{
						lang: "",
						signerRole: "Signer",
						signersEmail:
							profileDetails && profileDetails?.email
								? profileDetails?.email
								: "",
						fullname:
							profileDetails && profileDetails?.fullname
								? profileDetails?.fullname
								: "",
						emailError: false,
						emailHelperText: "",
						nameError: false,
						nameHelperText: "",
						aadhaarNo: "",
						aadhaarError: false,
						aadhaarHelperText: "",
					},
					{
						fullname: "",
						signersEmail: "",
						signerRole: "Signer",
						lang: "",
						emailError: false,
						emailHelperText: "",
						nameError: false,
						nameHelperText: "",
						aadhaarNo: "",
						aadhaarError: false,
						aadhaarHelperText: "",
					},
				]);
			}
			return setSigners([
				{
					fullname: "",
					signersEmail: "",
					signerRole: "Signer",
					lang: "",
					emailError: false,
					emailHelperText: "",
					nameError: false,
					nameHelperText: "",
					aadhaarNo: "",
					aadhaarError: false,
					aadhaarHelperText: "",
				},
			]);
		}
	}, [actions, id]);
	// const handleKeyDown = (event) => {
	// 	// if (event.key === "Enter") {
	// 	// 	setdocumentDetail({
	// 	// 		...documentDetail,
	// 	// 		message: event.target.value + "\n",
	// 	// 	});
	// 	// 	event.preventDefault();
	// 	// }
	// };

	useEffect(() => {
		if (id) {
			getAgreement();
		}
	}, [id]);

	return (
		<>
			<Snackbar
				open={snackbarOpen}
				onClose={handleSnackbarClose}
				autoHideDuration={4000}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert severity="error">{snackbarMsg}</Alert>
			</Snackbar>
			<div className="flex lg:hidden items-stretch justify-between gap-3 lg:py-2 py-3 mb-4 px-5 shadow-lg sticky top-[65px] bg-background border-b z-50 ">
				<Image
					src={
						"https://static-00.iconduck.com/assets.00/document-add-icon-2047x2048-3rwd3gx6.png"
					}
					width={32}
					height={32}
					// className="w-[5px] h-[5px]"
				></Image>
				<ul className="flex items-center gap-2">
					{content.links.map((e, i) => {
						if (i === 0) {
							return (
								<li key={i}>
									<Button
										onClick={() => handleSubmit(e.title)}
										className="font-semibold  rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] lg:px-5 lg:text-base px-2 h-8 text-xs"
									>
										{e.title}
									</Button>
								</li>
							);
						}
						return (
							<li key={i}>
								<Button
									className="font-semibold  rounded-full bg-[#05686E] text-background lg:px-5 lg:text-base px-2 h-8 text-xs"
									onClick={() => handleSubmit(e.title)}
								>
									{e.title}
								</Button>
							</li>
						);
					})}
				</ul>
			</div>
			<main className="lg:px-[35px] lg:pl-24  px-3">
				<Modal
					size="lg"
					className="lg:min-w-[600px] min-h-[624px] md:min-w-[800px] lg:h-auto h-3/4 mx-3 lg:mx-0 lg:bottom-0 bottom-1/2 lg:-translate-y-0 translate-y-1/2"
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					classNames={{
						closeButton: "top-3.5 right-3.5",
					}}
				>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader
									className={`flex flex-col gap-1 line-clamp-1 ${nunito.className}`}
								>
									{modalfiledetails.name.slice(0, 20)}
									{modalfiledetails.name.length > 20 ? "..." : ""}
								</ModalHeader>
								<ModalBody className="p-0 flex flex-col justify-between relative h-[400px] gap-0">
									<input
										type="file"
										ref={fileRefSwap}
										accept=".pdf"
										onChange={(event) => {
											if (window.FileReader) {
												setFiles([
													...files.filter((e) => e !== modalfiledetails),
													event.target.files[0],
												]);
											}
											onClose();
										}}
										className="hidden"
									/>
									{modalfiledetails.type === "application/pdf" ? (
										<div className="w-full flex-1">
											<iframe
												src={modalfile}
												className={`w-full h-full  border-2 lg:border-none transition-all ${
													filePickAction ? "lg:h-[400px] " : "lg:h-[600px] "
												}`}
											></iframe>
										</div>
									) : (
										<div className="flex-1">
											<iframe
												src={modalfile}
												className={`w-full h-full border-2 lg:border-none ${
													filePickAction ? "lg:h-[400px] " : "lg:h-[600px]"
												}`}
											></iframe>
										</div>
									)}
									{filePickAction ? (
										<div
											style={{ fontFamily: "Nunito, sans-serif" }}
											className="w-full bg-[#d1d5da] relative p-5 lg:h-[200px] h-[130px] font-bold flex items-center justify-center"
										>
											<div className="pr-5 border-r-2 border-[#e8713c]">
												<button
													onClick={() => {
														fileRefSwap.current.click();
													}}
													className="rounded-lg flex-row items-center justify-center  gap-2 bg-[#05686E] flex lg:py-3 py-2 text-background lg:px-5 px-2"
												>
													<Computer />
													<p className="lg:text-base text-xs">
														Pick From Local
													</p>
												</button>
											</div>
											<div className="pl-5">
												<Image
													src={
														"https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
													}
													width={30}
													height={30}
													alt=""
													onClick={() => {
														console.log(files);
														files.map((e) =>
															console.log(e?.id !== modalfiledetails?.id)
														);
														console.log(
															files.filter(
																(e) => e?.id !== modalfiledetails?.id
															)
														);
														setFiles(
															files.filter(
																(e) => e?.id !== modalfiledetails?.id
															)
														);

														onClose();
														setFilePickAction(false);
														setTimeout(() => {
															googleDriveRef.current.click();
														}, 1000);
														// onClose();
													}}
													className="m-2.5"
												></Image>
											</div>
											<button
												onClick={() => setFilePickAction(false)}
												className="py-2  flex gap-2 absolute lg:top-2 lg:left-5 top-1 left-3"
											>
												<div className="flex gap-2  hover:border-b  border-black pb-1">
													<Undo2 size={18} className="" />
													<p className="lg:text-base text-sm">Back</p>
												</div>
											</button>
										</div>
									) : (
										<div className="h-[80px] w-full flex items-center gap-3 justify-end px-5">
											<Button
												color="danger"
												variant="light"
												onPress={onClose}
												className={`${nunito.className} font-semibold`}
											>
												Close
											</Button>
											<Button
											
												// onPress={() => {
												// 	fileRefSwap.current.click();
												// }}
												onClick={() => setFilePickAction(!filePickAction)}
												className={`${nunito.className} font-semibold bg-[#05686E] text-white`}
											>
												Change
											</Button>
										</div>
									)}
								</ModalBody>
							</>
						)}
					</ModalContent>
				</Modal>
				<div>
					<div className="lg:grid flex items-stretch grid-cols-3 gap-2 lg:py-10 pb-5">
						{actionLink.map((e, i) => {
							return (
								<div
									key={i}
									onClick={() => {
										setAction(e.action);
									}}
									className={`${
										actions && actions == e.action
											? "bg-[#3db1b7] text-gray-100 border-[#05686E] shadow-lg"
											: "text-gray-600"
									} flex lg:flex-row  flex-col w-full h-[118px] items-center lg:px-10 lg:p-3 py-3 px-1 md:gap-5 gap-2 lg:aspect-[2/.5] border rounded-lg cursor-pointer hover:bg-[#3db1b7] hover:text-gray-100 hover:border-[#05686E] hover:shadow-lg`}
								>
									{e.icon}

									<div className="">
										<h1 className="font-bold md:text-xl text-sm lg:text-left text-center">
											{e.title}
										</h1>
										<p className="text-sm lg:text-left text-center">
											{e?.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
					<div className="w-full border lg:p-10 p-6 rounded-lg">
						<div className="flex relative flex-wrap gap-5 lg:justify-between justify-start items-start pb-5 border-b">
							<div className="">
								<input
									type="file"
									accept=".pdf"
									className="hidden"
									onChange={handleFileChange}
									ref={fileRef}
								/>
								<Button
									// size="sm"
									onClick={() => fileRef.current.click()}
									className="font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] lg:h-11 h-9 lg:px-5 px-3"
								>
									Choose File From Local
								</Button>
								<p className="text-sm font-semibold mt-1 text-gray-700">
									Supported formats : .pdf
								</p>
							</div>
							<div className="flex absolute right-0 lg:relative items-stretch lg:gap-3 gap-2">
								<GoogleDrivePicker
									setFiles={setFiles}
									files={files}
									setSnackbarOpen={setSnackbarOpen}
									setSnackbarMsg={setSnackbarMsg}
									googleDriveRef={googleDriveRef}
									setPreview={setPreview}
									preview={preview}
								/>
							</div>
						</div>
						<div className="lg:py-10 pt-10 pb-5">
							<div>
								{files.length > 0 ? (
									<div className="flex gap-5 w-full flex-wrap">
										{files.map((e, i) => {
											if (e.type) {
												return (
													<div
														className="relative w-[299px]  aspect-[1/1.1]"
														key={i}
													>
														<Trash2
															onClick={() => handleRemoveFile(e, i)}
															className="z-[20] absolute m-5 top-0 right-0 text-background hover:cursor-pointer"
														/>
														{preview[i] && (
															<Image
																key={i}
																src={preview[i]}
																width={300}
																height={400}
																alt=""
																className="w-full relative z-20 h-full object-cover"
															/>
														)}
														<div
															// onClick={() => {
															//   const file = e;

															//   if (file) {
															//     const fileReader = new FileReader();

															//     if (!file?.downloadUrl) {
															//       fileReader.onload = (e) => {
															//         const dataUrl = e.target.result;
															//         console.log(dataUrl);
															//         // Set the source of the iframe to the data URL
															//         // iframeRef.current.src = dataUrl;
															//         console.log(file.type);
															//         setModalFiledetails(file);
															//         setModalFile(dataUrl);
															//         onOpen();
															//         // console.log(modalfile);
															//       };

															//       // Read the contents of the file as a data URL
															//       fileReader.readAsDataURL(file.url);
															//     }
															//   }
															// }}
															className="absolute cursor-pointer flex-col gap-2 p-5 bg-[#05686E] w-full h-full text-background font-bold text-xl top-0 flex items-center justify-center"
														>
															<h1 className="text-center  text-sm w-4/5 line-clamp-2">
																{e.name}
															</h1>
															<Button
																className="bg-[#E8713C] lg:inline hidden px-5 text-background"
																onClick={() => {
																	setFilePickAction(false);
																	const file = e;
																	console.log("click 1");
																	if (file) {
																		const fileReader = new FileReader();
																		console.log("click 2");

																		if (!file?.url) {
																			console.log("click 3");
																			fileReader.onload = (e) => {
																				const dataUrl = e.target.result;

																				// Set the source of the iframe to the data URL
																				// iframeRef.current.src = dataUrl;
																				console.log(file.type);
																				setModalFiledetails(file);
																				setModalFile(dataUrl);
																				onOpen();
																				// console.log(modalfile);
																			};

																			// Read the contents of the file as a data URL
																			fileReader.readAsDataURL(file);
																		} else {
																			console.log("click 4");
																			setModalFiledetails(file);
																			setModalFile(file.url);
																			onOpen();
																			// fileReader.onload = (e) => {
																			// 	const dataUrl = e.target.result;
																			// 	console.log(dataUrl);
																			// 	// Set the source of the iframe to the data URL
																			// 	// iframeRef.current.src = dataUrl;
																			// 	console.log(file.type);

																			// 	setModalFile(dataUrl);
																			// 	onOpen();
																			// 	// console.log(modalfile);
																			// };

																			// // Read the contents of the file as a data URL
																			// fileReader.readAsDataURL(file);
																		}
																	}
																}}
															>
																Click to Preview
															</Button>
														</div>
													</div>
												);
											}
											if (e.URL) {
												return (
													<div
														className="relative w-[299px]  aspect-[1/1.1]"
														key={i}
													>
														<Trash2
															onClick={() => {
																if(isInstance){
																	setIsInstance(false);
																}
																handleRemoveFile(e, i)
															}}
															className=" z-[20] absolute m-5 top-0 right-0 text-white hover:cursor-pointer"
														/>
														<div
															className="absolute  flex-col gap-2 p-5 bg-[#05686E] w-full h-full text-background font-bold text-xl top-0 flex items-center justify-center"
															onClick={() => {
																setModalFiledetails(e);
																setModalFile(e?.URL);
																onOpen();
															}}
														>
															<h1 className="text-center text-sm w-4/5 line-clamp-2">
																{e.name}
															</h1>
															<Button
																className="bg-[#E8713C] lg:inline hidden px-5 text-background"
																onClick={() => {
																	setModalFiledetails(e);
																	setModalFile(e?.URL);
																	onOpen();
																}}
															>
																Click to Preview
															</Button>
														</div>
													</div>
												);
											}
										})}
										{!isInstance&&(
										<div
											onClick={() => fileRef.current.click()}
											className="w-[299px] border flex lg:flex-col py-3 px-5 flex-row gap-2 items-center justify-start lg:justify-center lg:aspect-[1/1.1]  cursor-pointer"
										>
											<UploadCloud
												size={25}
												className="lg:w-[60px] lg:h-[60px]"
											/>
											<h1 className="font-semibold lg:text-lg">
												Choose File From Local
											</h1>
										</div>
										)}
									</div>
								) : (
									<div
										onClick={() => fileRef.current.click()}
										className="flex gap-2 text-gray-500 cursor-pointer flex-col items-center"
									>
										<UploadCloud size={60} />
										<h1 className="font-semibold">Drop File Here</h1>
									</div>
								)}
							</div>
						</div>
						{/* <div className=" pt-0">
							<div className="flex items-center justify-end">
								<Button
									disabled={mergeLoading}
									onClick={handleMerge}
									className="rounded-full bg-transparent border text-[#05686E] font-semibold border-[#05686E] hover:bg-[#05686E] hover:text-white"
								>
									Merge PDFs
								</Button>
							</div>
						</div> */}
					</div>
				</div>
				{/* <div className="mt-10  border rounded-lg">
					<div className="p-5 lg:px-10 border-b bg-[#e3feff]">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 relative -left-2">
								<FileBadge className="lg:w-[38px] w-[20px] " />
								<h1 className="lg:text-xl font-bold">Stamp Settings</h1>
							</div>
						</div>
					</div>
					<div className="p-5 lg:px-10">
						<div className="flex flex-col gap-2">
							<Switch
								isSelected={isStampRequired}
								onValueChange={setStampRequired}
								classNames={{
									base: cn(
										"inline-flex flex-row-reverse w-full max-w-md bg-content1 items-center",
										"justify-between cursor-pointer rounded-lg gap-2 border-2 border-transparent"
									),
									wrapper: "p-0 h-4 overflow-visible",
									thumb: cn(
										"w-6 h-6 border-2 shadow-lg",

										//selected
										"group-data-[selected=true]:ml-6",
										// pressed
										"group-data-[pressed=true]:w-7",
										"group-data-[selected]:group-data-[pressed]:ml-4"
									),
								}}
							>
								<div className="flex flex-col gap-1">
									<p className="text-medium">
										Is stamp required for this agreement ?
									</p>
								</div>
							</Switch>
							{isStampRequired && (
								<>
									<Switch
										isSelected={isSelectedStamp}
										onValueChange={setIsSelectedStamp}
										classNames={{
											base: cn(
												"inline-flex flex-row-reverse w-full max-w-md bg-content1 items-center",
												"justify-between cursor-pointer rounded-lg gap-2 border-2 border-transparent"
											),
											wrapper: "p-0 h-4 overflow-visible",
											thumb: cn(
												"w-6 h-6 border-2 shadow-lg",

												//selected
												"group-data-[selected=true]:ml-6",
												// pressed
												"group-data-[pressed=true]:w-7",
												"group-data-[selected]:group-data-[pressed]:ml-4"
											),
										}}
									>
										<div className="flex flex-col gap-1">
											<p className="text-medium">
												Have you already purchased stamp ?
											</p>
										</div>
									</Switch>
									{isSelectedStamp ? (
										<div className="">
											<label htmlFor="">Upload Stamp *</label>
											<div className="relative border w-fit mt-2">
												<input
													onChange={handleFileStampChange}
													type="file"
													className="border opacity-0 relative z-30 cursor-pointer lg:w-[500px] py-1 pl-8 px-3 min-h-[47px]"
												/>
												<File
													size={18}
													className="absolute top-0 min-h-[47px] mx-3"
												/>
												<p className="min-h-[47px] top-0 flex items-center absolute left-10">
													{stampFile?.name
														? stampFile.name
														: "Choose purchased stamp file"}
												</p>
											</div>
										</div>
									) : (
										<div className="flex flex-col">
											<label htmlFor="">Stamp Amount to be purchased *</label>
											<div className="relative">
												<input
													onChange={(e) => {
														if (e.target.value === "0") {
															setStampAmount("");
														}
														setStampAmount(e.target.value.replace(/\D/g, ""));
													}}
													type="text"
													placeholder="0"
													value={stampAmount}
													className="border lg:w-[500px] py-1 pl-8 px-3 mt-2 min-h-[47px]"
												/>
												<IndianRupee
													size={16}
													className="absolute top-0 mt-2 min-h-[47px] mx-3"
												/>
											</div>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div> */}
				<div className="mt-10  border rounded-lg">
					<div className="p-5 lg:px-10 border-b bg-[#e3feff]">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 ">
								<Users2 className="lg:w-[38px] w-[20px]" />
								<h1 className="lg:text-xl font-bold">Signers & CCs</h1>
							</div>
							<div className="flex gap-2">
								<Popover placement="bottom-start">
									<PopoverTrigger>
										<div className="flex justify-between border border-gray-500 px-3 items-center gap-5 min-w-[150px] bg-white hover:cursor-pointer">
											<div className="flex flex-col">
												<p className="text-[11px]">Signing Method</p>
												<p className="text-[14px] capitalize flex gap-2 items-center">
													{signMethod.icon} {signMethod.title}
												</p>
											</div>
											<ChevronDownIcon size={18} />
										</div>
									</PopoverTrigger>
									<PopoverContent
										className={`rounded-none ${nunito.className} bg-white text-foreground p-0`}
									>
										<ul className="p-2">
											{signingMethods.map((ele, index) => {
												return (
													<li
														key={index}
														className="flex px-2 py-2 gap-1 cursor-pointer hover:bg-gray-300 items-center w-[140px] capitalize"
														onClick={() => setSignMethod(ele)}
														style={{
															backgroundColor:
																signMethod.title === ele.title
																	? "rgb(209,213,219)"
																	: "white",
														}}
													>
														{ele.icon} {`Using ${ele.title}`}
													</li>
												);
											})}
										</ul>
									</PopoverContent>
								</Popover>
								<div className="hidden lg:flex items-center lg:gap-2 gap-1">
									<input
										type="checkbox"
										checked={signingOrderActive}
										onChange={(event) =>
											setSigningOrderActive(event.target.checked)
										}
										className="lg:w-4 aspect-square"
									/>
									<h3 className="font-bold lg:text-base text-sm ">
										Signing Order
									</h3>
								</div>
								<button className="hidden lg:block border border-gray-500 px-3 bg-white h-[56px]">
									EN
								</button>
							</div>
						</div>
					</div>
					<div className="p-5 lg:px-10">
						{signers.map((e, i) => {
							return (
								<div
									key={i}
									onTouchStart={() => (dragSigner.current = i)}
									onTouchEnd={() => (draggedOverSigner.current = i)}
									onTouchCancel={handleDrag}
									draggable={signingOrderActive}
									onDragStart={() => {
										dragSigner.current = i;
									}}
									onDragEnter={() => {
										draggedOverSigner.current = i;
									}}
									onDragEnd={handleDrag}
									onDragOver={(eve) => eve.preventDefault()}
									className={`py-5 pb-8 ${isInstance?'':'border-b'} flex lg:items-stretch md:items-stretch items-start flex-wrap justify-between gap-5`}
								>
									<div className="flex flex-wrap lg:flex-row flex-col items-stretch gap-5">
										{signingOrderActive && (
											<div className="flex gap-5 items-center">
												<div className="flex items-center ">
													<GripVertical />
												</div>
												<div className="w-12 aspect-square flex items-center justify-center font-bold bg-gray-300">
													{i + 1}
												</div>
											</div>
										)}
										<div className="flex flex-col gap-5">
											<div className="flex items-stretch min-w-[294px]">
												<div className="bg-gray-300 flex w-[47px] h-[56px] items-center justify-center">
													<User className="" size={16} />
												</div>
												<TextField
													onChange={(event) => {
														const updatedSigners = [...signers];
														updatedSigners[i].fullname = event.target.value;
														setSigners(updatedSigners);
													}}
													value={signers[i].fullname}
													type="text"
													disabled={isInstance}
													error={signers[i].nameError}
													helperText={signers[i].nameHelperText}
													className="border  w-full h-[47px]"
													placeholder={`${
														e.signerRole ? e.signerRole : "Signer"
													}'s Name`}
													sx={{
														"& .MuiInputBase-root": {
															borderRadius: 0,
														},
													}}
												/>
											</div>
											{signMethod.title === "aadhaar" &&
												signers[i].signerRole === "Signer" && (
													<div className="relative">
														<div className="flex items-stretch min-w-[294px]">
															<div className="bg-gray-300 flex w-[47px] h-[56px] items-center justify-center">
																<Fingerprint className="" size={16} />
															</div>
															<TextField
																onChange={(event) => {
																	const updatedSigners = [...signers];
																	updatedSigners[i].aadhaarNo =
																		event.target.value;
																	setSigners(updatedSigners);
																}}
																// disabled={isInstance}
																value={signers[i].aadhaarNo}
																inputProps={{ maxLength: 12 }}
																error={signers[i].aadhaarError}
																helperText={signers[i].aadhaarHelperText}
																className={`border ${
																	errorMail ? "border-red-600" : ""
																}  w-full min-h-[47px]`}
																placeholder={"Signers's Aadhaar Number"}
																sx={{
																	"& .MuiInputBase-root": {
																		borderRadius: 0,
																	},
																}}
															/>
														</div>
														<span className="absolute top-[27%] -right-10">
															<Tooltip
																placement="top"
																size="md"
																className={`w-[250px] bg-[#e3feff] p-3 ${nunito.className}`}
																content="We are using SHA-256 for encryption"
															>
																<HelpCircle />
															</Tooltip>
														</span>
													</div>
												)}
										</div>
										<div className="flex items-stretch min-w-[294px]">
											<div className="bg-gray-300 flex w-[47px] h-[56px] items-center justify-center">
												<Mail className="" size={16} />
											</div>
											<TextField
												onChange={(event) => {
													const updatedSigners = [...signers];
													updatedSigners[i].signersEmail = event.target.value;
													setSigners(updatedSigners);
												}}
												value={signers[i].signersEmail}
												type="email"
												disabled={isInstance}
												error={signers[i].emailError}
												helperText={signers[i].emailHelperText}
												className={`border ${
													errorMail ? "border-red-600" : ""
												}  w-full min-h-[47px]`}
												placeholder={`${
													e.signerRole ? e.signerRole : "Signer"
												}'s Email`}
												sx={{
													"& .MuiInputBase-root": {
														borderRadius: 0,
													},
												}}
											/>
										</div>
										<Popover placement="bottom-start">
											<PopoverTrigger>
												<button className="flex gap-5 h-[56px] bg-[#e3feff] min-w-[150px] justify-between items-center border px-3 border-gray-500">
													<div className="flex gap-1 items-center lg:py-0 py-1">
														{getSignerRoleIcon(signers[i].signerRole)}{" "}
														{signers[i].signerRole
															? signers[i].signerRole
															: "Signer"}
													</div>
													<ChevronDownIcon size={18} />
												</button>
											</PopoverTrigger>
											<PopoverContent
												className={`rounded-none ${nunito.className} bg-white text-foreground p-0`}
											>
												<ul className="p-2">
													{signerRoles.map((e, index) => {
														return (
															<li
																onClick={() => {
																	const clone = [...signers];
																	// clone[i].signerIcon = e.icon;
																	clone[i].signerRole = e.title;
																	setSigners(clone);
																}}
																key={index}
																className="flex px-2 py-2 gap-1 cursor-pointer hover:bg-gray-300 items-center w-[140px]"
															>
																{e.icon} {e.title}
															</li>
														);
													})}
												</ul>
											</PopoverContent>
										</Popover>
									</div>
									{!isInstance&&(
									<div className="w-full lg:w-auto lg:justify-start right-0 flex gap-3 justify-end">
										<button
											className="border px-3 bg-[#e3feff] h-[56px]"
											onClick={() => {
												if (signers.length === 1) {
													return;
												}
												setSigners([
													...signers.slice(0, i),
													...signers.slice(i + 1),
												]);
											}}
										>
											<Trash2 />
										</button>
									</div>
									)}
								</div>
							);
						})}
					</div>
					{!isInstance&&(
					<div className="p-5 pt-0 lg:px-10">
						<div className="flex items-center justify-between">
							<Button
								onClick={() => {
									// const validEmail = ValidateEmail(
									// 	signers[signers.length - 1].signersEmail
									// );
									// if (!validEmail) {
									// 	setSnackbarOpen(true);
									// 	setSnackbarMsg("Email is Invalid.");
									// 	setErrormail(true);
									// 	return;
									// }
									// setErrormail(false);
									setSigners([
										...signers,
										{
											fullname: "",
											signersEmail: "",
											signerRole: "Signer",
											lang: "",
											emailError: false,
											emailHelperText: "",
											nameError: false,
											nameHelperText: "",
											aadhaarNo: "",
											aadhaarError: false,
											aadhaarHelperText: "",
										},
									]);
								}}
								className="rounded-full lg:px-10 bg-transparent border text-[#05686E] font-semibold border-[#05686E] hover:bg-[#05686E] hover:text-white"
							>
								Add Signer or CC
							</Button>
							<div className="flex items-center lg:gap-3 gap-1">
								<input
									// defaultChecked={true}
									type="checkbox"
									className="lg:w-4 aspect-square"
									checked={isContactSave}
									onChange={(e) => {
										setIsContactSave(e.target.checked);
									}}
								/>
								<h1 className="font-bold text-sm lg:text-base">
									Save Contacts
								</h1>
							</div>
						</div>
					</div>
					)}
				</div>
				<div className="mt-10 border rounded-lg">
					<div className="p-5 lg:px-10 border-b bg-[#e3feff]">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<File className="lg:w-[38px] w-[20px]" />
								<h1 className="lg:text-xl font-bold">Title & Message</h1>
							</div>
						</div>
					</div>
					<div className="flex lg:flex-row flex-col">
						<div className="flex-1">
							<div className="p-5 lg:px-10 border-b flex flex-col">
								<label htmlFor="doctitle">Email Subject</label>
								<input
									onChange={(event) => {
										setdocumentDetail({
											...documentDetail,
											title: event.target.value,
										});
									}}
									maxLength={80}
									value={documentDetail.title}
									type="text"
									placeholder="Email Subject Text"
									className="border lg:w-[500px] py-1 px-3 mt-2 min-h-[47px]"
								/>
							</div>
							<div className="p-5 lg:px-10  flex flex-col">
								<label htmlFor="doctitle">Body Message</label>
								<textarea
									onChange={(event) => {
										setdocumentDetail({
											...documentDetail,
											message: event.target.value,
										});
									}}
									// onKeyDown={handleKeyDown}
									value={documentDetail.message}
									placeholder="Email Body Message"
									className="border lg:w-[500px] aspect-[2/.6] lg:aspect-video py-1 px-3 mt-2"
								/>
							</div>
						</div>
						<div className="flex-1 group relative border-l border-t">
							<div className="absolute opacity-0 z-10 top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2">
								<button className="py-2 px-5 bg-[#056a70ff] text-background rounded-lg">
									See Preview
								</button>
							</div>
							<div className=" ">
								<h1 className="py-5 lg:px-10 px-5 border-b text-lg font-bold">
									{documentDetail.title
										? documentDetail.title
										: "Email Subject"}
								</h1>
								<div className="">
									<div className="py-5 lg:px-10 px-5">
										<p className="opacity-60">{`Hi <Signer's Name>`}</p>

										<div className="mt-3 flex flex-col gap-1">
											{documentDetail &&
												documentDetail.message.split("\n").map((e, i) => {
													return (
														<p key={i} className="opacity-60">
															{e}
														</p>
													);
												})}
										</div>

										<Tooltip
											placement="right"
											content="This will enabled in email"
											classNames={{
												base: [
													// arrow color
													"before:bg-neutral-400 dark:before:bg-white",
												],
												content: [
													"py-2 px-4 shadow-md",
													"text-background bg-[#056a70ff]",
												],
											}}
										>
											<button
												disabled
												className="bg-blue-500 opacity-70 py-2 px-6 rounded-md text-background mt-3"
											>
												Sign Documents
											</button>
										</Tooltip>
										<p className="mt-3 opacity-60">
											If you have any questions or need assistance, feel free to
											reach out to sender.
										</p>
										<h3 className="mt-3 font-bold text-xl mb-5">
											Thanks & Regards, <br />
											{profileDetails && profileDetails.fullname}
											{/* <span className="text-[#056a70ff]">.</span> */}
										</h3>
										{clientEmail ? (
											<div className="relative">
												<Image
													className="my-5"
													src={
														typeof clientEmail === "string"
															? clientEmail
															: URL.createObjectURL(clientEmail)
													}
													width={50}
													height={50}
												></Image>
												<span>
													<Trash2
														className="absolute top-0 left-[46px] text-black hover:cursor-pointer"
														size={12}
														onClick={() => handleRemoveLogo()}
													/>
												</span>
											</div>
										) : (
											<div className="flex">
												<input
													type="file"
													ref={clientLogoForm}
													onChange={(event) => {
														console.log(event.target.files[0]);
														if (window.FileReader && event.target.files[0]) {
															const file = new FileReader();
															if (
																event.target.files[0] &&
																event.target.files[0].type.match("image.*")
															) {
																file.onload = function () {
																	setClientEmail(event.target.files[0]);
																};
																file.readAsDataURL(event.target.files[0]);
															}
														}
													}}
													accept=".jpeg,.png"
													className="hidden"
												/>
												<div
													onClick={() => clientLogoForm.current.click()}
													className="w-[50px] aspect-square border-2 flex items-center justify-center"
												>
													<Plus className="hover:cursor-pointer" />
												</div>
											</div>
										)}
									</div>
									<div className="border-t flex flex-col items-end bg-gray-100 py-8 lg:px-10 px-5 ">
										<Image
											src={"/images/Colibri.png"}
											width={50}
											height={50}
										></Image>
										<h4 className="font-bold text-[#056a70ff] mt-3">
											Powered By EaseDraft
										</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-10 border rounded-lg">
					<div className="p-5 lg:px-10 border-b bg-[#e3feff]">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Settings className="lg:w-[25px] w-[20px]" />
								<h1 className="lg:text-xl font-bold">Document Settings</h1>
							</div>
						</div>
					</div>
					<div className="p-5 lg:px-10 border-b flex flex-col gap-2 ">
						<div className="flex items-start flex-row-reverse lg:justify-end justify-between gap-2">
							<Tooltip
								placement="top"
								size="md"
								className={`w-[250px] bg-[#e3feff] p-3 ${nunito.className}`}
								content="Enable automatic reminder emails for this document. Reminder schedules can be adjusted in Business Settings > Expiration & Reminders"
							>
								<HelpCircle />
							</Tooltip>
							<label htmlFor="doctitle" className="lg:w-auto w-4/5">
								Enable auto reminders{" "}
							</label>
							<input
								type="checkbox"
								onChange={(event) =>
									setdocumnetSettings({
										...documentSettings,
										autoReminder: event.target.checked,
									})
								}
								checked={documentSettings.autoReminder}
								className="w-4 aspect-square relative top-1"
							/>
						</div>
						<div className="flex items-start flex-row-reverse lg:justify-end justify-between gap-2">
							<Tooltip
								placement="top"
								size="md"
								className={`w-[250px] bg-[#e3feff] p-3 ${nunito.className}`}
								content="If this option is enabled, all signer must sign this document in order to complete it. If at least one signer declines to sign, this document will be cancelled."
							>
								<HelpCircle />
							</Tooltip>
							<label htmlFor="doctitle" className="lg:w-auto w-4/5">
								Require all signers to sign to complete document{" "}
							</label>
							<input
								type="checkbox"
								onChange={(event) =>
									setdocumnetSettings({
										...documentSettings,
										requiredAllSigners: event.target.checked,
									})
								}
								checked={true}
								disabled={true}
								className="w-4 aspect-square relative top-1"
							/>
						</div>
					</div>
					<div className="p-5 lg:px-10 border-b flex justify-between lg:justify-start items-center gap-5">
						<label htmlFor="doctitle">Expire Document After</label>
						<select
							name=""
							id=""
							onChange={(event) =>
								setdocumnetSettings({
									...documentSettings,
									expires: event.target.value,
								})
							}
							value={documentSettings.expires}
							className="w-fit border py-2 px-4 bg-[#e3feff]"
							defaultValue={"1d"}
						>
							<option value="1d">1 Day</option>
							<option value="3d">3 Day</option>
							<option value="7d">7 Day</option>
							{/* <option value="2w">2 Weeks</option>
							<option value="1m">1 Month</option>
							<option value="3m">3 Months</option> */}
						</select>
					</div>
				</div>
				<div className="lg:my-10 my-5 flex justify-end lg:gap-3 gap-2">
					<Button
						onClick={() => handleSubmit("Save Draft")}
						size="sm"
						className="font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] lg:px-5 px-4"
					>
						Save Draft
					</Button>
					{isInstance?(
						<Button
						onClick={() => handleSubmit("Send")}
						size="sm"
						className="font-semibold rounded-full bg-[#05686E] text-background lg:px-5 px-4"
					>
						Send
						</Button>
					)
					:(
						<>
					<Button
						onClick={() => handleSubmit("Prepare")}
						size="sm"
						className="font-semibold rounded-full bg-[#05686E] text-background lg:px-5 px-4"
					>
						Prepare
					</Button>
					<Button
						onClick={() => handleSubmit("Quick Send")}
						size="sm"
						className="font-semibold rounded-full bg-[#05686E] text-background lg:px-5 px-4"
					>
						Quick Send
					</Button>
					</>
					)}
				</div>
			</main>
		</>
	);
}

export default NewDocumentPage;
