import { useMutation } from "react-query"
import axios from 'axios'
import { useState } from 'react'
import { Student } from "./App";
import { useQueryClient } from "react-query";

function AddStudent() {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const { isLoading: addStudentLoading, isSuccess: addStudentSuccess, isError: addStudentError, 
        error: addStudentErrorData, mutate: addStudent } = useMutation<any, Error>(() => {
        return axios.post<Student>("http://localhost:4000/students", { id: new Date(), name: name })
    })
  
    return (
      <div>
        {addStudentLoading ? (
          'Adding Student...'
        ) : (
          <>
            {addStudentError ? (
              <div>An error occurred: {addStudentErrorData?.message}</div>
            ) : null}
  
            {addStudentSuccess ? <div>Student added!</div> : null}
            <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
            <button
              onClick={() => {
                addStudent()
              }}
            >
              Create Student
            </button>
          </>
        )}
      </div>
    )
  }
  export default AddStudent

//   {
//     onSuccess: () => queryClient.invalidateQueries("fetchStudents"),
//     //onError: () => //show toast message
// }