import SignAgreementPage from '@/components/Agreement/Sign';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

const Page = () => {
    // const searchParams = useSearchParams();
    // const idWithIndex = searchParams.get("id");
    const router = useRouter();
    console.log(router.query)
    const {userType , id} = router.query;
    // const id = useMemo(()=>{
    //   if(idWithIndex.includes("-")){
    //     const temp = idWithIndex.split("-");
    //     return temp[0];
    //   }
    //   return idWithIndex;
    // },[idWithIndex]);


  return (
    <>
    {/* <MainContainer> */}
        <SignAgreementPage id={id} isSign={true} userType={userType}/>
    {/* </MainContainer> */}
    </>
  )
}
export default Page;