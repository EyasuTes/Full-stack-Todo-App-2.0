import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import register from './registerPage.module.css'
const API_BASE= 'https://mern-taskapp-backend3.onrender.com'
const Register =()=>{
    const [email, setEmail]=useState('')
    const [name, setName]=useState('')
    const [password, setPassword]=useState('')
    const [password2, setPassword2]=useState('')
    const [error , setError]=useState([])
    let navigate = useNavigate();
    async function handleSubmit(e){
        e.preventDefault();
        const errors=[]
        if(!name || !email || !password ||!password2){
            errors.push("fill all the info")
        }
        if(password !== password2){
            errors.push("passwords do not match")
        }
        if(errors.length===0){
            const data =await fetch(API_BASE+'/register',{
            method:'POST',
            headers:{
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name:name,
                email:email,
                password:password,
            })
            }).then(res=>res.json())
            console.log(data)
            if(data.email){
                navigate('/login');
            }
            else{
                errors.push(data.map((error) => error.msg));
            }
            
        }
        setError(errors);

        
    }
    function gologin(){
        navigate('/login')
    }
    return(
        <>
        
        <div  className={register.formContainer}>
            {error.length > 0 && (
                <div className={register.error}>
                    <div>
                        {error.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))}
                    </div>
                </div>
            )}
            <div>
                <label htmlFor="name"></label>
                <input 
                type="text"
                name="name" 
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e)=>{setName(e.target.value)}}
                required
                className={register.name}
                ></input>
            </div>
            <div>
                <label htmlFor="email"></label>
                <input 
                type="email" 
                name="email" 
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                required
                className={register.email}
                ></input>
            </div>
            <div>
                <label htmlFor="password"></label>
                <input 
                type="text" 
                name="password" 
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                required
                className={register.password}
                ></input>
            </div>
            <div>
                <label htmlFor="password2"></label>
                <input 
                type="text" 
                placeholder="Confirm Password"
                name="password2" 
                id="password2"
                value={password2}
                onChange={(e)=>{setPassword2(e.target.value)}}
                required
                className={register.password2}
                ></input>
            </div>
            
            <button onClick={handleSubmit} className={register.registerButton} type="submit">Sign Up</button>
            <div onClick={gologin}className={register.login}>Log-in</div>
        </div>
        
        </>
    )
}

export default Register;