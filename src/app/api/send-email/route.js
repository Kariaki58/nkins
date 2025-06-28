import { sendEmailToAdmin } from "@/lib/sendEmail";


export async function POST(request) {
    const { name, email, subject, message } = await request.json();

    // Validate the input
    if (!name || !email || !subject || !message) {
        return new Response("All fields are required", { status: 400 });
    }

    console.log(
        `Received message from ${name} (${email}): ${message}`
    )

    // Send the email
    try {
        const htmlMessage = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `;
        await sendEmailToAdmin(email, subject, htmlMessage);
        return new Response(JSON.stringify({ error: "Email sent successfully", }, { status: 200 }));
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to send email"}, { status: 500 }));
    }
}