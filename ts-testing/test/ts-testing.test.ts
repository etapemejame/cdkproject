import * as cdk from 'aws-cdk-lib';
import { Template, Match, Capture } from 'aws-cdk-lib/assertions';
import * as TsTesting from '../lib/ts-testing-stack';
import { Policy } from 'aws-cdk-lib/aws-sns';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { assert } from 'console';

describe('TsSimpleStack test suite', ()=>{

    let template: cdk.assertions.Template

    beforeAll(()=>{
        const app = new cdk.App({
            outdir:'cdk.out/test'
        });
        const stack = new TsTesting.TsSimpleStack(app, 'MySimpleStack');
        template = Template.fromStack(stack);
    })

    test('Lambda runtime check', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            Runtime: "nodejs24.x"
        });
        template.resourceCountIs('AWS::Lambda::Function', 1)
    });

    test('Lambda runtime check with matchers', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            Runtime: Match.stringLikeRegexp("nodejs")
        });
    });

    test('S3 versioning check', ()=>{
        template.hasResourceProperties('AWS::S3::Bucket', {
            VersioningConfiguration: {
                Status: "Enabled"
            }
        })
    });

    test('Lambda bucket policy check with matchers', () => {
        template.hasResourceProperties('AWS::IAM::Policy', 
            Match.objectLike({
                PolicyDocument: {
                    Statement: [{
                        Resource: [
                            {
                                'Fn::GetAtt': [
                                    Match.stringLikeRegexp('SimpleBucket'),
                                    'Arn'
                                ]  
                            },
                            Match.anyValue()
                        ]
                    }]
                }
            })
        );
    });

    test('Lambda IAM policy actions check with Captors', () => {
        const lambdaActionsCaptors = new Capture();

        template.hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [{
                    Action: lambdaActionsCaptors
                }]
            }
        });

        const expectedActions = ["s3:GetObject*", "s3:GetBucket*", "s3:List*"]

        expect(lambdaActionsCaptors.asArray()).toEqual(
            expect.arrayContaining(expectedActions)
        )
    });

    test('Bucket properties with snapshot', ()=>{
        const bucketTemplate = template.findResources('AWS::S3::Bucket');
        expect(bucketTemplate).toMatchSnapshot()
    })


})

