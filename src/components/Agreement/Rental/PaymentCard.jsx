import React, { useEffect, useState } from 'react'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { createGeneralAgreement, createRentalAgreement } from '@/Apis/legalAgreement';
import { useRouter } from 'next/router';
import { getPaymentByOrderId, paymentRequest } from '@/Apis/payment';
import { Alert } from '@mui/material';


const PaymentCard = ({agreementResponse,type}) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [paymentError, setPaymentError] =useState(false)
    const [totalAmount , setTotalAmount] = useState(0)
    const [stampAmount , setStampAmount] = useState(0)
    useEffect(()=>{
      if(agreementResponse){
        console.log(agreementResponse?.agreements);
        if (type === "legal") {
          let base = 50;
          let temp =0
          if (
            agreementResponse?.agreements &&
            agreementResponse?.agreements.length > 0
          ) {
            for (const agreement of agreementResponse?.agreements) {
              temp = temp + parseInt(agreement?.stampAmount);
            }
          }
          setStampAmount(temp)
          setTotalAmount(50 * 0.18 + base + temp);
        } else {
          const base = parseInt(agreementResponse?.stampAmount) + 50;
          setStampAmount(agreementResponse?.stampAmount)
          setTotalAmount(50 * 0.18 + base);
        }
      }
    },[agreementResponse])

    const handlePaymentClick = async () => {
      const accessToken = Cookies.get("accessToken");
       setIsLoading(true)
        const requestBody = {
          enquiryId : agreementResponse?._id,
          userId: agreementResponse?.user?.id,
          lawyerId: "64c9061ae1bf7f589436b901",
          amount:totalAmount,
          payment_mode:"ONLINE",
          payment_type : "ENQUIRY_FEE",
      }
        const paymentRequestReponse = await paymentRequest(requestBody,accessToken)
        console.log(paymentRequestReponse)
        if(paymentRequestReponse){
          const posX = window.screen.width / 3;
          const posY = window.screen.height / 2;
          const width = 500;
          const height = 680;
          const popUpPosition = `location,status,scrollbars,height=${height},width=${width},left=${posX},top=${posY}`;
          const myWindow = window.open(
            `https://api.easedraft.com/payment/initiate?order_id=${paymentRequestReponse?.order_id}&retry=1&platform=cloud`,
            "new",
            popUpPosition
          );
          const checkClosed = setInterval(async () => {
            if (myWindow.closed) {
              clearInterval(checkClosed);
              const response = await getPaymentByOrderId(paymentRequestReponse?.order_id,accessToken)
          
              console.log("closed"); 
              console.log(response?.order_status === "Success");
              // if(response?.order_status === "Success"){ 
                // UNCOMMENT ABOVE LINE IN PRODUCTION
                if(true){
                let data = {
                rentalId: agreementResponse._id,
                };
                let res=""
                if(agreementResponse?.agreementType==="Rental Agreement"){
                  res = await createRentalAgreement(accessToken, data, "6");
                }else{
                  data={agreementId:agreementResponse?._id}
                  res = await createGeneralAgreement(data,"4");
                }
                if(res){
                  localStorage.clear("agreementId")
                  router.push(`/legalagreement/sign?id=${res[0]._id}`)
                }
                setIsLoading(false)
              } else {
                setPaymentError(true)
                setIsLoading(false)
              }
            }
          }, 1000);
        }
    }


  return (
    <div className="mt-4 w-full md:border rounded-md md:shadow-md border-gray-200 p-0 md:py-7 md:pl-6 md:pr-6 max-w-xl">
      <div className="flex flex-col">
        <p className="text-lg md:text-xl  font-medium mb-2 pb-2 border-b">
          Payment
        </p>
        {paymentError && 
        <Alert severity="error" className='my-2'>An error occured while processing your payment — please try again!</Alert>
        }
        <div className="flex justify-between w-full">
          <span className="text-[14px] font-[500] text-gray-700 mb-2">
            Stamp Fee
            {/* {type === "legal" && " (per document)"} */}
          </span>
          <span className="text-[14px] font-[700] text-gray-700 mb-2">
          {/* ₹{parseInt(agreementResponse?.stampAmount)* agreementResponse?.ogAgreementUrls?.length} */}
          ₹{stampAmount}
          </span>
        </div>
        
        <div className="flex justify-between w-full">
          <span className="text-[14px] font-[500] text-gray-700 mb-2">
            Platform Charges
          </span>
          <span className="text-[14px] font-[700] text-gray-700 mb-2">
          ₹50
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-[14px] font-[500] text-gray-700 mb-2">
            GST @18%
          </span>
          <span className="text-[14px] font-[700] text-gray-700 mb-2">
            ₹9
          </span>
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="text-[16px] font-[500] text-gray-700 mb-2">
            Total Amount
          </span>
          <span className="text-[24px] font-[700] text-gray-700 mb-2">
            <CurrencyRupeeIcon className="text-[24px]" />
            {totalAmount}
          </span>
        </div>
        <div>
          <p className='text-gray-400 text-sm leading-3'>
            By continuing you are confirming that the data provided by you is self attested and you are agreeing to Lawinzo Terms and Conditions. 
          </p>
        </div>
        <div className="flex justify-end mt-2 items-center w-full">
          <Button
            radius="sm"
            size="lg"
            isLoading={isLoading}
            className="bg-[#fda178] hover:bg-[#05686E] hover:text-[white]"
            onClick={handlePaymentClick}
          >
            <span className="text-[16px] font-[700] ">
              Pay{" "}₹{" "}{totalAmount} Now
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCard