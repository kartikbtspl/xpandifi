import React from 'react'
import Checkbox from '../../components/ui/checkbox/Checkbox'

const WithdrawEarning = () => {
  return (
    <>
    <div>
      <p className='text-gray-900 text-lg lg:text-xl font-bold'>
        Withdraw Earnings
      </p>
      
<Checkbox
          name="paymentMethods"
          label="Select Payment Methods"
          options={[
            { label: 'UPI', value: 'upi' },
            { label: 'Bank', value: 'bank' },
          ]}
          control={control}
        />
    </div>
    </>
  )
}

export default WithdrawEarning