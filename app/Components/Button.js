"use client"


export const PrimaryButton = ({children, onClick}) => {
  return (
    <button type="button" onClick={onClick} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{children}</button>
  )
}


export const SecondaryButton = ({children,prefix,onClick}) => {
  return (<>
  {prefix}
  <button type="button" onClick={onClick} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{children}</button>
  </>
  )
}


export const TabButton = ({children,active,onClick})=>{

  return (<>
    <button type="button" onClick={onClick}  className={`text-black ${active? "bg-blue-600" : "bg-blue-400"} hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2`}>{children}</button>
  </>)
}