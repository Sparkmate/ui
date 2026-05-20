import * as React from 'react'

import { ArrowUpIcon, XIcon } from 'lucide-react'

import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'

export type AgentChatRole = 'user' | 'assistant'

export type AgentChatMessage = {
  id?: string
  role: AgentChatRole
  content: string
  ts?: string
}

export type AgentChatProps = {
  messages?: AgentChatMessage[]
  defaultMessages?: AgentChatMessage[]
  onMessagesChange?: (messages: AgentChatMessage[]) => void
  onSubmit?: (
    text: string,
  ) => void | AgentChatMessage | AgentChatMessage[] | Promise<void | AgentChatMessage | AgentChatMessage[]>
  suggestions?: string[]
  placeholder?: string
  emptyTitle?: string
  emptyDescription?: string
  assistantName?: string
  assistantAvatarSrc?: string
  assistantAvatarAlt?: string
  modelLabel?: string
  showClear?: boolean
  onClear?: () => void
  showClose?: boolean
  onClose?: () => void
  disabled?: boolean
  className?: string
}

const defaultSuggestions = [
  'Give me an investor overview.',
  'Summarize key metrics.',
  'What are main risks?',
  'Highlight red flags.',
]

function nextId() {
  return Math.random().toString(36).slice(2, 10)
}

function nowSerialTime() {
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
  return formatter.format(new Date()).toUpperCase()
}

export function AgentChat({
  messages,
  defaultMessages = [],
  onMessagesChange,
  onSubmit,
  suggestions = defaultSuggestions,
  placeholder = 'What would you like to know?',
  emptyTitle = 'Welcome to your AI copilot',
  emptyDescription = 'Ask a question to get started.',
  assistantName = 'AI',
  assistantAvatarSrc,
  assistantAvatarAlt,
  modelLabel,
  showClear = true,
  onClear,
  showClose,
  onClose,
  disabled,
  className,
}: AgentChatProps) {
  const isControlled = messages !== undefined
  const [internalMessages, setInternalMessages] =
    React.useState<AgentChatMessage[]>(defaultMessages)
  const [text, setText] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  const currentMessages = isControlled ? messages : internalMessages

  const commitMessages = React.useCallback(
    (next: AgentChatMessage[]) => {
      if (!isControlled) {
        setInternalMessages(next)
      }
      onMessagesChange?.(next)
    },
    [isControlled, onMessagesChange],
  )

  const handleSend = React.useCallback(
    async (value: string) => {
      const trimmed = value.trim()
      if (!trimmed || disabled || submitting) return

      const userMessage: AgentChatMessage = {
        id: nextId(),
        role: 'user',
        content: trimmed,
        ts: nowSerialTime(),
      }
      const nextWithUser = [...currentMessages, userMessage]
      commitMessages(nextWithUser)
      setText('')

      if (!onSubmit) return

      setSubmitting(true)
      try {
        const result = await onSubmit(trimmed)
        if (!result) return

        if (Array.isArray(result)) {
          const normalized = result.map((item) => ({
            ...item,
            id: item.id ?? nextId(),
            ts: item.ts ?? nowSerialTime(),
          }))
          commitMessages([...nextWithUser, ...normalized])
          return
        }

        commitMessages([
          ...nextWithUser,
          {
            ...result,
            id: result.id ?? nextId(),
            ts: result.ts ?? nowSerialTime(),
          },
        ])
      } finally {
        setSubmitting(false)
      }
    },
    [commitMessages, currentMessages, disabled, onSubmit, submitting],
  )

  const clearMessages = React.useCallback(() => {
    commitMessages([])
    onClear?.()
  }, [commitMessages, onClear])

  const autoResize = React.useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`
  }, [])

  React.useEffect(() => {
    autoResize()
  }, [text, autoResize])

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [currentMessages, submitting])

  return (
    <div className={cn('relative flex h-full flex-col overflow-hidden bg-canvas', className)}>
      {showClose && onClose ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 z-10"
          onClick={onClose}
          aria-label="Close chat"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      ) : null}

      <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto px-6 py-6 scrollbar-thin">
        {currentMessages.length === 0 ? (
          <div className="flex h-full min-h-48 max-w-2xl flex-col items-start justify-center pb-20">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-white">
              {emptyTitle}
            </h3>
            <p className="serial mb-6 mt-1">{emptyDescription}</p>
            <div className="w-full space-y-1.5">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={disabled || submitting}
                  onClick={() => {
                    void handleSend(suggestion)
                  }}
                  className="w-full border border-line px-3 py-2.5 text-left text-xs uppercase tracking-wide text-muted transition hover:border-body hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{`→ ${suggestion}`}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          currentMessages.map((message) => (
            <div
              key={message.id ?? `${message.role}-${message.content}`}
              className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {message.role === 'assistant' ? (
                <div className="flex max-w-2xl gap-3">
                  {assistantAvatarSrc ? (
                    <img
                      src={assistantAvatarSrc}
                      alt={assistantAvatarAlt ?? assistantName}
                      className="mt-0.5 h-7 w-7 flex-shrink-0 object-cover"
                      style={{ borderRadius: 0 }}
                    />
                  ) : null}
                  <div className="min-w-0">
                    <div className="border border-line bg-surface px-4 py-3 text-sm text-body">
                      <div className="prose-chat whitespace-pre-wrap">{message.content}</div>
                    </div>
                    {message.ts ? (
                      <div className="mt-1 flex items-center gap-3">
                        <span className="serial">{message.ts}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="max-w-xl">
                  <div className="whitespace-pre-wrap bg-spark px-4 py-2.5 text-sm font-medium text-canvas">
                    {message.content}
                  </div>
                  {message.ts ? (
                    <div className="serial mt-1 text-right text-xs text-muted">{message.ts}</div>
                  ) : null}
                </div>
              )}
            </div>
          ))
        )}
        {submitting ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 text-xs text-muted">
              <Spinner className="h-4 w-4" />
              <span className="serial">Connecting...</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex-shrink-0 px-6 pb-5">
        {currentMessages.length > 0 && showClear ? (
          <div className="mb-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto border border-line px-3 py-1.5 text-xs uppercase tracking-widest text-muted hover:border-body hover:text-body"
              disabled={disabled || submitting}
              onClick={clearMessages}
            >
              New chat
            </Button>
          </div>
        ) : null}

        <div className="flex items-end gap-0 border border-line transition focus-within:border-body">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void handleSend(text)
              }
            }}
            placeholder={placeholder}
            disabled={disabled || submitting}
            rows={1}
            className="max-h-32 min-h-16 flex-1 resize-none bg-surface px-4 py-3 text-sm leading-relaxed text-body outline-none placeholder:text-muted"
          />
          <button
            type="button"
            disabled={disabled || submitting || !text.trim()}
            onClick={() => {
              void handleSend(text)
            }}
            className={cn(
              'flex w-12 flex-shrink-0 self-stretch items-center justify-center transition',
              text.trim() && !disabled && !submitting
                ? 'cursor-pointer bg-spark text-canvas hover:bg-white'
                : 'cursor-not-allowed bg-surface text-muted',
            )}
          >
            {submitting ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <ArrowUpIcon className="h-4 w-4 rotate-90" />
            )}
          </button>
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="serial">ENTER TO SEND · SHIFT+ENTER FOR NEW LINE</span>
          {modelLabel ? <span className="serial text-spark">{modelLabel}</span> : null}
        </div>
      </div>
    </div>
  )
}
