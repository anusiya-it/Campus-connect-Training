import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import memberService from '../services/memberService'
import Loader from '../components/Loader.jsx'
import { useToast } from '../components/ToastContext.jsx'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
}

export default function AddMember() {
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
      memberService
        .getById(id)
        .then((res) => {
          const m = res.data
          setForm({
            name: m.name,
            email: m.email,
            phone: m.phone,
            address: m.address || '',
          })
        })
        .catch((err) => showToast(err.friendlyMessage || 'Failed to load member', 'error'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email'
    }
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    }

    setSaving(true)
    try {
      if (isEdit) {
        await memberService.update(id, payload)
        showToast('Member updated successfully')
      } else {
        await memberService.create(payload)
        showToast('Member added successfully')
      }
      navigate('/members')
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setErrors(err.response.data.validationErrors)
      }
      showToast(err.friendlyMessage || 'Failed to save member', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading member..." />

  return (
    <div>
      <h4 className="fw-bold mb-4">{isEdit ? 'Edit Member' : 'Add Member'}</h4>

      <div className="table-card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name *</label>
              <input
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone *</label>
              <input
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Address</label>
              <input className="form-control" name="address" value={form.address} onChange={handleChange} />
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
                'Update Member'
              ) : (
                'Add Member'
              )}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/members')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
