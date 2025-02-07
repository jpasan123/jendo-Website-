"use server"

import { revalidatePath } from "next/cache"

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  try {
    // Here you would typically send an email using an email service
    // For demonstration, we'll just log the data and simulate a successful send
    console.log("Sending email with:", { name, email, message })

    // Simulate an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real application, you would send the email here
    // For example, using the SendGrid API as shown in the previous response

    // Revalidate the page to reflect the new state
    revalidatePath("/")

    return { success: true, message: "Email sent successfully" }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Failed to send email" }
  }
}

