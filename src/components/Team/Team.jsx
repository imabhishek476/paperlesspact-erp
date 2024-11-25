import {
  Button,
  ButtonGroup,
  Checkbox,
  Select,
  SelectItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Avatar,
  Skeleton,
} from "@nextui-org/react";
import { FormControl, Select as MUISelect } from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  Disc2,
  Download,
  Search,
  ChevronDownIcon,
  FileSignature,
  Fingerprint,
  Mail,
  Eye,
  SquarePen,
  MoreHorizontalIcon,
  Trash2,
} from "lucide-react";

import { useFormik, Formik, Form } from "formik";

import React, { useState, useEffect, use } from "react";
import * as Yup from "yup";
import {
  Alert,
  InputLabel,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });

import { CheckBox } from "@mui/icons-material";
import { TeamList } from "./TeamList";
import {
  createTeam,
  addMember,
  getTeamListById,
  getAllMyTeam,
  updateTeam,
} from "../../Apis/team";

import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import CreateTeamModal from "./CreateTeamModal";
import TeamDeleteModel from "./TeamDeleteModal";

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
const Team = ({ isOpen, onOpen, addMode, setAddMode }) => {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSuccess, setSnackSuccess] = useState("success");
  const [snackMessage, setSnackMessage] = useState("");
  const [update, setUpdate] = useState(false);
  const [initialValue, setInitialValue] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [editMode, setEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [teamId, setTeamId] = useState("")
  const [popOpen, setPopOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [totalItem, setTotalItem] = useState()
  const [page, setPage] = useState({
    size: 5,
    currentPage: 1,
    maxPage: 1,
  });
  const router = useRouter()
  const handleNext = async () => {
    if (page.currentPage == page.maxPage) {
      return;
    }
    setUpdate((prev) => !prev);
    setPage({
      ...page,
      currentPage: page.currentPage + 1,
    });
    setIsLoading(true);
    const res = await getAllMyTeam(page?.currentPage + 1, page?.size);
    if (res) {
      setTeamData(res?.ref);
    }
    setIsLoading(false);
  };
  const handlePrev = async () => {
    if (page.currentPage == 1) {
      return;
    }
    setUpdate((prev) => !prev);
    setPage({
      ...page,
      currentPage: page.currentPage - 1,
    });
    setIsLoading(true);
    const res = await getAllMyTeam(page?.currentPage - 1, page?.size);
    if (res) {
      setTeamData(res?.ref);
    }
    setIsLoading(false);
  };
  const getAllTeam = async (search) => {
    setIsLoading(true);
    const res = await getAllMyTeam(page?.currentPage, page?.size,search);
    console.log(res);
    if (res) {
      setPage({
        ...page,
        maxPage: res?.totalPages,
      });
      setTeamData(res?.ref);
      setTotalItem(res?.totalItems)
      // setInitialValue(res?.ref);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllTeam();
    // console.log(teamData);
  }, [update]);
  console.log(isOpen)
  const handleSizeChange = (e) => {
    setPage((prevPage) => ({
      ...prevPage,
      size: e.target.value,
      currentPage: 1,
    }));
    setUpdate((prev) => !prev);
  };

  const bgArray = ["#F2F8E9", "#FFEDDE", "#EBE5F3"];

  function capitalizeFirstLetterOfEachWord(title) {
    return title.replace(/\b\w/g, (match) => match.toUpperCase());
  }
  const handleEdit = (id) => {
    setPopOpen(false)
    onOpen(true)
    setEditMode(true)
    setTeamId(id)
  }
  const handleDelete = (id) => {
    setPopOpen(false)
    setDeleteOpen(true)
    setTeamId(id)
  }
  const handleSearch = (value) => {
      getAllTeam(value)
  }
  return (
    <div className="sm:px-[35px] lg:pl-24 px-4  pb-5">
      {isOpen && (
        <CreateTeamModal
          teamId={teamId}
          editMode={editMode}
          isOpen={isOpen}
          setSnackMessage={setSnackMessage}
          setSnackOpen={setSnackOpen}
          setSnackSuccess={setSnackSuccess}
          setUpdate={setUpdate}
          teamData={teamData}
          setEditMode={setEditMode}
          onOpen={onOpen}
          setTeamId={setTeamId}
        />
      )}
      {
        deleteOpen && <TeamDeleteModel
          isOpen={deleteOpen}
          onOpen={setDeleteOpen}
          setSnackMessage={setSnackMessage}
          setSnackOpen={setSnackOpen}
          setSnackSuccess={setSnackSuccess}
          setUpdate={setUpdate}
          teamId={teamId}
          setTeamId={setTeamId}
        />
      }
      {snackOpen && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackOpen}
          autoHideDuration={2000}
          onClose={() => setSnackOpen(false)}
          sx={{ zIndex: 1000, mt: 10 }}
        >
          <Alert
            onClose={() => setSnackOpen(false)}
            severity={snackSuccess}
            sx={{ width: "100%", pr: 3, pl: 3, borderRadius: "10px" }}
          >
            <Typography sx={{ fontSize: "14px" }} variant="h6">
              {snackMessage}
            </Typography>
          </Alert>
        </Snackbar>
      )}

      <div className="block md:hidden bg-[#d7d7d9] border rounded-sm w-full p-1 mb-3 mt-5 px-[20px]">
        Team
      </div>
      <div className="mt-5 w-full items-start lg:items-center flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex flex-row justify-between w-full lg:w-fit">
          <p className="text-md font-semibold">Total Teams {" "} ({totalItem})</p>
          <Button onClick={onOpen} size="sm" className="bg-[#05686E] text-white rounded-full h-7 text-md inline-flex md:hidden">Create Team</Button>

        </div>
        <div className="flex justify-between w-full lg:w-fit lg:justify-normal flex-row gap-2">
          <div className="flex flex-row gap-2 border-1 rounded-sm py-2 px-2 w-full md:w-[400px]">
            <Search
              strokeWidth={2}
              className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
            />{" "}
            <input
              onChange={(e) => handleSearch(e.target.value)}
              type="text"
              className="outline-0 flex-1"
              placeholder="Search Team"
            />
          </div>
          <div className="flex flex-row gap-2 justify-center items-center">
            <p className="hidden md:flex text-[14px] font-[600]">
              Number of Results :
            </p>{" "}
            <select
              value={page?.size}
              onChange={handleSizeChange}
              className="w-[60px] h-[40px] border rounded-sm bg-cyan-50"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-5 border-t pb-5">
        <div className="flex flex-col md:flex-row justify-between flex-wrap w-full md:w-max gap-1 md:gap-0"></div>
        {/* <div className="flex flex-col md:flex-row items-end justify-end gap-1 md:gap-0">
          <Button className="bg-cyan-50 border rounded-sm w-full md:w-max">
            Archive
          </Button>
          <Button className="bg-cyan-50 border rounded-sm w-full md:w-max">
            All
          </Button>
          <Button className="bg-cyan-50 border rounded-sm w-full md:w-max">ort
            Active
          </Button>
          <Button className="bg-cyan-50 border rounded-sm w-full md:w-max">
            Inactive
          </Button>
        </div> */}
      </div>
      {isLoading && (
        <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full">
          {[...Array(5)].map((_, rowIndex) => {
            return (
              <Card key={rowIndex} className="max-w-[400px] space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                  <div className="h-12 rounded-lg bg-default-300"></div>
                </Skeleton>
                <Skeleton className="rounded-lg">
                  <div className="h-12 rounded-lg bg-default-300"></div>
                </Skeleton>
              </Card>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full">
        {!isLoading && teamData && teamData?.length > 0 ? (
          <>
            {teamData?.map((item, index) => {
              console.log(item);
              return (
                <Card
                  key={index}
                  className={`max-w-[400px] bg-[${bgArray[index % bgArray.length]
                    }] border-2  hover:border-[#05686E70] group`}
                >
                  <CardHeader className="flex flex-col items-center justify-center gap-3 relative">
                    <Popover showArrow placement="bottom">
                      <PopoverTrigger className="absolute top-0 right-0 rounded-bl-lg rounded-tl-none rounded-br-none">
                        <Button onClick={() => setPopOpen(true)} size="sm" className="bg-gray-50" isIconOnly ><MoreHorizontalIcon size={20} /></Button>
                      </PopoverTrigger>
                      {popOpen && <PopoverContent className="w-[120px] rounded-md">
                        <div className="p-1 flex flex-col w-full">
                          <div onClick={() => handleEdit(item?._id)} className="bg-transparent flex flex-row  gap-3 items-center hover:bg-gray-100 hover:cursor-pointer py-2 px-1"><SquarePen size={18} />Edit</div>
                          <div onClick={() => handleDelete(item?._id)} className="bg-transparent flex flex-row  gap-3 items-center hover:bg-gray-100 hover:cursor-pointer py-2 px-1" > <Trash2 size={18} /> Delete</div>
                        </div>
                      </PopoverContent>}
                    </Popover>

                    <Avatar
                      showFallback
                      name={item?.name?.substring(0, 2).toUpperCase()}
                      className="bg-[#05686E] text-white border-white border-2"
                      src={item?.teamIcon}
                      size="lg"
                    />
                    <div className="flex flex-col">
                      <p className="text-[15px] font-bold">
                        {capitalizeFirstLetterOfEachWord(item.name?.slice(0,22))}{item.name?.length>22 && "..."}
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody className="flex flex-row gap-4 p-2 justify-around text-center border-t border-gray-300 overflow-x-hidden">
                    <div className="flex flex-col">
                      <span className="text-[18px]">0</span>
                      <span className="text-[12px] font-semibold">
                        Templates
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[18px]"> 0</span>
                      <span className="text-[12px] font-semibold">
                        Projects
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[18px]">
                        {item?.members ? item?.members?.length : 0}
                      </span>
                      <span className="text-[12px] font-semibold">
                        Members
                      </span>
                    </div>
                  </CardBody>
                  {/* <Divider /> */}
                  <CardFooter className="flex justify-center border-t-2 border-gray-300">
                    {/* <Link href={`/team/${item._id}`}> */}
                    <Button
                      variant="light"
                      size="sm"
                      startContent={<Eye size={12} />}
                      onClick={() => router.push(`/team/${item._id}`)}
                    >
                      View Members
                    </Button>
                    {/* </Link> */}
                  </CardFooter>
                </Card>
              );
            })}
          </>
        )
          : (
            !isLoading && <div className="h-[300px] border col-span-12 !px-0">
              <div className="flex flex-col gap-2 justify-center items-center self-center h-full">
                <p className="text-md font-normal">No Teams Available</p>
                <Button onClick={onOpen} size="sm" className="bg-[#05686E] text-white rounded-full text-md">Create Team</Button>
              </div>
            </div>
          )}
      </div>

      <div className="flex flex-row justify-between mt-5 mb-5">
        <div className="flex flex-row">
          <ButtonGroup radius="none" className="border rounded-sm">
            {/* <Button isIconOnly className="bg-cyan-50 border rounded-sm">
              <ChevronLeft size={28} /> <ChevronLeft size={28} />
            </Button> */}
            <Button
              onPress={() => handlePrev()}
              isIconOnly
              className="bg-cyan-50 border rounded-sm"
            >
              <ChevronLeft size={18} />{" "}
            </Button>
            <Button
              onPress={() => handleNext()}
              isIconOnly
              className="bg-cyan-50 border rounded-sm"
            >
              {page?.currentPage}
            </Button>
            <Button
              onPress={() => handleNext()}
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
            <select
              value={page?.size}
              onChange={handleSizeChange}
              className="w-[60px] h-[40px] border rounded-sm bg-cyan-50"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div> */}
      </div>
    </div>
  );
};

export default Team;

// const CreateTeamModal = ({
//   editMode,
//   isOpen,
//   onOpenChange,
//   setSnackMessage,
//   setSnackOpen,
//   setSnackSuccess,
//   setUpdate,
//   teamData,
//   teamId
// }) => {
//   const [file, setFile] = useState();
//   const [data, setData] = useState()
//   const [initialValue, setInitialValue] = useState({ name: "" })
//   const createTeamvalidator = Yup.object().shape({
//     name: Yup.string()
//       .required("Name is required!")
//       .test("same name test", "Team with same name exists", function (value) {
//         let check = false;
//         if (!editMode && teamData?.length > 0) {
//           check = teamData?.some((reci) => {
//             console.log(reci?.name === value);
//             return reci?.name === value;
//           });
//           if (check) {
//             return false;
//           }
//         }
//         return true;
//       }),
//   });
//   const accessToken = Cookies.get("accessToken")
//   const handleFileUpload = (e) => {
//     console.log(e);
//     const newFile = e.target.files[0];
//     setFile(newFile);
//   };
//   const getTeamById = async () => {
//     const res = await getTeamListById(teamId, accessToken)
//     console.log(res)
//     if (res) {
//       setData(res?.userTeam)
//     }
//   }
//   useEffect(() => {
//     if (teamId && editMode) {
//       getTeamById()
//     }
//   }, [teamId])
//   useEffect(() => {
//     setInitialValue({ name: data?.name })
//   }, [data])

//   console.log(initialValue)
//   return (
//     <>
//       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">
//                 {editMode ? "Edit Team" : "Create Team"}
//               </ModalHeader>

//               <ModalBody>
//                 <Formik
//                   onSubmit={async (values) => {
//                     console.log(values);
//                     let body
//                     console.log(file);
//                     if (editMode) {
//                       body = {
//                         teamName: values?.name,
//                         isActive: 1
//                       }
//                       if (file) { body.file = file }
//                       else {
//                         body.file = data?.teamIcon
//                       }
//                       console.log(body)
//                       const res = await updateTeam(body, teamId)
//                       if (res) {
//                         setUpdate((prev) => !prev);
//                         setSnackOpen(true);
//                         setSnackSuccess("success");
//                         setSnackMessage(`Updated SuccessFully`);
//                         onClose();
//                       } else {
//                         setSnackOpen(true);
//                         setSnackSuccess("warning");
//                         setSnackMessage(`Something Went Wrong`);
//                       }
//                     }
//                     else {
//                       body = { teamName: values?.name }
//                       if (file) { body.file = file }
//                       const res = await createTeam(body);
//                       if (res) {
//                         setUpdate((prev) => !prev);
//                         setSnackOpen(true);
//                         setSnackSuccess("success");
//                         setSnackMessage(`Created SuccessFully`);
//                         onClose();
//                       } else {
//                         setSnackOpen(true);
//                         setSnackSuccess("warning");
//                         setSnackMessage(`Something Went Wrong`);
//                       }
//                     }

//                   }}
//                   enableReinitialize
//                   initialValues={initialValue}
//                   validationSchema={createTeamvalidator}
//                 >
//                   {({
//                     values,
//                     errors,
//                     touched,
//                     handleChange,
//                     handleBlur,
//                     handleSubmit,
//                     isSubmitting,
//                   }) => {
//                     { console.log(values) }
//                     return (
//                       <Form onSubmit={handleSubmit}>
//                         <div className="flex flex-col gap-4">
//                           <TextField
//                             fullWidth
//                             type="text"
//                             className="border py-1"
//                             label={`Team Name`}
//                             // size="small"
//                             onBlur={handleBlur}
//                             value={values?.name}
//                             onChange={handleChange}
//                             name="name"
//                             error={errors?.name && touched?.name}
//                             helperText={
//                               errors?.name && touched?.name && errors?.name
//                             }
//                             sx={{
//                               "& .MuiInputBase-root": {
//                                 borderRadius: 0,
//                                 height: "45px",
//                                 backgroundColor: "white"
//                               },
//                               "& .MuiFormHelperText-root": {
//                                 marginLeft: 0,
//                               },
//                             }}
//                           />
//                           <div >
//                             <div className="flex flex-row justify-between pb-5">
//                               {editMode && (
//                                 <div className="flex flex-col w-full justify-center items-center">
//                                   {editMode && file && <p>Old Icon</p>}
//                                   <div className="h-[75px] w-[75px]">
//                                     <Avatar
//                                       showFallback
//                                       name={data?.name?.substring(0, 2).toUpperCase()}
//                                       className="bg-[#05686E] text-white border-white border-2 h-full w-full"
//                                       src={data?.teamIcon}
//                                       size="lg"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                               {file && (
//                                 <div className="flex w-full flex-col justify-center items-center">
//                                   {editMode && file && <p>New Icon</p>}
//                                   <div className="h-[75px] w-[75px]">
//                                     <Avatar
//                                       showFallback
//                                       name={file?.name?.substring(0, 2).toUpperCase()}
//                                       className="bg-[#05686E] text-white border-white border-2 h-full w-full"
//                                       src={URL.createObjectURL(file)}
//                                       size="lg"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex flex-col gap-2 items-center justify-center w-full">
//                               <p className="self-start">
//                                 {file || editMode ? "Change " : "Upload "} Team Icon
//                               </p>
//                               <label
//                                 htmlFor="dropzone-file"
//                                 className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
//                               >
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                   <svg
//                                     className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
//                                     aria-hidden="true"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 20 16"
//                                   >
//                                     <path
//                                       stroke="currentColor"
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth="2"
//                                       d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//                                     />
//                                   </svg>
//                                   <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                                     <span className="font-semibold">
//                                       {editMode || file ? "Click to change" : "Click to upload"}
//                                     </span>
//                                   </p>
//                                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                                     SVG, PNG, JPG or GIF (MAX. 800x400px)
//                                   </p>
//                                 </div>

//                                 <input
//                                   id="dropzone-file"
//                                   type="file"
//                                   accept="image/*"
//                                   className="hidden"
//                                   onChange={handleFileUpload}
//                                 />
//                               </label>
//                             </div>
//                           </div>

//                           <div className="w-full flex justify-end">
//                             <Button
//                               className="bg-[#05686E] text-white"
//                               color="primary"
//                               type="submit"
//                               isLoading={isSubmitting}
//                             // onPress={handleSubmit}
//                             >
//                               {editMode ? "Update" : "Create"}
//                             </Button>
//                           </div>
//                         </div>
//                       </Form>
//                     );
//                   }}
//                 </Formik>
//               </ModalBody>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };
// const DeleteModel = ({
//   isOpen,
//   onOpen,
//   setSnackMessage,
//   setSnackOpen,
//   setSnackSuccess,
//   setUpdate,
//   teamId,
//   setTeamId,
// }) => {
//   const accessToken = Cookies.get("accessToken")
//   const [data, setData] = useState(null)
//   const getTeamById = async () => {
//     const res = await getTeamListById(teamId, accessToken)
//     console.log(res)
//     if (res) {
//       setData(res?.userTeam)
//     }
//   }
//   useEffect(() => {
//     if (teamId) {
//       getTeamById()
//     }
//   }, [teamId])
//   const handleDelete = async () => {
//     let body = {
//       teamName: data?.name,
//       file: data?.teamIcon,
//       isActive: 0
//     }
//     const res = await updateTeam(body, teamId)
//     if (res) {
//       setUpdate((prev) => !prev);
//       setSnackOpen(true);
//       setSnackSuccess("success");
//       setSnackMessage(`Team Delete SuccessFully`);
//       onOpen(false);
//       setTeamId("")
//     } else {
//       setSnackOpen(true);
//       setSnackSuccess("warning");
//       setSnackMessage(`Something Went Wrong`);
//     }
//   }

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={() => onOpen(false)}
//     >
//       <ModalContent>
//         {(onClose) => (
//           <>
//             <ModalHeader className="flex flex-col gap-1">
//               Are You sure want to delete this team ?
//             </ModalHeader>
//             <ModalBody className="">

//             </ModalBody>
//             <ModalFooter>
//               <Button size="sm" color="danger" variant="light" onClick={() => handleDelete()}>
//                 yes
//               </Button>
//               <Button size="sm" className="bg-[#05686E] text-white" onPress={onClose}>
//                 No
//               </Button>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   )
// }