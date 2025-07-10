import React from 'react'
import Checkbox from '../../components/ui/checkbox/Checkbox'
import FormBuilder from '.././../components/form/FromBuilder'
import { FormProvider } from 'react-hook-form'
import { withdrawFields } from '../../util/Form-menu/withdraw-earning'
import { useForm } from 'react-hook-form'

const WithdrawEarning = () => {

   const methods = useForm({
    defaultValues: {
      paymentMethod: ["UPI"],
      amount: "",
      accountNo: "",
    },
  });

  const handleSubmit = (data) => {
    console.log("Withdraw form submitted:", data);
    // Add API integration here
  };
  
  return (
    <>
    <div>
      <p className='text-gray-900 text-lg lg:text-xl font-bold'>
        Withdraw Earnings
      </p>
 


      <div className='flex gap-x-2 bg-white'>
        <div className='flex items-center gap-x-2'>
          <input
        type='checkbox'
          id="upi"
          name="paymentMethod"
          value="upi"
          className="text-gray-900 text-sm font-semibold"
        />
          <label htmlFor="upi">UPi</label>
        </div>
        <div className='flex items-center gap-x-2'>
          <input
        type='checkbox'
          id="bank"
          value="bank"
          name='paymentMethod'
          className="text-gray-900 text-sm font-semibold"
        />
          <label htmlFor="bank">Bank</label>
        </div>
      </div> 
       <FormProvider {...methods}>
      <FormBuilder
        onSubmit={handleSubmit}
        methods={methods}
        isEdit={false}
        loading={false}
        dropdowns={{}} 
        fields={withdrawFields}
      />
    </FormProvider>
    </div>
    </>
  )
}

export default WithdrawEarning