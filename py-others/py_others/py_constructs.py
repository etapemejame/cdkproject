from aws_solutions_constructs.aws_lambda_s3 import LambdaToS3
from aws_cdk import (
    aws_lambda as _lambda,
    Stack
)
from constructs import Construct

class PyConstructStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        LambdaToS3(self, 'LambdaToS3Pattern',
            lambda_function_props=_lambda.FunctionProps(
                code=_lambda.Code.from_inline('print()'),
                runtime=_lambda.Runtime.PYTHON_3_14,
                handler='index.handler'
            )
        )