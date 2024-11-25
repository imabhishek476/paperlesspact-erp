import { rename } from "@/Apis/folderStructure";
import { TextField } from "@mui/material";
import {
	Button,
	ModalBody,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

function RenameAction({ onClose, node, setUpdate,fetchfolderStructureByPath }) {
	// const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [folderName, setFolderName] = useState("");
	const [template, setTemplate] = useState({});

	async function handleRename() {
		console.log(template?._id, folderName);
		const isUpdated = await rename(template?._id, folderName);
		console.log(isUpdated);
		if (isUpdated) {
			setUpdate((prev) => !prev);
			if(template?.parent!=='root'){
				fetchfolderStructureByPath(template?.parent);
			}
		}
	}

	useEffect(() => {
		console.log(node);
		setTemplate(node);
	}, [node]);

	useEffect(() => {
		console.log(template);
	}, [template]);

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">
				Rename {template?.isTemplate === "0" ? "Folder" : "File"}
			</ModalHeader>
			<ModalBody>
				<TextField
					sx={{ width: "100%" }}
					id="outlined-basic"
					label="Folder Name"
					required
					color="secondary"
					variant="outlined"
					value={folderName}
					onChange={(e) => {
						setFolderName(e.target.value);
					}}
					name="foldername"
				/>
			</ModalBody>
			<ModalFooter>
				<Button color="danger" variant="light" onPress={onClose}>
					Close
				</Button>
				<Button
				className="bg-[#05686E] text-white"
					onPress={() => {
						onClose();
						handleRename();
					}}
				>
					Rename
				</Button>
			</ModalFooter>
		</>
	);
}

export default RenameAction;
