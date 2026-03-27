import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function Auth() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
      } else if (mode === 'signup') {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return }
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { name } }
        })
        if (error) setError(error.message)
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) setError(error.message)
        else setResetSent(true)
      }
    } catch (e) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const field = (placeholder, value, onChange, type = 'text') => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      style={{
        width: '100%', padding: '10px 14px', fontSize: 13,
        border: '0.5px solid var(--border-2)',
        borderRadius: 8, background: 'var(--bg)',
        color: 'var(--text)', outline: 'none', marginBottom: 10,
      }}
      onFocus={e => e.target.style.borderColor = 'var(--acc)'}
      onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
    />
  )

  return (
    <div style={{
      height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-3)',
    }}>
      <div style={{
        width: 380, background: 'var(--bg)',
        border: '0.5px solid var(--border)',
        borderRadius: 16, padding: 32,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            fontSize: 22, fontWeight: 500,
            color: 'var(--acc)', letterSpacing: '0.04em',
            marginBottom: 6,
          }}>Folio</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {mode === 'login' && 'Sign in to your workspace'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'reset' && 'Reset your password'}
          </div>
        </div>

        {resetSent ? (
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>✉️</div>
            Check your email for a password reset link.
            <div
              onClick={() => { setMode('login'); setResetSent(false) }}
              style={{ marginTop: 16, color: 'var(--acc)', cursor: 'pointer', fontSize: 12 }}
            >
              Back to sign in
            </div>
          </div>
        ) : (
          <>
            {mode === 'signup' && field('Your name', name, setName)}
            {field('Email address', email, setEmail, 'email')}
            {mode !== 'reset' && field('Password', password, setPassword, 'password')}

            {error && (
              <div style={{
                fontSize: 12, color: '#A32D2D',
                background: '#FCEBEB', borderRadius: 6,
                padding: '8px 12px', marginBottom: 12,
              }}>{error}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '10px',
                background: loading ? 'var(--bg-3)' : 'var(--acc)',
                color: loading ? 'var(--text-3)' : '#fff',
                border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: 16, transition: 'all 0.12s',
              }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {mode === 'login' && (
                <>
                  <span
                    onClick={() => { setMode('signup'); setError('') }}
                    style={{ fontSize: 12, color: 'var(--acc)', cursor: 'pointer' }}
                  >Don't have an account? Sign up</span>
                  <span
                    onClick={() => { setMode('reset'); setError('') }}
                    style={{ fontSize: 12, color: 'var(--text-3)', cursor: 'pointer' }}
                  >Forgot password?</span>
                </>
              )}
              {mode !== 'login' && (
                <span
                  onClick={() => { setMode('login'); setError('') }}
                  style={{ fontSize: 12, color: 'var(--acc)', cursor: 'pointer' }}
                >Back to sign in</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
