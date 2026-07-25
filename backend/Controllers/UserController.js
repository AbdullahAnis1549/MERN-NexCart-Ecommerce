import User from '../Models/UserSchema.js'
import bcrypt from 'bcrypt'
import sendEmail from '../utils/SendEmail.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config({quiet:true})


export const RegisterUser = async (req, res) => {

        try {
                const { name, email, password, cpassword, phone } = req.body;
                if (!name || !email || !password || !cpassword || !phone) {
                        return res.status(400).json({
                                status: "fail",
                                message: "fields required"
                        })
                }
                if (!(password == cpassword)) {
                        return res.status(400).json({
                                status: "fail",
                                message: "password doesnot match"
                        })
                }

                // prevent duplicate active accounts
                const existuser = await User.findOne({ email, verifystatus: true });

                if (existuser) {
                        return res.status(400).json({
                                status: "fail",
                                message: "User already exists"
                        });
                }

                const hashpassword = await bcrypt.hash(password, 12)
                let randomCode = Math.floor(10000 + Math.random() * 90000);
                try {
                        await sendEmail({
                                to: email,
                                subject: "verification code",
                                text: `Your verify code is ${randomCode}`
                        })
                } catch (err) {
                        console.log(err)

                }

                const usr = await User.create({
                        name: name,
                        email: email,
                        password: hashpassword,
                        phone: phone,
                        image: req.file?.path,
                        verifycode: randomCode,
                        // Ensure normal users are not created as admin
                        role: "user" 
                })

                return res.status(200).json({
                        status: "success",
                        data: usr
                });
        } catch (err) {
                console.log(err)
                return res.status(500).json({
                        status: "fail",
                        message: "something went wrong"
                });
        }
};




export const VerifyUser = async (req, res) => {
    try {
        const { email, verifycode } = req.body;

        if (!email || !verifycode) {
            return res.status(400).json({
                status: "fail",
                message: "email and code required"
            });
        }

        const user = await User.findOne({
            email,
            verifycode: Number(verifycode)
        });

        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid code"
            });
        }

        user.verifystatus = true;
        user.verifycode = null;

        await user.save();

        return res.status(200).json({
            status: "success",
            message: "User verified successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "fail",
            message: "something went wrong"
        });
    }
};

export const Loginuser = async (req, res) => {
        try {
                const { email, password } = req.body;
                if (!email || !password) {
                        return res.status(400).json({
                                status: "Failed",
                                message: "Please enter fields"
                        });
                }
                const user = await User.findOne({ email: email, verifystatus: true });


                if (!user) {
                        return res.status(404).json({
                                status: "Failed",
                                message: "User not found"
                        });
                }
                const passcheck = await bcrypt.compare(password, user.password)
                if (!passcheck) {
                        return res.status(404).json({
                                status: "Failed",
                                message: "password or email wrong"
                        });
                }
                const token = jwt.sign({id:user.id},process.env.jwtkey,{
                        expiresIn:process.env.jwtexpire
                })
                return res.status(200).json({
                        status: "success",
                        data: user,
                        token
                })
        } catch (err) {
                console.log(err);
                return res.status(500).json({
                        status: "Fail",
                        message: "Something went wrong"
                });
        }
};

export const Forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: "Failed",
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email, verifystatus: true });

        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found"
            });
        }
        const randomCode = Math.floor(10000 + Math.random() * 90000);
        await sendEmail({
            to: email,
            subject: "Password Reset Code",
            text: `Your reset code is ${randomCode}`
        });

        user.resetpasscode = randomCode;
        await user.save();

        return res.status(200).json({
            status: "success",
            message: "Reset code sent successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "Fail",
            message: "Something went wrong"
        });
    }
};

export const Resetpassword = async (req, res) => {
    try {
        const { verifycode, password, cpassword } = req.body;

        if (!verifycode || !password || !cpassword) {
            return res.status(400).json({
                status: "Failed",
                message: "Please enter all fields"
            });
        }

        if (password !== cpassword) {
            return res.status(400).json({
                status: "Failed",
                message: "Passwords do not match"
            });
        }

        const user = await User.findOne({
            resetpasscode: Number(verifycode)
        });

        if (!user) {
            return res.status(400).json({
                status: "Failed",
                message: "Invalid verification code"
            });
        }

        const hashpassword = await bcrypt.hash(password, 12);

        user.password = hashpassword;
        user.resetpasscode = null;

        await user.save();

        return res.status(200).json({
            status: "success",
            message: "Password reset successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "Fail",
            message: "Something went wrong"
        });
    }
};




export const Getuser = async (req, res) => {
  try {

    const id = req.id;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: "success",
      data:user
    });

  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};





export const UpdateUser = async (req, res) => {
  try {
    const id = req.id;

    const { name, email, phone, password, cpassword } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // normal fields update
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;

    // image update (Multer se aayegi)
    if (req.file) {
      user.image = req.file.path;
    }

    // password update (optional)
    if (password || cpassword) {
      if (password !== cpassword) {
        return res.status(400).json({
          status: "fail",
          message: "Password and confirm password do not match",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};