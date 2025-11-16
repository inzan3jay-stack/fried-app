import React, { useState } from 'react';
export default function SignInPage({ onSign }) {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('');
  const register = async () => {
    const res = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password,name})});
    const json = await res.json();
    if (json.token) onSign({ token: json.token, ...json.user }); else alert(json.error||'Error');
  };
  const login = async () => {
    const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})});
    const json = await res.json();
    if (json.token) onSign({ token: json.token, ...json.user }); else alert(json.error||'Error');
  };
  return (
    <div className='page'>
      <h1>👤 Sign In / Create</h1>
      <input className='input' placeholder='Name (for register)' value={name} onChange={e=>setName(e.target.value)} />
      <input className='input' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
      <input className='input' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      <button className='primary-btn' onClick={login}>Sign In</button>
      <button style={{marginTop:8}} className='primary-btn' onClick={register}>Create Account</button>
    </div>
  );
}
