import {
  Button,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Chip,
  Skeleton,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ModalFooter,
  ButtonGroup,
  Link,
} from "@nextui-org/react";
import {
  Mail,
  Eye,
  User,
  Phone,
  ChevronDownIcon,
  FileSignature,
  MoreHorizontal,
  Trash2Icon,
  SquarePen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowBigLeftDash,
  ArrowLeft,
} from "lucide-react";
import { useFormik, Formik, Form } from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Alert, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });
import { CheckBox } from "@mui/icons-material";
import { addMember, deleteMember, getTeamListById, updateRole } from "../../Apis/team";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import CustomSkeleton from "../Skeleton/Skeleton";
import { size, template } from "lodash-es";
const bgArray = ["#F2F8E9", "#FFEDDE", "#EBE5F3"];
const columns = [
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "action",
    label: "ACTION",
  },

];

const Member = ({ isOpen, onOpen, onOpenChange, teamId }) => {
  const accessToken = Cookies.get("accessToken");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSuccess, setSnackSuccess] = useState("success");
  const [snackMessage, setSnackMessage] = useState("");
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [editMode, setEditMode] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [currentUserData, setCurrentUserData] = useState(null)
  const [openDeleteModel, setOpenDeleteModel] = useState(false)
  const [invitedMembers, setInvitedMembers] = useState([])
  const [page, setPage] = useState({
    size: 2,
    currentPage: 1,
    maxPage: 1,
  });
  const getTeamList = async () => {
    setIsLoading(true);
    if (teamId) {
      const res = await getTeamListById(teamId, accessToken);
      console.log(res);
      if (res) {
        setTeamData(res?.userTeam);
        setInvitedMembers(res?.userTeam?.invitedMembers)
        handleSort(res?.userTeam?.invitedMembers)
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getTeamList();
  }, [teamId, update, page]);

  const handleSort = (invitedMember)=>{
    console.log(invitedMember)
    if (page.size === 10) {
      console.log("Hello")
      const sortedInvitedMembers = [...invitedMember].sort((a, b) => {
        const nameA = a.email.toLowerCase();
        const nameB = b.email.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      // setInvitedMembers(sortedInvitedMembers);
      console.log(sortedInvitedMembers)
      setTeamData((prevTeamData) => ({
        ...prevTeamData,
        invitedMembers: sortedInvitedMembers,
      }));
    }
  }

  const handleSizeChange = (e) => {
    setPage((prevPage) => ({
      ...prevPage,
      size: e.target.value,
      currentPage: 1,
    }));
    setUpdate((prev) => !prev);
  };

  function capitalizeFirstLetterOfEachWord(title) {
    return title?.replace(/\b\w/g, (match) => match.toUpperCase());
  }
  const handleEdit = (userInfo) => {
    setCurrentUserData(userInfo)
    setEditMode(true)
    onOpen()
    setPopoverOpen(false)
  }
  const handleDelete = (userInfo) => {
    setCurrentUserData(userInfo)
    setOpenDeleteModel(true)
    setPopoverOpen(false)
  }
  const handleNext = (type) => {
    if (page.currentPage >= page.maxPage) {
      return;
    }
    console.log(type)
    const startIndex = page.currentPage * size;
    setUpdate(prev => !prev);

    setPage(prevPage => ({
      ...prevPage,
      currentPage: prevPage.currentPage + 1,
    }));

    setIsLoading(true);

    if (type === "invited") {
      const paginatedData = teamData?.invitedMembers.slice(startIndex, startIndex + size);
      setTeamData(paginatedData);
    } else {
      const paginatedData = teamData?.members.slice(startIndex, startIndex + size);
      setTeamData(paginatedData);
    }

    setIsLoading(false);
  };

  const handlePrev = (type) => {
    if (page.currentPage <= 1) {
      return;
    }

    const startIndex = (page.currentPage - 2) * size;
    setUpdate(prev => !prev);

    setPage(prevPage => ({
      ...prevPage,
      currentPage: prevPage.currentPage - 1,
    }));

    setIsLoading(true);

    if (type === "invited") {
      const paginatedData = teamData?.invitedMembers.slice(startIndex, startIndex + size);
      setTeamData(paginatedData);
    } else {
      const paginatedData = teamData?.members.slice(startIndex, startIndex + size);
      setTeamData(paginatedData);
    }

    setIsLoading(false);
  };
  console.log(teamData?.invitedMembers)
  return (
    <div className="sm:px-[35px] lg:pl-24 px-4  pb-5">
      {isOpen && (
        <AddMemberModal
          editMode={editMode}
          setEditMode={setEditMode}
          setCurrentUserData={setCurrentUserData}
          isOpen={isOpen}
          currentUserData={currentUserData}
          onOpenChange={onOpenChange}
          onOpen={onOpen}
          teamData={teamData}
          setSnackMessage={setSnackMessage}
          setSnackOpen={setSnackOpen}
          setSnackSuccess={setSnackSuccess}
          update={update}
          setUpdate={setUpdate}
          teamname={teamData?.name}
          teamId={teamId}
        />
      )}
      {openDeleteModel && <DeleteModel
        isOpen={openDeleteModel}
        currentUserData={currentUserData}
        onOpen={setOpenDeleteModel}
        setSnackMessage={setSnackMessage}
        setSnackOpen={setSnackOpen}
        setSnackSuccess={setSnackSuccess}
        setUpdate={setUpdate}
        teamId={teamId}
      />}
      {snackOpen && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

      <div className="flex flex-row justify-between md:hidden bg-[#d7d7d9] border rounded-sm w-full mb-3 mt-5 pl-2">
        <Link className="text-black flex flex-row gap-5 " href="/team"><ArrowLeft size={20} />  Teams</Link> <Button radius="none" onClick={onOpen} className="bg-[#05686E] h-9  text-white">Invite Team Member</Button>
      </div>
      <div className="my-5 ">
        <div className="flex justify-between">
          <div className="flex items-center w-full md:w-max gap-2">
            <Avatar
              showFallback
              name={teamData?.name?.substring(0, 2).toUpperCase()}
              className="bg-[#05686E] text-white border-white border-2"
              src={teamData?.imageUrl}
              size="md"
            />
            <Tooltip title={capitalizeFirstLetterOfEachWord(teamData?.name)}  >
              <div className="text-[20px]">{capitalizeFirstLetterOfEachWord(teamData?.name?.slice(0, 20))}{teamData?.name?.length > 20 && "..."}</div>
            </Tooltip>
            {/* <Button isIconOnly aria-label="edit" > </Button> */}
          </div>
          <div className="flex gap-2  items-center">
            <span className="hidden lg:inline-flex ">Sort By</span>
            <select
              value={page?.size}
              onChange={handleSizeChange}
              className="w-fit h-[40px] border rounded-sm bg-cyan-50"
            >
              <option value={5}>Date Added</option>
              <option value={10}>Name</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <Tabs
          variant="underlined"
          size="lg"
          className="border-b-1 border-gray-300  pb-2"
          aria-label="Options"
          disabledKeys={["projects", "templates"]}
        >
          <Tab key="members" title="Members">
            <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, rowIndex) => {
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
                </>
              ) : (
                <>
                  {teamData?.members?.length > 0 ? (
                    <>
                      {teamData?.members?.map((item, index) => {
                        // console.log(data);
                        return (
                          <Card
                            key={index}
                            className={`max-w-[400px] bg-[${bgArray[index % bgArray.length]
                              }] border-2  hover:border-[#05686E70] group`}
                          >
                            <CardHeader className="flex flex-col items-center justify-center gap-3 relative">
                              <Avatar
                                showFallback
                                name={item?.data?.fullname?.substring(0, 2)}
                                src={item?.imageUrl}
                                size="lg"
                              />
                              <div className="flex flex-col justify-center text-center">
                                <p className="text-[18px] font-bold">
                                  {item?.data?.fullname}
                                </p>
                                <p className="text-[14px] font-bold flex justify-center items-center gap-2">
                                  <span>
                                    <User size={14} />
                                  </span>{" "}
                                  {item?.role}
                                </p>
                              </div>
                              <Popover showArrow={true} placement="bottom">
                                <PopoverTrigger className="absolute top-0 right-1 bg-gray-100 group-hover:flex hidden">
                                  <Button onClick={() => setPopoverOpen(true)} className="bg-gray-200" isIconOnly aria-label="More"> <MoreHorizontal /></Button>
                                </PopoverTrigger>
                                {popoverOpen && <PopoverContent>
                                  <div className="py-2 flex flex-col">
                                    <Button onClick={() => handleEdit(item)} className="bg-transparent hover:bg-gray-100 flex flex-row gap-5 rounded-sm justify-start">
                                      <SquarePen size={20} />   Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(item)} className="bg-transparent hover:bg-gray-100 flex flex-row gap-5 rounded-sm justify-start">
                                      <Trash2Icon size={20} />    Remove
                                    </Button>
                                  </div>
                                </PopoverContent>}
                              </Popover>
                            </CardHeader>
                            {/* <Divider /> */}
                            <CardBody className="flex px-6 pb-6 justify-between text-center border-t border-gray-300">
                              <div className="flex justify-start items-center gap-2">
                                <span className="text-[18px]">
                                  <Mail size={14} />
                                </span>
                                <span className="text-[14px] font-semibold">
                                  {item?.data?.email}
                                </span>
                              </div>
                              <div className="flex justify-start items-center gap-2">
                                <span className="text-[18px]">
                                  {" "}
                                  <Phone size={14} />
                                </span>
                                <span className="text-[14px] font-semibold">
                                  {item?.data?.phone}
                                </span>
                              </div>
                            </CardBody>
                            {/* <Divider /> */}
                            {/* <div className="border-t border-gray-300" ></div> */}
                            {/* <CardFooter className="flex justify-center">
                              <Link href={`/team/${item._id}`}>
                                <Button
                                  variant="light"
                                  size="sm"
                                  startContent={<Eye size={12} />}
                                >
                                  View Members
                                </Button>
                              </Link>
                            </CardFooter> */}
                          </Card>
                        );
                      })}
                      <div className="flex flex-row justify-between mt-5 mb-5">
                        {/* <div className="flex flex-row">
                          <ButtonGroup radius="none" className="border rounded-sm">
 
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
                              {""}
                            </Button>
                            <Button
                              onPress={() => handleNext()}
                              isIconOnly
                              className="bg-cyan-50 border rounded-sm"
                            >
                              <ChevronRight size={18} />
                            </Button>

                          </ButtonGroup>
                        </div> */}
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
                    </>

                  ) : (

                    !isLoading && <div className="h-[300px] border col-span-12 !px-0">
                      <div className="flex flex-col gap-2 justify-center items-center self-center h-full">
                        <p className="text-md font-normal">No Members Available</p>
                        <Button onClick={onOpen} size="sm" className="bg-[#05686E] text-white rounded-full text-md">Invite Team Member</Button>
                      </div>
                    </div>
                    // <p className="mx-[-2rem]">No Members Available</p>

                  )}
                </>
              )}
            </div>
          </Tab>
          <Tab key="invited" title="Invited Members">
            <div className="w-full">
              {isLoading &&
                <CustomSkeleton />
              }
              {!isLoading && teamData?.invitedMembers?.length > 0 ? (
                <>
                  <div className="w-full grid grid-cols-12 px-1 lg:px-4 py-2 bg-gray-200 border-b">
                    <div className="col-span-2">
                      Sno
                    </div>
                    <div className="col-span-8 lg:col-span-6">
                      Email
                    </div>
                    <div className="col-span-2 hidden lg:flex">
                      Role
                    </div>
                    <div className="col-span-2 flex justify-end">
                      Action
                    </div>
                  </div>

                  {teamData?.invitedMembers?.map((item, index) => {
                    { console.log(item) }
                    return <><div className="w-full grid grid-cols-12 px-1 lg:px-4 py-2 hover:bg-gray-100 border-b items-center">
                      <div className="col-span-2">
                        {index + 1}
                      </div>
                      <div className="col-span-8 lg:col-span-6">
                        <p className=" text-ellipsis" >  {item?.email?.slice(0, 25)}{item?.email?.length > 25 && "..."}</p>
                        <p className="flex lg:hidden">{item?.role}</p>
                      </div>
                      <div className="col-span-2 hidden lg:grid">
                        {item?.role}
                      </div>
                      <div className="col-span-2 flex justify-end flex-row gap-0 lg:gap-2">
                        <Tooltip title="Delete" >
                          <Button onClick={() => handleDelete(item)} size="sm" aria-label="edit" className="bg-transparent" isIconOnly><Trash2 size={20} /></Button>
                        </Tooltip>
                        <Tooltip title="Edit" >
                          <Button onClick={() => handleEdit(item)} size="sm" aria-label="edit" className="bg-transparent" isIconOnly><SquarePen size={20} /></Button>
                        </Tooltip>

                      </div>
                    </div></>
                  })}
                  <div className="flex flex-row justify-between mt-5 mb-5">
                    {/* <div className="flex flex-row">
                          <ButtonGroup radius="none" className="border rounded-sm">

                            <Button
                              onPress={() => handlePrev("invited")}
                              isIconOnly
                              className="bg-cyan-50 border rounded-sm"
                            >
                              <ChevronLeft size={18} />{" "}
                            </Button>
                            <Button
                              onPress={() => handleNext("invited")}
                              isIconOnly
                              className="bg-cyan-50 border rounded-sm"
                            >
                              {""}
                            </Button>
                            <Button
                              onPress={() => handleNext()}
                              isIconOnly
                              className="bg-cyan-50 border rounded-sm"
                            >
                              <ChevronRight size={18} />
                            </Button>

                          </ButtonGroup>
                        </div> */}
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
                  {/* <Table aria-label="table" shadow="none">
                    <TableHeader columns={columns}>
                      {(column) => (
                        <TableColumn key={column.key}>
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody items={data?.invitedMembers}>
                      {(item) => (
                        <TableRow key={item?.email}>
                          {(columnKey) => (

                            <TableCell>
                              {getKeyValue(item, columnKey)}
                            </TableCell>


                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table> */}
                </>
              ) : (
                !isLoading && <div className="h-[300px] border col-span-12 !px-0">
                  <div className="flex flex-col gap-2 justify-center items-center self-center h-full">
                    <p className="text-md font-normal">No Members Available</p>
                    <Button onClick={onOpen} size="sm" className="bg-[#05686E] text-white rounded-full text-md">Invite Team Member</Button>
                  </div>
                </div>
              )}
            </div>
          </Tab>
          {/* <Chip color="secondary">Secondary</Chip> */}
          <Tab
            key="projects"
            title={
              <div className="flex gap-1">
                Projects
                <Chip size="sm" color="secondary">
                  Coming Soon
                </Chip>
              </div>
            }
          >
            projects
          </Tab>
          <Tab
            key="templates"
            title={
              <div className="flex gap-1">
                Templates
                <Chip size="sm" color="secondary">
                  Coming Soon
                </Chip>
              </div>
            }
          >
            templates
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Member;

const AddMemberModal = ({
  isOpen,
  onOpen,
  onOpenChange,
  setSnackMessage,
  setSnackOpen,
  setSnackSuccess,
  update,
  setUpdate,
  teamname,
  teamData,
  teamId,
  editMode,
  currentUserData,
  setCurrentUserData,
  setEditMode
}) => {
  const [role, setRole] = useState("");
  const [isRoleOpen, setIsRoleOpen] = React.useState(false);
  // const [teamData, setTeamData] = useState([]);

  console.log(role);

  const getTeamList = async () => {
    const res = await getTeamListById(teamId);
    console.log(res);
    if (res) {
      // setTeamData(res?.userTeam);
    }
  };

  // useEffect(() => {
  //   getTeamList();
  //   console.log(teamData);
  // }, [update]);
  // console.log(teamData);

  const signerRoles = [
    {
      title: "Role : Admin",
      value: "Admin",
      icon: <FileSignature size={18} />,
    },
    {
      title: "Role : Member",
      value: "Member",
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

  const handleCloseModal = () => {
    setCurrentUserData(null)
    setEditMode(false)
    onOpen
  };

  const addMembervalidator = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      // .email("Invalid Email")

      .nullable()
      .test(
        "email-validation",
        function (value) {
          console.log("Validating email:", value);
          
          const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          
          if (!regex.test(value)) {
            console.log("Invalid email format");
            return this.createError({
              path: this.path,
              message: "Invalid email address",
            });
          }
          
          let check = false;
          if (!editMode && teamData?.invitedMembers?.length > 0) {
            check = teamData?.invitedMembers?.some((reci) => reci?.email === value);
            if (check) {
              console.log("Email already exists (invitedMembers)");
              return this.createError({
                path: this.path,
                message: "Recipient with the same email address exists",
              });
            }
          }
          if (!editMode && teamData?.members?.length > 0) {
            check = teamData?.members?.some((reci) => reci?.data?.email === value);
            if (check) {
              console.log("Email already exists (members)");
              return this.createError({
                path: this.path,
                message: "Recipient with the same email address exists",
              });
            }
          }
          
          console.log("Email is valid");
          return true;
        }
      ),
  });
  const initialValues = {
    email: editMode ? currentUserData?.email || currentUserData?.data?.email : "",
    role: editMode ? currentUserData?.role : "Admin",
    teamId: teamId,
  }
  console.log(currentUserData)
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={handleCloseModal}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editMode ? "Update Role" : "Add Member"}
              </ModalHeader>

              <ModalBody>
                <Formik
                  initialValues={initialValues}
                  validationSchema={addMembervalidator}
                  onSubmit={async (values) => {
                    console.log(values);
                    const body = {
                      email: values?.email,
                      role: values?.role,
                      teamId: teamId,
                    };
                    if (editMode) {
                      const res = await updateRole({ ...body, memberType: currentUserData?.data?.email ? "member" : "invited" });
                      if (res) {
                        setUpdate((prev) => !prev);
                        setSnackOpen(true);
                        setSnackSuccess("success");
                        setSnackMessage(`Role Update Sent`);
                        setCurrentUserData(null)
                        setEditMode(false)
                        onClose();
                      } else {
                        setSnackOpen(true);
                        setSnackSuccess("warning");
                        setSnackMessage(`Something Went Wrong`);
                      }
                    }
                    else {
                      const res = await addMember(body);
                      if (res) {
                        setUpdate((prev) => !prev);
                        setSnackOpen(true);
                        setSnackSuccess("success");
                        setSnackMessage(`Invite Sent`);
                        onClose();
                      } else {
                        setSnackOpen(true);
                        setSnackSuccess("warning");
                        setSnackMessage(`Something Went Wrong`);
                      }
                    }

                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                  }) => {
                    console.log(values);
                    return (
                      <Form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                          <div>
                            <TextField
                              fullWidth
                              required
                              disabled={editMode}
                              type="email"
                              className="border py-1"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.email}
                              name="email"
                              error={errors.email && touched.email}
                              helperText={
                                errors.email && touched.email && errors.email
                              }
                              label="Email"
                              sx={{
                                "& .MuiInputBase-root": {
                                  borderRadius: 0,
                                  height: "47px",
                                },
                                "& .MuiFormHelperText-root": {
                                  marginLeft: 0,
                                },
                              }}
                            />

                            <div className="flex sm:items-stretch md:items-stretch items-start flex-wrap justify-between gap-5 mt-3  w-full ">
                              <div className="flex flex-wrap sm:flex-row flex-col items-stretch gap-5 w-full ">
                                <Popover
                                  placement="bottom-start "
                                  isOpen={isRoleOpen}
                                  onOpenChange={(open) => setIsRoleOpen(open)}
                                >
                                  <PopoverTrigger>
                                    <button className="flex gap-5 h-[47px] bg-[#e3feff] w-full justify-between items-center border px-3 border-gray-500">
                                      <div className="flex gap-1 items-center sm:py-0 py-1 capitalize">
                                        {values.role ? `Role: ${values.role}` : "Role: Admin"}
                                      </div>
                                      <ChevronDownIcon size={18} />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[300px] md:w-[375px]`}
                                  >
                                    <ul className="py-2 self-start w-full">
                                      {signerRoles.map((e, index) => {
                                        return (
                                          <li
                                            onClick={() => {
                                              setFieldValue("role", e.value);
                                              setIsRoleOpen(false);
                                              setRole(e.value);
                                            }}
                                            key={index}
                                            className="flex px-2 py-2 gap-1 cursor-pointer hover:bg-gray-300 w-full"
                                          >
                                            {e.title}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>

                            <div className="flex sm:items-stretch md:items-stretch items-start flex-wrap justify-between gap-5 mt-3  w-full ">
                              <div className="flex flex-wrap sm:flex-row flex-col items-stretch gap-5 w-full ">
                              <TextField
                                fullWidth
                                required
                                disabled={true}
                                type="name"
                                className="border py-1"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={teamname}
                                name="teamname"
                                label="Team Name"
                                sx={{
                                  "& .MuiInputBase-root": {
                                    borderRadius: 0,
                                    height: "47px",
                                  },
                                  "& .MuiFormHelperText-root": {
                                    marginLeft: 0,
                                  },
                                }}
                              />
                                {/* <button
                                  disabled
                                  className="flex gap-5 h-[47px] bg-[#fff] rounded-none w-full justify-between items-center border px-3 border-gray-500"
                                >
                                  <div className="flex gap-1 items-center sm:py-0 py-1 capitalize">
                                    {teamname}
                                  </div>
                                </button> */}
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex justify-end">
                            <Button
                              className="bg-[#05686E] text-white"
                              color="primary"
                              type="submit"
                              isLoading={isSubmitting}
                            >
                              {editMode ? "Update" : "Add"}
                            </Button>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const DeleteModel = ({
  isOpen,
  onOpen,
  setSnackMessage,
  setSnackOpen,
  setSnackSuccess,
  setUpdate,
  teamId,
  currentUserData
}) => {
  const handleDelete = async () => {
    console.log("hi")
    let body
    if (currentUserData?.email) {
      console.log("hi")
      body = {
        email: currentUserData?.email,
        memberType: "invited",
        teamId: teamId
      }
    }
    if (currentUserData?.data?.email) {
      body = {
        email: currentUserData?.data?.email,
        memberType: "member",
        teamId: teamId
      }

    }
    console.log(body)
    if (body) {
      const res = await deleteMember(body)
      console.log("hi")
      if (res) {
        setUpdate((prev) => !prev);
        setSnackOpen(true);
        setSnackSuccess("success");
        setSnackMessage(`Member removed Successfully !`);
        onOpen(false);
      }
      else {
        setUpdate((prev) => !prev);
        setSnackOpen(true);
        setSnackSuccess("warning");
        setSnackMessage(`Something went wrong`);
        onOpen(false);
      }
    }
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onOpen(false)}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Are You sure want to remove this member ?
            </ModalHeader>
            <ModalBody className="">

            </ModalBody>
            <ModalFooter>
              <Button size="sm" color="danger" variant="light" onClick={() => handleDelete()}>
                Yes
              </Button>
              <Button size="sm" className="bg-[#05686E] text-white" onPress={onClose}>
                No
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
