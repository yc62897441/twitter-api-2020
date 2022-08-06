const { Op } = require('sequelize')
const db = require('../models')
const User = db.User
const Followship = db.Followship

const followshipController = {
  getRecommendedFollowings: (req, res) => {
    const userId = req.user.id //req.query.userId
    User.findAll({ where: { id: { [Op.not]: userId } }, include: [{ model: User, as: 'Followers' }], limit: 10 })
      .then(users => {
        users = { users: users }
        users = JSON.stringify(users)
        users = JSON.parse(users)
        users = users.users.map(user => ({
          account: user.account,
          avatar: user.avatar,
          id: user.id,
          introduction: user.introduction,
          name: user.name,
          role: user.role,
          banner: user.banner,
          Followers: user.Followers.map(follower => follower.Followship.followerId)
        }))
        return res.json(users)
      })
  },
  postFollowship: (req, res) => {
    const followerId = req.user.id || 1
    const followingId = req.body.id
    Followship.create({
      followerId: followerId,
      followingId: followingId
    })
      .then(followship => {
        return res.json({ status: 'success', message: '' })
      })
  },
  deleteFollowship: (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.id
    Followship.findOne({
      where: {
        followerId: followerId,
        followingId: followingId
      }
    })
      .then(followship => {
        followship.destroy()
          .then(() => {
            return res.json({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = followshipController
