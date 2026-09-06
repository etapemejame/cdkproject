import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { Cors, LambdaIntegration, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb';

export class TsRestApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    const employeesTable = new TableV2(this, 'Ts-EmplTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billing: Billing.onDemand()
    });

    // Create Lambda function
    const emplLambda = new NodejsFunction(this, 'Ts-EmplLambda', {
      runtime: Runtime.NODEJS_24_X,
      handler: 'handler',
      entry: (join(__dirname, '..', 'services', 'handler.ts')),
      environment: {
        TABLE_NAME: employeesTable.tableName
      }
    });

    // Grant Lambda permissions to DynamoDB table
    employeesTable.grantReadWriteData(emplLambda)

    // Create a API Gateway Rest Api
    const api = new RestApi(this, 'TS-EmplApi');

    // Add Cors support for Api
    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    }
    
    // Create Api resource
    const emplResource = api.root.addResource('empl', optionsWithCors);

    // Create Lambda integration to Rest Api
    const emplLamdaIntegration = new LambdaIntegration(emplLambda);

    // Add methods to the resource
    emplResource.addMethod('GET', emplLamdaIntegration);
    emplResource.addMethod('POST', emplLamdaIntegration);
    emplResource.addMethod('DELETE', emplLamdaIntegration);
  }
}
