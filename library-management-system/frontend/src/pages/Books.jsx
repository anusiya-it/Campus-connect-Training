import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bookService from '../services/bookService'
import Loader from '../components/Loader.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { useToast } from '../components/ToastContext.jsx'

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async (keyword = '') => {
    setLoading(true)
    try {
      const res = await bookService.getAll(keyword)
      setBooks(res.data)
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to load books', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadBooks(search)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await bookService.remove(deleteTarget.id)
      showToast(`"${deleteTarget.title}" deleted successfully`)
      setDeleteTarget(null)
      loadBooks(search)
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to delete book', 'error')
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h4 className="fw-bold mb-0">Books</h4>
        <Link to="/books/add" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Add Book
        </Link>
      </div>

      <form className="mb-3" onSubmit={handleSearch}>
        <div className="input-group" style={{ maxWidth: 420 }}>
          <span className="input-group-text bg-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, author, ISBN, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="submit">
            Search
          </button>
          {search && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                setSearch('')
                loadBooks('')
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="table-card">
        {loading ? (
          <Loader label="Loading books..." />
        ) : books.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-book fs-1 d-block mb-2"></i>
            No books found
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Publisher</th>
                  <th>Year</th>
                  <th>Qty</th>
                  <th>Available</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.isbn}</td>
                    <td>{b.category || '-'}</td>
                    <td>{b.publisher || '-'}</td>
                    <td>{b.publicationYear || '-'}</td>
                    <td>{b.quantity}</td>
                    <td>
                      <span className={`badge ${b.availableQuantity > 0 ? 'text-bg-success' : 'text-bg-secondary'}`}>
                        {b.availableQuantity}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => navigate(`/books/edit/${b.id}`)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteTarget(b)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
