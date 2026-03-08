import express from 'express'
import { createProfile, getMyProfile, getEarnings, listTailors, getTailorById } from '../controllers/tailorController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

const ensureTailor = (req, res, next) => {
  if (req.user.role !== 'tailor') {
    return res.status(403).json({ message: 'Tailor access only' })
  }
  next()
}

router.post('/profile', auth, ensureTailor, createProfile)
router.get('/profile/me', auth, ensureTailor, getMyProfile)
router.get('/earnings', auth, ensureTailor, getEarnings)
router.get('/', listTailors)
router.get('/:id', getTailorById)

export default router
