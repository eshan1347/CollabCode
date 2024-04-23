import { useState } from 'react'
import './App.css'
import CodeEditor from '../components/CodeEditor'
import CodeEdi from '../components/CodeEdi'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <CodeEditor /> */}
    <CodeEdi />
    </>
  )
}

export default App
