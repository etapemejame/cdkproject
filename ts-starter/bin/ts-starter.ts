#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { TsStarterStack } from '../lib/ts-starter-stack';
import { TsHandlerStack } from '../lib/ts-handler-stack';

const app = new cdk.App();
const tsStarterStack = new TsStarterStack(app, 'TsStarterStack', {});
new TsHandlerStack(app, 'TsHandlerStack', {
  coolBucket: tsStarterStack.coolBucket
})
