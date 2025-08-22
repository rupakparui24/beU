import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";

import { sendVerificationMail } from "@/helpers/sendVerificationMail";
import { UserModel } from "@/model/user.model";

export async function POST(request: Request){
    await dbConnect();

    try {
       const {email, username, password} =  await request.json()

       const exisitingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified: true
       })

       if(exisitingUserVerifiedByUsername){
        return Response.json({
            success: false,
            message: "Username is already taken.",
        },
        {
            status: 400,
        })
       }

       const exisitingUserByEmail = await UserModel.findOne({email});
       const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
       if(exisitingUserByEmail){
            if (exisitingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email is already registered and verified.",
                },
                {
                    status: 400,
                }) 
            }
            // Update existing unverified user with new details
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
                exisitingUserByEmail.password = hashedPassword;
                exisitingUserByEmail.verifyCode = verifyCode;
                exisitingUserByEmail.verifyCodeExpiry = expiryDate;
            }
       }
       else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours()+1);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages: []
        })
        await newUser.save();
       }
       // Send verification email
       const emailResponse = await sendVerificationMail(email, username, verifyCode);

       if(!emailResponse.success){
        return Response.json({
            success: false,
            message: "Failed to send verification email.",
        },
        {
            status: 500,
        })
       }
        return Response.json({
        success: true,
        message: "User registered successfully. Please check your email for the verification code.",
        },
        {
        status: 201,
        })
        
    } catch (error) {
        console.error("Error in sign-up route:", error);
        return Response.json({
            success: false,
            message: "An error occurred while processing your request.",
        },
        {
            status: 500,
        })
    }
}