const { User } =  require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
class UserController{
  static async postLogin(req,res) {
    if(req.body.email == '' && req.body.password ==''){
      res.status(400).json({
        message:'Email and password cannot be Empty'
      })
    } else if (req.body.password) {
      res.status(400).json({
        message:'password cannot be Empty'
      })
    } else {
      const user = await User.findOne({ where: { email: req.body.email }})
      if(!user){
        return res.status(401).json({
          message:`Email not registered,please register first`
        })
      } else {
        if(bcrypt.compareSync(req.body.password,user.password)){
          const access_token = jwt.sign({id:user.id,email:user.email,role:user.role},process.env.SECRET_KEY)
          return res.status(202).json({access_token,message:'Login Success'})
        } else {
          return res.status(401).json({
            message: 'Incorrect email/password'
          })
        }
      }
    }
  }
}
module.exports = UserController
