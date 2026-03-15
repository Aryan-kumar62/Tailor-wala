import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import sendEmail from '../utils/sendEmail.js'

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, city, address, pincode } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      phone,
      city,
      address,
      pincode,
    })

    const token = createToken(user._id)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        address: user.address,
        pincode: user.pincode,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        address: user.address,
        pincode: user.pincode,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getMe = async (req, res) => {
  res.json({ user: req.user })
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex')
    
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    
    // Set token expire time (e.g., 10 minutes)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000
    
    await user.save({ validateBeforeSave: false })
    
    // Create reset URL using the referring origin if available
    const clientUrl = req.headers.origin || 'http://localhost:5173'
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`
    
    const message = `You are receiving this email because you (or someone else) requested a password reset. Please click the following link, or paste it into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      })
      
      res.status(200).json({ success: true, message: 'Email sent' })
    } catch (err) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save({ validateBeforeSave: false })
      
      console.error('Email send error:', err)
      return res.status(500).json({ message: 'Email could not be sent' })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    })
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid token or token expired' })
    }
    
    // Set new password
    const salt = await bcrypt.genSalt(10)
    user.passwordHash = await bcrypt.hash(req.body.password, salt)
    
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    
    await user.save()
    
    const token = createToken(user._id)
    
    res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
