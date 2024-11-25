import { TextField } from "@mui/material";
import {
	Button,
	Input,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Radio,
	RadioGroup,
	Select,
	SelectItem,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { handleCreate } from "../CustomTreeView/ActionsHelpers";
import { PageOrientationDropdown } from "../SideTabContents/Pagesetup";
const pagesetupOptions = [
	"Letter", "A4", "Legal"
];
function AddFolder({ onClose, refreshParent, currentNode, refreshFolder, refreshRoot }) {
	// console.log(currentNode)
	const [pageOreintation, setPageOreintation] = useState("portrait");
	const [templateType, setTemplateType] = useState("document");
	const [opt, setOpt] = useState(new Set(["Folder"]));
	const [folderName, setFolderName] = useState('');
	const [pageOption, setPageOption] = useState("A4")
	const [pageSize, setPageSize] = useState({
		height: "1080px",
		width: "768px",
	});
	const handleOptionChange = (e)=>{
		if(e.size>0){
			setOpt(e);
		}
	}
	console.log(opt?.anchorKey)
	const handlePageSize = (value) => {
		console.log(value)
		if (value === "Legal") {
			setPageSize({
				height: "1346px",
				width: "816px",
			},
			)
		}
		if (value === "Letter") {
			setPageSize({
				height: "1056px",
				width: "816px",
			})
		}
		if (value === "A4") {
			setPageSize({
				height: "1080px",
				width: "768px",
			})
		}
		setPageOption(value)
	}

	function handleSubmit() {
		if (opt.values().next().value === "Folder") {
			handleCreate(folderName, currentNode?._id ? currentNode?._id : 'root', '0', refreshParent, refreshFolder, refreshRoot, currentNode, setFolderName);
		} else {
			let pageSetup ={
				orientation: pageOreintation,
				size: pageSize,
			  }
			  console.log(pageOreintation)
			   if (templateType === "presentation") {
                    if (pageOreintation === "portrait") {
                      pageSetup.size = {
                        height: "1024px",
                        width: "576px",
                      }
                    } else {
                      pageSetup.size = {
                        width: "1024px",
                        height: "576px",
                      }
                    }
                  }
			  
			handleCreate(folderName, currentNode?._id ? currentNode?._id : 'root', '1', refreshParent, refreshFolder, refreshRoot, currentNode, setFolderName,templateType,pageSetup);
		}

	}
	// console.log(opt);
	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				<div className="flex justify-between items-center">
					<h1>Add Folder/File</h1>
					<Select
						size={"sm"}
						selectedKeys={opt}
						className="max-w-[150px] min-h-unit-2 mr-5"
						defaultSelectedKeys={opt}
						onSelectionChange={handleOptionChange}
					>
						<SelectItem key={"Folder"} value={"Folder"}>
							Folder
						</SelectItem>
						<SelectItem key={"File"} value={"File"}>
							File
						</SelectItem>
					</Select>
				</div>
			</ModalHeader>
			<ModalBody>
				<TextField
					sx={{ width: "100%" }}
					id="outlined-basic"
					label={opt.values().next().value + " Name"}
					required
					color="secondary"
					variant="outlined"
					value={folderName}
					onChange={(e) => {
						console.log(e.target.value);
						setFolderName(e.target.value);
					}}
					name="foldername"
				/>
				{opt?.anchorKey === "File" && <>
					<div className="flex items-center">
						<span className="text-[14px]">Select Template Type:</span>
						<RadioGroup
							// label="Select Page Size:"
							className="p-4 text-[14px]"
							value={templateType}
							onValueChange={setTemplateType}
							orientation="horizontal"
							defaultValue={"document"}
						>
							<Radio
								value={"document"}
								classNames={{
									label: "text-[14px]",
									control: "bg-[#e8713d] border-[#e8713d]",
								}}
								size="sm"
							>
								Document
							</Radio>
							<Radio
								value={"presentation"}
								classNames={{
									label: "text-[14px]",
									control: "bg-[#e8713d] border-[#e8713d]",
								}}
								size="sm"
							>
								Presentation
							</Radio>
						</RadioGroup>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex justify-between items-center border-t py-4">
							<p className="text-[14px]">Page Orientation: </p>
							<PageOrientationDropdown
								pageOreintation={pageOreintation}
								setPageOreintation={setPageOreintation}
							/>
						</div>
						{templateType !== "presentation" &&
							<RadioGroup
								label="Select Page Size:"
								className="py-4 text-[14px]"
								orientation="horizontal"
								value={pageOption}
								onValueChange={handlePageSize}

							>
								{pagesetupOptions.map((ele) => {
									return (
										<Radio
											value={ele}
											key={ele}
											classNames={{
												label: "text-[14px]",
												control: "bg-[#e8713d] border-[#e8713d]",
											}}
											size="sm"
										>
											{console.log(ele)}
											{ele}
										</Radio>
									);
								})}
							</RadioGroup>
						}
					</div>

				</>}
			</ModalBody>
			<ModalFooter>
				<Button color="danger" variant="light" onPress={onClose}>
					Close
				</Button>
				<Button
					className="bg-[#05686E] text-white"
					// color="primary"
					onPress={() => {
						onClose();
						handleSubmit();
					}}
				>
					Create
				</Button>
			</ModalFooter>
		</>
	);
}

export default AddFolder;
