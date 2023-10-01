import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import Login from './components/loginPage';
import Register from './components/registerPage.js'
import Home from './components/homePage'
import Intro from './components/Intro'

const Router =()=>{
    const router =createBrowserRouter([
        {
            path:'/',
            element: <Intro/>,
        },
        {
            path:'/login',
            element: <Login/>
        },
        {
            path:'/register',
            element: <Register/>

        },
        {
            path:'/home',
            element: <Home/>
        }
    ])
    return <RouterProvider router={router}/>
};
export default Router;