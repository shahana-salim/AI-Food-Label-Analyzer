function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        border
        border-gray-300
        rounded-xl
        pl-12
        pr-4
        py-3
        bg-gray-50
        text-gray-800
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500
        focus:border-emerald-500
        transition-all
        duration-300
      "
    />
  );
}

export default Input;