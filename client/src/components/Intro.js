import { useNavigate } from 'react-router-dom';
import intro from './intro.module.css';
const Home =()=>{
    const navigate = useNavigate();
    return(
        <>
        <div className={intro.buttons}>
            <button className={intro.loginIntro} onClick={()=>navigate('/login')}>login</button>
            <button className={intro.registerIntro} onClick={()=>navigate('/register')}>Sign-up</button>
        </div>
       
        </>
    )
}

export default Home;