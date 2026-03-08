import express from 'express'
import { getCloths, getClothById, createCloth, seedCloths } from '../controllers/clothController.js'

const router = express.Router()

router.get('/', getCloths)
router.get('/seed', seedCloths)
router.get('/:id', getClothById)
router.post('/', createCloth)

export default router
