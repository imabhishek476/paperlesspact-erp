import React from "react";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const SigneeList = ({
  signee,
  setSignee,
  party1,
  party2,
  isSign,
  userType,
  agreementType,
}) => {
  const handleChange = (e) => {
    setSignee(e.target.value);
  };
  console.log(party1 && Array.isArray(party1))
  return (
    <>
      <div className="w-full gap-x-4">
        <div className=" rounded-md p-2">
          <span className="block text-[#fda178] text-[20px] font-[400] border-b-1 pb-2 border-gray-200 border-solid">
            {" "}
            {agreementType==="general"?"Party 1":"Owners"}
          </span>
          <div className="mt-2">
          {party1 && Array.isArray(party1) ? (
            party1.map((owner,index) => {
              return <span className="flex justify-between" key={index}  >
                {" "}
                <p className="font-[400] text-[14px]">{`${index+1}. ${owner?.fullname}`}</p>
              </span>;
            })
          ) : (
            <span className="font-[400] text-[14px]">
              {" "}
              {party1?.fullname}
            </span>
          )}
          </div>
        </div>
        <div className="rounded-md p-2">
          <span className="block text-[#fda178] text-[20px] font-[400] border-b-1 pb-2 border-gray-200 border-solid">
            {" "}
            
            {agreementType==="general"?"Party 2":"Tenants"}
          </span>

          <div className="mt-2">
          {party2 && Array.isArray(party2) ? (
            party2.map((tenant, index) => {
              return <span className="flex justify-between" key={index}  >
                {" "}
                <p className="font-[400] text-[14px]">{`${index+1}. ${tenant?.fullname}`}</p>
              </span>;
            })
          ) : (
            <span className="font-[400] text-[14px]">
              {" "}
              {party2?.fullname}
            </span>
          )}
          </div>
        </div>
      </div>
      {/* {isSign===false&&( */}
      {/* <TextField
        sx={{ minWidth: "100%", my: 2 }}
        disabled
        color="secondary"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <LinkIcon />
            </InputAdornment>
          ),
        }}
      /> */}
      {/* )} */}
    </>
  );
};

export default SigneeList;
