const fs = require('fs')
const path = require('path')

const quizPath = path.join(__dirname, 'src', 'components', 'QuizSection.tsx')
let content = fs.readFileSync(quizPath, 'utf8')

// Add getCurrentUser to imports
content = content.replace(
  `import { useState, useCallback } from 'react'`,
  `import { useState, useCallback, useEffect } from 'react'
import { getCurrentUser } from '../services/authStorage'`
)

const oldDraftInit = `  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)`

const newDraftInit = `  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  // AD14-06: Sinkronisasi draf & riwayat saat akun berganti (Akun A -> Akun B)
  useEffect(() => {
    const handleAuthChange = () => {
      const freshUser = getCurrentUser()
      const uid = freshUser?.id || 'guest'
      const { draft: reloadedDraft } = loadQuizDraft(questions, uid)
      const { history: reloadedHistory } = loadQuizHistory(uid)
      setDraft(reloadedDraft)
      setHistory(reloadedHistory)
    }

    window.addEventListener('asambasa:auth_changed', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('focus', handleAuthChange)
    return () => {
      window.removeEventListener('asambasa:auth_changed', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('focus', handleAuthChange)
    }
  }, [questions])`

content = content.replace(oldDraftInit, newDraftInit)

fs.writeFileSync(quizPath, content, 'utf8')
console.log('Updated QuizSection.tsx with auth sync')
