import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import memberService from '../services/memberService'
import Loader from '../components/Loader.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { useToast } from '../components/ToastContext.jsx'

export default function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async (keyword = '') => {
    setLoading(true)
    try {
      const res = await memberService.getAll(keyword)
      setMembers(res.data)
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to load members', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadMembers(search)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await memberService.remove(deleteTarget.id)
      showToast(`"${deleteTarget.name}" deleted successfully`)
      setDeleteTarget(null)
      loadMembers(search)
    } catch (err) {
      showToast(err.friendlyMessage || 'Failed to delete member', 'error')
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h4 className="fw-bold mb-0">Members</h4>
        <Link to="/members/add" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Add Member
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
            placeholder="Search by name, email, phone..."
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
                loadMembers('')
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="table-card">
        {loading ? (
          <Loader label="Loading members..." />
        ) : members.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-people fs-1 d-block mb-2"></i>
            No members found
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Registered On</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className="fw-semibold">{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.phone}</td>
                    <td>{m.address || '-'}</td>
                    <td>{m.registrationDate}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => navigate(`/members/edit/${m.id}`)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteTarget(m)}
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
        title="Delete Member"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
