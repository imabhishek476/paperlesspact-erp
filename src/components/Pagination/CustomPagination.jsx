import React from "react";
import { Button, Pagination, PaginationItemType, cn } from "@nextui-org/react";
import { Badge, ChevronLeft, ChevronRight, Divide } from "lucide-react";

export default function CustomPagination({
	totalPages,
	setPageNumber,
	pageNumber,
}) {
	const handleNext = () => {
		// if (pageNumber < totalPages) {
		setPageNumber(pageNumber + 1);
		// }
	};

	const handlePrevious = () => {
		// if (pageNumber > 1) {
		setPageNumber(pageNumber - 1);
		// }
	};

	const renderItem = ({
		ref,
		key,
		value,
		isActive,
		onNext,
		onPrevious,
		setPage,
	}) => {
		console.log(key);
		if (value === PaginationItemType.NEXT) {
			return (
				<>
					<Button
						key={key}
						onClick={() => {
							onNext();
							handleNext();
						}}
						isIconOnly
						disabled={pageNumber === totalPages}
						className={`border rounded-sm ${
							pageNumber === totalPages
								? "bg-cyan-50 "
								: "bg-cyan-50 cursor-pointer"
						}'}`}
					>
						<ChevronRight size={18} />{" "}
					</Button>
				</>
			);
		}

		if (value === PaginationItemType.PREV) {
			return (
				<Button
					key={key}
					// onClick={onPrevious}
					onClick={() => {
						onPrevious();
						handlePrevious();
					}}
					disabled={pageNumber === 1}
					isIconOnly
					className={`border rounded-sm ${
						pageNumber === 1 ? "bg-cyan-50 " : "bg-cyan-50 cursor-pointer"
					} '}`}
				>
					<ChevronLeft size={18} />{" "}
				</Button>
			);
		}

		if (value === PaginationItemType.DOTS) {
			return (
				<Button isIconOnly key={key} className='bg-cyan-50 rounded-sm border p-0'
				>
					...
				</Button>
			);
		}

		return (
			<Button
				key={key}
				isIconOnly
				ref={ref}
				className={cn(
					// className,
					!isActive
						? "border rounded-sm bg-cyan-50 cursor-pointer"
						: "border rounded-sm bg-cyan-50 cursor-pointer"

				)}
				onClick={() => {
					console.log(value);
					setPage(value);
					setPageNumber(value);
				}}
			>
				{value}
			</Button>
		);
	};

	return (
		<Pagination
			disableCursorAnimation
			showControls
			total={totalPages}
			initialPage={1}
			classNames={{ wrapper: "gap-0" }}
			radius="full"
			renderItem={renderItem}
			variant="light"
		/>
	);
}
