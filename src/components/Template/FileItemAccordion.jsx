import { Accordion } from "@nextui-org/react";
import { File, Folder } from "lucide-react";
import React from "react";
import { getFolderStructure } from "@/Apis/folderStructure";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { Box, Typography, styled, useTheme } from "@mui/material";

const subFiles = [
	{
		name: "name",
		isTemplate: 1,
		user: {
			fullname: "Divyansh Malik",
		},
	},
	{
		name: "name",
		isTemplate: 1,
		user: {
			fullname: "Divyansh Malik",
		},
	},
	{
		name: "name",
		isTemplate: 1,
		user: {
			fullname: "Divyansh Malik",
		},
	},
	{
		name: "name",
		isTemplate: 0,
		user: {
			fullname: "Divyansh Malik",
		},
	},
];

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
	color: theme.palette.text.secondary,
	[`& .${treeItemClasses.content}`]: {
		color: theme.palette.text.secondary,
		borderTopRightRadius: theme.spacing(2),
		borderBottomRightRadius: theme.spacing(2),
		paddingRight: "10px",
		fontWeight: theme.typography.fontWeightMedium,
		"&.Mui-expanded": {
			fontWeight: theme.typography.fontWeightRegular,
		},
		"&:hover": {
			backgroundColor: "transparent",
		},
		"&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
			backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
			color: "var(--tree-view-color)",
		},
		[`& .${treeItemClasses.label}`]: {
			fontWeight: "inherit",
			color: "inherit",
		},
	},
	[`& .${treeItemClasses.group}`]: {
		marginLeft: 0,
		[`& .${treeItemClasses.content}`]: {
			paddingLeft: theme.spacing(2),
		},
	},
}));

export const StyledTreeItem = React.forwardRef(function StyledTreeItem(
	props,
	ref
) {
	const theme = useTheme();
	const {
		bgColor,
		color,
		labelIcon: LabelIcon,
		labelInfo,
		labelText,
		colorForDarkMode,
		bgColorForDarkMode,
		...other
	} = props;

	const styleProps = {
		"--tree-view-color":
			theme.palette.mode !== "dark" ? color : colorForDarkMode,
		"--tree-view-bg-color":
			theme.palette.mode !== "dark" ? bgColor : bgColorForDarkMode,
	};

	return (
		<StyledTreeItemRoot
			label={
				<Box
					sx={{
						display: "flex",
						// alignItems: "center",
						// p: 0.5,
						p: 0,
					}}
				>
					<Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
					<Typography
						variant="body2"
						sx={{ fontWeight: "inherit", flexGrow: 1 }}
					>
						{labelText}
					</Typography>
					<Typography variant="caption" color="inherit">
						{labelInfo}
					</Typography>
				</Box>
			}
			style={styleProps}
			{...other}
			ref={ref}
		/>
	);
});

const FileItemAccordion = ({ item }) => {
	console.log(item);
	if (item?.key) {
		return;
	}
	return (
		<>
			{item?.map((e, i) => {
				return (
					// <></>
					<StyledTreeItem
						key={i}
						nodeId={i}
						labelText={e?.name}
						labelIcon={e?.isTemplate === "0" ? Folder : File}
					>
						{/* {e?.contents && <FileItemAccordion item={e?.contents} />} */}
					</StyledTreeItem>
				);
			})}
		</>
	);
};

export default FileItemAccordion;
