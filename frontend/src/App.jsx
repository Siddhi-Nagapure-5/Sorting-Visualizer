import React from 'react'
import './App.css'
import SortingVisualizer from './components/SortingVisualizer'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import SplashScreen from './components/SplashScreen';
const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path='/' element={<SplashScreen />}/>
        <Route path='/home' element={<SortingVisualizer/>}/>
      </Routes>
    </Router>
  )
}

export default App
