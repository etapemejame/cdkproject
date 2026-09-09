import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';


export class TsOthersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'TsOtherBucket', {
      versioned: true
    });

    const lambda = new Function(this, 'TsOtherLambda', {
      code: Code.fromInline("console.log('Hello!')"),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_24_X
    });

    bucket.grantRead(lambda)
  }
}
