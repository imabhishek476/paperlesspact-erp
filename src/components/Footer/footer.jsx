import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Badge, Link } from "@nextui-org/react";
import axios from "axios";

const Footer = ({ footer }) => {
	console.log(footer);
	// const [footer, setDocumentObject] = useState(null);
	const getJSON = async () => {
		const data = axios
			.get(
				"https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json"
				// "images-lawinzo.s3.ap-south-1.amazonaws.com/lawinzoHome.json"
			)
			.then(() => {
				console.log(data);
				setDocumentObject(data.data);
			});
		// const document = await data.json()?.footer;
		// console.log(data);
		// setDocumentObject(data.data);
	};

	// useEffect(() => {
	//   // getJSON();
	//   // fetch("https://plp-home-ui.s3.ap-south-1.amazonaws.com/index.json")
	//   //   .then((res) => res.json())
	//   //   .then((data) => console.log(data));
	// }, []);

	return (
		// <footer className="footer relative text-gray-200 dark:text-gray-200 bg-[#05686E] mt-8 md:mt-16">
		//   <div className="container">
		//     <div className="grid grid-cols-12">
		//       <div className="col-span-12">
		//         <div className="py-[60px] px-0">
		//           <div className="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
		//             <div className="lg:col-span-4 md:col-span-12">
		//               <a href="#" className="text-[22px] focus:outline-none">
		//                 <Image
		//                   src="/images/logo.webp"
		//                   alt="lawinzo"
		//                   height={25}
		//                   width={140}
		//                   className="object-cover"
		//                 />
		//               </a>
		//               <p className="mt-6 text-gray-300">
		//                 {footer?.description}
		//               </p>
		//               {/* <ul className="list-none mt-6">
		//                 <li className="inline">
		//                   <a
		//                     href="https://www.linkedin.com/company/lawinzo/"
		//                     target="_blank"
		//                     className="p-2 mx-1  border border-gray-800 rounded-md hover:border-[#EABF4E] dark:hover:border-[#EABF4E] hover:bg-[#EABF4E] dark:hover:bg-[#EABF4E]"
		//                   >
		//                     <LinkedInIcon className="pb-1" />
		//                   </a>
		//                 </li>
		//                 <li className="inline">
		//                   <a
		//                     href="https://www.facebook.com/LawinzoERP"
		//                     target="_blank"
		//                     className="p-2 mx-1  border border-gray-800 rounded-md hover:border-[#EABF4E] dark:hover:border-[#EABF4E] hover:bg-[#EABF4E] dark:hover:bg-[#EABF4E]"
		//                   >
		//                     <FacebookIcon className="pb-1" />
		//                   </a>
		//                 </li>
		//                 <li className="inline">
		//                   <a
		//                     href="/"
		//                     target="_blank"
		//                     className="p-2 mx-1 border border-gray-800 rounded-md hover:border-[#EABF4E] dark:hover:border-[#EABF4E] hover:bg-[#EABF4E] dark:hover:bg-[#EABF4E]"
		//                   >
		//                     <InstagramIcon className="pb-1" />
		//                   </a>
		//                 </li>
		//                 <li className="inline">
		//                   <a
		//                     href="/"
		//                     target="_blank"
		//                     className="p-2 mx-1 border border-gray-800 rounded-md hover:border-[#EABF4E] dark:hover:border-[#EABF4E] hover:bg-[#EABF4E] dark:hover:bg-[#EABF4E]"
		//                   >
		//                     <TwitterIcon className="pb-1" />
		//                   </a>
		//                 </li>
		//                 <li className="inline">
		//                   <a
		//                     href="mailto:connect@lawinzo.com"
		//                     className="p-2 mx-1 border border-gray-800 rounded-md hover:border-[#EABF4E] dark:hover:border-[#EABF4E] hover:bg-[#EABF4E] dark:hover:bg-[#EABF4E]"
		//                   >
		//                     <MailOutlineIcon className="pb-1" />
		//                   </a>
		//                 </li>
		//               </ul> */}
		//             </div>

		//             {/* <div className="lg:col-span-2 md:col-span-4">
		//               <h5 className="tracking-[1px] text-gray-100 font-semibold">
		//                 Company
		//               </h5>
		//               <ul className="list-none footer-list mt-6">
		//                 <li>
		//                   <Link
		//                     href="/producterp.html"
		//                     className="text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
		//                   >
		//                     <i className="uil uil-angle-right-b"></i> Lawyer ERP
		//                   </Link>
		//                 </li>
		//                 <li className="mt-[10px]">
		//                   <Link
		//                     href="/whoweare.html"
		//                     className="text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
		//                   >
		//                     <i className="uil uil-angle-right-b"></i> Who We Are
		//                   </Link>
		//                 </li>
		//                 <li className="mt-[10px]">
		//                   <Link
		//                     href="/services.html"
		//                     className="text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
		//                   >
		//                     <i className="uil uil-angle-right-b"></i> What We Serve
		//                   </Link>
		//                 </li>
		//               </ul>
		//             </div> */}

		//             <div className="lg:col-span-3 md:col-span-4">
		//               <h5 className="tracking-[1px] text-gray-100 font-semibold">
		//                 Usefull Links
		//               </h5>
		//               <ul className="list-none footer-list mt-6">
		//                 <li>
		//                   <Link
		//                     href="terms.html"
		//                     className="text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
		//                   >
		//                     <i className="uil uil-angle-right-b"></i> Terms of
		//                     Services
		//                   </Link>
		//                 </li>
		//                 <li className="mt-[10px]">
		//                   <Link
		//                     href="privacy.html"
		//                     className="text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
		//                   >
		//                     <i className="uil uil-angle-right-b"></i> Privacy Policy
		//                   </Link>
		//                 </li>
		//               </ul>
		//             </div>

		//             <div className="lg:col-span-3 md:col-span-4">
		//               <h5 className="tracking-[1px] text-gray-100 font-semibold">
		//                 Contact Us -
		//               </h5>
		//               <form>
		//                 <label className="form-label">
		//                   {footer?.address?.description}
		//                 </label>
		//                 <div className="grid grid-cols-1">
		//                   <div className="foot-subscribe my-3">
		//                     <label className="form-label">
		//                       {footer?.address?.address}
		//                     </label>
		//                     {/* <label className="form-label">Galleria Dlf-IV,</label>
		//                     <label className="form-label">
		//                       Gurgaon, Haryana 122009
		//                     </label> */}
		//                   </div>
		//                 </div>
		//               </form>
		//               <h5 className="tracking-[1px] text-gray-100 font-semibold">
		//                 Download Our Application
		//               </h5>
		//               <div className="flex justify-content: space-between mt-1">
		//                 <Link
		//                   href="#"
		//                   className="hidden lg:block h-[40px] w-[115px]"
		//                   disableAnimation
		//                 >
		//                   <Image
		//                     className="rounded-md object-cover h-[40px] w-[115px]"
		//                     src={"/images/playStore1.png"}
		//                     alt={"Play Store Link"}
		//                     height={40}
		//                     width={115}
		//                   />
		//                 </Link>
		//                 <Link
		//                   href="#"
		//                   className="hidden lg:block ml-2 h-[40px] w-[115px]"
		//                   disableAnimation
		//                 >
		//                   <Image
		//                     className="rounded-md object-fill h-[40px] w-[115px]"
		//                     src={"/images/appStoreIcon.png"}
		//                     alt={"App Store Link"}
		//                     height={40}
		//                     width={115}
		//                   />
		//                 </Link>
		//               </div>
		//             </div>
		//           </div>
		//         </div>
		//       </div>
		//     </div>
		//   </div>

		//   <div className="py-[30px] px-0 border-t border-white]">
		//     <div className="container text-center">
		//       <div className="grid md:grid-cols-2 items-center">
		//         <div className="flex ltr:md:text-left rtl:md:text-right text-center">
		//           <p className="mb-0">{footer?.bottomNav?.copyright}</p>
		//         </div>
		//         <p className="flex justify-end xxs:hidden md:flex">
		//           {" "}
		//           {footer?.bottomNav?.finalMsg}
		//           <Image
		//             className="mx-1 mb-1"
		//             src="/images/Make_In_India.webp"
		//             width={50}
		//             height={50}
		//             alt="Made In India Tiger"
		//           />
		//         </p>
		//       </div>
		//     </div>
		//   </div>
		// </footer>
		<footer className="bg-[#05686E] fixed bottom-0 w-full pt-5 mt-10">
			<div className="max-w-[1280px] w-[90%] p-0 mx-auto">
				<div className="flex items-start justify-between sm:flex-row flex-col gap-5 ">
					<div className="sm:w-1/4">
						<div className="flex items-center">
							<Link href={"/"}>
								<Image
									src="https://plp-home-ui.s3.ap-south-1.amazonaws.com/easedraft-icon-white.png"
									width={394}
									height={76}
									alt="logo"
									className="w-52 relative sm:-left-2"
								/>
							</Link>
							{footer?.badge && (
								<div
									className={
										"rounded-md bg-[#e4f6f1] text-[#056b70] text-[12px] py-1 px-[10px]"
									}
								>
									{footer.badge}
								</div>
							)}
						</div>
						<p className="mt-5 text-[#fff]">{footer?.description}</p>
					</div>
					<ul className="flex flex-col gap-1 pt-5">
						{footer?.links?.map((e, i) => (
							<li key={i} className="sm:block hidden">
								<Link
									className="text-[#fff]"
									href={`https://easedraft.com${e?.slug}`}
								>
									{e?.title}
								</Link>
							</li>
						))}
						{/* {footer.links2.map((e, i) => (
              <li key={i} className="">
                <Link  className="text-[#fff]" href={e?.slug}>{e?.title}</Link>
              </li>
            ))} */}
					</ul>
					<div className="w-[26%] sm:inline hidden">
						<h1 className=" text-lg text-[#fff]">Contact Us -</h1>
						{/* <h2 className=" text-[#fff]">{footer.address[0]?.description}</h2> */}
						<address className="text-[#fff]">
							{footer?.address[0]?.address}
						</address>
						<h3 className="mt-3 text-[#fff]">
							<Link
								href={`mailto:${footer?.address[0]?.contact?.split(" ")[0]}`}
								className="text-[#fff]"
							>
								{footer?.address[0]?.contact?.split("/")[0]}
							</Link>{" "}
							<br />
							<Link
								href={`tel:${footer.address[0].contact.split(" ")[1]}`}
								className="text-[#fff]"
							>
								{footer?.address[0]?.contact?.split("/")[1]}
							</Link>
						</h3>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="flex sm:flex-row flex-col sm:justify-between sm:items-center py-8 gap-2">
					<p className="text-[#fff]">
						{footer?.bottomNav?.copyright} powered by Ozybrains LLP
					</p>
					<p className="hidden sm:block text-[#fff]">
						{footer?.bottomNav?.finalMsg}
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
