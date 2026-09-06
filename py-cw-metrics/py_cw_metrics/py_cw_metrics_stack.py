from aws_cdk import (
    Duration,
    Stack,
    aws_cloudwatch,
    aws_cloudwatch_actions,
    aws_lambda,
    aws_sns,
    aws_sns_subscriptions
)
from constructs import Construct

class PyCwMetricsStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create a webhooks Lambda function
        web_hook_lambda = aws_lambda.Function(
            self, "webHookLambda",
            runtime=aws_lambda.Runtime.PYTHON_3_14,
            code=aws_lambda.Code.from_asset("services"),
            handler="webhook.handler"
        )

        # Create SNS topic for alarm
        alarm_topic = aws_sns.Topic(
            self, "PyAlarmTopic", display_name="PyAlarmTopic", topic_name="PyAlarmTopic"
        )

        # Add a subscription to the SNS topic for Lamabda
        alarm_topic.add_subscription(
            aws_sns_subscriptions.LambdaSubscription(web_hook_lambda)
        )

        # Create CloudWatch alarm
        alarm = aws_cloudwatch.Alarm(
            self, "ApiAlarm",
            metric=aws_cloudwatch.Metric(
                metric_name="custom-error",
                namespace="Custom",
                period=Duration.minutes(1),
                statistic="Sum",
            ),
            evaluation_periods=1,
            threshold=100
        )

        # Create a topic action for alarm
        topic_action = aws_cloudwatch_actions.SnsAction(alarm_topic)

        # Add alarm actions
        alarm.add_alarm_action(topic_action)
        alarm.add_ok_action(topic_action)

        # Create CloudWatch alarm
        api_alarm = aws_cloudwatch.Alarm(
            self, "Py-Api4xxAlarm",
            metric=aws_cloudwatch.Metric(
                metric_name="4XXError",
                namespace="AWS/ApiGateway",
                period=Duration.minutes(1),
                statistic="Sum",
                dimensions_map={
                   "ApiName": "TS-EmplApi" 
                }
            ),
            evaluation_periods=1,
            threshold=1
        )

        # Add alarm actions
        api_alarm.add_alarm_action(topic_action)
        api_alarm.add_ok_action(topic_action)