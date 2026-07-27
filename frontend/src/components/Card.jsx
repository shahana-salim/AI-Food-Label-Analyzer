function Card({ children }) {
  return (
    <div
      className="
        w-full
        max-w-md
        bg-white
        rounded-2xl
        shadow-2xl
        border
        border-gray-100
        p-8
      "
    >
      {children}
    </div>
  );
}

export default Card;