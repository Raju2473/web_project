export default function AuthForm({ title, subtitle, fields, onSubmit, submitLabel, footer }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <form onSubmit={onSubmit} className="auth-form">
          {fields}
          <button type="submit" className="primary-button full-width">{submitLabel}</button>
        </form>
        {footer}
      </div>
    </div>
  )
}
