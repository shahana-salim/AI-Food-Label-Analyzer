function Button({ children, type = "button", onClick, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;