import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { join } from 'path';
import { existsSync } from 'fs';
import { Distribution, OriginAccessIdentity, S3OriginAccessControl } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class TsWebdeplStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the static content S3 bucket
    const deploymentBucket = new Bucket(this, 'TsWebDeploymentBucket')

    // Point project to web application directory
    const uiDir = join(__dirname, "..", "..", "web", "dist");
    if (!existsSync(uiDir)) {
      console.warn(`Ui dir not found: ${uiDir}`);
      return;
    };

    // Grant CloudFront access to S3 bucket
    const originIdentity = new OriginAccessIdentity(this, "OriginAccessIdentity");
    deploymentBucket.grantRead(originIdentity);

    // Create a CloudFront Distribution
    const distribution = new Distribution(this, 'WebDeploymentDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessIdentity(deploymentBucket, {
          originAccessIdentity: originIdentity
        })
      }
    });

    // Create AWS S3 deployment for web packages
    new BucketDeployment(this, 'webDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
      distribution: distribution
    });

    // Create cfn output to extract the distribution URL
    new cdk.CfnOutput(this, 'TsAppUrl', {
      value: distribution.distributionDomainName
    })
  }
}
