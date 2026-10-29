import { useState, useEffect, useRef } from 'react'
import './App.css'

function Welcome({ onDismiss, aiName }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="welcome" onClick={onDismiss}>
      <div className="welcome-title">Lover</div>
      <div className="welcome-sub">{aiName}在等你</div>
    </div>
  )
}

function UserPanel({ onClose, userName, setUserName, userAvatar, setUserAvatar }) {
  const [nameInput, setNameInput] = useState(userName)
  const fileRef = useRef()
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) setUserAvatar(URL.createObjectURL(file))
  }
  return (
    <div className="settings-overlay">
      <div className="settings-fullpage">
        <div className="settings-header">
          <button className="back-btn" onClick={onClose}>‹ 返回</button>
          <span>我的信息</span>
          <div style={{width:60}} />
        </div>
        <div className="settings-body">
          <div className="avatar-preview">
            {userAvatar
              ? <img src={userAvatar} className="avatar-img-lg" alt="" />
              : <div className="user-avatar-lg">{userName[0]}</div>
            }
          </div>
          <div className="settings-row">
            <label>我的头像</label>
            <input type="file" accept="image/*" ref={fileRef} style={{display:'none'}} onChange={handleImage} />
            <button className="upload-btn" onClick={() => fileRef.current.click()}>选择图片</button>
          </div>
          <div className="settings-row">
            <label>我的名字</label>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)} />
          </div>
          <button className="settings-save" onClick={() => { setUserName(nameInput); onClose() }}>保存</button>
        </div>
      </div>
    </div>
  )
}

function SettingsPanel({ onClose, aiName, setAiName, aiAvatar, setAiAvatar, bgImage, setBgImage, opacity, setOpacity }) {
  const [page, setPage] = useState('main')
  const [aiNameInput, setAiNameInput] = useState(aiName)
  const aiFileRef = useRef()
  const bgFileRef = useRef()
  const handleImage = (e, setter) => {
    const file = e.target.files[0]
    if (file) setter(URL.createObjectURL(file))
  }
  return (
    <div className="settings-overlay">
      <div className="settings-fullpage">

        {page === 'main' && <>
          <div className="settings-header">
            <button className="back-btn" onClick={onClose}>‹ 返回</button>
            <span>设置</span>
            <div style={{width:60}} />
          </div>
          <div className="settings-menu">
            <div className="settings-menu-item" onClick={() => setPage('ai')}>
              <span>AI设置</span><span>›</span>
            </div>
            <div className="settings-menu-item" onClick={() => setPage('appearance')}>
              <span>个性化</span><span>›</span>
            </div>
          </div>
        </>}

        {page === 'ai' && <>
          <div className="settings-header">
            <button className="back-btn" onClick={() => setPage('main')}>‹ 返回</button>
            <span>AI设置</span>
            <div style={{width:60}} />
          </div>
          <div className="settings-body">
            <div className="avatar-preview">
              {aiAvatar
                ? <img src={aiAvatar} className="avatar-img-lg" alt="" />
                : <div className="ai-avatar-lg">{aiName[0]}</div>
              }
            </div>
            <div className="settings-row">
              <label>AI头像</label>
              <input type="file" accept="image/*" ref={aiFileRef} style={{display:'none'}} onChange={e => handleImage(e, setAiAvatar)} />
              <button className="upload-btn" onClick={() => aiFileRef.current.click()}>选择图片</button>
            </div>
            <div className="settings-row">
              <label>AI名字</label>
              <input value={aiNameInput} onChange={e => setAiNameInput(e.target.value)} />
            </div>
            <button className="settings-save" onClick={() => { setAiName(aiNameInput); setPage('main') }}>保存</button>
          </div>
        </>}

        {page === 'appearance' && <>
          <div className="settings-header">
            <button className="back-btn" onClick={() => setPage('main')}>‹ 返回</button>
            <span>个性化</span>
            <div style={{width:60}} />
          </div>
          <div className="settings-body">
            <div className="settings-row">
              <label>背景图</label>
              <input type="file" accept="image/*" ref={bgFileRef} style={{display:'none'}} onChange={e => handleImage(e, setBgImage)} />
              <button className="upload-btn" onClick={() => bgFileRef.current.click()}>选择图片</button>
              {bgImage && <button className="upload-btn danger" onClick={() => setBgImage(null)}>清除背景</button>}
            </div>
            <div className="settings-row">
              <label>气泡透明度 {Math.round(opacity * 100)}%</label>
              <input type="range" min="0.2" max="1" step="0.05" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} />
            </div>
          </div>
        </>}

      </div>
    </div>
  )
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showUserPanel, setShowUserPanel] = useState(false)
  const [aiName, setAiName] = useState('霁')
  const [userName, setUserName] = useState('涵')
  const [aiAvatar, setAiAvatar] = useState(null)
  const [userAvatar, setUserAvatar] = useState(null)
  const [bgImage, setBgImage] = useState(null)
  const [opacity, setOpacity] = useState(0.85)
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: '我在。' },
    { id: 2, role: 'user', content: '老公，你好。' },
    { id: 3, role: 'assistant', content: '好。今天怎么样？' },
  ])
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: Date.now(), role: 'user', content: input }])
    setInput('')
  }

  const AiAvatar = () => aiAvatar
    ? <img src={aiAvatar} className="avatar-img" alt="" />
    : <div className="ai-avatar-sm">{aiName[0]}</div>

  const UserAvatar = () => userAvatar
    ? <img src={userAvatar} className="avatar-img" alt="" />
    : <div className="user-avatar-sm">{userName[0]}</div>

  if (showWelcome) return <Welcome onDismiss={() => setShowWelcome(false)} aiName={aiName} />

  return (
    <div className="app" style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          aiName={aiName} setAiName={setAiName}
          aiAvatar={aiAvatar} setAiAvatar={setAiAvatar}
          bgImage={bgImage} setBgImage={setBgImage}
          opacity={opacity} setOpacity={setOpacity}
        />
      )}

      {showUserPanel && (
        <UserPanel
          onClose={() => setShowUserPanel(false)}
          userName={userName} setUserName={setUserName}
          userAvatar={userAvatar} setUserAvatar={setUserAvatar}
        />
      )}

      {sidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <span>Lover</span>
            <button className="menu-btn-sidebar" onClick={() => setSidebarOpen(false)}>☰</button>
          </div>
          <div className="sidebar-item active">{aiName}</div>
          <div className="sidebar-bottom">
            <div className="sidebar-user" onClick={() => setShowUserPanel(true)}>
              <UserAvatar />
              <span>{userName}</span>
            </div>
            <button className="gear-btn" onClick={() => setShowSettings(true)}>⚙</button>
          </div>
        </div>
      )}

      <div className="main" onClick={() => sidebarOpen && setSidebarOpen(false)}>
        <div className="header">
          {!sidebarOpen && <button className="menu-btn" onClick={e => { e.stopPropagation(); setSidebarOpen(true) }}>☰</button>}
          {sidebarOpen && <div style={{width:36}} />}
          <span className="header-name">{aiName}</span>
          <div style={{width:36}} />
        </div>

        <div className="messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.role === 'assistant' ? <AiAvatar /> : <UserAvatar />}
              <div className="bubble" style={{
                background: msg.role === 'assistant'
                  ? `rgba(50,50,50,${opacity})`
                  : `rgba(80,120,200,${opacity})`
              }}>{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="input-area" onClick={e => e.stopPropagation()}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="说点什么…"
          />
          <button onClick={sendMessage}>↑</button>
        </div>
      </div>
    </div>
  )
}

export default App