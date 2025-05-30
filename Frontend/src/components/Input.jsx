import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
  label,
  type = "text",
  className = "",
  ...props
}, ref) {
  const generatedId = useId()
  const id = props.id || generatedId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block mb-1 ">
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        ref={ref}
        {...props}
        className={`w-full px-3 py-2 rounded bg-gray-700 text-white outline-none focus:bg-white/5  duration-200 border border-gray-200 ${className} text-wh`}
      />
    </div>
  )
})

export default Input
