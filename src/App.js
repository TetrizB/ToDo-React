import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { CONFIG_FILES } from 'next/dist/shared/lib/constants';

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  //Loadn todos on page Load
  useEffect(()=>{
    const loadData = async()=>{

      setLoading(true)
      //Await vai funcionar aqui pq a funcao pe assincrona (async)
      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data)=>data)
      .catch((err)=> console.log(err));
      //caso algo de errado, vai haver um alerta no console

      setLoading(false);
      
      setTodos(res);

    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   const todo ={
    id: Math.random(),
    title,
    time,
    done:false
   };
  
   await fetch(API +"/todos",{
    method: "POST",
    body: JSON.stringify(todo),
    headers:{
      "Content-Type":"application/json",
    },
   });

   setTodos((prevState)=>[...prevState, todo]);

    setTitle("");
    setTime("");
  };

  if(loading){
    return(
      <p> Loading...</p>
    ) 
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React Todo</h1>
      </div>
      <div className="form-todo">
        <h2>Insira Sua Proxima Tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>O que voce vai decidir fazer</label>
            <input
              type="text"
              name="title"
              placeholder='Titulo da Tarefa'
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              // Voce pode comecar com o valor vazio e dpois muda que nao vai ter problema
              required
            />
          </div>
          <div className='form-control'>
            <label htmlFor='time'>Tempo de Tarefa:</label>
            <input
              type="number"
              name="time"
              placeholder='Tempo Estimado (Em horas)'
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              // Voce pode comecar com o valor vazio e dpois muda que nao vai ter problema
              required
            />
          </div>
          <input type='submit' value='Criar Tarefa'/>
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista De Tarefas:</h2>
        {todos.length === 0 && <p>Não Há Tarefas!</p>}
        {todos.map((todo)=>(
          <div className='todo' key={todo.id}> 
            <h3 className={todo.done ? "todo-done" : ""}> {todo.title}  </h3>
            <p>Duracão: {todo.time}</p>
            <div className='actions'>
              <span>
                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>
              <BsTrash/>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

export default App;
