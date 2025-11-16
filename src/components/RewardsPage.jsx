import React, { useEffect, useState } from 'react';
export default function RewardsPage({ user }) {
  const [me, setMe] = useState(user);
  useEffect(()=> {
    if (!user) return;
    fetch('/api/me', { headers: { Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('ff_user'))?.token||'') }})
      .then(r=>r.json()).then(setMe).catch(()=>{});
  }, [user]);
  return (
    <div className='page'>
      <h1>⭐ Rewards</h1>
      {me ? <div><p>Name: {me.name||me.email}</p><p>Points: {me.points}</p></div> : <p>Please sign in to see rewards.</p>}
    </div>
  );
}
