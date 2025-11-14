import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, X, Home, FileText, Star, User } from 'lucide-react';

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [page, setPage] = useState('home');

  const menuItems = [
    { id: 1, name: "Furious Feast", price: 12.99, desc: "3 pc chicken, fries, drink", cat: "Combos" },
    { id: 2, name: "Wing Combo", price: 10.99, desc: "8 wings, fries, drink", cat: "Combos" },
    { id: 3, name: "Classic Burger", price: 6.49, desc: "Chicken, lettuce, mayo", cat: "Burgers" },
    { id: 4, name: "Spicy Burger", price: 6.99, desc: "Hot chicken, jalapeños", cat: "Burgers" },
    { id: 5, name: "Original Wings", price: 7.99, desc: "8 crispy wings", cat: "Wings" },
    { id: 6, name: "Hot Wings", price: 8.49, desc: "8 spicy wings", cat: "Wings" }
  ];

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i));
    } else {
      setCart([...cart, {...item, qty: 1}]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(i => i.id === id ? {...i, qty: i.qty + delta} : i).filter(i => i.qty > 0));
  };

  const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  const categories = [...new Set(menuItems.map(i => i.cat))];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      
      {page === 'home' && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-sm">
            <div className="bg-gray-900 rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔥</div>
                <h1 className="text-3xl font-bold mb-2">FRIED & FURIOUS</h1>
              </div>
              
              <div className="bg-gray-800 rounded-2xl p-6 mb-6 text-center">
                <div className="text-5xl mb-3">🍔</div>
                <h2 className="text-4xl font-bold mb-2">2 FOR £12</h2>
                <p className="text-2xl text-yellow-500 font-bold">FURIOUS FRIDAYS</p>
              </div>

              <button 
                onClick={() => setPage('menu')}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold text-lg mb-3"
              >
                View Menu
              </button>

              <button 
                onClick={() => setPage('rewards')}
                className="w-full bg-red-900 hover:bg-red-800 text-white py-4 rounded-xl font-semibold text-lg"
              >
                Rewards
              </button>
            </div>
          </div>
        </div>
      )}

      {page === 'menu' && (
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-black py-4">
              <h1 className="text-2xl font-bold">Menu</h1>
              <button onClick={() => setShowCart(true)} className="relative bg-red-600 px-4 py-2 rounded-lg">
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <div className="absolute -top-2 -right-2 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {count}
                  </div>
                )}
              </button>
            </div>

            {categories.map(cat => (
              <div key={cat} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-red-500">{cat}</h2>
                {menuItems.filter(item => item.cat === cat).map(item => (
                  <div key={item.id} className="bg-gray-900 rounded-2xl p-4 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-xl">{item.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                      </div>
                      <p className="text-red-500 font-bold text-xl">£{item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => addToCart(item)} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {page === 'orders' && (
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
            <div className="bg-gray-900 rounded-2xl p-8 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-4">No orders yet</p>
              <button onClick={() => setPage('menu')} className="bg-red-600 px-6 py-3 rounded-xl font-bold">
                Start Ordering
              </button>
            </div>
          </div>
        </div>
      )}

      {page === 'rewards' && (
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Rewards</h1>
            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 text-center mb-6">
              <p className="text-sm mb-2">Your Points</p>
              <p className="text-6xl font-bold">850</p>
              <p className="text-sm mt-2">350 points to next reward</p>
            </div>
            <h2 className="text-xl font-bold mb-4">Available Rewards</h2>
            <div className="bg-gray-900 rounded-2xl p-5 flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-red-600 rounded-full w-14 h-14 flex items-center justify-center text-3xl">🍗</div>
                <div>
                  <h3 className="font-bold text-lg">Free 3pc Wings</h3>
                  <p className="text-sm text-red-500">500 points</p>
                </div>
              </div>
              <button className="bg-red-600 px-6 py-3 rounded-xl font-bold">Redeem</button>
            </div>
            <div className="bg-gray-900 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-600 rounded-full w-14 h-14 flex items-center justify-center text-3xl">🍔</div>
                <div>
                  <h3 className="font-bold text-lg">Free Burger</h3>
                  <p className="text-sm text-red-500">800 points</p>
                </div>
              </div>
              <button className="bg-red-600 px-6 py-3 rounded-xl font-bold">Redeem</button>
            </div>
          </div>
        </div>
      )}

      {page === 'profile' && (
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <div className="bg-gray-900 rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                <User className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Guest User</h2>
              <p className="text-gray-400 mb-6">Sign in to earn rewards</p>
              <button className="bg-red-600 px-10 py-4 rounded-xl font-bold text-lg">Sign In</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="grid grid-cols-5 max-w-2xl mx-auto">
          <button onClick={() => setPage('home')} className={`flex flex-col items-center py-3 ${page === 'home' ? 'text-red-500' : 'text-gray-400'}`}>
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setPage('menu')} className={`flex flex-col items-center py-3 ${page === 'menu' ? 'text-red-500' : 'text-gray-400'}`}>
            <div className="text-2xl mb-1">🍽️</div>
            <span className="text-xs">Menu</span>
          </button>
          <button onClick={() => setPage('orders')} className={`flex flex-col items-center py-3 ${page === 'orders' ? 'text-red-500' : 'text-gray-400'}`}>
            <FileText className="w-6 h-6 mb-1" />
            <span className="text-xs">Orders</span>
          </button>
          <button onClick={() => setPage('rewards')} className={`flex flex-col items-center py-3 ${page === 'rewards' ? 'text-red-500' : 'text-gray-400'}`}>
            <Star className="w-6 h-6 mb-1" />
            <span className="text-xs">Rewards</span>
          </button>
          <button onClick={() => setPage('profile')} className={`flex flex-col items-center py-3 ${page === 'profile' ? 'text-red-500' : 'text-gray-400'}`}>
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {showCart && (
        <div className="fixed inset-0 bg-black/80 z-50" onClick={() => setShowCart(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              <div className="bg-red-600 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 mt-12">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-xl p-4 mb-4">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-red-500 font-bold">£{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => updateQty(item.id, -1)} className="bg-gray-700 p-2 rounded-lg">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-8 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="bg-red-600 p-2 rounded-lg">
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="ml-auto font-bold">£{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-gray-800 p-6">
                  <div className="flex justify-between text-2xl font-bold mb-4">
                    <span>Total</span>
                    <span className="text-red-500">£{total.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-lg">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;