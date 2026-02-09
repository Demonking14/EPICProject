import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || ''

export function getSocket () {
  const token = localStorage.getItem('token')
  return io(SOCKET_URL, {
    auth: { token },
    path: '/socket.io'
  })
}
