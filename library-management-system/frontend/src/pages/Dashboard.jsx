import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Loader from '../components/Loader.jsx'
import { useToast } from '../components/ToastContext.jsx'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await api.get('/dashboard')
      setStats(res.data)
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to load dashboard', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader label="Loading dashboard..." />
  if (!stats) return null

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, icon: 'bi-book-half', bg: 'bg-books' },
    { label: 'Available Books', value: stats.availableBooks, icon: 'bi-check2-circle', bg: 'bg-available' },
    { label: 'Borrowed Books', value: stats.borrowedBooks, icon: 'bi-arrow-left-right', bg: 'bg-borrowed' },
    { label: 'Total Members', value: stats.totalMembers, icon: 'bi-people-fill', bg: 'bg-members' },
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Dashboard</h4>
        {stats.overdueTransactions > 0 && (
          <span className="badge rounded-pill text-bg-danger">
            <i className="bi bi-exclamation-triangle me-1"></i>
            {stats.overdueTransactions} overdue return{stats.overdueTransactions > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-6 col-lg-3" key={c.label}>
            <div className={`stat-card ${c.bg} p-3 h-100`}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stat-value">{c.value}</div>
                  <div className="small opacity-75">{c.label}</div>
                </div>
                <i className={`bi ${c.icon} stat-icon`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Recent Transactions</h6>
          <Link to="/transactions" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>

        {stats.recentTransactions.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            No transactions yet
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.bookTitle}</td>
                    <td>{t.memberName}</td>
                    <td>{t.issueDate}</td>
                    <td>{t.dueDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          t.status === 'ISSUED' ? 'badge-status-issued' : 'badge-status-returned'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
