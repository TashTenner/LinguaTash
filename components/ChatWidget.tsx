'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Step = 'message' | 'more' | 'extra' | 'name' | 'email' | 'done' | 'error'

type Bubble = { from: 'tash' | 'user'; text: string }

const GREETING: Bubble = {
  from: 'tash',
  text: '¡Hola! ¿En qué puedo ayudarte? Te respondo por email.',
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('message')
  const [bubbles, setBubbles] = useState<Bubble[]>([GREETING])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const userMessage = useRef('')
  const userName = useRef('')

  const panelRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open) return
    function onMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bubbles, isTyping])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open, step])

  function pushBubble(bubble: Bubble) {
    setBubbles((prev) => [...prev, bubble])
  }

  function tashResponds(text: string, nextStep: Step, delay = 700) {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      pushBubble({ from: 'tash', text })
      setStep(nextStep)
    }, delay)
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const value = draft.trim()
    if (!value) return
    setDraft('')
    pushBubble({ from: 'user', text: value })

    if (step === 'message') {
      userMessage.current = value
      tashResponds('¿Quieres añadir algo más?', 'more')
    } else if (step === 'extra') {
      userMessage.current = userMessage.current + '\n\n' + value
      tashResponds('¿Quieres añadir algo más?', 'more')
    } else if (step === 'name') {
      userName.current = value
      tashResponds(`¡Encantada, ${value}! ¿A qué email te respondo?`, 'email')
    } else if (step === 'email') {
      sendEmail(value)
    }
  }

  function handleMore(choice: 'yes' | 'no') {
    if (choice === 'no') {
      pushBubble({ from: 'user', text: 'No, es todo.' })
      tashResponds('¡Gracias! ¿Cómo te llamas?', 'name')
    } else {
      pushBubble({ from: 'user', text: 'Sí, añado algo.' })
      tashResponds('¡Claro! Te escucho.', 'extra')
    }
  }

  async function sendEmail(email: string) {
    setIsTyping(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName.current,
          email,
          message: userMessage.current,
        }),
      })
      if (res.ok) {
        setIsTyping(false)
        pushBubble({ from: 'tash', text: '¡Listo! Te respondo en cuanto pueda. Hasta pronto.' })
        setStep('done')
      } else {
        const data = await res.json().catch(() => ({}))
        setIsTyping(false)
        setErrorMsg(data?.error ?? 'Ha ocurrido un error. Inténtalo de nuevo.')
        setStep('error')
      }
    } catch {
      setIsTyping(false)
      setErrorMsg('Ha ocurrido un error. Inténtalo de nuevo.')
      setStep('error')
    }
  }

  const showInput = step === 'message' || step === 'extra' || step === 'name' || step === 'email'

  const placeholder =
    step === 'message' || step === 'extra'
      ? '¿En qué puedo ayudarte?'
      : step === 'name'
        ? 'Tu nombre'
        : 'Tu email'

  return (
    <div className="fixed right-3 bottom-3 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div
          ref={panelRef}
          className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10"
          style={{
            width: 'min(320px, calc(100vw - 1.5rem))',
            height: 'min(420px, calc(100dvh - 6rem))',
          }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center gap-2.5 bg-[#B3475A] px-4 py-3">
            <div className="relative shrink-0">
              <Image
                src="/static/images/headshot-png-format.png"
                alt="Tash"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/40"
              />
              <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#B3475A]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight text-white">Tash</p>
              <p className="text-xs leading-tight text-white/65">Activa hace un momento</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="shrink-0 text-white/60 transition-colors hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {bubbles.map((bubble, i) =>
              bubble.from === 'tash' ? (
                <div key={i} className="flex items-end gap-1.5">
                  <Image
                    src="/static/images/headshot-png-format.png"
                    alt=""
                    width={22}
                    height={22}
                    className="mb-0.5 h-[22px] w-[22px] shrink-0 rounded-full object-cover"
                  />
                  <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-gray-100 px-3.5 py-2.5 text-sm leading-snug text-[#081C3C] dark:bg-gray-700 dark:text-[#F4EFE8]">
                    {bubble.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-[#B3475A] px-3.5 py-2.5 text-sm leading-snug text-white">
                    {bubble.text}
                  </div>
                </div>
              )
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-1.5">
                <Image
                  src="/static/images/headshot-png-format.png"
                  alt=""
                  width={22}
                  height={22}
                  className="mb-0.5 h-[22px] w-[22px] shrink-0 rounded-full object-cover"
                />
                <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 dark:bg-gray-700">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9A8F85]" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9A8F85]" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9A8F85]" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            {/* Quick-reply chips */}
            {step === 'more' && !isTyping && (
              <div className="flex gap-2 pl-8">
                <button
                  onClick={() => handleMore('no')}
                  className="rounded-full border border-[#9A8F85]/40 px-3 py-1.5 text-xs text-[#081C3C] transition-colors hover:border-[#B3475A] hover:bg-[#B3475A] hover:text-white dark:text-[#F4EFE8]"
                >
                  No, es todo
                </button>
                <button
                  onClick={() => handleMore('yes')}
                  className="rounded-full border border-[#9A8F85]/40 px-3 py-1.5 text-xs text-[#081C3C] transition-colors hover:border-[#B3475A] hover:bg-[#B3475A] hover:text-white dark:text-[#F4EFE8]"
                >
                  Sí, añado algo
                </button>
              </div>
            )}

            {step === 'error' && (
              <p className="text-center text-xs text-[#B3475A]">{errorMsg}</p>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          {showInput && (
            <form
              onSubmit={handleSend}
              className="flex shrink-0 items-end gap-2 border-t border-black/5 bg-white px-3 py-3 dark:border-white/5 dark:bg-gray-900"
            >
              {step === 'message' || step === 'extra' ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={placeholder}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      e.currentTarget.form?.requestSubmit()
                    }
                  }}
                  className="max-h-20 min-h-[36px] flex-1 resize-none rounded-xl bg-gray-100 px-3 py-2 text-sm text-[#081C3C] placeholder:text-[#9A8F85] focus:outline-none dark:bg-gray-800 dark:text-[#F4EFE8]"
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={step === 'email' ? 'email' : 'text'}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="flex-1 rounded-xl bg-gray-100 px-3 py-2 text-sm text-[#081C3C] placeholder:text-[#9A8F85] focus:outline-none dark:bg-gray-800 dark:text-[#F4EFE8]"
                />
              )}
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Enviar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B3475A] text-white transition-opacity hover:opacity-90 disabled:opacity-35"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19V5m-7 7l7-7 7 7"
                  />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat' : 'Escríbeme'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B3475A] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
