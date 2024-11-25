import {
	Bell,
	Blocks,
	Contact2,
	CreditCard,
	File,
	FileStack,
	GraduationCap,
	Layout,
	LayoutDashboard,
	Menu,
	MessageSquare,
	Settings,
	Trash,
	User2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Image from "next/image";
import HelpMenu from "../../../Dashboard/HelpMenu";

export const navlinksAdmin = [
	{
		link: "/admin/dashboard",
		title: "Dashboard",
		icon: <LayoutDashboard size={20} className="min-w-[20px]" />,
	},
	{
		link: "/admin/sessions",
		title: "Sessions",
		icon: <GraduationCap size={20} className="min-w-[20px]" />,
	},
	{
		link: "/admin/lawyers",
		title: "Lawyers",
		icon: <User2 size={20} className="min-w-[20px]" />,
	},
	{
		link: "/admin/layout",
		title: "Layout",
		icon: <Layout size={20} className="min-w-[20px]" />,
	},
	{
		link: "/admin/messages",
		title: "Messages",
		icon: <MessageSquare size={20} className="min-w-[20px]" />,
	},
];

export const navlinksLawyers = [
	{
		link: "/dashboard",
		title: "Dashboard",
		icon: <LayoutDashboard size={20} className="min-w-[20px]" />,
		links: [
			{
				link: "/dashboard",
				title: "Dashboard",
			},
		],
	},
	{
		link: "/document",
		title: "Documents",
		icon: <File size={20} className="min-w-[20px]" />,
		links: [
			{
				link: "/document/new",
				title: "New Document",
			},
			{
				link: "/document",
				title: "Document List",
			},
		],
	},
	{
		link: "/template",
		title: "Template",
		icon:   <FileStack className="min-w-[20px]" />,
		links: [
			{
				link: "/template",
				title: "Template",
			},
		],
	},
	// {
	// 	link: "/payment",
	// 	title: "Payments",
	// 	icon: <CreditCard size={20} className="min-w-[20px]" />,
	// 	links: [
	// 		{
	// 			link: "/payment",
	// 			title: "Payments",
	// 		},
	// 	],
	// },
	{
		link: "/contacts",
		title: "Contacts",
		icon: <Contact2 className="min-w-[20px]" />,
		links: [
			{
				link: "/contacts",
				title: "Contacts",
			},
		],
	},
	{
		link: "/team",
		title: "Team",
		icon: <GroupsOutlinedIcon className="min-w-[20px]" />,
		links: [
			{
				link: "/team",
				title: "Team",
			},
		],
	},
	{
		link: "/trash",
		title: "Trash",
		icon: <Trash className="min-w-[20px]" />,
		links: [
			{
				link: "/trash",
				title: "Trash",
			},
		],
	},

	// {
	// 	link: "/settings",
	// 	title: "Business Settings",
	// 	icon: <Settings size={20} className="min-w-[20px]" />,
	// 	links: [
	// 		{
	// 			link: "/settings",
	// 			title: "Business Settings",
	// 		},
	// 		// {
	// 		// 	link: "/config/profile",
	// 		// 	title: "Config",
	// 		// },
	// 	],
	// },
];

function SideNav({ isAdmin }) {
	const router = useRouter();
	const [hidden, setHidden] = useState("w-0 opacity-0");
	const [Switch, setSwitch] = useState(false);
	useEffect(() => {
		setSwitch(!Switch);
	}, [hidden]);

	const pathname = usePathname();
	// console.log(pathname, pathname?.includes("/lawyers/sessions"));
	return (
		<div className="py-1 fixed top-0 z-50 h-screen bg-[#05686E] text-background hidden lg:inline w-fit transition-all">
			<div className="flex flex-col items-center h-full min-w-fit">
				<Link href={"/dashboard"} className="px-0">
					<Image
						width={52}
						height={52}
						src="/images/logo-white.png"
						className={`w-[52px]  p-1 object-fill transition-opacity ${
							Switch ? "opacity-100" : "opacity-0"
						}`}
						alt=""
					/>
				</Link>
				<div className="mt-7 flex flex-col gap-3">
					{navlinksLawyers.map((ele, i) => {
						return (
							<div className="relative group hover:bg-[#E8713C]" key={i}>
								<Link
									href={ele.link}
									className={`flex items-center px-6 py-4   ${
										pathname?.includes(ele.link) ? "bg-[#E8713C]" : ""
									}`}
								>
									{ele.icon}
									{/* <h1 className={`${hidden} transition-all`}>{ele.title}</h1> */}
								</Link>
								<div className="absolute min-w-[300px] h-full left-[100%] z-50 hidden group-hover:flex top-0">
									<div className="border-y border-r relative w-full min-h-[56px] bg-white flex flex-col">
										{ele.links.map((e, i) => {
											if (ele.links.length === 1) {
												return (
													<Link
														href={e.link}
														key={i}
														className={`hover:bg-[#E8713C] ${
															pathname?.includes(e.link)
																? "bg-[#E8713C] text-background"
																: "text-black"
														} hover:text-background shadow-xl h-full cursor-pointer py-3 px-4 flex items-center min-h-[56px]`}
													>
														<h1>{e.title}</h1>
													</Link>
												);
											}
											if (i === 0) {
												return (
													<Link
														href={e.link}
														key={i}
														className={`bg-white text-black hover:bg-[#E8713C] ${
															pathname?.includes(e.link)
																? "bg-[#E8713C] text-background"
																: ""
														} hover:text-background shadow-xl cursor-pointer py-3 px-4 h-full flex items-center min-h-[56px]`}
													>
														<h1>{e.title}</h1>
													</Link>
												);
											}
											if (i === ele.links.length - 1) {
												return (
													<Link
														href={e.link}
														key={i}
														className={`bg-white text-black hover:bg-[#E8713C] ${
															pathname?.includes(e.link)
																? "bg-[#E8713C] text-background"
																: ""
														} hover:text-background shadow-xl cursor-pointer py-3 px-4 h-full flex items-center min-h-[56px]`}
													>
														<h1>{e.title}</h1>
													</Link>
												);
											}
											return (
												<Link
													href={e.link}
													key={i}
													className={`bg-[#E8713C] ${
														pathname?.includes(e.link)
															? "bg-[#E8713C] text-background"
															: ""
													} cursor-pointer py-3 px-4 h-full flex items-center min-h-[56px]`}
												>
													<h1>{e.title}</h1>
												</Link>
											);
										})}
									</div>
								</div>
							</div>
						);
					})}

				</div>
				<div className="flex flex-col h-full justify-end">
           			<HelpMenu />

				</div>
			</div>
			{/* <div className="fixed bottom-1  lg:bottom-5 right-1 lg:right-5">
                <HelpMenu />
            </div> */}
		</div>
	);
}

export default SideNav;
