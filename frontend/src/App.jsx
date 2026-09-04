import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../firebase'
import { login } from './features/login'

const App = () => {

  const handleLogin = async() => {
    const result = await signInWithPopup(auth, googleProvider)
    const token = await result.user.getIdToken()
    const data = await login(token)
    console.log("✅ Decoded user from backend:", data?.data)
  }
  return (
    <div>
    <button onClick={handleLogin}>Sign in with Google</button>
    
    </div>
  )
}

export default App