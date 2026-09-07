import os

from aws_cdk import (
    CfnOutput,
    Stack,
    aws_s3, aws_s3_deployment,
    aws_cloudfront, aws_cloudfront_origins,
)
from pathlib import Path
from constructs import Construct

class PyWebdeplStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create the static content S3 bucket
        deployment_bucket = aws_s3.Bucket(self, 'PyWebDeplBucket', removal_policy='DESTROY', auto_delete_objects=True)

        # Point project to web application directory
        ui_dir = os.path.join(os.path.dirname(__file__), "..", "..", "web", "dist")
        print(f"UI-DIR: {ui_dir}")
        if not os.path.exists(ui_dir):
            print(f"Ui dir not found: {ui_dir}")
            return

        # Grant CloudFront access to S3 bucket
        origin_identity = aws_cloudfront.OriginAccessIdentity(
            self, "PyOriginAccessIdentity"
        )
        deployment_bucket.grant_read(origin_identity)

        # Create a CloudFront Distribution
        distribution = aws_cloudfront.Distribution(
            self, "PyWebDeploymentDistribution",
            default_root_object="index.html",
            default_behavior=aws_cloudfront.BehaviorOptions(
                origin=aws_cloudfront_origins.S3Origin(
                    deployment_bucket, origin_access_identity=origin_identity
                )
            )
        )

        # Create AWS S3 deployment for web packages
        aws_s3_deployment.BucketDeployment(self, "PyWebDeployment",
            destination_bucket=deployment_bucket,
            sources=[aws_s3_deployment.Source.asset(ui_dir)],
            distribution=distribution
        )

        # Create cfn output to extract the distribution URL
        CfnOutput(self, "PyAppUrl",
            value=distribution.distribution_domain_name
        )