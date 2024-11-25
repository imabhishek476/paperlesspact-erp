import { Radio, RadioGroup } from '@nextui-org/react';
import React from 'react'

const SignOrder = ({signOrder,setSignOrder}) => {
  return (
    <RadioGroup
    label="Select order for signing"
    // orientation='horizontal'
    defaultValue="0"
    value={signOrder}
    onValueChange={setSignOrder}
    size='sm'
    className='p-2'
    color='warning'
  >
    <Radio value="0">
      No order
    </Radio>
    <Radio value="1" 
    description="To be signed by owner(s) before tenant(s)"
    >
      Owners first
    </Radio>
    <Radio value="2" description="To be signed by tenant(s) before owner(s)">
    Tenants first
    </Radio>
  </RadioGroup>
  )
}

export default SignOrder;