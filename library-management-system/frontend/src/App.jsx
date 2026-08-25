import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Books from './pages/Books.jsx'
import AddBook from './pages/AddBook.jsx'
import Members from './pages/Members.jsx'
import AddMember from './pages/AddMember.jsx'
import IssueBook from './pages/IssueBook.jsx'
import ReturnBook from './pages/ReturnBook.jsx'
import Transactions from './pages/Transactions.jsx'
import { ToastProvider } from './components/ToastContext.jsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <ToastProvider>
      <div className="app-layout">
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={closeSidebar}
        />
        <div className="main-content">
          <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
          <div className="page-body">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/add" element={<AddBook />} />
              <Route path="/books/edit/:id" element={<AddBook />} />
              <Route path="/members" element={<Members />} />
              <Route path="/members/add" element={<AddMember />} />
              <Route path="/members/edit/:id" element={<AddMember />} />
              <Route path="/issue" element={<IssueBook />} />
              <Route path="/return" element={<ReturnBook />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

export default App
