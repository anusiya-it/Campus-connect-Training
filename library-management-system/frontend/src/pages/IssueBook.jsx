import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bookService from '../services/bookService'
import memberService from '../services/memberService'
import transactionService from '../services/transactionService'
import Loader from '../components/Loader.jsx'
import { useToast } from '../components/ToastContext.jsx'

export default function IssueBook() {
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const { showToast } = useToast()
  const navigate = useNavigate()

  const today = new Date().toISOString().slice(0, 10)
  const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)

  const [form, setForm] = useState({
    bookId: '',
    memberId: '',
    issueDate: today,
    dueDate: defaultDue,
  })

  useEffect(() => {
    Promise.all([bookService.getAll(), memberService.getAll()])
      .then(([bRes, mRes]) => {
        setBooks(bRes.data.filter((b) => b.availableQuantity > 0))
        setMembers(mRes.data)
      })
      .catch((err) => showToast(err.friendlyMessage || 'Failed to load data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const errs = {}
    if (!form.bookId) errs.bookId = 'Select a book'
    if (!form.memberId) errs.memberId = 'Select a member'
    if (!form.issueDate) errs.issueDate = 'Issue date is required'
    if (!form.dueDate) errs.dueDate = 'Due date is required'
    if (form.issueDate && form.dueDate && form.dueDate < form.issueDate) {
      errs.dueDate = 'Due date cannot be before issue date'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      await transactionService.issue({
        bookId: Number(form.bookId),
        memberId: Number(form.memberId),
        issueDate: form.issueDate,
        dueDate: form.dueDate,
      })
      showToast('Book issued successfully')
      navigate('/transactions')
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to issue book', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading books and members..." />

  return (
    <div>
      <h4 className="fw-bold mb-4">Issue Book</h4>

      <div className="table-card" style={{ maxWidth: 700 }}>
        {books.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
            No books currently available to issue
          </div>
        ) : members.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
            No members registered yet
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Book *</label>
                <select
                  className={`form-select ${errors.bookId ? 'is-invalid' : ''}`}
                  name="bookId"
                  value={form.bookId}
                  onChange={handleChange}
                >
                  <option value="">Select a book</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.availableQuantity} available)
                    </option>
                  ))}
                </select>
                {errors.bookId && <div className="invalid-feedback">{errors.bookId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Member *</label>
                <select
                  className={`form-select ${errors.memberId ? 'is-invalid' : ''}`}
                  name="memberId"
                  value={form.memberId}
                  onChange={handleChange}
                >
                  <option value="">Select a member</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
                {errors.memberId && <div className="invalid-feedback">{errors.memberId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Issue Date *</label>
                <input
                  type="date"
                  className={`form-control ${errors.issueDate ? 'is-invalid' : ''}`}
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                />
                {errors.issueDate && <div className="invalid-feedback">{errors.issueDate}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
                {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Issuing...
                  </>
                ) : (
                  'Issue Book'
                )}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/transactions')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
