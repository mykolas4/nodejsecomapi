
import { v4 as uuidv4} from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../model/user.js";

export const SIGN_IN = async (req, res) => {
  try {

    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "please provide all required fields" });
    }


    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: uuidv4(),
      email,
      name,
      password: hash,
    };

    const user = new UserModel(newUser);
    const response = await user.save();

    return res.status(201).json({ message: "user was created", user: response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "we have some problems" });
  }
};

export const LOGIN = async (req, res) => {
  try {
  

    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "uou have provided bad data" });
    }

    const isPasswordsMatch = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordsMatch) {
      return res.status(401).json({ message: "uou have provided bad data" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not defined" });
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).json({ message: "successful login", token: token });
  } catch (err) {
    console.error(err); 
    return res.status(500).json({ message: "we have some problems" });
  }
};