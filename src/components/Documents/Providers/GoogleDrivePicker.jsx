import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Tooltip,
} from "@nextui-org/react";
import { Nunito } from "next/font/google";
import useDrivePicker from "react-google-drive-picker";

const nunito = Nunito({ subsets: ["latin"] });

function GoogleDrivePicker({
	setFiles,
	files,
	setPreview,
	preview,
	googleDriveRef,
	setSnackbarOpen,
	setSnackbarMsg,
}) {
	const [openPicker, authResponse] = useDrivePicker();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const handleOpen = (size) => {
		onOpen();
	};
	const handleOpenPicker = () => {
		openPicker({
			clientId:
				"1018497844427-ie0jj0ff881630tdc3bo4df69sh7lc7n.apps.googleusercontent.com",
			developerKey: "AIzaSyAj85p7IzEWVjTMSeZ2hiaRFn6XUE-gXMk",

			viewMimeTypes: "application/pdf",
			showUploadFolders: true,
			showUploadView: true,
			supportDrives: true,

			// multiselect : true
			callbackFunction: (data) => {
				if (data.action === "cancel") {
					console.log("User clicked cancel/close button");
				}

				if (
					data &&
					data.docs &&
					data.docs.length > 0 &&
					data.docs.length === 1
				) {
					data.docs.map(async (e) => {
						const cloneFiles = [...files];
						const clonePreview = [...preview];

						const selectedDoc = e;

						const doc = {
							id: selectedDoc.id,
							name: selectedDoc.name,
							url: selectedDoc.embedUrl,
							type: selectedDoc.mimeType,
							// downloadUrl: selectedDoc.downloadUrl,
						};
						if (files && files.length > 0) {
							setSnackbarOpen(true);
							setSnackbarMsg("You can't select more than one document");
						} else {
							setFiles([...files, doc]);
							setPreview([...preview, null]);
						}
					});
				}
			},
		});
	};

	return (
		<>
			<div className="border-x opacity-60 sm:border-none sm:border-r sm:bg-[#eff2f7] sm:rounded-full border-[#e8713c] sm:mx-3  px-1.5 sm:px-0">
				<Tooltip color="success" content={"Coming Soon"} placement="bottom">
					<div
						//   onClick={handleOpenPicker}
						className="rounded-full cursor-pointer"
						ref={googleDriveRef}
					>
						<Image
							src={
								"https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
							}
							width={30}
							height={30}
							alt=""
							className="sm:m-1.5 rounded-full  m-1"
						></Image>
					</div>
				</Tooltip>
			</div>
			<Modal size={"3xl"} isOpen={isOpen} onClose={onClose}>
				<ModalContent className={nunito.className}>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Google Drive Picker
							</ModalHeader>
							<ModalBody>
								<div className="p-5 mb-5 aspect-video border"></div>
							</ModalBody>
							{/* <ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</ModalFooter> */}
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default GoogleDrivePicker;
