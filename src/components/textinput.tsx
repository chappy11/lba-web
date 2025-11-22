import React from "react";
type TextInputProps = React.ComponentProps<"input"> & {
  label?: string
  error?: string
  isRequired?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  name,
  error,
  isRequired = true,
}) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={name}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default TextInput;
