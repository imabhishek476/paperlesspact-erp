import { Button, ButtonGroup } from "@nextui-org/react";
import { ArrowDownToLine, Search, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddContactModal from "./AddContactModal";
import Navbar from "../Navbar/Navbar";
import { useDisclosure } from "@nextui-org/react";
import {
	createContact,
	deleteContact,
	getContacts,
	updateContact,
} from "@/Apis/contacts";
import ContactList from "./ContactList";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Badge, ChevronLeft, ChevronRight, Divide } from "lucide-react";
import { Alert, Snackbar, Typography } from "@mui/material";
import PaginationFooter from "../Pagination/PaginationFooter";
import CustomPagination from "../Pagination/CustomPagination";
import Link from "next/link";
import { useRouter } from "next/router";
import ContactNavbar from "./ContactNavbar";
const validator = Yup.object().shape({
	fullname: Yup.string().required("Name is required!"),
	signersEmail: Yup.string()
	.required('Email is required!')
    .test('valid-email', 'Not a valid email', function(value) {
      if (!value) return true; // Let the required validation handle empty values
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    }),
	phone: Yup.string()
		.matches(/^[6-9]\d{9}$/, {
			message: "Please enter valid number.",
			excludeEmptyString: false,
		})
		.nullable(),
});
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
const Contacts = ({ document }) => {
	const [signers, setSigners] = useState({
		signerRole: "Role : Signer",
		singerValue: "Signer",
	});
	const [signerMethod, setSignerMethod] = useState({
		selectedMethod: "Sign using email",
		mathodValue: "email",
	});
	const router = useRouter();
	console.log(router.query.add);
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState("");
	const [pageNumber, setPageNumber] = React.useState(1);
	const [totalPages, setTotalPages] = React.useState(null);
	const [pageSize, setPageSize] = React.useState("10");
	const { onOpenChange } = useDisclosure();
	const [openModel, setOpenModel] = useState(false);
	const [contactDetails, SetContactDetails] = useState([]);
	const [initialValue, setInitialValue] = useState(null);
	const [isEdit, setIsEdit] = useState(false);
	const [update, setUpdate] = useState(false);
	const [searchInput, setSerchInput] = useState("");
	const [userId, setUserId] = useState("");
	const [deleteModel, setDeleteModel] = useState(false);
	const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
	const [isLoading, setIsLoading] = useState(true);
	const [isActive, setIsActive] = useState("1");
	const [isDeleted, setIsDeleted] = useState("0");
	const [alertSeverity, setAlertSeverity] = useState("success");
	const [details, setDetails] = useState({
		fullname: "",
		signersEmail: "",
		lang: "en",
		signerMethod: "email",
		signerRole: "signer",
		phone: "",
	});

	const getDetails = async () => {
		setIsLoading(true);
		const res = await getContacts(pageNumber, pageSize, isActive, isDeleted);
		if (res) {
			// console.log(res.data)
			SetContactDetails(
				res?.data?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
			);
			// SetContactDetails(res?.data)
			setTotalPages(res?.totalPages);
			setIsLoading(false);
		}
	};
	useEffect(() => {
		console.log(searchInput);
		if (searchInput.length >= 3) {
			const filteredResults = contactDetails?.filter((user) =>
				user.fullname.toLowerCase().includes(searchInput.toLowerCase())
			);
			SetContactDetails(filteredResults);
		}
	}, [searchInput]);

	useEffect(() => {
		getDetails();
	}, [update, pageSize, pageNumber, searchInput, isDeleted]);
	console.log(update);
	async function handleSearch(searchQuery) {
		const res = await getContacts(
			pageNumber,
			pageSize,
			isActive,
			isDeleted,
			searchQuery
		);
		if (res) {
			console.log(res);
			SetContactDetails(res?.data);
			// setDraftDetail(docs);
			// setDrafts(docs?.agreementDetails);
		}
	}

	const filterAll = () => {
		setSelectedKeys([])
		setIsActive("1");
		setIsDeleted("0");
	};
	const filterDeleted = () => {
		setSelectedKeys([])
		setIsActive("0");
		setIsDeleted("1");
	};
	useEffect(() => {
		setInitialValue(details);
		setSigners({
			signerRole: `Role : ${details?.signerRole}`,
			singerValue: details?.signerRole,
		});
		setSignerMethod({
			selectedMethod: `Sign using ${details?.signerMethod}`,
			mathodValue: details?.signerMethod,
		});
	}, [details]);
	const deleteUser = async (id) => {
		setIsLoading(true);
		const res = await deleteContact(id);
		if (res) {
			setUpdate((prev) => !prev);
			setDeleteModel(false);
			setAlertSeverity("success");
			setSnackbarMsg("User Deleted Successfully!!");
			setOpenSnackBar(true);
			setIsLoading(false);
			setSelectedKeys(new Set([]));
		} else {
			setUpdate((prev) => !prev);
			setDeleteModel(false);
			setAlertSeverity("error");
			setSnackbarMsg("Something went wrong, please try again in sometime");
			setOpenSnackBar(true);
			setIsLoading(false);
		}
	};
	const handleSnackbarClose = () => {
		setOpenSnackBar(false);
	};
	const formik = useFormik({
		initialValues: initialValue,
		enableReinitialize: true,
		validationSchema: validator,
		onSubmit: async (values) => {
			// setIsDeleted("0");
			const obj = {
				lang: "en",
				fullname: values.fullname,
				phone: values.phone,
				signersEmail: values.signersEmail,
				signerRole: signers.singerValue,
				signerMethod: signerMethod.mathodValue,
			};
			console.log("new List", obj);
			if (isEdit) {
				const res = await updateContact(obj, details?._id);
				console.log(res);
				if (res) {
					setUpdate((prev) => !prev);
					setAlertSeverity("success");
					setSnackbarMsg("Details Updated Successfully!!");
					setOpenSnackBar(true);
					setOpenModel(false);
					setIsEdit(false);
					setSigners({
						signerRole: "Role : Signer",
						singerValue: "Signer",
					});
					setSignerMethod({
						selectedMethod: "Sign using email",
						mathodValue: "email",
					});
					setDetails({
						fullname: "",
						signersEmail: "",
						lang: "en",
						signerMethod: "email",
						signerRole: "signer",
						phone: "",
					});
					formik.resetForm();
				} else {
					setUpdate((prev) => !prev);
					setAlertSeverity("error");
					setSnackbarMsg("Something went wrong, please try again in sometime");
					setOpenSnackBar(true);
					setOpenModel(false);
					setIsEdit(false);
					setSigners({
						signerRole: "Role : Signer",
						singerValue: "Signer",
					});
					setSignerMethod({
						selectedMethod: "Sign using email",
						mathodValue: "email",
					});
					setDetails({
						fullname: "",
						signersEmail: "",
						lang: "en",
						signerMethod: "email",
						signerRole: "signer",
						phone: "",
					});
					formik.resetForm();
				}
			} else {
				const res = await createContact(obj);
				if (!res.data.error) {
					console.log(res);
					setSigners({
						signerRole: "Role : Signer",
						singerValue: "Signer",
					});
					setSignerMethod({
						selectedMethod: "Sign using email",
						mathodValue: "email",
					});
					setDetails({
						fullname: "",
						signersEmail: "",
						lang: "en",
						signerMethod: "email",
						signerRole: "signer",
						phone: "",
					});
					formik.resetForm();
					setUpdate((prev) => !prev);
					setOpenModel(false);

					if (router.query.add) {
						// router.replace(`/contacts`)
						router.push(
							{
								pathname: "/contacts",
								query: {
									add: "false", //
								},
							},
							undefined,
							{ shallow: true }
						);
					}
					setAlertSeverity("success");
					setSnackbarMsg("Contact Added Successfully!!");
					setOpenSnackBar(true);
				} else {
					setSigners({
						signerRole: "Role : Signer",
						singerValue: "Signer",
					});
					setSignerMethod({
						selectedMethod: "Sign using email",
						mathodValue: "email",
					});
					setDetails({
						fullname: "",
						signersEmail: "",
						lang: "en",
						signerMethod: "email",
						signerRole: "signer",
						phone: "",
					});
					formik.resetForm();
					setUpdate((prev) => !prev);
					setOpenModel(false);
					setAlertSeverity("error");
					setSnackbarMsg("Something went wrong, please try again in sometime");
					setOpenSnackBar(true);
				}
			}
		},
	});

	// useEffect(() => {
	// 	if (router.query.add === 'true') {
	// 		setOpenModel(true)
	// 	}
	// }, [router.query]);

	const handleDelete = (id) => {
		console.log(id);
		let obj = [id];
		if (id) {
			setDeleteModel(true);
			setUserId(obj);
		}
	};

	const deletedFromMain = () => {
		let userToDelete = [];
		let idArr = [];
		console.log(selectedKeys);
		if (selectedKeys.size > 0 || selectedKeys === "all") {
			if (selectedKeys === "all") {
				console.log("in me");
				userToDelete = contactDetails?.map((list) => list?._id);
				if (userToDelete) {
					setUserId(idArr);
					setDeleteModel(true);
				}
			} else {
				console.log("in me");
				selectedKeys.forEach(function (value) {
					if (value) {
						userToDelete = [...userToDelete, { id: value }];
					}
				});
				idArr = userToDelete.map((obj) => obj.id);
				setUserId(idArr);
				console.log(idArr);
				if (idArr) {
					setDeleteModel(true);
				}
			}
		}
	};
	return (
    <>
      {/* <Navbar
        hideLogo={true}
        handleSubmit={setOpenModel}
        content={{
          title: "Contacts",
          comp: false,
          links: [
            {
              title: "New Contact",
              action: "new-contact",
              link: "/contact/new?action=new-contact"
            },
          ],
		//   save:{title:"New Contact",action: "new-contact", link:"/contact/new?action=new-contact"}
        }}
        footer={document.footer}
      /> */}
	  
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
	  <ContactNavbar
	  	hideLogo={true}
		  handleSubmit={setOpenModel}
		  content={{
			title: "Contacts",
			comp: false,
			links:
			  {
				title: "New Contact",
				action: "new-contact",
				link: "/contact/new?action=new-contact"
			  }
		  //   save:{title:"New Contact",action: "new-contact", link:"/contact/new?action=new-contact"}
		  }}
	  />
      <div className="lg:px-[35px] lg:pl-24 px-4">
        <div className="block md:hidden bg-[#d7d7d9] border rounded-sm w-full p-1 mb-3 mt-5 px-[20px]">
          Contacts
        </div>
        <AddContactModal
          openModel={openModel}
          setOpenModel={setOpenModel}
          set
          onOpenChange={onOpenChange}
          formik={formik}
          signers={signers}
          setSigners={setSigners}
          signerMethod={signerMethod}
          setSignerMethod={setSignerMethod}
          setDetails={setDetails}
        />
        <div className="mt-[2rem] w-full flex flex-col md:flex-row gap-3 justify-between">
          <div className="flex flex-row gap-3 justify-between">
            <div className="flex flex-row gap-3">
              {isDeleted === "0" && (
                <>
                  {/* <Button
                    onClick={() => filterDeleted()}
                    className={`bg-transparent border rounded-sm hover:border-cyan-200`}
                    isIconOnly
                    aria-label="Like"
                  >
                    <ArrowDownToLine strokeWidth={0.5} />
                  </Button> */}
                  <Button
                    disabled={isDeleted === "1" || selectedKeys.length === 0}
                    onClick={() => deletedFromMain()}
                    className={`bg-transparent border rounded-sm hover:border-cyan-200 ${
                      isDeleted === "1" || selectedKeys.size === 0
                        ? "cursor-no-drop"
                        : "cursor-pointer"
                    }`}
                    isIconOnly
                    aria-label="Like"
                  >
                    <Trash strokeWidth={0.5} />
                  </Button>
                </>
              )}
            </div>

            <Button
              onClick={setOpenModel}
              className="rounded-full lg:hidden hover:bg-[#056a70ff] hover:text-background bg-transparent border border-[#056a70ff] text-[#056a70ff]"
            >
              New Contact
            </Button>
          </div>
          <div>
            <div className="flex flex-row gap-2 border-1 rounded-sm py-2 px-2 w-full md:w-[400px]">
              <Search
                strokeWidth={2}
                className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
              />{" "}
              <input
                type="text"
                className="outline-0 flex-1"
                // value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search Contacts"
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-col md:flex-row items-end justify-end gap-1 md:gap-0">
            <Button
              className={`bg-${
                isDeleted === "1" ? "cyan-50 " : "white"
              } border rounded-sm w-full md:w-max`}
              onClick={() => filterAll()}
            >
              All
            </Button>
            <Button
              className={`${
                isDeleted === "1"
                  ? "bg-white cursor-pointer"
                  : "bg-cyan-50 cursor-pointer"
              } border rounded-sm w-full md:w-max`}
              onClick={() => filterDeleted()}
            >
              Archive
            </Button>
          </div>
          <ContactList
            update={update}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            deleteUser={deleteUser}
            deleteModel={deleteModel}
            setDeleteModel={setDeleteModel}
            users={contactDetails}
            setOpenModel={setOpenModel}
            setDetails={setDetails}
            setIsEdit={setIsEdit}
            setUpdate={setUpdate}
            setSnackbarMsg={setSnackbarMsg}
            setOpenSnackBar={setOpenSnackBar}
            userId={userId}
            setUserId={setUserId}
            handleDelete={handleDelete}
            isLoading={isLoading}
          />

          {/* <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <ButtonGroup radius="none" className=" rounded-sm">
                                <Button
                                    disabled={pageNumber === 1}
                                    onClick={() => setPageNumber(pageNumber - 1)}
                                    isIconOnly
                                    className={`border rounded-sm ${pageNumber === 1 ? 'bg-gray-100 cursor-no-drop' : 'bg-cyan-50 cursor-pointer'}`}
                                >
                                    <ChevronLeft size={18} />{" "}
                                </Button>
                                {[...Array(totalPages)].map((list, index) => (
                                    <Button key={index} isIconOnly className="bg-cyan-50 border rounded-sm">
                                        {index + 1}  {" "}
                                    </Button>
                                ))}
                                <Button isIconOnly className="bg-cyan-50 border rounded-sm">
                                    {pageNumber}{" "}
                                </Button>
                                <Button
                                    disabled={pageNumber === totalPages}
                                    onClick={() => setPageNumber(pageNumber + 1)}
                                    isIconOnly
                                    className={`border rounded-sm ${pageNumber === totalPages ? 'bg-gray-100 cursor-no-drop' : 'bg-cyan-50 cursor-pointer'}`}
                                >
                                    <ChevronRight size={18} />
                                </Button>
                            </ButtonGroup>
                        </div>

                    </div> */}
          <div className="flex justify-start mt-2">
            {contactDetails && totalPages > 0 && (
              <CustomPagination
                totalPages={totalPages}
                setPageNumber={setPageNumber}
                pageNumber={pageNumber}
              />
            )}
          </div>

          {/* <div className='flex justify-start mt-2'>

                        {contactDetails && totalPages > 0 && (
                            <PaginationFooter
                                totalPages={totalPages}
                                setPageNumber={setPageNumber}
                            />
                        )}
                    </div> */}
        </div>
      </div>
    </>
  );
};

export default Contacts;
