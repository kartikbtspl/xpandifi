import React, { useState } from 'react'



const DataPrivacy = () => {
  const [isOn,setIsOn]= useState(true)
  return (
    <div className='flex flex-col w-full'>
      <h1 className='text-lx font-bold'>Data Privacy</h1>
      <div className='flex justify-between bg-white p-4 w-full my-4 rounded-lg shadow-md'>
        <span className='text-md text-gray-400'>
          Allow Data Sharing
        </span>
        <Switch
          checked={isOn}
          onChange={() => {console.log("Toggled is working"),setIsOn(!isOn)}}
          color="primary"
        />
      
      </div>
    </div>
  )
}

export default DataPrivacy