'use client';
import React, {useState} from 'react'
import {z} from "zod";
import { loginSchema } from '@/utils/loginSchema';
import { handleLogin } from '@/actions/login';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const [buttonText,setButtonText] = useState<string>('Login')
  const [loginData, setLoginData] = useState<z.infer<typeof loginSchema>>({
    id: '',
    password: '',
    adminCode: ''
  })

  const [errors, setErrors] = useState<z.infer<typeof loginSchema>>({
    id: '',
    password: '',
    adminCode: ''
  })

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>,field:string) => {
    setLoginData({
      ...loginData,
      [field]:e.target.value
    })
  }

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    setErrors({id:'',password:'',adminCode:''})
    setButtonText("Submitting..")
    const res = loginSchema.safeParse(loginData)
    if(!res.success){
      setButtonText("Login");
      console.log(res.error.errors)
      res.error.errors.map(error=>{
        setErrors(prev => ({
          ...prev,
          [error.path[0]]: error.message
        }))
      })
      return;
    }
    handleLogin(loginData).then(res=>{
      if(res?.success){
        setButtonText("Redirecting..");
        router.push('/Bidder');
      }else{
        setButtonText("Login");
        res?.errors?.map(error=>setErrors(prev=>({...prev, [error.path[0]]:`Invalid ${error.path[0]}` })))
        if(res?.error) setErrors(prev=>({...prev, "password": "Invalid Credentials" }))
        return;
      }
    }).finally(()=>setButtonText("Login"));
  }

  return (
    <form className='flex flex-col gap-y-6 mt-6' onSubmit={handleSubmit}>
      <div className='flex flex-col'>
        <input type="text" placeholder='UserId' className='bg-transparent text-accent placeholder:text-sm font-opensans border-b-accent border-b px-2 outline-none' value={loginData.id} onChange={e=>handleChange(e,"id")}/>
        <p className='text-red-500 text-sm'>{errors.id??''}</p>
      </div>
      <div className='flex flex-col'>
        <input type="password" placeholder='Password' className='bg-transparent text-accent placeholder:text-sm font-opensans border-b-accent border-b px-2 outline-none text-lg' value={loginData.password} onChange={e=>handleChange(e,"password")}/>
        <p className='text-red-500 text-sm'>{errors.password ?? ''}</p>
      </div>
        <button type="submit" className='bg-primary text-background font-opensans px-3 py-1 my-4 rounded-sm w-1/2 self-center'>{buttonText}</button>
    </form>
  )
}

export default LoginForm