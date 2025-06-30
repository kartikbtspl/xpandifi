import React from 'react'

const SidebarItem = ({icon , label}) => {
  return (
     <div className="flex items-center gap-3 cursor-pointer hover:bg-[#445E94] p-2 transition">
    <span className="text-lg">{icon}</span>
    <span className="text-sm">{label}</span>
  </div>
  )
}

export default SidebarItem