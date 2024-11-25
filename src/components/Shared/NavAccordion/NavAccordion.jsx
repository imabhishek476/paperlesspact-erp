import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Grid } from "lucide-react";

export default function NavAccordion() {
	const itemClasses = {
		base: "py-0 w-full rounded-none",
		title: "font-normal text-medium rounded-none",
		trigger:
			"px-2 py-0 data-[hover=true]:bg-default-100 h-14 rounded-none border-y flex items-center",
		indicator: "text-medium rounded-none",
		content: "text-small px-2 rounded-none",
	};

	const defaultContent =
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

	return (
		<Accordion
			showDivider={false}
			className=" flex flex-col gap-1 w-full rounded-none"
			// variant="shadow"
			itemClasses={itemClasses}
		>
			<AccordionItem
				key="1"
				aria-label="Connected devices"
				startContent={<Grid className="text-primary" />}
				subtitle={
					<p className="flex">
						2 issues to <p className="text-primary ml-1">fix now</p>
					</p>
				}
				title="Connected devices"
			>
				{defaultContent}
			</AccordionItem>
			<AccordionItem
				key="2"
				aria-label="Apps Permissions"
				startContent={<Grid />}
				subtitle="3 apps have read permissions"
				title="Apps Permissions"
			>
				{defaultContent}
			</AccordionItem>
			<AccordionItem
				key="3"
				aria-label="Pending tasks"
				classNames={{ subtitle: "text-warning" }}
				startContent={<Grid className="text-warning" />}
				subtitle="Complete your profile"
				title="Pending tasks"
			>
				{defaultContent}
			</AccordionItem>
			<AccordionItem
				key="4"
				aria-label="Card expired"
				classNames={{ subtitle: "text-danger" }}
				startContent={<Grid className="text-danger" />}
				subtitle="Please, update now"
				title={
					<p className="flex gap-1 items-center">
						Card expired
						<p className="text-default-400 text-small">*4812</p>
					</p>
				}
			>
				{defaultContent}
			</AccordionItem>
		</Accordion>
	);
}
