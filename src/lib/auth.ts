import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { sendEmail } from "./email";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { passwordSchema } from "./validation";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders:{
        google:{
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        github:{
              clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }
    },
    emailAndPassword:{
        enabled:true,
        // requireEmailVerification:true, 
        // autoSignInAfterVerification: true  // verify แล้ว login อัตโนมัติ 
       async sendResetPassword({user,url}){
            await sendEmail({
                to:user.email,
                subject:"Reset your email",
                html: `<p>Click <a href='${url}'>here</a> to reset your password.</p>`
            })
        }
    },
    emailVerification:{
        sendOnSignUp:true,
        autoSignInAfterVerification:true,
        async sendVerificationEmail({user,url}) {
            await sendEmail({
                to:user.email,
                subject:"Verify your email",
                html:`<p>Click <a href='${url}'>here</a> to verify your email.</p>`
            })
        },
    },
    user:{
        changeEmail:{
            enabled:true,
            async sendChangeEmailVerification({user,newEmail,url}){
                await sendEmail({
                    to: user.email,
                    subject: "Verify your new email",
                    html:`<p>Your email is being changed to ${newEmail}. Click the link to approve the change: ${url}</p>`
                })
            }
        },
        additionalFields:{
            role:{
                type:"string",
                input:false,
            }
        }
    },
    hooks:{
        before: createAuthMiddleware(async ctx =>{
            if( ctx.path === "/sign-up/email" || 
                ctx.path === "/reset-password" ||
                ctx.path === "/change-password"){
                    const password =ctx.body.password || ctx.body.newPassword
                    const { error } = passwordSchema.safeParse(password)
                    if(error){
                        throw new APIError("BAD_REQUEST",{
                            message: "Password not strong enough"
                        })
                    }
                }
        }),
    }
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;