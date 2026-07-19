function Card({ children }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      {children}
    </div>
  );
}

export default Card;