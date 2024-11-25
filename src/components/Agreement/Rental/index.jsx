import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import RentalStepper from "./RentalStepper";
import AgreementPreview from "./AgreementPreview";

const RentalAgreementPage = () => {
  const [agreementResponse, setAgreementResponse] = useState(null);
  const [previewData, setPreviewData] = useState({
    fullPropertyAddress:"",
    rent:"",
    startDate:"",
    endDate:"",
    deposit:"",
    billingBy:"",
    escalation:"",
    city:"",
    fullDateInWords:"",
    ownerName:"",
    ownerAddress:"",
    tenantName:"",
    tenantAddress:"",
    startDay:"",
    itemTable:""
  });
  // useEffect(() => {
  //   if(agreementResponse){

  //     const {
  //       tenantDetails:"",
  //       createdDate,
  //       ownerDetails,
  //       propertyDetails,
  //       agreementDetails,
  //       items,
  //     } = agreementResponse;
  //     const { address, city, state, pincode } = propertyDetails;

  //     const fullPropertyAddress = `${address}, ${city?.districtName}, ${state.stateName}, ${pincode}`;
  //     const invoiceHTML = fs.readFileSync(rentalAgreementTemplatePath, "utf8");
  //     const startDate = new Date(agreementDetails.startDate).toLocaleDateString();
  //     const endDate = new Date(agreementDetails.startDate);
  //     endDate.setMonth(endDate.getMonth() + agreementDetails.validity);
  //     // const fullDateInWords =
  //     const date = new Date(createdDate);
  //     const day = date.getDate();
  //     const monthNames = [
  //       "January",
  //       "February",
  //       "March",
  //       "April",
  //       "May",
  //       "June",
  //       "July",
  //       "August",
  //       "September",
  //       "October",
  //       "November",
  //       "December",
  //     ];
  //     const month = monthNames[date.getMonth()];
  //     const year = date.getFullYear();

  //     const fullDateInWords = `${day} of ${month} ${year}`;

  //     let itemTable = ""

  //     items.map((item,index)=>{
  //       itemTable= itemTable + `<tr style='height:21.0pt'>
  //       <td width=91 valign=top style='width:68.25pt;border:solid gray 1.0pt;
  //       border-top:none;background:white;padding:4.0pt 4.0pt 4.0pt 4.0pt;height:21.0pt'>
  //       <p class=MsoNormal align=center style='margin-top:11.0pt;text-align:center'><span
  //       style='color:black'>${index}</span></p>
  //       </td>
  //       <td width=219 valign=top style='width:164.25pt;border-top:none;border-left:
  //       none;border-bottom:solid gray 1.0pt;border-right:solid gray 1.0pt;background:
  //       white;padding:4.0pt 4.0pt 4.0pt 4.0pt;height:21.0pt'>
  //       <p class=MsoNormal align=center style='margin-top:11.0pt;text-align:center'><span
  //       style='color:black'>${item.name}</span></p>
  //       </td>
  //       <td width=202 valign=top style='width:151.5pt;border-top:none;border-left:
  //       none;border-bottom:solid gray 1.0pt;border-right:solid gray 1.0pt;background:
  //       white;padding:4.0pt 4.0pt 4.0pt 4.0pt;height:21.0pt'>
  //       <p class=MsoNormal align=center style='margin-top:11.0pt;text-align:center'><span
  //       style='color:black'>${item.quantity}</span></p>
  //       </td>
  //      </tr>`
  //     })
  //     const data = {
  //       fullPropertyAddress: fullPropertyAddress,
  //       startDate: startDate,
  //       endDate: endDate.toLocaleDateString(),
  //       rent: agreementDetails.rent,
  //       deposit: agreementDetails.deposit,
  //       city: propertyDetails.city?.districtName,
  //       fullDateInWords: fullDateInWords,
  //       ownerName: ownerDetails.fullname,
  //       ownerAddress: ownerDetails.address,
  //       tenantName: tenantDetails.fullname,
  //       tenantAddress: tenantDetails.address,
  //       startDay: new Date(startDate).getDate(),
  //       billingBy: agreementDetails.billingBy === "owner" ? "lessor" : "lessee",
  //       escalation: agreementDetails.escalation,
  //       itemTable:itemTable
  //     };
  //     setPreviewData(data)
  //   }
  // }, [agreementResponse])
  return (
    <section className="w-full">
      <div className="px-4 md:px-[40px] mx-auto max-w-7xl">
        <Typography
          sx={{ fontSize: "24px", fontWeight: 700, py: 2, color: "#eabf4e" }}
        >
          Rental Agreement
        </Typography>
        <div className="grid grid-cols-10">
          <div className="col-span-12 lg:col-span-5">

            <RentalStepper
              agreementResponse={agreementResponse}
              setAgreementResponse={setAgreementResponse}
              setPreviewData={setPreviewData}
            />

          </div>
          <div className="col-span-12 lg:col-span-5">
            <AgreementPreview previewData={previewData} agreementResponse={agreementResponse}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalAgreementPage;
