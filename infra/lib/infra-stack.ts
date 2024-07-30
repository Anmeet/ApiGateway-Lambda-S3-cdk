import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here

    //S3 bucket

    const balancestatuss3 = new s3.Bucket(this, 's3bucketlogicalId619', {
      bucketName: 'balancestatus619',
    })

    //IAM Role
    const imbalancerole = new iam.Role(this, 'imbalancerole', {
      roleName: 'banklambdaRole',
      description: 'role for lambda to access s3 bucket',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    })

    imbalancerole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')
    )

    //lambda
    const bankingLambdaFunction = new lambda.Function(
      this,
      'bankingLambdaFunction',
      {
        handler: 'lambda_function.handler',
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset('../services/'),
        role: imbalancerole,
      }
    )

    //api gateway

    const bankingrestApi = new apigateway.LambdaRestApi(
      this,
      'bankingrestapi',
      {
        handler: bankingLambdaFunction,
        restApiName: 'bankingrestapi',
        deploy: true,
        proxy: false,
      }
    )

    const bankStatus = bankingrestApi.root.addResource('bankstatus')
    bankStatus.addMethod('GET')
  }
}
