import { handler } from "./webhooks"

handler({Records:[{
    Sns: {
        Message: "Test Message, thank you!!!"
    }
}]} as any)