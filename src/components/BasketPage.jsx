import React from 'react';
export default function BasketPage({ cart=[], user, clearCart }) {
  const total = cart.reduce((s,i)=> s + (Number(i.price||i.price_cents)/1) * i.quantity, 0);
  const handleCheckout = async () => {
    if (!user) return alert('Please sign in to checkout');
    const token = JSON.parse(localStorage.getItem('ff_user'))?.token;
    const res = await fetch('/api/create-checkout-session', {
      method:'POST',
      headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
      body: JSON.stringify({ items: cart })
    });
    const json = await res.json();
    if (json.url) window.location = json.url;
    else alert('Checkout failed');
  };
  return (
    <div className='page'>
      <h1>🛒 Basket</h1>
      {cart.length===0 ? <p>Your basket is empty.</p> : (
        <div>
          <ul>
            {cart.map(c=> <li key={c.id}>{c.name} x {c.quantity} — £{(Number(c.price)).toFixed(2)}</li>)}
          </ul>
          <p><strong>Total: £{cart.reduce((s,i)=> s + Number(i.price)*i.quantity,0).toFixed(2)}</strong></p>
          <button className='primary-btn' onClick={handleCheckout}>Pay with Apple Pay / Google Pay</button>
          <button style={{marginTop:8}} onClick={clearCart}>Clear</button>
        </div>
      )}
    </div>
  );
}
