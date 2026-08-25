import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import bookService from '../services/bookService'
import Loader from '../components/Loader.jsx'
import { useToast } from '../components/ToastContext.jsx'

const emptyForm = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  publisher: '',
  publicationYear: '',
  quantity: '',
}

export default function AddBook() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      bookService
        .getById(id)
        .then((res) => {
          const b = res.data
          setForm({
            title: b.title,
            author: b.author,
            isbn: b.isbn,
            category: b.category || '',
            publisher: b.publisher || '',
            publicationYear: b.publicationYear || '',
            quantity: b.quantity,
          })
        })
        .catch((err) => showToast(err.friendlyMessage || 'Failed to load book', 'error'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.author.trim()) errs.author = 'Author is required'
    if (!form.isbn.trim()) errs.isbn = 'ISBN is required'
    if (form.quantity === '' || Number(form.quantity) < 0) errs.quantity = 'Enter a valid quantity'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      category: form.category.trim(),
      publisher: form.publisher.trim(),
      publicationYear: form.publicationYear ? Number(form.publicationYear) : null,
      quantity: Number(form.quantity),
    }

    setSaving(true)
    try {
      if (isEdit) {
        await bookService.update(id, payload)
        showToast('Book updated successfully')
      } else {
        await bookService.create(payload)
        showToast('Book added successfully')
      }
      navigate('/books')
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setErrors(err.response.data.validationErrors)
      }
      showToast(err.friendlyMessage || 'Failed to save book', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading book..." />

  return (
    <div>
      <h4 className="fw-bold mb-4">{isEdit ? 'Edit Book' : 'Add Book'}</h4>

      <div className="table-card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title *</label>
              <input
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                name="title"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Author *</label>
              <input
                className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                name="author"
                value={form.author}
                onChange={handleChange}
              />
              {errors.author && <div className="invalid-feedback">{errors.author}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">ISBN *</label>
              <input
                className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
              />
              {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Category</label>
              <input className="form-control" name="category" value={form.category} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Publisher</label>
              <input className="form-control" name="publisher" value={form.publisher} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Publication Year</label>
              <input
                type="number"
                className="form-control"
                name="publicationYear"
                value={form.publicationYear}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                min="0"
                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
              />
              {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
              {isEdit && (
                <div className="form-text">
                  Reducing quantity below currently issued copies is not allowed.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : isEdit ? (
                'Update Book'
              ) : (
                'Add Book'
              )}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/books')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
