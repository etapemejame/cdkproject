import { SNSEvent } from "aws-lambda";

const webHookUrl = 'https://hooks.slack.com/services/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';

async function handler(event: SNSEvent) {
    for (const record of event.Records) {
        await fetch(webHookUrl, {
            method: 'POST',
            body: JSON.stringify({
                "text": `Huston, we have a problem: ${record.Sns.Message}`
            })
        })
    }
}

export { handler }