import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailValues {
    to:string,
    subject:string,
    html:string,
}

export async function sendEmail({to , subject,html}:SendEmailValues){
    await resend.emails.send({
        from:"Acme <onboarding@resend.dev>",
        to,
        subject,
        html,
    })
}