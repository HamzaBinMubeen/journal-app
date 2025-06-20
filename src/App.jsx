import React, { useState, useEffect } from 'react'
import { marked } from 'marked'

// Dynamically import all markdown files from public/essays
const essayFiles = import.meta.glob('/public/essays/*.md', { query: '?url', import: 'default', eager: true })

const essays = Object.entries(essayFiles).map(([path, url]) => {
  const file = path.split('/').pop()
  // Remove extension, replace _ and - with spaces, capitalize each word
  const base = file.replace(/\.md$/, '').replace(/[_-]/g, ' ')
  const title = base.replace(/\b\w/g, c => c.toUpperCase())
  return { title, file, url }
})

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
    // Use the url property for fetching
    const res = await fetch(essay.url)
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
            <div className="heading">hi, i am hamza.</div>
            <div className="sub">a startup founder.</div>
            <div className="sub">here i analyze different essays/books that i'm reading in the startup ecosystem and how it applies to my startup life.</div>
            <div className="sub">these are some topics that i've read and journaled, i hope you find them useful.</div>
            <ul className="essay-list">
              {essays.map((essay) => (
                <li key={essay.file}>
                  <button className="essay-link" onClick={() => loadEssay(essay)}>
                    {essay.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="sub">PS. i'm not a startup growth expert, i'm just a startup founder who is journaling here and sharing my thoughts.</div>
            <div className="sub">if you like what you read or have some feedback, please reach out to me on</div>
            <div className="sub">
              <a href="https://www.linkedin.com/in/hamza-bin-mubeen/">linkedin</a> 
              • 
              <a href="https://www.instagram.com/hamza.bin.mubeen/"> instagram</a>
            </div>
            <div className="sub">or email me at <a href="mailto:ceo@theuniapp.com">ceo@theuniapp.com</a>.</div>
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
