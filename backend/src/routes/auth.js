import express from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup', async (req,res)=>{
  const {email,password} = req.body;
  const existing = await prisma.user.findUnique({where:{email}});
  if(existing) return res.status(400).json({error:'Email exists'});
  const hash = await bcrypt.hash(password,10);
  const user = await prisma.user.create({data:{email,password:hash}});
  res.json({id:user.id,email:user.email});
});

router.post('/login', async (req,res)=>{
  const {email,password} = req.body;
  const user = await prisma.user.findUnique({where:{email}});
  if(!user) return res.status(401).json({error:'Invalid'});
  const ok = await bcrypt.compare(password,user.password);
  if(!ok) return res.status(401).json({error:'Invalid'});
  const token = jwt.sign({userId:user.id}, process.env.JWT_SECRET, {expiresIn:'7d'});
  res.json({token});
});

export default router;
