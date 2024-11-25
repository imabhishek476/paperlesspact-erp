import React from 'react'
import { ThemeProvider, useTheme } from "@mui/system";
import OnboardingSuccess from './OnboardingSuccess';


const OnboardingSuccessPage = () => {
	const theme = useTheme();
	return (
		<div>
			<ThemeProvider theme={theme}>
				<OnboardingSuccess />
			</ThemeProvider>
		</div>
	);
}

export default OnboardingSuccessPage
