const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sign } = require('../utils/jwt');

exports.register = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  try {
    const {name,email,password} = req.body;
    let user = await User.findOne({email});
    if (user) return res.status(400).json({error:'Email taken'});
    const hashed = await bcrypt.hash(password,10);
    user = new User({name,email,password:hashed});
    await user.save();
    const token = sign(user);
    res.status(201).json({token, user:{id:user._id,name:user.name,email:user.email}});
  } catch (err) { next(err); }
};

exports.login = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({error:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({error:'Invalid credentials'});
    const token = sign(user);
    res.json({token, user:{id:user._id,name:user.name,email:user.email}});
  } catch (err) { next(err); }
};
