import Image from "next/image";
import React from "react";

const LoadingPage = () => {
	return (
		<div id="preloader">
			<div
				id="status"
			>
				<div className="">
					<div
						// href="#"
						className="flex flex-col justify-center !w-screen !h-screen text-[45px] focus:outline-none items-center text-center"
					>
						<Image
							height={250}
							width={250}
							src="/images/loading1.gif"
							alt="easedraft"
							className="!relative"
							quality={100}
						/>
						<span className="text-[#05686E] text-[12px] md:text-[16px] mt-10 font-bold">
						Please wait, we are processing your request
					</span>
					</div>
				</div>
				{/* <span className="">
				<div className="spinner w-10 h-10 relative  mx-auto">
					<div className="double-bounce1 w-full h-full rounded-full bg-[#05686E]/60 absolute top-0 start-0"></div>
					<div className="double-bounce2 w-full h-full rounded-full bg-[#05686E]/60 absolute top-0 start-0"></div>
				</div>
				</span> */}
				<div className="absolute top-[57%] w-screen flex justify-center">
					
				</div>
			</div>
		</div>
	);
};

export default LoadingPage;
