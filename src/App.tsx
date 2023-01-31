import './App.css'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState } from 'react'

export type Student = {
  id: number,
  name: string
}

const fetchStudents = async () => {
  const response = await axios.get<Student[]>('http://localhost:4000/students');
  return response.data;
}

function App() {
  const[studentId, setStudentId] = useState(1);
  const { isLoading, isError, data, error, refetch } = useQuery<Student[], Error>('fetchStudents', fetchStudents);
  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className="App">
      <h1>Hello, React query!!!</h1>
      {data && data.map(student => {
        return <div key={student.id}> Id: {student.id} & Name: {student.name} </div>
      })}
    </div>
  )
}

export default App
