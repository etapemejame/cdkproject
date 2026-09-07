import aws_cdk as core
import aws_cdk.assertions as assertions
import pytest
from aws_cdk.assertions import Match, Capture

from py_webdepl.py_webdepl_stack import PyWebdeplStack

# example tests. To run these tests, uncomment this file along with the example
# resource in py_webdepl/py_webdepl_stack.py
@pytest.fixture(scope='session')
def tests_template():
    app = core.App()
    stack = PyWebdeplStack(app, "py-webdepl")
    template = assertions.Template.from_stack(stack)
    return template

def test_lambda_props(tests_template):
    tests_template.has_resource_properties("AWS::Lambda::Function", {
        "Runtime": "python3.13"
    })