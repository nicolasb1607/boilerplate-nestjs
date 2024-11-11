import * as aws from '@pulumi/aws';
import * as config from './config';

//Create s3 bucket

// Create an AWS resource (S3 Bucket)
export const bucket = new aws.s3.Bucket(
    `${config.stack}-bucket`,
    {},
    config.defaultProvider,
);

// Export the name of the bucket
export const bucketName = bucket.id;

export const ownershipControls = new aws.s3.BucketOwnershipControls(
    `${config.stack}-ownership-controls`,
    {
        bucket: bucketName,
        rule: {
            objectOwnership: 'ObjectWriter',
        },
    },
    config.defaultProvider,
);

export const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(
    `${config.stack}-public-access-block`,
    {
        bucket: bucketName,
        blockPublicAcls: false,
    },
    config.defaultProvider,
);
