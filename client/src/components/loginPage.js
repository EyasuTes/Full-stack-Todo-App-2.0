import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from './loginPage.module.css'
const API_BASE= 'http://localhost:3001'
const Login =()=>{
    const [email , setEmail]= useState('');
    const [password, setPassword]=useState('');
    const [error , setError]=useState([])
    let navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if (token) {
        
        navigate('/home');
        return;
      }
    },[])
    async function checkUser(){
        // const error =[]
        const data =await fetch(API_BASE+'/login',{
            method:'POST',
            headers:{
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              email:email,
              password:password,
            })
            }).then(res=>res.json())
            
            if (data && data.length > 0) {
                setError(data.map((error) => error.msg));
                
            } else if (data.user) {
                // If the login is successful and you receive a token
                // Store the token in local storage
                localStorage.setItem('token', data.user);
        
                // You can also navigate to another page here if needed
                // For example:
                // navigate('/dashboard');
                navigate('/home');
            }
          
        
          
    }
    function goRegister(){
        navigate('/register')
    }
    return(
        <>
        
        <div className={login.formContainer}>
        {error.length > 0 && (
            <div className={login.error}>
                <div>
                    {error.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            </div>
        )}
            <div>
                <label htmlFor="email"></label>
                <input 
                className={login.inputEmail}
                type="email" 
                name="email" 
                id="email"
                placeholder='Email'
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                ></input>


            </div>
            <div>
                <label htmlFor="password" ></label>
                <input 
                className={login.inputPassword}
                type='text' 
                name="password" 
                id="password"
                placeholder='Password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}></input>
            </div>
            <button className={login.loginButton} onClick={checkUser}>Login</button>
            <div onClick={goRegister}className={login.signUp}>Sign-Up</div>
        </div>
        
        </>
    )
}

export default Login;