import React, { useState, useEffect } from 'react';
import MenuPage from './components/MenuPage';
import OffersPage from './components/OffersPage';
import RewardsPage from './components/RewardsPage';
import BasketPage from './components/BasketPage';
import SignInPage from './components/SignInPage';
import Home from './components/Home';

export default function App(){
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(()=> {
    const raw = localStorage.getItem('ff_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const found = prev.find(p=>p.id===item.id);
      if (found) return prev.map(p=>p.id===item.id? {...p, quantity: p.quantity+1}:p);
      return [...prev, {...item, quantity:1}];
    });
    setPage('basket');
  };

  const clearCart = ()=> setCart([]);

  const render = () => {
    switch(page){
      case 'menu': return <MenuPage onAdd={addToCart} />;
      case 'offers': return <OffersPage />;
      case 'rewards': return <RewardsPage user={user} />;
      case 'basket': return <BasketPage cart={cart} setPage={setPage} user={user} clearCart={clearCart} />;
      case 'signin': return <SignInPage onSign={(u)=>{ setUser(u); localStorage.setItem('ff_user', JSON.stringify(u)); setPage('home'); }} />;
      default: return <Home setPage={setPage} />;
    }
  };

  return (
    <div className='app'>
      {render()}
      <footer className='footer-nav'>
        <button onClick={()=>setPage('home')}>🏠</button>
        <button onClick={()=>setPage('menu')}>🍗</button>
        <button onClick={()=>setPage('rewards')}>⭐</button>
        <button onClick={()=>setPage('basket')}>🛒</button>
        <button onClick={()=>setPage('signin')}>👤</button>
      </footer>
    </div>
  );
}
