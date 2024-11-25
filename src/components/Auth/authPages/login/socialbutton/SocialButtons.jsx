import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@nextui-org/react";
import Link from "next/link";

function SocialButtons() {
	// async function handleSignin() {
	// 	const response = await fetch(
	// 		"https://api.easedraft.com/oauth2/authorize/google?redirect_uri=https://api.easedraft.com/oauth2/redirect"
	// 	);
	// 	const data = await response.json();
	// 	console.log(data);
	// }
	return (
		<div>
			<Stack
				direction={{ xs: "row", md: "row" }}
				alignItems="center"
				justifyContent="center"
				spacing={1.5}
			>
				<Button
					as={Link}
					href={
						"https://api.easedraft.com/oauth2/authorize/google?redirect_uri=https://api.easedraft.com/oauth2/redirect"
					}
					className="bg-red-500 flex items-center text-background rounded w-full py-5"
					// color="error"
				>
					<GoogleIcon color="inherit" />
					<h1 className="font-bold">Sign in with Google</h1>
				</Button>
			</Stack>
		</div>
	);
}

export default SocialButtons;
