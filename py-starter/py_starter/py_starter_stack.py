from aws_cdk import (
    Duration,
    Stack,
    aws_s3 as s3,
    CfnOutput,
    RemovalPolicy,
    Fn
)
from constructs import Construct

class PyStarterStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here
        suffix = self.__initialize_suffix()

        self.bucket = s3.Bucket(self, 'PyBucket',
            bucket_name=f"py-bucket-{suffix}", 
            lifecycle_rules=[
            s3.LifecycleRule(
                expiration=Duration.days(3)
            )
        ], removal_policy=RemovalPolicy.DESTROY)

        CfnOutput(self, 'PyBucketName',
            value=self.bucket.bucket_name,
            export_name='PyBucketName'
        )

    def __initialize_suffix(self):
        short_stack_id = Fn.select(2, Fn.split('/', self.stack_id))
        suffix = Fn.select(4, Fn.split('-', short_stack_id))
        return suffix

    @property
    def cool_bucket(self):
        return self.bucket
        
        
