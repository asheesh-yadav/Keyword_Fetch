// import { User } from "../model/User.js";
// import jwt from 'jsonwebtoken'
// import bcrypt from "bcryptjs";

// const secretKey = process.env.JWT_SECRET;


// // user register
// export const register = async(req,res)=>{
//   const {name,email,password,confirmPassword} = req.body;
//   try{
//     if (password !== confirmPassword) {
//     return res.status(400).json({ message: "Passwords do not match", success: false });
//     }

//     let user = await User.findOne({email});
//     if(user){
//       return res.status(409).json({ message: "User already exist",success:false });
//     }
//     const hassPass = await bcrypt.hash(password,10);
//     user = await User.create({name,email,password:hassPass});
//     res.json({message:"User registered successfully",success:true});

//   }catch(err){
//     res.json({message:err.message,success: false });
//   }
// }



// // user login
// export const Login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found", success: false });
//     }
//     // validate password
//     const validPass = await bcrypt.compare(password, user.password);
//     if (!validPass) {
//       return res
//         .status(401)
//         .json({ message: "Incorrect password", success: false });
//     }
//     const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "365d" });
//     return res.status(200).json({
//       message: `Welcome ${user.name}`,
//       token,
//       success: true,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Server error: " + err.message,
//       success: false,
//     });
//   }
// };