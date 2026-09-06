from webhook import handler

event = {
    'Records': [{
        'Sns': {
            'Message': 'Test message, thank you!!!'
        }
    }], 
}

handler(event, {})