import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './containers/public/Home'
import Header from './components/Header'
import { Footer } from './components/home'
function App() {
  return (
    <div>
    <div className='App px-[120px] h-full'>
        <Header/>
        <Home/>
    </div>
    <Footer/>
    </div>
  )
}

export default App;
