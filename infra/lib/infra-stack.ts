import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ✅ NEW SQS (with -cdk suffix)
    const queue = new sqs.Queue(this, 'ContactQueueCDK', {
      queueName: 'contact-form-queue-cdk',
    });

    // ✅ NEW Lambda (with -cdk suffix)
    const fn = new lambda.Function(this, 'ContactLambdaCDK', {
      functionName: 'contact-form-processor-cdk',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../lambda'),
      environment: {
        SES_EMAIL_FROM: 'nlysrkr10@gmail.com',
      },
    });

    // ✅ Permissions (least privilege)
    queue.grantConsumeMessages(fn);

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      })
    );

    // ✅ SQS → Lambda trigger
    fn.addEventSource(new eventSources.SqsEventSource(queue));

    // ✅ Output for EB
    new cdk.CfnOutput(this, 'QueueUrl', {
      value: queue.queueUrl,
    });
  }
}