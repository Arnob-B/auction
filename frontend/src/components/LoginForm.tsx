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
        res?.errors?.map(error=>setErrors(prev=>({...prev, [error.path[0]]:`Invalid ${error.path[0]}` })))
        if(res?.error) setErrors(prev=>({...prev, "password": "Invalid Credentials" }))
        return;
      }
    }).finally(()=>setButtonText("Submit"));
  }

  return (
    <form className='flex flex-col gap-y-5' onSubmit={handleSubmit}>
      <div className='flex flex-col'>
        <input type="text" placeholder='UserId' className='bg-transparent placeholder:text-black placeholder:text-sm border-b-black border-b px-2 outline-none' value={loginData.id} onChange={e=>handleChange(e,"id")}/>
        <p className='text-red-500 text-sm'>{errors.id??''}</p>
      </div>
      <div className='flex flex-col'>
        <input type="password" placeholder='Password' className='bg-transparent placeholder:text-black placeholder:text-sm border-b-black border-b px-2 outline-none' value={loginData.password} onChange={e=>handleChange(e,"password")}/>
        <p className='text-red-500 text-sm'>{errors.password ?? ''}</p>
      </div>
        {/* <div className='flex flex-col mt-2'>
        <label htmlFor="adminCode" className='text-[12px] font-semibold'>Only for admins</label>
        <input type="text" name='adminCode' placeholder='Admin Code' className='bg-transparent placeholder:text-sm placeholder:text-black border-b-black border-b px-2 outline-none' value={loginData.adminCode} onChange={e=>handleChange(e,"adminCode")} />
        <p className='text-red-500 text-sm'>{errors.adminCode??''}</p>
        </div> */}
        <button type="submit" className='bg-black text-white px-3 py-1 rounded-sm w-1/2 self-center'>{buttonText}</button>
    </form>
  )
}

export default LoginForm