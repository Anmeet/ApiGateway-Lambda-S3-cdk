const AWS = require('aws-sdk')

exports.handler = async (event, context) => {
  const params = { Bucket: 'balancestatus619', Key: 'accountStatus.json' }

  const s3 = new AWS.S3()
  const response = await s3.getObject(params).promise()
  const body = response.Body?.toString('utf-8') || ''

  return {
    statusCode: 200,
    body: body,
  }
}
