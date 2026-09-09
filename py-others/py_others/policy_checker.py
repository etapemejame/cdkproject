import json

import jsii
from aws_cdk import Annotations, IAspect, aws_iam, Stack

@jsii.implements(IAspect)
class PolicyChecker:
    def visit(self, node):
        # print(f'Visiting {node.__class__.__name__}')

        if isinstance(node, aws_iam.CfnPolicy):
            resolved_doc = Stack.of(node).resolve(node.policy_document)
            resolved_doc_json = json.dumps(resolved_doc)
            # print(resolved_doc_json)

            if 'GetBucket' in resolved_doc_json:
                Annotations.of(node).add_warning_v2('warning', 
                'Forbidden action ' + 'GetBucket is found in the Lambda policy.'
            )