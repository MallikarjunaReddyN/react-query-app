import { useMutation } from "react-query"
import axios from 'axios'
import { Student } from "./App";
import { useQueryClient } from "react-query";

function DeleteStudent() {
    const queryClient = useQueryClient();
    const studentId: number = 4;
    const { isLoading, isSuccess, isError, 
        error, mutate } = useMutation<any, Error>(() => {
        return axios.delete<Student>(`http://localhost:4000/students/${studentId}`)
    })
  
    return (
      <div>
        {isLoading ? (
          'Deleting Student...'
        ) : (
          <>
            {isError ? (
              <div>An error occurred: {error?.message}</div>
            ) : null}
            <button onClick={() => {mutate()}}>
              Delete Student
            </button>
          </>
        )}
      </div>
    )
  }
  export default DeleteStudent