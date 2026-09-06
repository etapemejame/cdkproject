import urllib3
import json

http = urllib3.PoolManager()

def handler(event, context):
    print('calling slack!!!')
    url = 'https://hooks.slack.com/services/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'
    msg = {
        "channel": "#aws-events",
        "text": event['Records'][0]['Sns']['Message'],
    }

    encoded_msg = json.dumps(msg).encode('utf-8')
    resp = http.request('POST', url, body=encoded_msg)
    print({
        "message": event['Records'][0]['Sns']['Message'],
        "status_code": resp.status,
        "response": resp.data
    })