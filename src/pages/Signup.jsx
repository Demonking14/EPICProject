import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../utils/auth'

const roles = [
  { value: 'farmer', label: 'Farmer', description: 'List produce, automate supply commitments.' },
  { value: 'buyer', label: 'Buyer', description: 'Source verified farm lots directly.' }
]

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('farmer')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)
    try {
      const msg = await register({ name, email, password, role })
      setSuccessMsg(msg)
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (successMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white shadow-xl text-center">
          <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox</h2>
          <p className="text-slate-600 mb-8">{successMsg}</p>
          <Link to="/login" className="btn-primary w-full inline-block text-center py-3">Return to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-900 to-emerald-800 px-4 py-16 text-white">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white/10 p-1 shadow-2xl backdrop-blur">
        <div className="grid gap-10 rounded-3xl bg-white/95 p-10 text-slate-900 lg:grid-cols-[1.1fr,1fr]">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-500">Join us</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Create your workspace</h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose a role to tailor the experience. You can always onboard your team later.
              </p>
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Full name</label>
                <input
                  type="text"
                  className="input-field mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Patel"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Work email</label>
                <input
                  type="email"
                  className="input-field mt-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@agrimarket.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Password</label>
                <input
                  type="password"
                  className="input-field mt-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">I am signing up as:</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {roles.map((option) => (
                  <label
                    key={option.value}
                    className={`rounded-2xl border p-4 text-sm transition ${
                      role === option.value ? 'border-green-400 bg-green-50 text-green-900' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      className="hidden"
                      value={option.value}
                      checked={role === option.value}
                      onChange={() => setRole(option.value)}
                    />
                    <p className="font-semibold">{option.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{option.description}</p>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <p className="text-center text-sm text-slate-500">
              Already onboarded?{' '}
              <Link to="/login" className="font-semibold text-green-600">
                Log in
              </Link>
            </p>
          </form>
          <div className="rounded-2xl bg-slate-950/90 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Platform snapshot</p>
            <h3 className="mt-4 text-2xl font-semibold">What you unlock</h3>
            <ul className="mt-6 space-y-4 text-sm text-white/80">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">Smart inventory planning</p>
                <p className="text-white/60">Automated alerts when buyer demand shifts.</p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">Collaborative deals</p>
                <p className="text-white/60">Shared negotiation workspace with buyers or farmers.</p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">Logistics visibility</p>
                <p className="text-white/60">Track dispatch, QA checks, and delivery milestones.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
