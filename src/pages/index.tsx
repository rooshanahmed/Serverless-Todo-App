import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"


const GET_TODOS = gql`
{
  todos {
    id,
    task,
  }
}
`

const ADD_TODO = gql`
  mutation addTodo($task: String!){
    addTodo(task: $task){
      task
    }
  }
`


export default function Home() {
  let inputText;

  const [ addTodo ] = useMutation(ADD_TODO);

  const addTask = () => {
    addTodo({
      variables: {
        task: inputText.value
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
    inputText.value = ""
  }
  const { error, data } = useQuery(GET_TODOS);

  if(error){
    return <h2>Error!</h2>
  }
  if(!data){
    return <h2>Loading..!!</h2>
  }
  return (
    <div>
      <h1>Todo List</h1>
      <label>
        <h3>Add Task</h3>
        <input type="text" ref={node => (
          inputText = node
        )} />
      </label>
      <button onClick={addTask}>Add Task</button>
      <br /><br />
      {JSON.stringify(data)}
    </div>
  )
}
