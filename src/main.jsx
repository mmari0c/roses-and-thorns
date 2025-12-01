import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Layout from './routes/Layout.jsx'
import CreatePost from './routes/CreatePost.jsx'
import App from './App.jsx'
import DetailView from './routes/DetailView.jsx'
import EditPost from './routes/EditPost.jsx'
import LandingPage from './routes/LandingPage.jsx'
import SignUp from './routes/SignUp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route  path="/signup" element={<SignUp />} />
        <Route path="/" element={<Layout/>}>
          <Route path="/feed" element={<App />} />
          <Route path="post/:postId" element={<DetailView />}/>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
