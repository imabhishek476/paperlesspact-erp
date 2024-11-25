import { PDFDocument } from "pdf-lib";
import { nanoid } from "nanoid";

export async function MergePdf(selectedFiles) {
	const pdfDoc = await PDFDocument.create();
	for (const file of selectedFiles) {
		const pdfBytes = await file.arrayBuffer();
		const tempDoc = await PDFDocument.load(pdfBytes);

		// Copy all pages from the tempDoc
		const pages = await pdfDoc.copyPages(tempDoc, tempDoc.getPageIndices());
		pages.forEach((page) => pdfDoc.addPage(page));
	}
	const mergedPdfBytes = await pdfDoc.save();
	const mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
	console.log("hey");
	const mergedFile = new File([mergedBlob], `merged-${nanoid(4)}`, {
		type: "application/pdf",
	});
	return mergedFile;
}
