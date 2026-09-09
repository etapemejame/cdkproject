import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class TsSimpleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Function(this, 'SimpleLambda', {
        code: Code.fromInline('console.log("Hello!")'),
        handler: 'index.handler',
        runtime: Runtime.NODEJS_24_X
    });

    const bucket = new Bucket(this, "SimpleBucket", {
      versioned: true
    });

    bucket.grantRead(lambda)
  }
}
