import {
	Button,
	Card,
	CardBody,
	Divider,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tab,
	Tabs,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GestureIcon from "@mui/icons-material/Gesture";
import dynamic from "next/dynamic";
import { createUserSignature } from "@/Apis/legalAgreement";
const AddSignFromText = dynamic(() =>
	import("../Agreement/Sign/AddSignFromText")
);
const AddSignFromImage = dynamic(() =>
	import("../Agreement/Sign/AddSignFromImage")
);
const AddSignFromDraw = dynamic(() =>
	import("../Agreement/Sign/AddSignFromDraw")
);

const SignModal = ({
	onClose,
	field,
	fullname,
	image,
	setImage,
	fromDashboard,
	setUpdate,
}) => {
	const [selectedFieldItem, setSelectedFieldItem] = useState({
		field: field,
		signee: {
			fullname: fullname,
		},
	});
	const onSign = (bigImage, signAll, width) => {
		// console.log("SIGN", selectedSignee);
		const img = new Image();
		img.onload = async function () {
			const canvas2 = document.createElement("canvas");
			canvas2.setAttribute("width", width ? width : 250);
			canvas2.setAttribute("height", 51);
			const ctx2 = canvas2.getContext("2d");
			ctx2.drawImage(img, 0, 0, width ? width : 250, 51); // Or at whatever offset you like
			const dataUrl2 = canvas2.toDataURL();
			await fetch(dataUrl2)
				.then((response) => response.blob())
				.then(async (blob) => {
					const image = new File([blob], "sample.png", { type: blob.type });
					// console.log(file)
					let res;
					if (field === "Signature") {
						res = await createUserSignature(image, null);
					} else {
						res = await createUserSignature(null, image);
					}
					if (res?._id) {
						setUpdate((prev) => !prev);
					}
					onClose();
				});
		};
		if (typeof bigImage !== "string") {
			img.src = URL.createObjectURL(bigImage);
		}
		if (typeof bigImage === "string") {
			onClose();
		}
	};
	return (
		<ModalContent>
			{(onClose) => (
				<>
					<div className="__variable_598ead font-sans">
						<ModalHeader className="flex flex-col gap-1 text-[#05686E] text-[20px]">
							Add {field}
						</ModalHeader>
						<ModalBody>
							<div className="flex w-full flex-col">
								<Tabs
									// aria-label="Dynamic tabs"
									classNames={{
										tabList: "w-full",
										cursor: "w-full bg-[#05686E]",
										//   tab: "w-full",
										tabContent: "group-data-[selected=true]:text-[#FFFFFF]",
									}}
									// items={tabs}
								>
									<Tab
										title={
											<>
												<TextFieldsIcon className="pe-1" />
												Type {field}
											</>
										}
									>
										<AddSignFromText
											onSign={onSign}
											field={field}
											selectedFieldItem={selectedFieldItem}
											setImage={setImage}
											fromDashboard={fromDashboard}
										/>
									</Tab>
									<Tab
										title={
											<>
												<FileUploadIcon className="pe-1" />
												Upload {field}
											</>
										}
									>
										<AddSignFromImage
											onSign={onSign}
											field={field}
											setImage={setImage}
											fromDashboard={fromDashboard}
										/>
									</Tab>
									<Tab
										title={
											<>
												<GestureIcon className="pe-1" />
												Draw {field}
											</>
										}
									>
										<AddSignFromDraw
											field={field}
											onSign={onSign}
											setImage={setImage}
											fromDashboard={fromDashboard}
										/>
									</Tab>
								</Tabs>
							</div>
						</ModalBody>
					</div>
				</>
			)}
		</ModalContent>
	);
};

export default SignModal;
