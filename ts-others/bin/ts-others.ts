#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { TsOthersStack } from '../lib/ts-others-stack';
import { PolicyChecker } from '../lib/policy-checker';
import { TsConstructsStack } from '../lib/ts-constructs';

const app = new cdk.App();
const otherStack = new TsOthersStack(app, 'TsOthersStack');
new TsConstructsStack(app, 'TsConstructsStack');
cdk.Tags.of(otherStack).add('stage', 'test');
cdk.Tags.of(otherStack).add('storage', 'main', {
    includeResourceTypes: ['AWS::S3::Bucket']
});
cdk.Tags.of(otherStack).add('storage', 'aux', {
    includeResourceTypes: ['AWS::S3::Bucket'],
    priority: 150
});

cdk.Aspects.of(app).add(new PolicyChecker())

