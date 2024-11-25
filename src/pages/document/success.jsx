import Success from '@/components/Agreement/Sign/Success'
import SuccessForOutsider from '@/components/Agreement/Sign/SuccessForOutsider'
import { useRouter } from 'next/router'
import React from 'react'

const SuccessPage = ({isOutsider}) => {
  // const router = useRouter()
  
  return (<>
    {isOutsider ?
      <SuccessForOutsider/>
    :
    <Success/>
  }
  </>
  )
}

export const getServerSideProps = async (ctx) => {
	const {isOutsider } = ctx.query
	return { props: { isOutsider: isOutsider ? isOutsider : null } };
};

export default SuccessPage