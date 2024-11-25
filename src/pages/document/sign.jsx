import { getRentalAgreementById } from '@/Apis/legalAgreement';
import SignAgreementPage from '@/components/Agreement/Sign';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';
import CryptoJS from 'crypto-js';
import { getUserProfile } from '../../Apis/login';
const SignAgreement = ({id,res}) => {
    // const searchParams = useSearchParams();
    // const id = searchParams.get("id");
    console.log(id,"id.....");
    // const router = useRouter();
    // const {userType , id} = router.query;

  return (
    <>
    {/* <MainContainer> */}
        <SignAgreementPage id={id}/>
    {/* </MainContainer> */}
    </>
  )
}

export const getServerSideProps = async (ctx) => {
    try {
    
    const accessToken = ctx.req.cookies['accessToken'];
    if(!accessToken){
      return{props:{isSignedIn:false}};
    }
    const {envId,email} = ctx.query
    if (!envId || !email) {
      throw Error("NO ID")
    }
      const reb64 = CryptoJS.enc.Hex.parse(envId);
     const bytes = reb64.toString(CryptoJS.enc.Base64);
     const decrypt = CryptoJS.AES.decrypt(bytes, email);
     const plain = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
     if (!plain || !plain?.key) {
      // console.log(plain , plain?.key)
      throw Error("NO ENC")
    }
    const id = plain.key
    // const id = decryptedData
    const index = id && id.includes("-") ? id.split("-")[1] : -1;
    const extractedId = id && id.includes("-") ? id.split("-")[0] : id;

    // console.log(accessToken, extractedId,index)

    const response = await getRentalAgreementById(accessToken, extractedId,index);  
    const user = await getUserProfile(accessToken);
    let finalItems = [];
    for (const ele of response.agreements) {
      finalItems = [...finalItems, ...(ele?.items || [])];
    }
    const userItems = finalItems.filter((items)=> items?.signee?.fullname === response?.signees[index]?.fullname).map((item)=>item.isSigned)  
    console.log("ISDRAFT", response?.isDraft)
    if (!response?.signees[index] || response?.isDraft === 1) {
      throw Error("DRAFT")
    }

    let isDocSigned = response?.events?.find(event =>
      event.action === 'Document Signed' &&
      response?.signees?.some(signee =>
        event.user === signee.fullname &&
        signee.signersEmail === user?.data?.email
      )
    );
    if(isDocSigned){
      return {
            redirect: {
              destination: `/document/success?id=${extractedId}`,
              permanent: false,
            },
          }
    }
    // if(!userItems.some((ele)=> ele === "0")){
    //   return {
    //     redirect: {
    //       destination: `/document/preview?id=${extractedId}`,
    //       permanent: false,
    //     },
    //   }
    // }
    return { props: { id:id, res:response} };
  } catch (error) {
    console.log("ERROR",error)
    return {
      notFound: true,
    };
  }
};

export default SignAgreement;


