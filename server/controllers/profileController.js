import User from '../models/User.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch profile' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Unable to update profile' })
  }
}
