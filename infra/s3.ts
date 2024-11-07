import * as aws from '@pulumi/aws';

//Create s3 bucket

// Create an AWS resource (S3 Bucket)
export const bucket = new aws.s3.Bucket('staging-bucket', {});

// Export the name of the bucket
export const bucketName = bucket.id;

export const ownershipControls = new aws.s3.BucketOwnershipControls(
  'ownership-controls',
  {
    bucket: bucketName,
    rule: {
      objectOwnership: 'ObjectWriter',
    },
  },
);

export const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(
  'public-access-block',
  {
    bucket: bucketName,
    blockPublicAcls: false,
  },
);
