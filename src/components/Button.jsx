export function Button({ children, onClick, variant = 'primary' }) {
  const baseStyle = "px-4 py-2 rounded font-medium transition-colors"
  const style = variant === 'secondary'
    ? "bg-gray-300 hover:bg-gray-400 text-black"
    : "bg-blue-500 hover:bg-blue-600 text-white"

  return (
    <button onClick={onClick} className={`${baseStyle} ${style}`}>
      {children}
    </button>
  )
}
