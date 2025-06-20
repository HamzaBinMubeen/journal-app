import React, { useState, useEffect } from 'react'
import { marked } from 'marked'

const essays = [
  { title: '"How to start a startup" by Paul Graham', file: '1.how_to_start_a_startup.md' },
  { title: '"How to do Great Work" by Paul Graham', file: '2.how_to_do_great_work.md' },
]

function App() {
  const [content, setContent] = useState(null)
  const [title, setTitle] = useState('')
  const [currentFile, setCurrentFile] = useState(null)

  // Handle URL changes for essay navigation
  useEffect(() => {
    const match = window.location.pathname.match(/^\/essay\/(.+)$/)
    if (match) {
      const file = match[1]
      const essay = essays.find(e => e.file === file)
      if (essay) loadEssay(essay, false)
    }
    window.onpopstate = () => {
      const match = window.location.pathname.match(/^\/essay\/(.+)$/)
      if (match) {
        const file = match[1]
        const essay = essays.find(e => e.file === file)
        if (essay) loadEssay(essay, false)
      } else {
        setContent(null)
        setTitle('')
        setCurrentFile(null)
      }
    }
    return () => { window.onpopstate = null }
    // eslint-disable-next-line
  }, [])

  const loadEssay = async (essay, push = true) => {
    const res = await fetch(`/essays/${essay.file}`)
    const text = await res.text()
    setContent(marked.parse(text))
    setTitle(essay.title)
    setCurrentFile(essay.file)
    if (push) {
      window.history.pushState({}, '', `/essay/${essay.file}`)
    }
  }

  const goBack = () => {
    window.history.pushState({}, '', '/')
    setContent(null)
    setTitle('')
    setCurrentFile(null)
  }

  return (
    <>
      <style>{`
        body {
          background: #fff;
          font-family: 'Inter', Inter, system-ui, sans-serif;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          height: 100vh;
          width: 100vw;
        }
        .container {
          max-width: 600px;
          padding: 40px 24px;
        }
        .heading {
          font-size: 40px;
          font-weight: 700;
          color: #111;
          letter-spacing: -2px;
          margin-bottom: 16px;
        }
        .sub {
          color: #888;
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 32px;
        }
        .essay-list {
          list-style: none;
          padding: 0;
        }
        .essay-list li {
          margin-bottom: 0px;
        }
        .essay-link {
          color: #0099ff;
          text-decoration: underline;
          background: none;
          border: none;
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          padding: 0;
        }
        .essay-link:hover {
          color: #000;
          text-decoration: none;
          background: none;
          border: none;
        }
        .back-btn {
          color:rgb(73, 73, 73);
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 24px;
          padding: 0;
        }
        .back-btn:hover {
          color: #000;
          text-decoration: none;
          background: none;
          border: none;
        }
        .essay-content h1, .essay-content h2, .essay-content h3 {
          color: #111;
          font-family: inherit;
        }
        .essay-content {
          font-size: 18px;
          color: #222;
          line-height: 1.6;
        }
      `}</style>
      <div className="container">
        {!content ? (
          <>
            <div className="heading">hi.</div>
            <div className="sub">here are some analysis of what i'm reading.</div>
            <ul className="essay-list">
              {essays.map((essay) => (
                <li key={essay.file}>
                  <button className="essay-link" onClick={() => loadEssay(essay)}>
                    {essay.title}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div>
            <button className="back-btn" onClick={goBack}>&larr; back</button>
            <div className="essay-content" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </div>
    </>
  )
}

export default App
