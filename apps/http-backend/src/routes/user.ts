import express from "express";
import { auth } from "../middlewares/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { userSchema, loginSchema, createRoomSchema } from "@repo/common/types";
import {prismaClient} from '@repo/db/client'


const router = express.Router();
router.post("/signin", async (req, res) => {
  let userData = loginSchema.parse(req.body);
  // let founduser = await UserModel.findOne({ email: userData.email });
  let founduser = await prismaClient.user.findFirst({
    where: {
      email: userData.email
    }
  })
  if (founduser) {
    bcrypt.compare(userData.password, founduser.password).then((result) => {
      if (result) {
        const token = jwt.sign(
          {
            id: founduser.id.toString(),
          },
          JWT_SECRET
        );
        res
          .status(200)
          .json({ message: "Successfully logged in", token: token });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    });
  } else {
    res.status(400).json({ message: "User Not found" });
  }
});

router.post("/signup", async (req, res) => {
  let userData = userSchema.parse(req.body);
  userData.password = await bcrypt.hash(userData.password, 10);
  console.log(userData);
  let user = await prismaClient.user.findFirst({
    where: {
      email: userData.email
    }
  })
  console.log(user);
  if (!user) {
    const result = await prismaClient.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name
      }
    }).then((result) => {
      res.status(200).json({userId:result.id });
    }).catch((error) => {
      res.status(400).json({ message: error.message });
    })
  } else {
    res
      .status(400)
      .json({ message: "Email already used! Use different email address" });
  }
});

router.post("/room", auth, async (req, res) => {
  let roomData = createRoomSchema.safeParse(req.body)
  if(!roomData.success){
    res.status(400).json({ message: roomData.error.message });
    return
  }
  const userId = req.userId;
  try {
    console.log(userId, roomData.data.name);
    const room = await prismaClient.room.create({
      data:{
        slug: roomData.data.name,
        adminId: userId
      }
    })
    res.status(200).json({roomId:room.id})
  } catch (error) {
    res.status(400).json({ message: "This room already exists" });
  }
  

});

export default router;
