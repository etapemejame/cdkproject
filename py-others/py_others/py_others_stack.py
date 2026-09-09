from aws_cdk import (
    Stack,
    aws_lambda,
    aws_s3
)
from constructs import Construct

class PyOthersStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        other_lambda = aws_lambda.Function(self, 'PyOtherLambda',
            code=aws_lambda.Code.from_inline('print("Hello!")'),
            runtime=aws_lambda.Runtime.PYTHON_3_14,
            handler='index.handler'
        ) 

        bucket = aws_s3.Bucket(self, 'PyOtherBucket',
            versioned=True
        )

        bucket.grant_read(other_lambda)