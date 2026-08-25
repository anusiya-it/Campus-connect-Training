export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="spinner-wrap flex-column">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{label}</span>
      </div>
      <div className="text-muted mt-2 small">{label}</div>
    </div>
  )
}
