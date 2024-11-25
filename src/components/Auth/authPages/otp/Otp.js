import React, { useEffect, useState } from "react";
import {
	Button,
	CardContent,
	CircularProgress,
	TextField,
	Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
// import Div from "@jumbo/shared/Div";
// import { ASSET_IMAGES } from "../../../utils/constants/paths";
import * as yup from "yup";
import { Form, Formik } from "formik";
// import JumboTextField from "@jumbo/components/JumboFormik/JumboTextField";
import LoadingButton from "@mui/lab/LoadingButton";
// import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "@mui/material/Container";
import SwipeableTextMobileStepper from "../../components/SwipeableTextMobileStepper";
import Login from "../login";
// import LoginFooter from "app/pages/components/LoginFooter";
// import { generateOtp, getUserProfile, validateOtp } from "app/Apis/Login";
// import { useDispatch } from "react-redux";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Cookies from "js-cookie";
// import SocialButtons from "app/pages/components/SocialButtons";
// import {
// 	defaultAccessToken,
// 	DefaultEmailVerified,
// 	DefaultName,
// 	DefaultPhoneVerified,
// 	DefaultProfileImage,
// 	defaultProfileStatus,
// 	defaultRole,
// 	DefaultUserEmail,
// 	DefaultUserMobile,
// 	DefaultUserName,
// } from "app/redux/actions/OnboardingInputs";
// import { useSelector } from "react-redux";
// import Animation from "app/pages/components/Animations/Animation";

import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "@mui/material/Link";
// import { defaultLawyerId } from "app/redux/actions/OnboardingInputs";
// import Div from "@/components/Shared/Div/Div";
import LoginFooter from "../../components/LoginFooter";
import { generateOtp, getUserProfile, validateOtp } from "@/Apis/login";
import Div from "@/components/Shared/Div/Div";
import { useRouter, useSearchParams } from "next/navigation";
import { Nunito } from "next/font/google";
import Image from "next/image";
import { useEnv } from "@/components/Hooks/envHelper/useEnv";

const validationSchema = yup.object({
	otp: yup
		.string()
		.required()
		.matches(/^[0-9]+$/, "Must be only digits")
		.min(6, "Must be exactly 6 digits")
		.max(6, "Must be exactly 6 digits"),
});

const nunito = Nunito({ subsets: ["latin"] });

const Otp = ({ disableSmLogin, phoneNumber }) => {
	const inDevEnvironment = useEnv();
	const isBelow990px = useMediaQuery((theme) => theme.breakpoints.down(990));
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	// const { setAuthToken } = useJumboAuth();

	// const dispatch = useDispatch();
	const [editNumber, setEditNumber] = useState("");
	const [edit, setEdit] = useState(false);
	const [otp, setOtp] = useState();
	const [seconds, setSeconds] = useState(30);
	const searchParams = useSearchParams();

	const removeQueryParams = () => {
		const param = searchParams.get("phoneNumber");

		if (param) {
			// 👇️ delete each query param
			searchParams.delete("phoneNumber");
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1);
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [seconds]);

	//access Token
	// const accessToken = useSelector(
	// 	(state) => state?.onboardingInputs?.accessToken
	// );

	// const profileStatus = useSelector(
	// 	(state) => state?.onboardingInputs?.profileStatus
	// );

	const [error, setError] = useState();

	// const navigate = useNavigate();

	let role = "";
	const OtpReceived = async (otp) => {
		setIsLoading(true);
		const response = await validateOtp(phoneNumber, otp);
		response?.data.data.roles.map((e) => (role = e));
		if (response?.data.success === true) {
			setError("");
			// dispatch(defaultRole({ role, onboarding: false }));
			// dispatch(defaultAccessToken(response.data.data.accessToken));
			if(inDevEnvironment){
				Cookies.set("accessToken",response?.data?.data?.accessToken);
				Cookies.set("isLoggedIn",true);
				Cookies.set("id", response?.data?.data?.id, {
					expires: 1,
				});
			}else{
				Cookies.set("accessToken", response?.data?.data?.accessToken, {
					expires: 1,
					domain:".easedraft.com"
				});
				Cookies.set("isLoggedIn", true,{
					expires:1,
					domain:".easedraft.com"
				});
				Cookies.set("id", response?.data?.data?.id,{
					expires:1,
					domain:".easedraft.com"
				});
				
			}
			
			if (response.data.data.accessToken) {
				console.log("received");
				const userData = await getUserProfile(response.data.data.accessToken);
				// console.log(userData.data.data.userImageProfileLink);
				// dispatch(defaultProfileStatus(userData.data.data.profileStatus));
				// dispatch(DefaultUserEmail(userData.data.data.email));
				// dispatch(DefaultName(userData.data.data.fullname));
				// dispatch(DefaultUserName(userData.data.data.username));
				// dispatch(DefaultUserMobile(userData.data.data.phone));
				// dispatch(DefaultProfileImage(userData.data.data.userProfileImageLink));
				// dispatch(DefaultEmailVerified(userData.data.data.isEmailVerified));
				// dispatch(DefaultPhoneVerified(userData.data.data.isPhoneVerified));
				// dispatch(defaultLawyerId(userData.data.data.lawyerId));
				const next = searchParams.get("next")
				const teamId =searchParams.get("teamId")
				const adminId =searchParams.get("adminId")
				
				if(next){
					console.log(next)
					const parsedLink = next.replace("%2F\g","/").replace("%3F\g","?").replace("%3E\g","?")
					console.log(parsedLink)
					router.push(parsedLink);
				} else if(teamId){
					if(adminId){
						router.push(`/team/invited?teamId=${teamId}&adminId=${adminId}`)
					} else{
						router.push(`/team/invited?teamId=${teamId}`)
					}
				} else {
					router.push("/dashboard");
				}
				// router.push("/onboarding");
			}
		} else {
			setError("Please enter correct OTP!");
		}
		setIsLoading(false);
	};

	const getOtp = async () => {
		console.log("clicked");
		const response = await generateOtp(phoneNumber);
		console.log(response);
	};

	const resendOTP = async () => {
		console.log("resend clicked");
		await getOtp();
		setSeconds(30);
	};

	const handleChange = (event) => {
		setOtp(event.target.value);
	};
	return (
		<>
			{edit ? (
				<Login editNumber={editNumber} disableSmLogin={disableSmLogin} />
			) : (
				<Div
					sx={{
						backgroundColor: "#FFFFFF",
						margin: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flex: "1 1",
						minWidth: 0,
						flexDirection: { xs: "column", md: "row" },
						height: "100vh",
						borderRadius: "0",
					}}
				>
					<Div
						id="hey"
						sx={{
							flex: 1,
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							paddingBottom: "10vh",
							flex: 1,
							height: "100%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						}}
					>
						<Div
							sx={{
								flex: "1",
								display: "flex",
								justifyContent: "flex-end",
								flexDirection: "column",
								my: "10%",
								marginLeft: "auto",
								marginBottom: "12%",
								marginRight: isBelow990px ? "auto" : "15%",
								width: "380px",
								padding: "20px",
							}}
						>
							<Div
								sx={{
									display: "flex",
									// mb: 1,
								}}
							>
								<Link href="https://easedraft.com">
									<Image
										src={"/images/Colibri.png"}
										width={210}
										height={50}
										style={{
											objectFit: "contain",
											// width: "60px",
											marginBottom: "10px",
											// width: "150px",
										}}
										alt="Lawinzo"
									/>
								</Link>
							</Div>
							<Typography
								variant={"h2"}
								sx={{
									color: "#364a63",
									fontSize: "1.25rem",
									fontWeight: "700",
									fontFamily: "Nunito, sans-serif",
									mb: 2,
								}}
								className={nunito.className}
							>
								Access the EaseDraft Panel
							</Typography>
							<Div
								sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
							>
								<Typography
									variant={"h2"}
									sx={{
										color: "#344357",
										fontSize: "0.975rem",
										fontWeight: "700",
										mb: 2,
									}}
									className={nunito.className}
								>
									OTP send on +91 {phoneNumber}
								</Typography>
								<Typography
									variant={"h2"}
									onClick={() => {
										removeQueryParams();
										setEditNumber(phoneNumber);
										setEdit(true);
									}}
									sx={{
										color: "#E8713C",
										fontSize: "0.9rem",
										fontWeight: "700",
										mb: 2,
										cursor: "pointer",
									}}
								>
									Edit ?
								</Typography>
							</Div>
							<Formik
								validateOnChange={true}
								initialValues={{
									otp: "",
								}}
								validationSchema={validationSchema}
								onSubmit={(data, { setSubmitting }) => {
									console.log(data);
									setSubmitting(false);
									OtpReceived(data.otp);
								}}
							>
								{({ isSubmitting, handleSubmit, values, handleChange }) => (
									<Form
										style={{ textAlign: "left" }}
										noValidate
										autoComplete="off"
									>
										<Div sx={{ mb: 2 }}>
											<TextField
												className="w-full"
												value={values.otp}
												onChange={handleChange}
												name="otp"
												label="OTP"
												type="text"
												color="secondary"
												inputProps={{ maxLength: 6 }}
											/>

											{error && (
												<Div sx={{ display: "flex", alignItems: "center" }}>
													<ErrorOutlineIcon color="error" fontSize="small" />
													<Typography
														sx={{
															color: "red",
															fontSize: "12px",
															ml: 1,
														}}
													>
														{error}
													</Typography>
												</Div>
											)}
										</Div>
										<Div
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												mb: 4,
											}}
										>
											<Typography
												variant={"body1"}
												sx={{
													fontSize: "0.875rem",
													fontWeight: "500",
												}}
											>
												{seconds > 0
													? `Time Remaining: ${seconds} seconds`
													: "No OTP Received? Try Again"}
											</Typography>
											<Button
												disabled={seconds > 0}
												type="button"
												variant="text"
												onClick={resendOTP}
												sx={{
													fontSize: "0.8rem",
												}}
											>
												{seconds > 0 ? "" : "Resend OTP"}
											</Button>
										</Div>
										<Button
											type="submit"
											onClick={handleSubmit}
											className={`bg-[#E8713C] w-full text-white hover:bg-[#D94300] ${nunito.className} font-extrabold items-center`}
											loading={isSubmitting}
										>
											{/* {isLoading ? (
												<>
													<CircularProgress
														size="1.2rem"
														sx={{ color: "white" }}
													/>
													{"Verifying with the Server"}
												</>
											) : ( */}
											Verify OTP
											{/* )} */}
										</Button>
									</Form>
								)}
							</Formik>
							{/* <React.Fragment>
                <Typography
                  variant={"h6"}
                  mb={2}
                  pt={4}
                  pb={3}
                  sx={{
                    textAlign: "center",
                    paddingTop: "0",
                    paddingBottom: "0",
                    color: "#B6C6E3",
                    fontSize: "11px",
                    fontWeight: "700",
                    lineHeight: "1.2",
                    letterSpacing: "0.2em"
                  }}
                >
                  <span>-OTHER LOGIN OPTION-</span>
                </Typography>
                <SocialButtons />
              </React.Fragment> */}
						</Div>

						<Div
							sx={{
								flex: "1 ",
								display: "flex",
								my: "10%",
								width: "380px",
								maxHeight: "25%",
								marginLeft: "auto",
								marginBottom: "2%",
								marginRight: isBelow990px ? "auto" : "15%",
								marginTop: 0,
								padding: "20px",
								justifyContent: "center",
								alignContent: "center",
							}}
						>
							<LoginFooter />
						</Div>
					</Div>
					{!disableSmLogin && (
						<Div
							className="hidden sm:flex bg-[#f5f6fa] h-screen"
							sx={{
								height: "100%",

								display: "flex",
								width: "50%",
								alignItems: "center",
								justifyContent: "center",
								flexWrap: "wrap",
								padding: "5%",
								textAlign: "center",
							}}
						>
							<SwipeableTextMobileStepper />
						</Div>
					)}
				</Div>
			)}
		</>
	);
};

export default Otp;
