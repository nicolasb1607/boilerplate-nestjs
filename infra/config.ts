import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as dotenv from 'dotenv';

//Configure Environment
export const stack = pulumi.getStack();
dotenv.config({ path: `../.config/.env.${stack}` });

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION as aws.Region;

export const awsProvider = new aws.Provider('aws', {
    accessKey: awsAccessKeyId,
    secretKey: awsSecretAccessKey,
    region: awsRegion,
});

export const defaultProvider = { provider: awsProvider };
