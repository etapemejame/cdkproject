#!/usr/bin/env python3
import os

import aws_cdk as cdk

from py_others.py_others_stack import PyOthersStack
from py_others.policy_checker import PolicyChecker
from py_others.py_constructs import PyConstructStack


app = cdk.App()
other_stack = PyOthersStack(app, "PyOthersStack")
cdk.Tags.of(other_stack).add('stage', 'test')

PyConstructStack(app, 'PyConstructStack')

cdk.Aspects.of(app).add(PolicyChecker())

app.synth()
