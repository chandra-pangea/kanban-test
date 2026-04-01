import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  const canSubmit = email.trim() && password.trim()

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit) return
    login(email.trim())
  }

  return (
    <main className="min-h-screen bg-[#f6f8ff] px-4 py-10 md:py-16">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-[#e5e8f2] bg-white shadow-[0_18px_48px_rgba(14,20,38,0.08)] md:grid-cols-2">
        <div className="hidden bg-gradient-to-b from-[#5562ff] to-[#3947f4] p-10 text-white md:block">
          <p className="text-sm/6 tracking-[0.14em] text-white/70">NEXUS</p>
          <h2 className="mt-6 text-3xl font-semibold leading-tight">Manage your projects with clarity.</h2>
          <p className="mt-4 max-w-sm text-sm/6 text-white/85">
            Plan work, track progress, and collaborate with your team in one clean workspace.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#64748b]">Please enter your details to log in.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="h-11 w-full rounded-xl border border-[#d6dbe8] px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#5562ff] focus:ring-2 focus:ring-[#5562ff]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-11 w-full rounded-xl border border-[#d6dbe8] px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#5562ff] focus:ring-2 focus:ring-[#5562ff]/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-[#334155]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#cbd5e1] text-[#5562ff] focus:ring-[#5562ff]/30"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-[#5562ff] hover:text-[#3947f4]">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="h-11 w-full rounded-xl bg-[#5562ff] text-sm font-semibold text-white transition hover:bg-[#3947f4] disabled:cursor-not-allowed disabled:bg-[#b8bff8]"
            >
              Log in
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
