
import PrepareDocumentPage from '@/components/Agreement/Prepare';
import { useRouter } from 'next/router';

const PrepareDocument = () => {
    const router = useRouter();
    console.log(router.query)
    const {id} = router.query;

  return (
    <>
        <PrepareDocumentPage id={id}/>
    </>
  )
}

export default PrepareDocument;


