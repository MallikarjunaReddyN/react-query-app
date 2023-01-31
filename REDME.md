**

# React Query

### Overview

React.js is a powerful client-side JavaScript library. Like any other JavaScript library, React.js gives you a smooth experience when building reactive and declarative user interfaces.

However, there are a few negative aspects to it, like state management and data fetching.

Server state management is a little different from other libraries. In React.js, it is asynchronous and the data persists remotely with no direct control. This means that we have to update, cache or re-fetch the data to efficiently manage the state in React.js applications.

React Query is a pre-configured library that aims to solve these complexities. Using React Query, we can fetch, cache, and update data in React-based applications in a simple and declarative manner.

Nowadays, almost every web application works with remote data. Unfortunately, for developers, data fetching and handling server states in React applications are easier said than done. 

As developers, we need to rethink about:

- What to render while waiting for the remote data to load?
  
- What happens if an error occurs?
  
- How do we keep the client up to date with the server?
  

When dealing with asynchronous data that needs frequent updating, caching, and synchronization with the server, there is no better library than React-Query.

### Benefits of using React-Query

- Using window focus pre-fetching mechanism to pre-fetch the data depending on application tab activity.
  
- We can set the number of request retries for any request, in case of random errors.
  
- React-Query performs pre-fetching so that the application can update stale data in the background.
  
- Customize cachetime and stale time.
  

### Installation and setup

You can install React Query with [NPM](https://npmjs.com/) and [Yarn](https://yarnpkg.com/)

```js
npm i react-query 
Or 
yarn add react-query  
```

To configure React-Query in a React.js application, we need to wrap the components that need data fetching, with the QueryClientProvider component. The child components of the QueryClientProvider can now access the hooks provided by the React-Query library that provides us with a QueryClient instance. We will be using this instance to access the hooks provided by the React-Query library.

```tsx
import React from 'react'

import ReactDOM from 'react-dom/client'

import App from './App'

import './index.css'

import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

 <React.StrictMode>

   <QueryClientProvider client={queryClient}>

     <App />

   </QueryClientProvider>

 </React.StrictMode>,

)
```

### Data fetching using React-Query

The difference between React-Query and the common data fetching patterns such as useEffect, is that React-Query will first return the previously fetched data and then re-fetch it again.

If the resource is the same as the first, React-Query will keep both the data as a reference without forcing the page to reload.

While useEffect fetches the data irrespective of the modified data and reloads the page.

React query is providing a useQuery hook for fetching the data.

To subscribe to a query in your components or custom hooks, call the useQuery hook with at least:

- A unique key for the query
  
- A function that returns a promise that:
  

- Resolves the data, or
  
- Throws an error
  

```tsx
import axios from 'axios'

import { useQuery } from 'react-query'

type Student = {

 id: number,

 name: string

}

const fetchStudents = async () => {

 const response = await axios.get<Student[]>('http://localhost:4000/students');

 return response.data;

}

function App() {

 const result = useQuery<Student[], Error>('fetchStudents', fetchStudents);

}

export default App
```

The unique key you provide is used internally for refetching, caching, and sharing your queries throughout your application.

The query results returned by useQuery contains all of the information about the query that you'll need for templating and any other usage of the data:

```tsx
const result = useQuery<Student[], Error>('fetchStudents', fetchStudents);
```

The result object contains a few very important states you'll need to be aware of to be productive. A query can only be in one of the following states at any given moment:

- `isLoading` or `status === 'loading'` - The query has no data and is currently fetching
  
- `isError` or `status === 'error'` - The query encountered an error
  
- `isSuccess` or `status === 'success'` - The query was successful and data is available
  
- `isIdle` or `status === 'idle'` - The query is currently disabled (you'll learn more about this in a bit)
  

Beyond those primary states, more information is available depending on the state of the query:

- `error` - If the query is in an isError state, the error is available via the error property.
  
- `data` - If the query is in a success state, the data is available via the data property.
  
- `isFetching` - In any state, if the query is fetching at any time (including background refetching) isFetching will be true.
  
- `refetch`: the function to manually refetch the query.
  

For most queries, it's usually sufficient to check for the isLoading state, then the isError state, then finally, assume that the data is available and render the successful state:

```tsx
import axios from 'axios'
import { useQuery } from 'react-query'

type Student = {
 id: number,
 name: string
}

const fetchStudents = async () => {
 const response = await axios.get<Student[]>('http://localhost:4000/students');
 return response.data;
}

function App() {
 const { isLoading, isError, data, error, refetch } = useQuery<Student[], Error>('fetchStudents', fetchStudents);
 if (isLoading) {
   return <span>Loading...</span>
 }

 if (isError) {
   return <span>Error: {error.message}</span>
 }

 return (
   <ul>
     {data?.map(student => (
       <li key={student.id}> Id: {student.id} & Name: {student.name}</li>
     ))}
   </ul>
 )
}
export default App
```

If your query function depends on a variable, include it in your query key

```tsx
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState } from 'react'
type Student = {
 id: number,
 name: string
}

const fetchStudent = async (studentId: number) => {
 const response = await axios.get<Student>(`http://localhost:4000/students?${studentId}`);
 return response.data;
}

function App() {
 const[studentId, setStudentId] = useState(1);
 const { isLoading, isError, data, error, refetch } = useQuery<Student, Error>(['fetchStudent', studentId], () => fetchStudent(studentId));
 if (isLoading) {
   return <span>Loading...</span>
 }
 if (isError) {
   return <span>Error: {error.message}</span>
 }

 return (
   <ul>
     {data  && <li key={data.id}> Id: {data.id} & Name: {data.name}</li>}
   </ul>
 )
}

export default App
```

### Parallel Queries

"Parallel" queries are queries that are executed in parallel, or at the same time so as to maximize fetching concurrency.

Just use any number of React Query's useQuery hooks side-by-side!

```tsx
function App () {

 // The following queries will execute in parallel
 const usersQuery = useQuery<Student[], Error>('students', fetchStudents)
 const teamsQuery = useQuery<Team[], Error>('teams', fetchTeams)
 const projectsQuery = useQuery<Project[], Error>('projects', fetchProjects)

 ...

}
```

### Dependent queries

Dependent (or serial) queries depend on previous ones to finish before they can execute. To achieve this, it's as easy as using the enabled option to tell a query when it is ready to run:

```tsx
// Get the user

const { data: user } = useQuery(['user', email], getUserByEmail)
const userId = user?.id
// Then get the user's projects
const { isIdle, data: projects } = useQuery(
 ['projects', userId],
 getProjectsByUser,
 {
   // The query will not execute until the userId exists
   enabled: !!userId,
 }
)
```

### Query retries

When a useQuery query fails (the query function throws an error), React Query will automatically retry the query if that query's request has not reached the max number of consecutive retries (defaults to 3) or a function is provided to determine if a retry is allowed.

You can configure retries both on a global level and an individual query level.

- Setting retry = false will disable retries.
  
- Setting retry = 6 will retry failing requests 6 times before showing the final error thrown by the function.
  
- Setting retry = true will infinitely retry failing requests.
  

```tsx
const { isLoading, isError, data, error, refetch } = useQuery<Student[], Error>('fetchStudents', fetchStudents, {
   retry: 5, // Will retry failed requests 5 times before displaying an error
 });
```

### Creating, Updating and Deleting Data using React-Query

Unlike useQuery, useMutation is typically used to create/update/delete data or perform server side-effects. For this purpose, React Query exports a useMutation hook.

```tsx
import { useMutation } from "react-query"

function AddStudent() {
   const mutation = useMutation<any, Error>(() => {
       return axios.post<Student>("http://localhost:4000/students", { id: new Date(), name: name }) 
})
```

A mutation can only be in one of the following states at any given moment:

- `isIdle` or `status === 'idle'` - The mutation is currently idle or in a fresh/reset state
  
- `isLoading` or `status === 'loading'` - The mutation is currently running
  
- `isError` or `status === 'error'` - The mutation encountered an error
  
- `isSuccess` or `status === 'success'` - The mutation was successful and mutation data is available
  

Beyond those primary states, more information is available depending on the state of the mutation:

- `error` - If the mutation is in an error state, the error is available via the error property.
  
- `data` - If the mutation is in a success state, the data is available via the data property.
  

We can destructure useMutation like below:

```tsx
const { isLoading, isSuccess, isError, error, mutate } = useMutation<any, Error>(() => { 
return axios.post<Student>("http://localhost:4000/students", { id: new Date(), name: name })
})
```

If your component have multiple mutations or multiple queries we can give alias for destructured variables:

```tsx
const { isLoading: addStudentLoading, isSuccess: addStudentSuccess, isError: addStudentError,error: addStudentErrorData, mutate: addStudent } = useMutation<any, Error>(() => { 
 return axios.post<Student>("http://localhost:4000/students", { id: new Date(), name: name })
})
```

##### Creating Student:

```tsx
import { useMutation } from "react-query"
import axios from 'axios'
import { useState } from 'react'
import { Student } from "./App";
import { useQueryClient } from "react-query";
function AddStudent() {
   const queryClient = useQueryClient();
   const [name, setName] = useState("");
   const mutation = useMutation<any, Error>(() => {
       return axios.post<Student>("http://localhost:4000/students", { id: new Date(), name: name })
   })
    return (
     <div>
       {mutation.isLoading ? (
         'Adding Student...'
       ) : (
         <>
           {mutation.isError ? (
             <div>An error occurred: {mutation.error.message}</div>
           ) : null}
            {mutation.isSuccess ? <div>Student added!</div> : null}
           <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
           <button
             onClick={() => {
              mutation.mutate()
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
```

##### Updating Student:

```tsx
import { useMutation } from "react-query"
import axios from 'axios'
import { useState } from 'react'
import { Student } from "./App";
function updateStudent() {
   const studentId: number = 4;
   const [name, setName] = useState("");
   const { isLoading, isSuccess, isError,
       error, mutate} = useMutation<any, Error>(() => {
       return axios.put<Student>(`http://localhost:4000/students/${studentId}`, { name: name })
   })

    return (
     <div>
       {isLoading ? (
         'Update Student...'
       ) : (
         <>
           {isError ? (
             <div>An error occurred: {error?.message}</div>
           ) : null}
            {isSuccess ? <div>Student updated!</div> : null}
           <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
           <button
             onClick={() => {
               mutate()
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
```

##### Deleting Student:

```tsx
import { useMutation } from "react-query"
import axios from 'axios'
import { Student } from "./App";
function DeleteStudent() {
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

```

### Query Invalidation from Mutation

Usually when a mutation in your app succeeds, it's VERY likely that there are related queries in your application that need to be invalidated and possibly refetched to account for the new changes from your mutation.

For example, assume we have a mutation to post a new student:

```tsx
const mutation = useMutation<any, Error>(() => { return axios.post<Student>("http://localhost:4000/students", { id: new Date(), name: name })
```

When a successful postStudent mutation happens, we likely want all student queries to get invalidated and possibly refetched to show the new student item. To do this, you can use useMutation's onSuccess options and the client's invalidateQueries function:

```tsx
import { useQueryClient } from "react-query";

const queryClient = useQueryClient();
const mutation = useMutation<any, Error>(() => {
       return axios.post<Student>("http://localhost:4000/students", { id: new Date(), name: name })
   }, {
       onSuccess: () => queryClient.invalidateQueries("fetchStudents"),
       //onError: () => //show toast message
   })

### 
```

### QueryClient Global Configuration

The queryClient Configuration provides us with the ability to tweak and override the default behaviour of react-query library. It enables us to create our custom defaults for both queries and mutations across our application.

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient({

 defaultOptions: {
   queries: {
     retry: 2,
     staleTime: 1000 * 30,// 30seconds
     cacheTime: 1000 * 30, //30 seconds
     refetchOnMount: "always",
     refetchOnWindowFocus: "always",
     refetchOnReconnect: "always",
     refetchInterval: 1000 * 30, //30 seconds
     refetchIntervalInBackground: false,
   },
   mutations: {
     retry: 2,
   },
 }});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
 <React.StrictMode>
   <QueryClientProvider client={queryClient}>
     <App />
   </QueryClientProvider>
 </React.StrictMode>,

)
```

This global configuration can also be overridden for each query or mutation instance in our application if needed. 

To override default configuration, you need to pass a custom QueryClientConfig object to the QueryClient constructor while creating the QueryClient object. Refer above code snippet to define custom configuration. Nested in the QueryClientConfig object, is the defaultOptions object, which in turn has two objects; queries and mutations nested in it.

**queries**:

The queries object lets us configure react-query behaviour for our queries. According to the [documentation](https://react-query.tanstack.com/reference/useQuery), queries can be passed in more configuration options but I chose this bit to keep things simple and flexible.

**retry**:

- Defaults to `false`
  
- If `false`, failed queries will not retry
  
- If `true`, failed queries will retry infinitely.
  
- If set to a `number`, e.g. 3, failed queries will retry until the failed query count meets that number.
  

**staleTime**:

- Defaults to `0`
  
- The time in milliseconds after data is considered stale. This value only applies to the hook it is defined on.
  
- If set to `Infinity`, the data will never be considered stale
  

**cacheTime**:

- Defaults to` 5 * 60 * 1000 (5 minutes)`
  
- The time in milliseconds that unused/inactive cache data remains in memory. When a query's cache becomes unused or inactive, that cache data will be garbage collected after this duration. When different cache times are specified, the longest one will be used.
  
- If set to `Infinity`, will disable garbage collection
  

**refetchOnMount**:

When a component mounts and a query is run for the first time, the returned data from this successful query is cached. Sometimes, we may not want this same query to run again if the component remounts and the returned data from the previous call is still exists and fresh in the cache; this is the control refetchOnMount gives us.

- Defaults to `true`
  
- If set to `true`, the query will refetch on mount if the data is stale.
  
- If set to `false`, the query will not refetch on mount.
  
- If set to `always`, the query will always refetch on mount.
  

**refetchOnWindowFocus**:

This option is similar to refetchOnMount but for window focus.

We may wish to show our users fresh data whenever they switch their focus back to the browser tab where our application is being used; refetchOnWindowFocus helps with this.

- Defaults to `true`
  
- If set to `true`, the query will refetch on window focus if the data is stale.
  
- If set to `false`, the query will not refetch on window focus.
  
- If set to `always`, the query will always refetch on window focus.
  

**refetchOnReconnect**:

While using our application, users may lose internet connection. During this period, long or short as it may be, remote data may have changed.

refetchOnReconnect gives us the control to determine whether we want our application to refetch queries once our users regain internet connection.

- Defaults to `true`
  
- If set to `true`, the query will refetch on reconnect if the data is stale.
  
- If set to `false`, the query will not refetch on reconnect.
  
- If set to `always`, the query will always refetch on reconnect.
  

**refetchOnInterval**:

We may want our application refetching queries at certain interval in time regardless of whether data is stale or not. This is very useful for rapidly changing remote data or for near real-time behavior for our application.

- Defaults to `false`
  
- If set to `false`, the query will not refetch on Interval.
  
- If set to a `number`, all queries will continuously refetch at this frequency in milliseconds. For example, 5000 as a value of refetchInterval means queries will be refetched every 5 seconds.
  

**refetchOnBackgroundInterval**:

Would you like to explicitly control the refetchInterval behavior for when users are not focused on our application ?refetchIntervalInBackground lets us do this.

- If set to `true`, queries that are set to continuously refetch with a refetchInterval will continue to refetch while their tab/window is in the background
  
- If set to `false`, queries will not refetch at interval when our application is not in focus.
  

**mutations**:

The mutations object lets us configure react-query behavior for our mutations. Mutations are for create/update/delete actions to our server. For any action that seeks to mutate our remote data, mutations should be used. Let's discuss the only item in the mutations object: retry.

retry:

- Defaults to `false`
  
- If `false`, failed queries will not retry
  
- If `true`, failed queries will retry infinitely.
  
- If set to a number, e.g. 3, failed queries will retry until the failed query count meets that number.
  

### React Query DevTools

When you begin your React Query journey, you'll want these devtools by your side. They help visualize all of the inner workings of React Query and will likely save you hours of debugging.

The devtools are bundle split into the react-query/devtools package. No need to install anything extra.

**Enabling React Query Devtools:**

Import the DevTools from ‘react-query/devtools’

```tsx
import { ReactQueryDevtools } from 'react-query/devtools'
```

Once import done, we should place it inside the QueryClientProvider block like so:

```tsx
   <QueryClientProvider client={queryClient}>
     <App />
     <ReactQueryDevtools position='bottom-right' />
   </QueryClientProvider>
```

By using “position” prop we can place React query logo in any corner (like top-left, top-right, bottom-left and bottom-right).

**Using React query Devtools:**

Once you start up your application with the DevTools setup, you can quickly keep track of all the fired queries.

By clicking on one of them, you get to see a lot of information for this query.

- Query key
  
- Current status
  
- Last updated
  
- Data inside the cache
  

And you can quickly choose any of the following actions:

- Refetch
  
- Invalidate
  
- Reset
  
- Remove
  

![](https://lh5.googleusercontent.com/kuBxOYm2uDSK8LzKmT5jw_rIH2O4zXQb6LxzEcnGPlz9ZWhg3jqLT0pMf1pq5IFP4CBA1SoywH8q0EVeXvzabsnDilnjSWyaqD8bqX_jAUQCEO1rApKyx5YMyr49wd2gJshpAaAlnB4y3X3wdSEQ-epfuHOEG5JjSuD1pGAS5kd8G-f6359KiOyYV-lIzw)

Note: By default, React Query Devtools are only included in bundles when process.env.NODE_ENV === 'development', so you don't need to worry about excluding them during a production build.

### Conclusion

React Query is a great hook library for managing data requests that completely removes the need to put your remote data inside the global state. You just need to tell the library where you need to fetch your data, and it will handle caching, background updates, and stale data without any extra code or configuration.

React Query also removes the need for useState and useEffect hooks and replace them with a few lines of React Query logic. In the long run, it will definitely help you keep your application maintainable, responsive, and fast.

If you’re interested to learn more, don’t forget to check out the [React Query documentation](https://react-query.tanstack.com/docs/overview).

**