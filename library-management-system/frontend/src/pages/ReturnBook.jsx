import { useEffect, useState } from 'react'
import transactionService from '../services/transactionService'
import Loader from '../components/Loader.jsx'
import { useToast } from '../components/ToastContext.jsx'

export default function ReturnBook() {
  const [issued, setIssued] = useState([])
  const [loading, setLoading] = useState(true)
  const [returningId, setReturningId] = useState(null)
  const [result, setResult] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    loadIssued()
  }, [])

  const loadIssued = async () => {
    setLoading(true)
    try {
      const res = await transactionService.getAll()
      setIssued(res.data.filter((t) => t.status === 'ISSUED'))
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to load issued books', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (transaction) => {
    setReturningId(transaction.id)
    setResult(null)
    try {
      const res = await transactionService.returnBook(transaction.id, {
        returnDate: new Date().toISOString().slice(0, 10),
      })
      setResult(res.data)
      showToast('Book returned successfully')
      loadIssued()
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to return book', 'error')
    } finally {
      setReturningId(null)
    }
  }

  const isOverdue = (dueDate) => new Date(dueDate) < new Date(new Date().toDateString())

  return (
    <div>
      <h4 className="fw-bold mb-4">Return Book</h4>

      {result && (
        <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check-circle fs-5"></i>
          <div>
            <strong>"{result.bookTitle}"</strong> returned for <strong>{result.memberName}</strong>.{' '}
            {result.overdueDays > 0 ? (
              <>
                Overdue by <strong>{result.overdueDays} day(s)</strong> — fine:{' '}
                <strong>₹{result.fineAmount.toFixed(2)}</strong>
              </>
            ) : (
              'Returned on time, no fine.'
            )}
          </div>
        </div>
      )}

      <div className="table-card">
        {loading ? (
          <Loader label="Loading issued books..." />
        ) : issued.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-check2-all fs-1 d-block mb-2"></i>
            No books currently issued
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
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {issued.map((t) => {
                  const overdue = isOverdue(t.dueDate)
                  return (
                    <tr key={t.id}>
                      <td className="fw-semibold">{t.bookTitle}</td>
                      <td>{t.memberName}</td>
                      <td>{t.issueDate}</td>
                      <td>{t.dueDate}</td>
                      <td>
                        <span className={`badge ${overdue ? 'badge-status-overdue' : 'badge-status-issued'}`}>
                          {overdue ? 'Overdue' : 'On Time'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={returningId === t.id}
                          onClick={() => handleReturn(t)}
                        >
                          {returningId === t.id ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            'Return'
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
