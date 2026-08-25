import { useEffect, useMemo, useState } from 'react'
import transactionService from '../services/transactionService'
import Loader from '../components/Loader.jsx'
import { useToast } from '../components/ToastContext.jsx'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const { showToast } = useToast()

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await transactionService.getAll()
      setTransactions(res.data)
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to load transactions', 'error')
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = (t) => t.status === 'ISSUED' && new Date(t.dueDate) < new Date(new Date().toDateString())

  const filtered = useMemo(() => {
    if (filter === 'ALL') return transactions
    if (filter === 'ISSUED') return transactions.filter((t) => t.status === 'ISSUED' && !isOverdue(t))
    if (filter === 'OVERDUE') return transactions.filter((t) => isOverdue(t))
    if (filter === 'RETURNED') return transactions.filter((t) => t.status === 'RETURNED')
    return transactions
  }, [transactions, filter])

  const statusBadge = (t) => {
    if (t.status === 'RETURNED') {
      return <span className="badge badge-status-returned">Returned</span>
    }
    if (isOverdue(t)) {
      return <span className="badge badge-status-overdue">Overdue</span>
    }
    return <span className="badge badge-status-issued">Issued</span>
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h4 className="fw-bold mb-0">Transactions</h4>
        <div className="btn-group" role="group">
          {['ALL', 'ISSUED', 'OVERDUE', 'RETURNED'].map((f) => (
            <button
              key={f}
              type="button"
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader label="Loading transactions..." />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-clock-history fs-1 d-block mb-2"></i>
            No transactions found
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
                  <th>Return Date</th>
                  <th>Overdue Days</th>
                  <th>Fine</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td className="fw-semibold">{t.bookTitle}</td>
                    <td>{t.memberName}</td>
                    <td>{t.issueDate}</td>
                    <td>{t.dueDate}</td>
                    <td>{t.returnDate || '-'}</td>
                    <td>{t.overdueDays || 0}</td>
                    <td>{t.fineAmount ? `₹${t.fineAmount.toFixed(2)}` : '-'}</td>
                    <td>{statusBadge(t)}</td>
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
