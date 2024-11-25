import {RadioGroup, Radio, cn} from "@nextui-org/react";
import { useRouter } from "next/router";
// import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircleIcon from '@mui/icons-material/Circle';
export const CustomRadio = (props) => {
  const {children, ...otherProps} = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent bg-zinc-100",
          "data-[selected=true]:border-[#fda178]"
        ),
      }}
    >
      {children}
    </Radio>
  );
};

const PreviewRadioGroup = ({ index, handleChangeIndex, documents, isStatus, party1,party2 }) => {
  const router = useRouter()
  const {userType,id} = router.query
  const userIndex = id && id.includes("-") ? id.split("-")[1] : -1
  const isSigned = (doc,userType,userIndex) => {
    console.log(doc)
    console.log(userType)
    console.log(userIndex)
    let signeesArray
    if (userType === "party1"){
      signeesArray = doc.party1Signees
    } else {
      signeesArray = doc.party2Signees
    }
    if(signeesArray[userIndex]=== 0 ){
      return false 
    } else {
      return true
    }
  }
  // return (
  //   <FormControl sx={{p:1, width:"100%"}}>
  //     <FormLabel
  //       sx={{
  //         color: "#eabf4e",
  //       //   lineHeight: "1.5",
  //         fontSize: "20px",
  //         fontWeight: 400,
  //       }}
  //       // className="font-[400] text-[14px]"
  //     >
  //       Preview
  //     </FormLabel>
  //     <RadioGroup value={index} onChange={handleChangeIndex}>
  //       {documents &&
  //         documents.length > 0 &&
  //         documents.map((document, index) => {
  //           return (
  //             <FormControlLabel
  //               key={index}
  //               value={index}
  //               control={<Radio />}
  //               sx={{width:"100%"}}
  //               label={<div className="flex justify-between"><span>{document.name}</span>
  //                 {isSigned(document,userType,userIndex) ? "Signed" : "Not Signed"}
  //               </div>}
  //             />
  //           );
  //         })}
  //     </RadioGroup>
  //   </FormControl>
  // );
  return (
    <>
    <span className="block text-[#fda178] text-[20px] font-[400] border-b-1 pb-2 border-gray-200 border-solid">
      Agreements
    </span>
    <RadioGroup
      onChange={handleChangeIndex}
      color="secondary"
      defaultValue={0}
      className="mt-4"
    >
      {documents &&
          documents.length > 0 &&
          documents.map((document, index) => {
            return (
              <CustomRadio
                key={index}
                value={index}
                description={
                  !isStatus && (isSigned(document, userType, userIndex) ? "Signed" : "Not Signed")
                }
              >
                <h2 className="text-[18px]">{index+1}. {document.name}</h2>
                {isStatus && (
                  <>
                    {party1.map((signee,index)=>{
                        return (
                          <span className="text-[14px] w-full flex gap-2 items-center" key={index}>
                            <CircleIcon className="text-[10px]"/>
                            {signee.fullname}
                            {isSigned(document, "party1", index) && <CheckCircleOutlineIcon className="text-success text-[16px]"/>}
                          </span>
                        );
                    })}
                    {party2.map((signee,index)=>{
                        return (
                          <span
                            className="text-[14px] w-full flex gap-2 items-center"
                            key={index}
                          >
                            <CircleIcon className="text-[10px]"/>
                            {signee.fullname}
                            {isSigned(document, "party2", index) && <CheckCircleOutlineIcon className="text-success text-[16px]"/>}
                          </span>
                        );
                    })}
                  </>
                )}
              </CustomRadio>
              // <FormControlLabel
              //   key={index}
              //   value={index}
              //   control={<Radio />}
              //   sx={{width:"100%"}}
              //   label={<div className="flex justify-between"><span>{document.name}</span>
              //     {isSigned(document,userType,userIndex) ? "Signed" : "Not Signed"}
              //   </div>}
              // />
            );
          })}
      
      {/* <CustomRadio description="Unlimited items. $10 per month." value="pro">
        Pro
      </CustomRadio>
      <CustomRadio
        description="24/7 support. Contact us for pricing."
        value="enterprise"
      >
        Enterprise
      </CustomRadio> */}
    </RadioGroup>
    </>
  );
};

export default PreviewRadioGroup;
