const { Users } = require('../../models');

module.exports = {
  get: async (req, res) => {
    if (!req.session.userId) {
      res.status(400).json({message : 'not authorized'})
    } else {
      Users.findOne({ where : { userId : req.session.userId }}).then((data) => {
        console.log(data)
        res.status(200).json({ data : data.dataValues, message : 'ok' })
      })

      
    }
  },
};
