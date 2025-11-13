import "./Button.css"

function Button({ children, variant = "primary", size = "md", ...props }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} {...props}>
      {children}
    </button>
  )
}

export default Button
