const { Users } = require('../../models');

module.exports = {
  post: async (req, res) => {
    const userInfo = await Users.findOne({
      where: { userId: req.body.userId, password: req.body.password },
    });
    console.log('123123',userInfo)
    if (userInfo === null) {
      res.status(200).json({ message : 'not authorized' })
    } else {
      
      req.session.userId = userInfo.dataValues.userId;
      console.log('인포',req.session)
      res.status(200).json({ message : 'ok'})
    }
  }
}