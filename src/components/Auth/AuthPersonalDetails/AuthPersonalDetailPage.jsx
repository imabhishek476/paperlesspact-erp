import React from "react";
import AuthPersonalDetails from "./AuthPersonalDetails";
import { ThemeProvider, useTheme } from "@mui/system";

function AuthPersonalDetailPage() {
	const theme = useTheme();
	return (
		<div>
			<ThemeProvider theme={theme}>
				<AuthPersonalDetails />
			</ThemeProvider>
		</div>
	);
}

export default AuthPersonalDetailPage;
