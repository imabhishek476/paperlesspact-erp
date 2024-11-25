import React, { useEffect, useState } from "react";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { generateOtp, validateOtp } from "@/Apis/login";
import { Button } from "@nextui-org/react";
import Cookies from "js-cookie";
import { useEnv } from "../Hooks/envHelper/useEnv";

const OtpF = ({ phoneNumber, setUserId, setOtpStatus, fromSigning }) => {
	const [seconds, setSeconds] = useState(30);
	const [error, setError] = useState(null);
	const [otp, setOtp] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [otpForSigning, setOtpForSigning] = useState(true);
	const inDevEnvironment = useEnv();
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
	const OtpReceived = async () => {
		setIsSubmitting(true);
		if (/^\d{6}$/.test(otp)) {
			const response = await validateOtp(phoneNumber, otp);
			setIsSubmitting(false);
			console.log(response);
			if (response?.data?.success) {
				const { accessToken, roles, id } = response?.data?.data;
				if (true) {
					Cookies.set("accessToken", response.data.data.accessToken);
					Cookies.set("isLoggedIn", true);
					Cookies.set("assignedRole", roles[0]);
					Cookies.set("id", id);
				} else {
					Cookies.set("accessToken", response.data.data.accessToken, {
						expires: 1,
						domain: ".easedraft.com",
					});
					Cookies.set("isLoggedIn", true, {
						expires: 1,
						domain: ".easedraft.com",
					});
					Cookies.set("assignedRole", roles[0], {
						expires: 1,
						domain: ".easedraft.com",
					});
					Cookies.set("id", id, {
						expires: 1,
						domain: ".easedraft.com",
					});
				}

				if (!fromSigning) {
					setUserId(id);
				}
				setOtpStatus("verified");
			} else {
				setError("Please enter correct OTP!");
			}
		} else {
			setIsSubmitting(false);
			setError("OTP must be a number and must be exactly 6 digits!");
		}
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
	return (
		<>
			<div className="mt-3 flex justify-between mb-3">
				<Typography
					variant={"h2"}
					sx={{
						color: "#344357",
						fontSize: "0.975rem",
						fontWeight: "700",
						// mb: 2,
					}}
				>
					{fromSigning
						? `OTP sent on phone number ending with ******${phoneNumber
								.toString()
								.slice(-4)}`
						: `OTP sent on +91 ${phoneNumber}`}
				</Typography>
				{!fromSigning && (
					<Typography
						variant={"h2"}
						onClick={() => {
							setOtpStatus("numberEdit");
						}}
						sx={{
							color: "#fda178",
							fontSize: "0.9rem",
							fontWeight: "700",
							// mb: 2,
							cursor: "pointer",
						}}
					>
						Edit?
					</Typography>
				)}
			</div>
			<TextField
				sx={{ width: "100%" }}
				id="outlined-basic"
				label="OTP"
				required
				color="secondary"
				variant="outlined"
				value={otp}
				onChange={(e) => setOtp(e.target.value)}
				error={error}
				InputProps={{
					maxLength: 10,
					endAdornment: (
						<InputAdornment position="end">
							<Button
								type="button"
								size="md"
								radius="sm"
								className="bg-[#fda178] hover:text-[white] hover:bg-[black]"
								onClick={OtpReceived}
								isLoading={isSubmitting}
							>
								Verify
							</Button>
						</InputAdornment>
					),
				}}
				name="otp"
				helperText={error}
			/>
			<div className="flex items-center justify-between">
				<Typography
					variant={"body1"}
					sx={{
						fontSize: "0.875rem",
						fontWeight: "500",
						mb: 2,
						mt: 2,
					}}
				>
					{seconds > 0
						? `Time Remaining: ${seconds} seconds`
						: "No OTP Received? Try Again"}
				</Typography>
				<Button
					isDisabled={seconds > 0}
					variant="light"
					onClick={resendOTP}
					size="sm"
					radius="sm"
				>
					{seconds > 0 ? "" : "Resend OTP"}
				</Button>
			</div>
		</>
	);
};

export default OtpF;
