import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' })
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.user = { id: decoded.id }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token invalid' })
  }
}
