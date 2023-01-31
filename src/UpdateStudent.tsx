import { useMutation } from "react-query"
import axios from 'axios'
import { useState } from 'react'
import { Student } from "./App";
import { useQueryClient } from "react-query";

function updateStudent() {
    const queryClient = useQueryClient();
    const studentId: number = 4;
    const [name, setName] = useState("");
    const { isLoading: updateStudentLoading, isSuccess: updateStudentSuccess, isError: updateStudentError, 
        error: addStudentErrorData, mutate: addStudent } = useMutation<any, Error>(() => {
        return axios.put<Student>(`http://localhost:4000/students/${studentId}`, { name: name })
    })
  
    return (
      <div>
        {updateStudentLoading ? (
          'Update Student...'
        ) : (
          <>
            {updateStudentError ? (
              <div>An error occurred: {addStudentErrorData?.message}</div>
            ) : null}
  
            {updateStudentSuccess ? <div>Student updated!</div> : null}
            <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
            <button
              onClick={() => {
                addStudent()
              }}
            >
              Update Student
            </button>
          </>
        )}
      </div>
    )
  }
  export default updateStudent
