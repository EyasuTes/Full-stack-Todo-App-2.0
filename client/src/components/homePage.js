//try using the expand form usestate
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import home from './homePage.module.css'
import moment from 'moment'
import {CaretDown, List} from 'phosphor-react';
const API_BASE= 'http://localhost:3001'
const Home =()=>{
    
    const [popup, setPopup] =useState(false)
    const [user, setUser] =useState()
    const [todo , setTodo]=useState('')
    const [dueDate, setDueDate]=useState('')
    const [showtoolbar, setShowtoolbar]=useState(false)
    const [Alltodo, setAlltodo]=useState([])
    const [todaytodo, setTodaytodo]=useState([])
    const [weektodo, setWeektodo]=useState([])
    const [selection, setSelection]=useState([])
    let navigate = useNavigate();
 
    useEffect( ()=>{
      const token = localStorage.getItem('token');
      if (!token) {
        
        navigate('/login');
        return;
      }
        fetch(API_BASE +"/users",{
          method: 'POST',
            headers: {
                'Content-type': 'application/json',
                
                Authorization: `Bearer ${token}`,
            },
          
            body: JSON.stringify({
                
            }),
        }).then((res) => res.json())
          .then((responseData) => {
            
            if(!responseData){
              logout()
            }
            
            setUser(responseData);
            
            organize(responseData.todos)
            
            setSelection({ Todos: responseData.todos, label: 'All Tasks' })
          })
          
         
    
    },[navigate])
    

    function handleAdd(){
      const id =user._id;
      fetch(API_BASE+'/createtodo/user/'+id,{
        method:'POST',
        headers:{
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          text: todo,
          completeDate: dueDate,

          
        }),
      }).then((res)=>res.json())
      .then((data)=>{
        console.log(data)
        setUser(data)
        organize(data.todos)
        setSelection({ Todos: data.todos, label: 'All Tasks' })
      })
      setPopup(false)
    }
    function logout(){
      localStorage.removeItem('token');

        // Navigate to the login page
        navigate('/login');
    }
    async function handleDelete( id){
      
      const data= await fetch(API_BASE+'/deletetodo/'+id,{
        method:"DELETE"
      }).then(res=>res.json());
      setUser(user => ({
        ...user,
        todos: user.todos.filter(todo => todo._id !== id)
        
      }));
     
      organize(user.todos)
      const todoIndexToDelete = selection.Todos.findIndex(todo => todo._id === id);
      console.log(todoIndexToDelete)
      if (todoIndexToDelete !== -1) {
        
        // Create a new array that excludes the todo with the specific ID
        const updatedTodos = [...selection.Todos.slice(0, todoIndexToDelete), ...selection.Todos.slice(todoIndexToDelete + 1)];
    
        // Update the state with the new array
        setSelection({ ...selection, Todos: updatedTodos });
      }
      const todoIndexToDelete2= Alltodo.findIndex(todo=> todo._id ===id)
      if(todoIndexToDelete2!==-1){
        const updatedTodos2 =[...Alltodo.slice(0,todoIndexToDelete2), ...Alltodo.slice(todoIndexToDelete2+1)]
        setAlltodo(updatedTodos2)
      }
      const todoIndexToDelete3= todaytodo.findIndex(todo=> todo._id ===id)
      if(todoIndexToDelete3!==-1){
        const updatedTodos3 =[...todaytodo.slice(0,todoIndexToDelete3), ...todaytodo.slice(todoIndexToDelete3+1)]
        setTodaytodo(updatedTodos3)
      }
      const todoIndexToDelete4= weektodo.findIndex(todo=> todo._id ===id)
      if(todoIndexToDelete4!==-1){
        const updatedTodos4 =[...weektodo.slice(0,todoIndexToDelete4), ...weektodo.slice(todoIndexToDelete4+1)]
        setWeektodo(updatedTodos4)
      }
      
    }
    async function handleComplete(id){
      const data =await fetch(API_BASE+"/editTodo/"+id,{
        method:'PUT'
      }).then(res=>res.json());
      setUser(user=> ({...user, todo: user.todos.map(todo=>{
        if(todo._id===data._id){
          todo.complete=data.complete
        }
        return todo;
      })}))
      organize(user.todos)
    }
    async function expand(id){
      const data =await fetch(API_BASE+'/expand/'+id,{
        method:'PUT'
      }).then(res=>res.json());
      setUser(user=>({...user, todo: user.todos.map(todo=>{
        if(todo._id===data._id){
          todo.expand= data.expand
        }
        return todo;
      })}))
      
      organize(user.todos)
      
    }
    function organize(todos){
      setAlltodo(todos);
      
      const currentDate = new Date();
      currentDate.setUTCHours(0, 0, 0, 0); // Set the time to the start of the day in UTC
    
      const oneWeekFromToday = new Date(currentDate);
      oneWeekFromToday.setDate(currentDate.getDate() + 7); // Set the date one week from today
    
      const todayTodos = [];
      const weekTodos = [];
      console.log(todos);
      todos.forEach((todo) => {
        const dueDate = new Date(todo.completeDate);
    
        if (!isNaN(dueDate)) {
          // Check if dueDate is a valid date
          dueDate.setUTCHours(0, 0, 0, 0); // Set the time portion to 0 for comparison
    
          if (dueDate.getTime() === currentDate.getTime()) {
            todayTodos.push(todo); // Todo due today
          } else if (dueDate >= currentDate && dueDate < oneWeekFromToday) {
            weekTodos.push(todo); // Todo due this week
          }
        }
      });
    
      console.log('Today Todos:', todayTodos); // Log todayTodos for debugging
      console.log('Week Todos:', weekTodos); // Log weekTodos for debugging
    
      setTodaytodo(todayTodos);
      setWeektodo(weekTodos);
    }
    
    return(
        <div className={home.container}>
        
          
          
            
            {user && (
          <div>
            <div className={home.header}>
              <h1 className={home.h1}>Welcome, {user.name}</h1>
              <button className={home.logout} onClick={logout}>logout</button>
            </div>
            </div>
            )}
            <div className={home.mainContainer}>

            
            <div className={home.toolbar}>
              <div onClick={()=>setShowtoolbar(!showtoolbar)} className={home.toolbarButton}><List size={32} /></div>
                {showtoolbar? 
                  <div className={home.toolbarOptions}> 
                  <div onClick={()=>{setSelection({ Todos: Alltodo, label: 'All Tasks' })}} className={home.toolbarOption}>All Tasks</div>
                  <div onClick={()=>{setSelection({ Todos: todaytodo, label: 'Today Tasks' })}} className={home.toolbarOption}>Today Tasks</div>
                  <div onClick={()=>{setSelection({ Todos: weektodo, label: 'This Week Tasks' })}} className={home.toolbarOption}>This Week Tasks</div>
                </div>
                :""
                }
                
                

            </div>
          <div className={home.todoList}>
          <h1 className={home.todoTitle}>{selection.label}</h1>
          {user && selection.Todos.map(todo=>(
              
              <div className={`${home.todo } ${todo.complete? home.iscomplete:'' }`} key={todo._id}>
                
                <div className={home.basicDetail}>
                  <div onClick={()=>expand(todo._id)} className={home.dropdown}><CaretDown size={18} /></div>
                
                <div onClick={()=>handleComplete(todo._id)}className={home.checkbox}></div>
                
                <div className={home.text}>{todo.text}</div>
                <div className={home.delete} onClick={()=>handleDelete(todo._id)}>x</div>
                </div>
                <div>
                {todo.expand?  
                <div className={home.dateContainer}>
                  <div className={home.date}>
                    Date Created: { moment(todo.createDate).format('DD-MM-YYYY HH:mm')}
                  </div> 
                  <div className={home.date}>
                    Due Date: { moment(todo.completeDate).format('DD-MM-YYYY HH:mm')}
                  </div>
                </div>
                
                : ''}
                </div>
                
                
              </div>
            
          ))}


        </div>
        </div>
          
            
        <div className={home.plusButton}onClick={()=>{setPopup(true)}}>+</div>
        {popup? 
          <div className={home.popup} >
            <div className={home.closePopup} onClick={()=>{setPopup(false)}}>x</div>
            <h3 className={home.h3}>ADD TASK</h3>
            <input 
            className={home.popupInput}
            type='text' 
            name='todo' 
            id='todo' 
            value={todo}
            onChange={(e)=>{setTodo(e.target.value)}}

            ></input>
            <br></br>
            <div className={home.dateInputContainer}>
              <div>Due Date:</div>
              <input 
              className={home.popupInput} 
              type="datetime-local" 
              id="date" 
              name="date"
              value={dueDate}
              onChange={(e)=> setDueDate(e.target.value)}
              ></input> 
            </div>
            
            <br></br>
            <button className={home.popupButton} onClick={handleAdd}>Create Task</button>
          </div>
          

        :""}
          
        
        
        </div>
    )
}

export default Home;