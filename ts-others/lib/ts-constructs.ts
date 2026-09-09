import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaToS3 } from '@aws-solutions-constructs/aws-lambda-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class TsConstructsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new LambdaToS3(this, 'LambdaToS3Pattern', {
        lambdaFunctionProps: {
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`console.log()`)
        }
    });
    
  }
}
