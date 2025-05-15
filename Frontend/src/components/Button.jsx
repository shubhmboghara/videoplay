import React from 'react'

function Button(  {
    children,
    type="button",
    bgColor="",
    textColor="text-white",
    className='',
    ...props
}) {
  return (
    <button className={`px-2 py-2  rounded-lg  ${className}   ${bgColor} ${textColor} `}{...props}>
         {children}
    </button>
)
}

export default Button