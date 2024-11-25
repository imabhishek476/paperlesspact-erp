import { Avatar, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Confetti from "react-confetti";
import { Button } from "@nextui-org/react";
import { Copyright } from "lucide-react";
import Cookies from "js-cookie";
import { getUserProfile } from "@/Apis/login";
import Image from "next/image";
import useDimensions from "react-use-dimensions";
import { useRouter,useSearchParams } from "next/navigation";
import {
	useWindowSize,
	useWindowWidth,
	useWindowHeight,
} from "@react-hook/window-size";
import Link from "next/link";
import LoadingPage from "@/components/LoadingPage/loadingPage";
function OnboardingSuccess() {
	// const [ref, { x, y, width,height}] = useDimensions();

	const [windowSize, setWindowSize] = useState();
	const [docId, setdocId] = useState();
	const [teamId,setTeamId] =useState()
	const [celebrate, setCelebrate] = useState(null);
	const [userDetails, setUserDetails] = useState(null);
	const isBelow990px = useMediaQuery((theme) => theme.breakpoints.down(990));
	const [width, height] = useWindowSize();
	const router = useRouter();
	const searchParams =useSearchParams()
	// useEffect(()=>{
	//   if (typeof window !== "undefined") {
	//     setWindowSize({w:window.innerWidth, h:window.innerHeight});
	//     console.log(window.innerWidth)
	//     console.log(window.innerHeight)}
	// },[])
	useEffect(() => {
		setCelebrate(true);
		setTimeout(() => {
			setCelebrate(false);
		}, 8000);
	}, []);
	const profile = async () => {
		const profile = await getUserProfile(Cookies.get("accessToken"));
		if (profile) {
			console.log(
				profile?.data?.fullname !== "" && Cookies.get("onbording") === "true",
				Cookies.get("onbording")
			);
			if (
				profile?.data?.fullname !== "" &&
				Cookies.get("onbording") === "true"
			) {
				const teamId =searchParams.get("teamId")
				const adminId =searchParams.get("adminId")
				console.log(teamId)
				if(teamId){
					if(adminId){
						router.push(`/team/invited?teamId=${teamId}&adminId=${adminId}`)
					} else{
						router.push(`/team/invited?teamId=${teamId}`)
					}
				} else
				router.push("/");
			}
			setUserDetails(profile?.data);
		}
	};
	useEffect(() => {
		profile();
	}, []);
	useEffect(() => {
		const id = searchParams.get("id")
		const teamID =searchParams.get("teamId")
		console.log(
			typeof id,
			id !== "undefined",
			id
		);
		if (id && id !== "undefined") {
			setdocId(id);
		} else {
			setdocId(false);
		}
		if(teamID && teamID !== "undefined"){
			setTeamId(teamID)
		} else {
			setTeamId(false)
		}
	}, [searchParams]);

	// console.log(height)
	return !userDetails && docId ? (
		<LoadingPage />
	) : (
		<div className="w-full h-full">
			<header className="py-4 fixed z-3 top-0 w-full border-b bg-[#056a70ff]">
				<div className="container flex items-center justify-between">
					{!isBelow990px ? (
						<Image
							width={170}
							height={50}
							src={
								"https://plp-home-ui.s3.ap-south-1.amazonaws.com/easedraft-icon-white.png"
							}
						/>
					) : (
						<Image
							width={30}
							height={30}
							src={"/images/logo-white.png"}
						></Image>
					)}
					<div className="flex justify-center bg-white border rounded-[50%] items-center">
						{userDetails?.imageUrl ? (
							<img
								style={{
									width: "35px",
									height: "35px",
									border: "1px solid white",
									borderRadius: "50%",
									objectFit: "fill",
								}}
								src={userDetails?.imageUrl}
								alt=""
							/>
						) : (
							<PersonIcon sx={{ fontSize: "30px" }} />
						)}
					</div>
				</div>
			</header>
			<div className="relative z-999 h-full">
				{celebrate && (
					<Confetti
						onConfettiComplete={() => setCelebrate(false)}
						width={width}
						height={height}
						// width={width}
						// height={height}
						tweenDuration="5000"
						gravity={0.1}
						numberOfPieces={400}
					/>
				)}

				<div className=" w-full h-full flex justify-center items-center flex-col ">
					<div className="flex min-w-0 justify-center mb-3  border rounded-[50%] mt-[100px]">
						{userDetails?.imageUrl ? (
							<img
								style={{
									width: "60px",
									height: "60px",
									border: "1px solid white",
									borderRadius: "50%",
									objectFit: "contain",
								}}
								src={userDetails?.imageUrl}
								alt=""
							/>
						) : (
							<PersonIcon sx={{ fontSize: "30px" }} />
						)}
					</div>
					<Typography
						color="primary.main"
						sx={{
							mb: "40px",
							fontSize: { xs: "26px", md: "32px" },
							fontWeight: "600",
						}}
					>
						Congratulations!
					</Typography>

					<Typography
						sx={{ fontWeight: 600, fontSize: "20px" }}
						color="primary.main"
					>
						Hi, {userDetails?.fullname}
					</Typography>
					<Typography
						sx={{ fontWeight: 500, fontSize: "16px" }}
						color="primary.main"
					>
						Thank you for Signing Up.
					</Typography>
					<div className="mt-5">
						<Link
							href={docId ? "/document/new?id=" + docId : "/dashboard"}
							size="sm"
							className="font-semibold rounded-full bg-[#05686E] text-background px-5 py-3"
						>
							Go to Dashboard
						</Link>
					</div>
				</div>
			</div>

			<footer className="py-6 fixed w-full bottom-0 bg-foreground text-background">
				<div className="container flex justify-between">
					<h1 className="flex md:text-lg text-sm gap-2 font-bold items-center">
						Copyright EaseDraft <Copyright size={18} /> 2023
					</h1>
					<div className="hidden md:flex items-center gap-5">
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
		</div>
	);
}

export default OnboardingSuccess;
