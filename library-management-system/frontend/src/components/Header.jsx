export default function Header({ onToggleSidebar }) {
  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-2">
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
          <i className="bi bi-list"></i>
        </button>
        <h5 className="mb-0 fw-semibold text-secondary">Library Management System</h5>
      </div>
      <div className="d-flex align-items-center gap-2 text-muted">
        <i className="bi bi-person-circle fs-4"></i>
        <span className="d-none d-sm-inline">Administrator</span>
      </div>
    </header>
  )
}
