import React, { useEffect, useState } from 'react';
export default function MenuPage({ onAdd }) {
  const [menu, setMenu] = useState([]);
  useEffect(()=> { fetch('/api/menu').then(r=>r.json()).then(setMenu).catch(console.error); }, []);
  return (
    <div className='page'>
      <h1>🍗 Menu</h1>
      <div className='menu-grid'>
        {menu.map(item=>(
          <div className='menu-card' key={item.id}>
            <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
            <h3>{item.name}</h3>
            <p style={{color:'#ccc'}}>{item.description}</p>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <strong>£{Number(item.price).toFixed(2)}</strong>
              <button className='primary-btn' onClick={()=> onAdd ? onAdd(item) : null}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
