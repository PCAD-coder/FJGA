import "server-only"

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

interface BrevoAttachment {
  name: string
  content: string
}

interface SendBrevoEmailInput {
  to: {
    email: string
    name?: string
  }
  subject: string
  htmlContent: string
  textContent?: string
  attachments?: BrevoAttachment[]
}

interface BrevoSendResponse {
  messageId?: string
  messageIds?: string[]
}

export async function sendBrevoEmail(
  input: SendBrevoEmailInput
): Promise<BrevoSendResponse> {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName =
    process.env.BREVO_SENDER_NAME ?? "FJ Glass and Aluminum"

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured.")
  }

  if (!senderEmail) {
    throw new Error("BREVO_SENDER_EMAIL is not configured.")
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: senderName,
      },

      to: [
        {
          email: input.to.email,
          ...(input.to.name
            ? {
                name: input.to.name,
              }
            : {}),
        },
      ],

      subject: input.subject,

      htmlContent: input.htmlContent,

      ...(input.textContent
        ? {
            textContent: input.textContent,
          }
        : {}),

      ...(input.attachments?.length
        ? {
            attachment: input.attachments.map(
              (attachment) => ({
                name: attachment.name,
                content: attachment.content,
              })
            ),
          }
        : {}),

      tags: ["official-receipt"],
    }),
  })

  const responseBody = await response.text()

  if (!response.ok) {
    let message =
      `Brevo request failed with status ${response.status}.`

    try {
      const errorData = JSON.parse(responseBody) as {
        message?: string
      }

      if (errorData.message) {
        message = errorData.message
      }
    } catch {
      // Keep the fallback error message.
    }

    throw new Error(message)
  }

  if (!responseBody) {
    return {}
  }

  return JSON.parse(responseBody) as BrevoSendResponse
}