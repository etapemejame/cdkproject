import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Alarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';

export class TsCwMetricsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create webhook Lambda
    const WebHookLambda = new NodejsFunction(this, 'webHookLambda', {
      runtime: Runtime.NODEJS_24_X,
      handler: 'handler',
      entry: (join(__dirname, '..', 'services', 'webhooks.ts'))
    });
    
    // Create SNS topic
    const alarmTopic = new Topic(this, 'TSAlarmTopic', {
      displayName: "TsAlarmTopic",
      topicName: "TsAlarmTopic"
    });

    // Add subscription to the SNS topic
    alarmTopic.addSubscription(new LambdaSubscription(WebHookLambda));

    // Create and configure CloudWatch alarm
    const spacesApiAlarm = new Alarm(this, 'Ts-ApiAlarm', {
      metric: new Metric({
        metricName: 'custom-error',
        namespace: 'Custom',
        period: cdk.Duration.minutes(1),
        statistic: 'Sum'
      }),
      evaluationPeriods: 1,
      threshold: 100,
    });

    // Create SNS topic action for alarm
    const topicAction = new SnsAction(alarmTopic);

    // Add alarm action and ok action
    spacesApiAlarm.addAlarmAction(topicAction);
    spacesApiAlarm.addOkAction(topicAction);

    const apiAlarm = new Alarm(this, 'Ts-Api4xxAlarm', {
      metric: new Metric({
        metricName: '4XXError',
        namespace: 'AWS/ApiGateway',
        period: cdk.Duration.minutes(1),
        statistic: 'Sum',
        dimensionsMap: {
          "ApiName": "TS-EmplApi"
        }
      }),
      evaluationPeriods: 1,
      threshold: 1,
    });

    apiAlarm.addAlarmAction(topicAction);
    apiAlarm.addOkAction(topicAction);
    
  }
}
