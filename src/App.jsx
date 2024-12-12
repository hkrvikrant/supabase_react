import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabase-config";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getAllTodo();
  }, []);

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData])
      .single();

    if (error) {
      console.log("Error while adding new Todo", error);
    } else {
      setTodoList((pre) => [...pre, data]);
      setNewTodo("");
    }
  };

  const getAllTodo = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");
    if (error) {
      console.log("Error while fetching All Todo Lists", error);
    } else {
      setTodoList(data);
    }
  };

  const updateTodo = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("Error while updating Todo", error);
    } else {
      const udpatedTodo = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(udpatedTodo);
    }
  };

  const deleteTodo = async (id) => {
    const { data, error } = await supabase
      .from("TodoList")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Error while deleting Todo", error);
    } else {
      setTodoList((pre) => pre.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="Add New Todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={() => addTodo()}>Add Todo</button>
      </div>

      <div>
        <ul>
          {todoList.map((todo) => (
            <div key={todo?.id}>
              <li>{todo?.name}</li>
              <div>
                <button onClick={() => updateTodo(todo?.id, todo?.isCompleted)}>
                  {todo?.isCompleted ? "Completed" : "Incomplete"}
                </button>
                <button onClick={() => deleteTodo(todo?.id)}>Delete</button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
