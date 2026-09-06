from aws_cdk import (
    Duration,
    Stack,
    aws_s3 as s3,
    CfnOutput,
    RemovalPolicy,
    Fn,
    aws_lambda as lamb
)
from constructs import Construct

class PyHandlerStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, bucket: s3.Bucket, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        lamb.Function(self, 'PyCoolLambda',
            code=lamb.Code.from_inline(
                "import os\ndef handler(event, context):\n\tprint(os.environ['COOL_BUCKET_ARN'])"
            ),
            handler='index.handler',
            runtime=lamb.Runtime.PYTHON_3_14,
            environment={
               "COOL_BUCKET_ARN":bucket.bucket_arn 
            }          
        )