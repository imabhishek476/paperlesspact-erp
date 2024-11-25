import React, { useState } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	getKeyValue,
	Radio,
	RadioGroup,
	Dropdown,
	DropdownTrigger,
	Button,
	DropdownMenu,
	DropdownItem,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Skeleton,
	Spinner,
} from "@nextui-org/react";
const columns = [
	{
		key: "name",
		label: "NAME",
	},
	{
		key: "email",
		label: "Email",
	},
	{
		key: "phone",
		label: "Mobile Number",
	},
	{
		key: "method",
		label: "Signed Method",
	},
	{
		key: "role",
		label: "Signed Role",
	},
	{
		key: "action",
		label: "Action",
	},
];
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { deleteContact } from "@/Apis/contacts";
import CustomSkeleton from "../Skeleton/Skeleton";
import { Contacts, Troubleshoot } from "@mui/icons-material";

export default function ContactList({
	update,
	users,
	setOpenModel,
	setDetails,
	setIsEdit,
	setUpdate,
	userId,
	setUserId,
	deleteModel,
	setDeleteModel,
	deleteUser,
	selectedKeys,
	setSelectedKeys,
	handleDelete,
	isLoading,
}) {
	const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
	const { onOpenChange } = useDisclosure();

	const handleEdit = (data) => {
		setDetails(data);
		setIsEdit(true);
		setOpenModel(true);
	};

	const userDelete = () => {
		console.log(userId);
		if (userId) {
			console.log(userId);
			deleteUser(userId);
			setUpdate((prev) => !prev);
		}
	};
	const loadingState = isLoading ? "loading" : "idle";
	return (
    <div className="">
      <Modal
        isOpen={deleteModel}
        onOpenChange={onOpenChange}
        onClose={() => setDeleteModel(false)}
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
            Are you sure want to delete
            {selectedKeys.size > 1 ? " these contact?" : " this contact?"}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              size="md"
              onPress={() => userDelete()}
            >
              Yes
            </Button>
            <Button
              size="md"
			  className="bg-[#05686e] font-bold text-white"
              onPress={() => {
                setDeleteModel(false);
                setSelectedKeys([]);
              }}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="overflow-auto">
        {(update || !update) && (
          <Table
            isCompact={true}
            radius="none"
            shadow="none"
            layout="auto"
            removeWrapper={true}
            className="md:border-1 rounded-sm p-0 "
            aria-label="Rows actions table example with dynamic content"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            selectionBehavior={selectionBehavior}
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
              isLoading={isLoading}
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
              {users?.map((item) => {
                return (
                  <TableRow
                    className="hover:shadow-lg h-10 cursor-pointer"
                    key={item._id}
                  >
                    <TableCell className="whitespace-nowrap text-ellipsis">
                      {item?.fullname.slice(0, 35)}
                    </TableCell>
                    <TableCell className="lowercase whitespace-nowrap text-ellipsis">
                      {item?.signersEmail.slice(0, 45)}
                    </TableCell>
                    <TableCell>{item?.phone}</TableCell>
                    <TableCell className="capitalize whitespace-nowrap">
                      {item?.signerMethod}
                    </TableCell>
                    <TableCell className="capitalize whitespace-nowrap">
                      {item?.signerRole}
                    </TableCell>
                    <TableCell>
                      {" "}
                      <div className="relative flex justify-end items-center gap-2 z-0">
                        <Dropdown className="bg-background border-1 border-default-200">
                          <DropdownTrigger>
                            <Button radius="full" size="sm" variant="bordered">
                              Quick Action <KeyboardArrowDownIcon />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem onClick={() => handleEdit(item)}>
                              Edit
                            </DropdownItem>
                            {item?.isDeleted !== 1 && (
                              <DropdownItem
                                onClick={() => handleDelete(item?._id)}
                              >
                                Delete
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
