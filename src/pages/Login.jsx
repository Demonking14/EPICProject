import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, initializeDemoUsers } from '../utils/auth'

const tips = [
  'Monitor live demand insights before setting your prices.',
  'Use the buyer marketplace to secure repeat contracts.',
  'Switch roles anytime by signing up with a different persona.'
]

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    initializeDemoUsers()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      navigate(user.role === 'farmer' ? '/farmer-dashboard' : '/buyer-marketplace')
    } catch (err) {
      setError(err.message || 'Invalid email or password! Please try again or sign up.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-900 to-emerald-800 px-4 py-16 text-white">
      <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl bg-white/10 p-1 text-slate-900 shadow-2xl backdrop-blur">
        <div className="grid gap-10 rounded-3xl bg-white/95 p-10 lg:grid-cols-[1.3fr,1fr]">
          <div>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-500">AgriMarket</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Access your workspace</h2>
              <p className="mt-2 text-sm text-slate-500">Sign in to manage produce pipelines, buyer requests, and live pricing.</p>
            </div>
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
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
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                {loading ? 'Signing in...' : 'Continue'}
              </button>
              <p className="text-center text-sm text-slate-500">
                New to AgriMarket?{' '}
                <Link to="/signup" className="font-semibold text-green-600">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
          <div className="rounded-2xl bg-slate-900/90 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Demo access</p>
            <h3 className="mt-4 text-2xl font-semibold">Use a sample workspace</h3>
            <p className="mt-2 text-sm text-white/60">Create an account first, or use these after seeding demo users (see README).</p>
            <div className="mt-6 space-y-4 rounded-2xl bg-white/5 p-4 text-sm">
              <div>
                <p className="text-white/80">Farmer (supply)</p>
                <p className="font-mono text-lg">farmer@test.com</p>
                <p className="font-mono text-lg">farmer123</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-white/80">Buyer (demand)</p>
                <p className="font-mono text-lg">buyer@test.com</p>
                <p className="font-mono text-lg">buyer123</p>
              </div>
            </div>
            <div className="mt-8 space-y-3 text-sm text-white/80">
              {tips.map((tip) => (
                <div key={tip} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
