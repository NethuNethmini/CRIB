import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './Auth/login'

function App() {
 
  return (
    <div className='flex w-full'>
      <Routes>
      <Route path='/' element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App
