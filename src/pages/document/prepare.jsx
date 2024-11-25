
import { getRentalAgreementById } from '@/Apis/legalAgreement';
import PrepareDocumentPage from '@/components/Agreement/Prepare';
import { useRouter } from 'next/router';

const DraftDocument = () => {
    const router = useRouter();
    console.log(router.query)
    const {id} = router.query;

  return (
    <>
        <PrepareDocumentPage id={id}/>
    </>
  )
}
export const getServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  const accessToken = ctx.req.cookies['accessToken'];
  if(!accessToken){
    return{props:{isSignedIn:false}};
  }
  const {id} = ctx.query
  const index = id && id.includes("-") ? id.split("-")[1] : -1;
  const extractedId = id && id.includes("-") ? id.split("-")[0] : id;

  // console.log(extractedId)
  const response = await getRentalAgreementById(accessToken, extractedId);
  // console.log(response)
  if (response?.isDraft === 0) {
    return {
      notFound: true,
    };
  }
  return { props: {} };
};
export default DraftDocument;


