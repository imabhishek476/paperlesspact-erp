import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { Typography, InputAdornment, useMediaQuery } from "@mui/material";
import Switch from "@mui/material/Switch";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import PersonIcon from "@mui/icons-material/Person";
import { useFormik } from "formik";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Cookies from "js-cookie";
import EditOffIcon from "@mui/icons-material/EditOff";
import * as Yup from "yup";
import { UpdateUserProfile, updateProfilePicture } from "@/Apis/User";
import { Avatar, Button } from "@nextui-org/react";
import { Copyright } from "lucide-react";
import Image from "next/image";
import { useEnv } from "@/components/Hooks/envHelper/useEnv";
import { getUserProfile } from "@/Apis/login";
import LoadingPage from "@/components/LoadingPage/loadingPage";
import { useRouter, useSearchParams } from "next/navigation";
import { createSubscription } from "@/Apis/subscription";

const loginValidations = Yup.object().shape({
  fullname: Yup.string()
    .matches(/^[A-Za-z ]*$/, "Please enter valid name")
    .required("Name is required!"),
  email: Yup.string().email("Invalid email").nullable(),
  mobile: Yup.number()
    .typeError("That doesn't look like a phone number")
    .positive("A phone number can't start with a minus")
    .integer("A phone number can't include a decimal point")
    .required("Phone Number is required"),
});

const AuthPersonalDetails = () => {
  const [profileImage, setProfileImage] = useState();
  const [profileDetails, setProfileDetails] = useState(null);
  const [dpChange, setDpchange] = useState(false);
  const router = useRouter();
  const fileRef = useRef();
  const isBelow990px = useMediaQuery((theme) => theme.breakpoints.down(990));
  const [checked, setChecked] = React.useState(true);
  const inDevEnvironment = useEnv();
  const searchParams = useSearchParams();
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  console.log(profileImage);
  const accessToken = Cookies.get("accessToken");
  const formik = useFormik({
    initialValues: {
      fullname: profileDetails?.fullname ? profileDetails?.fullname : "",
      email: profileDetails?.email ? profileDetails?.email : "",
      mobile: profileDetails?.phone ? profileDetails?.phone : "",
    },
    validationSchema: loginValidations,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const obj = {
        mobile: values?.mobile,
        fullname: values?.fullname,
        email: values?.email,
        role: "",
        accessToken: Cookies.get("accessToken"),
      };
      console.log(obj);
      const response = await UpdateUserProfile(
        values?.mobile,
        values?.fullname,
        values?.email,
        "",
        Cookies.get("accessToken")
      );
      const ref = await createSubscription();
      if (response.data) {
        const id = searchParams.get("id")
        const teamId = searchParams.get("teamId")
        console.log(teamId);
        if (id && id !== "undefined" && teamId && teamId !== undefined) {
            router.push(`/onboarding/success?id=${id}?teamId=${teamId}`);
        } else {
          if(teamId && teamId !== undefined){
            router.push(`/onboarding/success?teamId=${teamId}`);
          } else if(id && id !== "undefined"){
            router.push(`/onboarding/success?id=${id}`);
          } else
          router.push(`/upgrade`);
        }
      }
    },
  });

  const profileImgChange = async (e) => {
    setProfileImage(e.target.files[0]);
    const response = await updateProfilePicture(accessToken, e.target.files[0]);
    if (response) {
      // console.log(response.data.data.imageUrl);
      setDpchange((prev) => !prev);
      // console.log(e.target.files[0]);
      // setProfileImage(e.target.files[0]);
    }
  };
  async function profile() {
    // setLoading(true);
    const profile = await getUserProfile(Cookies.get("accessToken"));
    if (profile) {
      console.log(profile);
      setProfileDetails(profile.data);
      setProfileImage(profile?.data?.userProfileImageLink);
    }
  }

  useEffect(() => {
    profile();
  }, [dpChange]);

  return !profileDetails ? (
    <LoadingPage />
  ) : (
    <>
      <header className="py-4 fixed top-0 w-full border-b bg-[#056a70ff]">
        <div className="container flex items-center justify-between">
          {!isBelow990px ? (
            <Image
              width={170}
              height={50}
              src={
                "/images/logo-dark.png"
              }
            />
          ) : (
            <Image
              width={30}
              height={30}
              src={"/images/logo-white.png"}
            ></Image>
          )}
          <div className="flex justify-center bg-white border rounded-[50%]  items-center">
            {profileImage ? (
              <img
                style={{
                  width: "35px",
                  height: "35px",
                  border: "1px solid white",
                  borderRadius: "50%",
                  objectFit: "fill",
                }}
                src={profileImage}
                alt=""
              />
            ) : (
              <PersonIcon sx={{ fontSize: "30px" }} />
            )}
          </div>
        </div>
      </header>
      <div className="h-screen flex items-center">
        <div className="md:w-[40%] w-4/5 mt-[50px] flex flex-col mx-auto  mb-[20px]">
          <Typography
            sx={{ fontSize: "20px", fontWeight: "600", textAlign: "left" }}
          >
            Your Personal Information
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: "20px",
              fontWeight: "500",
              marginTop: "8px",
              textAlign: "left",
            }}
          >
            Upload your profile picture
          </Typography>
          <div className="flex items-center w-full justify-between mb-7">
            <div className="flex justify-center bg-white border rounded-[50%] p-1 items-center">
              {profileImage ? (
                <img
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    objectFit: "fill",
                  }}
                  src={profileImage}
                  alt=""
                />
              ) : (
                <PersonIcon sx={{ fontSize: "45px" }} />
              )}
            </div>
            <Button
              size="sm"
              onClick={() => fileRef.current.click()}
              className="font-semibold rounded-full bg-[#05686E] text-background"
            >
              Upload Image
              <input
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={profileImgChange}
                type="file"
              />
            </Button>
          </div>
          <TextField
            fullWidth
            sx={{ mb: 2 }}
            id="outlined-multiline-flexible"
            label="Enter Your Name"
            required
            disabled={profileDetails?.fullname}
            color="secondary"
            inputProps={{ maxLength: 150 }}
            maxRows={4}
            error={formik.errors.fullname && formik.touched.fullname}
            name="fullname"
            value={formik.values.fullname}
            onChange={formik.handleChange}
            helperText={formik.errors.fullname ? formik.errors.fullname : ""}
          />
          <TextField
            sx={{ mb: 2 }}
            style={{ width: "100%", backgroundColor: "white" }}
            id="outlined-multiline-flexible"
            label="Enter Email Address"
            disabled={profileDetails?.email}
            inputProps={{ maxLength: 150 }}
            color="secondary"
            name="email"
            maxRows={4}
            error={formik.errors.email && formik.touched.email}
            value={formik.values.email}
            onChange={formik.handleChange}
            helperText={formik.touched.email ? formik.errors.email : ""}
            // InputProps={{
            // 	endAdornment: (
            // 		<InputAdornment position="end">
            // 			<EditOffIcon />
            // 		</InputAdornment>
            // 	),
            // }}
          />
          <TextField
            style={{ width: "100%", backgroundColor: "white" }}
            id="outlined-multiline-flexible"
            label="Enter Your Mobile Number"
            color="secondary"
            disabled={profileDetails?.phone}
            inputProps={{ maxLength: 10 }}
            name="mobile"
            maxRows={4}
            error={formik.errors.mobile}
            value={formik.values.mobile}
            onChange={formik.handleChange}
            helperText={formik.errors.mobile}
            // disabled={isMobileVerified}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditOffIcon />
                </InputAdornment>
              ),
            }}
          />
          <div className="flex justify-between items-center mt-[20px]">
            <div className="flex items-center gap-4  ">
              <WhatsAppIcon fontSize="medium" />
              <Typography sx={{ textAlign: "left", fontSize: "14px" }}>
                Get important updates on WhatsApp ?
              </Typography>
            </div>
            <FormControlLabel
              control={
                <Switch
                  disabled={true}
                  checked={checked}
                  onChange={handleChange}
                  color="secondary"
                />
              }
              label={checked ? "Yes" : "No"}
            />
          </div>
          <div className="w-full flex justify-end items-center mt-[20px]">
            <Button
              onClick={formik.handleSubmit}
              size="sm"
              className="font-semibold rounded-full bg-[#05686E] text-background px-5 self-end"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
      <footer className="py-6 fixed w-full bottom-0 bg-foreground text-background">
        <div className="container flex justify-between">
          <h1 className="flex md:text-lg text-sm gap-2 font-bold items-center">
            Copyright EaseDraft <Copyright size={18} /> 2023
          </h1>
          <div className="hidden md:flexitems-center gap-5">
            <h1 className="flex md:text-lg text-sm  font-bold items-center">
              Made with ❤️ In India
            </h1>
            <Image
              src={"/images/Make_In_India.webp"}
              width={!isBelow990px ? 60 : 40}
              height={!isBelow990px ? 40 : 20}
            ></Image>
          </div>
        </div>
      </footer>
    </>
  );
};
export default AuthPersonalDetails;
