import { CircularProgress } from "@nextui-org/react";
import React, { useState } from "react";

const DocumentPreviewFrame = ({ url, height }) => {
	const [loading, setLoading] = useState(true);
	return (
		<>
			{loading ? (
				<div
					style={{ height: height }}
					className="flex justify-center items-center w-full flex-col"
				>
					{" "}
					<CircularProgress />
					<p className="text-[#05686E] text-[14px] md:text-[16px] lg:text-[18px] text-center mt-[50px] md:mt-[50px]">
					Please wait, we are processing your request
					</p>
				</div>
			) : (
				<></>
			)}
			<iframe
				src={url}
				style={{
					height: height,
				}}
				onLoad={() => setLoading(false)}
				className={`w-full border-2 sm:border-none transition-all`}
			></iframe>
		</>
	);
};

export default DocumentPreviewFrame;
