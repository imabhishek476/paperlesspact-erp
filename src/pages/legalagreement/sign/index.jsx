import { getRentalAgreementById } from '@/Apis/legalAgreement';
import SignAgreementPage from '@/components/Agreement/Sign';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

const SignAgreement = () => {
    // const searchParams = useSearchParams();
    // const id = searchParams.get("id");
    // console.log(id,"id.....");
    const router = useRouter();
    console.log(router.query)
    const {userType , id} = router.query;

  return (
    <>
    {/* <MainContainer> */}
        <SignAgreementPage id={id}/>
    {/* </MainContainer> */}
    </>
  )
}

export default SignAgreement;


// export async function getServerSideProps(context) {
//     const id = context.query.id;
//     try{
//         if(!id){
//             throw Error("No id provided");
//         }
//         const response = await getRentalAgreementById(id);
//         console.log(response);
//         return {props:{id}};
//     }catch(err){
//         console.log(err);
//     }
// }