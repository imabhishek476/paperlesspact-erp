import React, { useEffect, useState } from "react";
import SideNav from "../Navbar/SideNav/Dashboard/SideNav";
import useProfile from "../Hooks/Profile/useProfile";
import TemplateFolderListing from "./TemplateFolderListing";
import { createTemplate } from "@/Apis/template";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import CreateTemplateNavbar from "./CreateTemplateNavbar";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, SelectItem, useDisclosure } from "@nextui-org/react";
import { TextField } from "@mui/material";
import TemplateModal from "./TemplateComponents/TemplateModal";

// const NavBar  = dynamic(()=>import('./Navbar'),{ssr:false});


const TemplateComponent = ({ document }) => {
  const router = useRouter();
  const modalDisc = useDisclosure();
  console.log(modalDisc);
  const handleModalOpen = () => {
    console.log(modalDisc.onOpen());
    modalDisc.onOpen();
  }
  const handleCreateTemplate = async (payload) => {
    const body = {
      fileJson: "{}",
      folderName: payload.folderName,
      type : payload.templateType,
      isFile: '1',
      parentId: 'root',
      pageSetup:{...payload.pageSetup},
    };
    const response = await createTemplate(body);
    console.log(response);
    if (response) {
      const id = response?.data?._id;
      if(response?.data?.type === "presentation"){
        router.push(`/presentation/new?id=${id}`);
      } else {
        router.push(`/template/new?id=${id}`);
      }
    }
  };
  return (
    <>
      <SideNav />
      <CreateTemplateNavbar
        title={"Templates"}
        cta={"New Template"}
        ctaOnclick={modalDisc.onOpen}
      />
      <TemplateFolderListing />
      <TemplateModal modalDisc={modalDisc} handleCreateTemplate={handleCreateTemplate}/>
      {/* <Modal
      isOpen={modalDisc.isOpen}
      onOpenChange={modalDisc.onOpenChange}
      >
        <ModalContent>
        {(onClose)=>(
          <>
			<ModalHeader className="flex flex-col gap-1">
				<div className="flex justify-between items-center">
					<h1>Enter Template Name</h1>
				</div>
			</ModalHeader>
			<ModalBody>
				<TextField
					sx={{ width: "100%" }}
					id="outlined-basic"
					label={"Template Name"}
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
				<Button color="danger" radius="md" variant="light" onPress={onClose}>
					Close
				</Button>
				<Button
					color="primary" radius="md"
          className="bg-[#05686E] text-background w-max"
					onPress={() => {
						modalDisc.onClose();
						handleCreateTemplate();
					}}
				>
					Create
				</Button>
			</ModalFooter>
      </>
      )}
      </ModalContent>
      </Modal> */}
    </>
  );
};

export default TemplateComponent;
