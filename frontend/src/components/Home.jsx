import React from 'react';
export default function Home({ setPage }) {
  return (
    <div className='home'>
      <header className='header'>
        <div>
          <h1 className='brand-title'>🔥 Fried & Furious</h1>
          <p style={{color:'#ccc'}}>Fast. Furious. Fully Loaded.</p>
        </div>
        <button className='primary-btn' onClick={()=>setPage('signin')}>Sign In / Create</button>
      </header>

      <div style={{marginTop:20}}>
        <div className='home-card' onClick={()=>setPage('menu')}>
          <h2>🍔 Full Menu</h2><p>See all wings, burgers & fries</p>
        </div>
        <div className='home-card' onClick={()=>setPage('offers')}>
          <h2>💸 Offers</h2><p>Exclusive app deals</p>
        </div>
        <div className='home-card' onClick={()=>setPage('rewards')}>
          <h2>⭐ Rewards</h2><p>Earn points for every order</p>
        </div>
        <div className='home-card' onClick={()=>setPage('basket')}>
          <h2>🛒 Basket</h2><p>View your order</p>
        </div>
      </div>
    </div>
  );
}
