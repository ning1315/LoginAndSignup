const { Users } = require('../../models')

module.exports = {
  post : (req, res) => {
    if(!req.body.data){
      res.status(200).json({ message : 'none'})
    } else {
      console.log(Users)
      Users.findOrCreate({ where: { userId : req.body.data.userId}, defaults : { userId : req.body.data.userId, password : req.body.data.password, email : req.body.data.email }}).then((data) => {
        console.log(data)
        if(!data[1]){
          res.status(200).json({ message : 'already' })
        } else {
          res.status(200).json({ message : 'ok' })
        }
      })
    }
  }
}