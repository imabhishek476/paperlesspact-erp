import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { UploadCloud } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, TextField } from "@mui/material";
import { getUserProfile } from "@/Apis/login";
import Cookies from "js-cookie";
const validator = Yup.object().shape({
  message: Yup.string()
    .min(20, "Must be at least 20 characters")
    .max(150, "Must be at most 150 characters")
    .required("Message is required!"),
});
import CloseIcon from "@mui/icons-material/Close";
import { createEnquiry } from "@/Apis/enquiry";
import { createHelp } from "@/Apis/help";
const HelpMenu = () => {
  const [details, setDetails] = useState(null);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const accessToken = Cookies.get("accessToken");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const fileRef = useRef();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(accessToken);
        setDetails(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  function handleFileChange(event) {
    console.log(event.target.files[0]);
    if (window.FileReader && event.target.files[0]) {
      setFiles(Array.from(event.target.files));
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
  const formik = useFormik({
    initialValues: { message: "" },
    enableReinitialize: true,
    validationSchema: validator,
    onSubmit: async (values) => {
      console.log(files[0]);
      const obj = {
        enquiryMessage: values.message,
        enquiryFile: files[0],
      };
      const res = await createHelp(obj);
      console.log(res);
      if (res) {
        // console.log(res)
        formik.resetForm();
        setFiles([]);
        setAlertSeverity("success");
        setShowAlert(true);
        setAlertMsg(
          "We received your request, our team will review and get back to you with in the next few hours."
        );
      } else {
        formik.resetForm();
        setFiles([]);
        setAlertSeverity("error");
        setShowAlert(true);
        setAlertMsg("Something went wrong, please try again after sometime!!");
      }
    },
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    formik.resetForm();
    setShowAlert(false);
    setOpen(false);
  };
  console.log(files[0]?.name);
  return (
    <div className="w-[72px]">
      <Popover
        shouldCloseOnInteractOutside={() => handleClose()}
        isOpen={open}
        onClose={() => handleClose()}
        showArrow
        placement="top-end"
      >
        <PopoverTrigger>
          <Button
            // size="sm"
            onClick={() => setOpen(true)}
            radius="none"
            aria-label="Help"
            className="capitalize min-w-[72px] text-white font-[600] bg-[#056a70ff] text-[12px] lg-text-[16px]"
          >
            <HelpOutlineIcon className="text-[26px] min-w-[20px]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] md:w-[350px] justify-start items-start relative">
          <div className="absolute right-0 mb-2">
            <Button
              isIconOnly
              className="bg-transparent"
              onClick={() => handleClose()}
            >
              <CloseIcon />
            </Button>
          </div>

          <div className="flex justify-start flex-col p-3 gap-5">
            {showAlert && (
              <div className={`${showAlert ? "mt-5" : "mt-0"}`}>
                <Alert severity={alertSeverity}>{alertMsg}</Alert>
              </div>
            )}
            <div className="flex flex-row gap-5 pl-2">
              <Avatar
                isBordered
                radius="full"
                size="md"
                name={
                  details?.data?.fullname
                    ? details?.data?.fullname.slice(0, 1)
                    : ""
                }
                src={
                  details?.data?.userProfileImageLink?.present &&
                  details?.data?.userProfileImageLink
                }
                showFallback
              />
              <div className="flex flex-col items-start justify-start gap-1">
                <h4 className="text-large font-semibold leading-none text-default-600">
                  {details?.data?.fullname ? details?.data?.fullname : "User"}
                </h4>
                <h5 className="text-small tracking-tight text-default-500">
                  {details?.data?.phone}
                </h5>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 justify-center items-center px-5 mt-3 w-full">
            <TextField
              fullWidth
              required
              type="text"
              multiline
              rows={5}
              maxRows={6}
              className="border py-1 z-0"
              onBlur={formik?.handleBlur}
              value={formik?.values?.message}
              onChange={formik?.handleChange}
              name="message"
              error={formik?.errors?.message && formik?.touched?.message}
              helperText={
                formik?.errors?.message && formik?.touched?.message
                  ? formik?.errors?.message
                  : ""
              }
              label="Message"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 0,
                },
              }}
            />
          </div>
          <div className="flex justify-between self-end py-2 px-5 w-full items-start mb-5">
            <div className="flex flex-col justify-center items-center self-center">
              <input
                type="file"
                accept=".png,.jpeg,.jpg"
                className="hidden"
                onChange={handleFileChange}
                ref={fileRef}
              />
              <Button
                size="sm"
                onClick={() => fileRef.current.click()}
                className="font-semibold rounded-full border bg-transparent border-[#05686E] text-[#05686E] hover:bg-[#f7f7f7] "
              >
                <UploadCloud /> Attached file if any
              </Button>
              <div className="flex justify-start items-start self-start">
                <p
                  className={`${
                    files[0]?.name
                      ? "text-[14px] text-[#05686E]"
                      : "text-[12px] text-gray-700"
                  } font-semibold mt-1 `}
                >
                  {files[0]?.name
                    ? files[0]?.name.length > 20
                      ? `${files[0].name.slice(0, 20)}...`
                      : files[0].name
                    : "Supported formats : .png, .jpg, .jpeg"}
                </p>
              </div>
            </div>
            <div className="self-end ">
              <Button
                onClick={formik.handleSubmit}
                size="sm"
                className="capitalize rounded-full text-white font-[600] bg-[#056a70ff] "
              >
                Send
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HelpMenu;
