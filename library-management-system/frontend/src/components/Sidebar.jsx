import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
  { to: '/books', label: 'Books', icon: 'bi-book' },
  { to: '/books/add', label: 'Add Book', icon: 'bi-plus-square' },
  { to: '/members', label: 'Members', icon: 'bi-people' },
  { to: '/members/add', label: 'Add Member', icon: 'bi-person-plus' },
  { to: '/issue', label: 'Issue Book', icon: 'bi-box-arrow-right' },
  { to: '/return', label: 'Return Book', icon: 'bi-box-arrow-in-left' },
  { to: '/transactions', label: 'Transactions', icon: 'bi-clock-history' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <nav className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <i className="bi bi-journal-bookmark-fill"></i>
        Library MS
      </div>
      <ul className="sidebar-nav">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <i className={`bi ${link.icon}`}></i>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
