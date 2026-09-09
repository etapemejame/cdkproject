import aws_cdk as core
import aws_cdk.assertions as assertions
import pytest
from py_testing.py_testing_stack import PySimpleStack
from aws_cdk.assertions import Match, Capture
# example tests. To run these tests, uncomment this file along with the example
# resource in py_testing/py_testing_stack.py

@pytest.fixture(scope='session')
def simple_template():
    app = core.App()
    stack = PySimpleStack(app, "py-testing")
    template = assertions.Template.from_stack(stack)
    return template

def test_lambda_props(simple_template):
    simple_template.has_resource_properties("AWS::Lambda::Function", {
        "Runtime": "python3.14"
    })

    simple_template.resource_count_is("AWS::Lambda::Function", 1)

    simple_template.has_resource_properties("AWS::S3::Bucket", {
        "VersioningConfiguration": {
            "Status": "Enabled"
        }
    })

def test_lambda_runtime_with_matcher(simple_template):
    simple_template.has_resource_properties("AWS::Lambda::Function", {
        "Runtime": Match.string_like_regexp("python")
    })

def test_labda_bucket_with_matcher(simple_template):
    simple_template.has_resource_properties(
        "AWS::IAM::Policy",
        Match.object_like(
            {
                "PolicyDocument": {
                    "Statement": [
                        {
                            "Resource": [
                                {
                                    "Fn::GetAtt": [
                                        Match.string_like_regexp("SimpleBucket"),
                                        "Arn"
                                    ]
                                },
                                Match.any_value()
                            ]
                        }
                    ]
                }
            }
        ),
    )

def test_lambda_actions_with_captors(simple_template):
    lambda_actions_captor = Capture()
    simple_template.has_resource_properties(
        "AWS::IAM::Policy",
        {"PolicyDocument": {"Statement": [{"Action": lambda_actions_captor}]}}
    )

    expected_actions = ["s3:GetBucket*", "s3:GetObject*", "s3:List*"]

    assert sorted(lambda_actions_captor.as_array()) == sorted(expected_actions)

#  Run snapshot testing
def test_bucket_props_with_snapshot(simple_template, snapshot):
    bucket_template = simple_template.find_resources('AWS::S3::Bucket')
    assert bucket_template == snapshot