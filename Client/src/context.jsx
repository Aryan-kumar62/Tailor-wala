import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiGet } from './api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    apiGet('/auth/me')
      .then((data) => {
        setUser(data.user)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// Cart: one stitching service + home visit (no fabric in MVP)
const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)

  const addToCart = (item) => setCart(item)
  const clearCart = () => setCart(null)

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
