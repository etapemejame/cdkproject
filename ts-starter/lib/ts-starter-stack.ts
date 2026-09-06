import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import {aws_s3, Fn} from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib/core';

export class TsStarterStack extends cdk.Stack {
  // Make this bucket publicly accessible outside of this class
  public coolBucket: aws_s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = this.intializeSuffix()

    this.coolBucket = new aws_s3.Bucket(this, 'TsBucket', {
      bucketName: `ts-bucket-${suffix}`,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(3)
        }
      ]
    })

    // Create cfn output for bucket name
    new cdk.CfnOutput(this, 'TsBucketName',
      {
        value: this.coolBucket.bucketName
      }
    )
  }

  // Create a private method to get bucket name suffix from stack Id
  private intializeSuffix(){
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId))
    const suffix =Fn.select(4, Fn.split('-', shortStackId))
    return suffix
  }
};

