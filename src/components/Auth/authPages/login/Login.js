import React, { useEffect, useState } from "react";
import { CardContent, TextField, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import LoadingButton from "@mui/lab/LoadingButton";
// import { useLocation } from "react-router-dom";
// import SwipeableTextMobileStepper from "../../components/SwipeableTextMobileStepper";
import Otp from "../otp";
// import LoginFooter from "app/pages/components/LoginFooter";
// import { generateOtp } from "app/Apis/Login";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import Animation from "app/pages/components/Animations/Animation";
import PersonIcon from "@mui/icons-material/Person";
import InputAdornment from "@mui/material/InputAdornment";
// import { useTheme } from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";
import Div from "@/components/Shared/Div/Div";
import SwipeableTextMobileStepper from "../../components/SwipeableTextMobileStepper";
import LoginFooter from "../../components/LoginFooter";
import { generateOtp, getUserProfile } from "@/Apis/login";
import Animation from "../../components/Animations/Animation";
import { useSearchParams } from "next/navigation";
import { Nunito } from "next/font/google";
import { Button, Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import SocialButtons from "./socialbutton/SocialButtons";

const nunito = Nunito({ subsets: ["latin"] });

const Login = ({ disableSmLogin, editNumber }) => {
	// const theme = useTheme();
	const isBelow990px = useMediaQuery((theme) => theme.breakpoints.down(990));

	useEffect(() => {
		console.log("is mobile", disableSmLogin);
	}, [disableSmLogin]);

	const queryParameters = useSearchParams();
	const router = useRouter();
	const phoneUrl = queryParameters.get("phoneNumber");
	const [isLoading, setIsLoading] = useState(false);

	const [showOtp, setShowOtp] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [error, setError] = useState("");

	const handleChange = (event) => {
		setPhoneNumber(event.target.value);
	};
	const getOtp = async () => {
		if (phoneNumber) {
			const response = await generateOtp(phoneNumber);
		} else {
			const response = await generateOtp(phoneUrl);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (
			/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phoneNumber)
		) {
			setShowOtp(true);
			setError("");
			getOtp();
		} else {
			setError("Enter a valid phone number");
			setTimeout(() => {
				setError("");
			}, 4000);
		}
	};
	useEffect(() => {
		if (phoneUrl) {
			if (
				/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phoneUrl)
			) {
				setShowOtp(true);
				getOtp();
			} else {
				setError("Enter a valid phone number");
			}
		}
		if (editNumber) {
			setPhoneNumber(editNumber);
		}
	}, [phoneUrl]);

	useEffect(() => {
		if (queryParameters.get("jwt")) {
			console.log(queryParameters.get("jwt"));
			getUserProfile(queryParameters.get("jwt"))
				.then((user) => {
					Cookies.set("accessToken", queryParameters.get("jwt"), {
						expires: 1,
					});
					Cookies.set("id", user?.data.id, {
						expires: 1,
					});
					Cookies.set("isLoggedIn", true);
					router.push(`/document/new?id=${queryParameters.get("id")}`);
				})
				.catch((err) => console.log(err.message));
		}
	}, []);

	return (
		<>
			{isLoading ? <Animation /> : null}
			{showOtp ? (
				<Otp
					phoneNumber={phoneNumber ? phoneNumber : phoneUrl}
					disableSmLogin={disableSmLogin}
				/>
			) : (
				<div 
					className={`${nunito.className} bg-white flex flex-col md:flex-row h-[90vh]`}
				>
					<div className="w-full flex h-full flex-col justify-between items-center">
						<div className={`flex p-5 w-[380px] justify-end flex-col ${isBelow990px ? "mr-auto" : "mr-[15%]"} flex-1 my-[10%] ml-auto mb-[12%] `}
						>
							<div className="flex mb-2"	
							>
								<Link href="https://easedraft.com">
									<Image
									    loading="lazy"
										src={`/images/Colibri.png`}
										width={210}
										height={50}
										style={{
											objectFit: "contain",
											marginBottom: "10px",
										}}
										alt="Lawinzo"
									/>
								</Link>
							</div>
							<h2 className={`${nunito.className} text-[#364a63] text-xl font-bold mb-4`}>
							Access the EaseDraft Panel
							</h2>
							{/* <Typography
								variant={"h2"}
								className={nunito.className}
								sx={{
									color: "#364a63",
									fontSize: "1.25rem",
									fontWeight: "700",
									mb: 2,
								}}
							>
								Access the EaseDraft Panel
							</Typography> */}
							<form onSubmit={handleSubmit} autoComplete="off">
								<div className="mb-8 font-normal mt-5 text-[#3c4d62]"
									// sx={{ mb: 4, color: "#3c4d62", fontWeight: "400", mt: 2.9 }}
								>
									<label>
										<TextField
											fullWidth
											className={nunito.className}
											id="Enter Mobile Number"
											label="Enter Mobile Number"
											type="tel"
											color="secondary"
											onChange={handleChange}
											value={phoneNumber}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<PersonIcon />
													</InputAdornment>
												),
												maxlength: 10,
											}}
											required
										/>
									</label>
									{error && (
										<div className="flex items-center">
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
										</div>
									)}
								</div>
								<div className="flex items-center mb-4">
									<div className="flex" >
										<Typography
											className={nunito.className}
											sx={{
												fontFamily: "Roboto, sans-serif",
												fontSize: "0.875rem",
												fontWeight: "550",
												marginBottom: "0.5rem",
												color: "#344357",
											}}
										>
											{" "}
											By continuing, I agree to EaseDraft's{" "}
											<Link
												href="https://easedraft.com/privacy-policy"
												underline="none"
												sx={{
													color: "#E8713C",
													cursor: "pointer",
													"&:hover": {
														color: "#D94300",
													},
												}}
												target="_blank"
												rel="noreferrer"
												className={nunito.className}
											>
												Privacy Policy
											</Link>{" "}
											and{" "}
											<Link
												href="https://easedraft.com/terms-and-conditions"
												underline="none"
												sx={{
													color: "#E8713C",
													"&:hover": {
														color: "#D94300",
													},
												}}
												target="_blank"
												rel="noreferrer"
												className={nunito.className}
											>
												Terms & Conditions,
											</Link>
											and receive communication from EaseDraft via SMS, E-Mail
											and WhatsApp
										</Typography>
									</div>
								</div>
								<Button
									fullWidth
									type="submit"
									variant="contained"
									size="large"
									disableElevation
									className={`bg-[#E8713C] rounded-sm text-white hover:bg-[#D94300] ${nunito.className} font-extrabold items-center`}
								>
									Get OTP
								</Button>
							</form>
							<>
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
										marginTop: "20px",
										letterSpacing: "0.2em",
									}}
								>
									<span>-OTHER LOGIN OPTION-</span>
								</Typography>
								<SocialButtons />
							</>
						</div>
						<div className={`flex flex-1 my-[10%] w-[380px] max-h-[25%] ml-auto  mt-0 p-5 justify-center items-center mb-[2%] ${isBelow990px? "mr-auto":"mr-[15%]"}`}
							// sx={{
							// 	flex: "1 ",
							// 	display: "flex",
							// 	my: "10%",
							// 	width: "380px",
							// 	maxHeight: "25%",
							// 	marginLeft: "auto",
							// 	marginBottom: "2%",
							// 	marginRight: isBelow990px ? "auto" : "15%",
							// 	marginTop: 0,
							// 	padding: "20px",
							// 	justifyContent: "center",
							// 	alignContent: "center",
							// }}
						>
							<LoginFooter />
						</div>
					</div>
					{!disableSmLogin && (
						<div className="h-[100vh] hidden md:flex w-full items-center justify-center flex-wrap p-[2%] text-center bg-[#f5f6fa]"
							// className="hidden sm:flex bg-[#f5f6fa] h-screen w-full"
							// sx={{
							// 	height: "100dvh",
							// 	display: {sm:"flex",xs:'none',xxs:'none'},
							// 	width: "100%",
							// 	alignItems: "center",
							// 	justifyContent: "center",
							// 	flexWrap: "wrap",
							// 	padding: "2%",
							// 	textAlign: "center",
							// 	backgroundColor:'#f5f6fa'
							// }}
						>
							<SwipeableTextMobileStepper />
						</div>
					)}
				</div>
				// </Div>
			)}
		</>
	);
};

export default Login;
