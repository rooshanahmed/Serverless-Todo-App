import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"
import { Button, TextField } from "@material-ui/core"

const GET_TODOS = gql`
  {
    todos {
      id
      task
    }
  }
`

const ADD_TODO = gql`
  mutation addTodo($task: String!) {
    addTodo(task: $task) {
      task
    }
  }
`

export default function Home() {
  let [inputText, setInputText] = useState("");

  const [addTodo] = useMutation(ADD_TODO)

  const addTask = () => {
    addTodo({
      variables: {
        task: inputText
      },
      refetchQueries: [{ query: GET_TODOS }],
    })
  }
  const { error, data } = useQuery(GET_TODOS)

  if (error) {
    return <h2>Error!</h2>
  }
  if (!data) {
    return <h2>Loading..!!</h2>
  }
  return (
    <div>
      <h1>Todo List</h1>
      <TextField type="text" onChange={(e) => setInputText(e.target.value)} />
      <br />
      <Button onClick={addTask} variant="contained">
        Add Task
      </Button>
      <br />
      <br />
      {JSON.stringify(data)}
    </div>
  )
}
