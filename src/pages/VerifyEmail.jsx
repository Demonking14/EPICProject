import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'

function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const verifyToken = async () => {
      try {
        const res = await api(`/api/auth/verify-email/${token}`)
        setStatus('success')
        setMessage(res.message)
      } catch (err) {
        setStatus('error')
        setMessage(err.message || 'Verification failed. The link may be expired or invalid.')
      }
    }

    verifyToken()
  }, [token])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center">
        {status === 'loading' && (
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
            <p className="text-slate-600 mb-8">{message}</p>
            <Link to="/login" className="btn-primary w-full inline-block">
              Proceed to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-16 h-16 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
            <p className="text-slate-600 mb-8">{message}</p>
            <Link to="/signup" className="btn-secondary w-full inline-block">
              Return to Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
