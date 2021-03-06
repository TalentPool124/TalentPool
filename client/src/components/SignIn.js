import React,{useState} from 'react'
import {useHistory} from 'react-router-dom'
import Navbar from './navbar' 
import GoogleLogin from 'react-google-login'
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
toast.configure()
export default function SignIn() {
    const history = useHistory();
    const [user,setUser] = useState({email:'',password:''});
    let name,value;
    const handleChange = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUser({...user,[name]:value});
    }
    const RegisterUser = async (res) => {
        const fname = res.givenName;
        const lname = res.familyName;
        const email = res.email;
        //console.log("password is",process.env.RANDOM_PASSWORD);
        const password = "11";    
        const cpassword = "11";
        const res1 = await fetch('/register',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                fname:fname,lname:lname,status:"Active",email:email,password:password,cpassword:cpassword
            })
        });
        const data = await res1.json();
        console.log(data);
        if(!data)
        {
            let err='Registration unsuccessful';
            
            console.log('Registration unsuccessful');
        } 
        else{
            //window.alert('Registration successful');
            console.log('Registration successful');


            const res2 = await fetch('/login',{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    email,password
                })
            });
            
            const data1 = await res2.json();
            console.log(data1);
            if(!data1)
            {
                let err='Login unsuccessful';
                
                toast.error(err,{position:toast.POSITION.TOP_CENTER});
                console.log('Login unsuccessful');
            } 
            else{
                toast.success("Login successful",{position:toast.POSITION.TOP_CENTER});
                console.log('Login successful');
                history.push('/profile');
            }

            
        }
    }

    const PostData = async (e) => {
        e.preventDefault();
        const {email,password} = user;
        const res = await fetch('/login',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,password
            })
        });
        const data = await res.json();
        console.log(data);
        if(!data||(data.status === 400&&data.error!=="Please confirm your email first"))
        {
            let err='Login unsuccessful';
            if(data)
            {
                err=data.error;
            }
            toast.error(err,{position:toast.POSITION.TOP_CENTER});
            console.log('Login unsuccessful');
        } 
        else if(data.status===400&&data.error==="Please confirm your email first")
        {
            toast.warn(data.error,{position:toast.POSITION.TOP_CENTER});
        }
        else{
            toast.success('Login successful',{position:toast.POSITION.TOP_CENTER});
            console.log('Login successful');
            history.push('/profile');
        }
    }
    
    return (
        <div>
            <Navbar/>

            <div className="container my-5">
                <div className="row">
                <div className="col-lg-4 col-md-6 col-10 mx-auto">
                    <h2 className="text-center mb-5">User Login Form</h2>
                    <form onSubmit={PostData} method="POST">
                    <div className="form-group">
                        <label>Email address:</label>
                        <input required type="email" onChange={handleChange} className="form-control" placeholder="Enter email" id="email" name="email"/>
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input required type="password" onChange={handleChange} className="form-control" placeholder="Enter password" id="pwd" name="password"/>
                    </div>
                    <button type="submit" className="btn btn-block btn-primary">Sign in</button>
                    <br/>
                    <GoogleLogin
                    clientId="827588330883-phk83ulan2r8rnnneu8nsmvi38f9oa20.apps.googleusercontent.com"
                    buttonText="Login via Google"
                    onSuccess={(res)=>{
                        console.log(res);
                        console.log(res.profileObj);
                        RegisterUser(res.profileObj);
                    }}
                    onFailure={(res)=>{
                        console.log(res);
                        console.log(res.profileObj);
                    }}
                    className='btn btn-block btn-primary'
                    cookiePolicy={'single_host_origin'}
                    />
                    <div className="py-2">
                        <p><a className="a-primary" href="signup">Create an account</a></p>
                        <p><a className="a-primary" href="/">Need help?</a></p>
                    </div>
                    </form>
                </div>
                </div>
            </div>


        </div>
    )
}
