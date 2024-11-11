import * as aws from '@pulumi/aws';
import * as bastion from './bastion';
import * as config from './config';
import * as vpc from './vpc';

export const rdsSecurityGroup = new aws.ec2.SecurityGroup(
    `${config.stack}-rds-sg`,
    {
        vpcId: vpc.vpcStaging.id,
        description: 'Allow database access only within the bastion host',
        ingress: [
            {
                protocol: 'tcp',
                fromPort: 5432,
                toPort: 5432,
                securityGroups: [bastion.securityGroupBastion.id],
            },
        ],
        egress: [
            {
                protocol: '-1',
                fromPort: 0,
                toPort: 0,
                cidrBlocks: ['0.0.0.0/0'],
            },
        ],
        tags: {
            Name: `${config.stack}-rds-sg`,
        },
    },
    config.defaultProvider,
);

export const rdsSubnetGroup = new aws.rds.SubnetGroup(
    `${config.stack}-db-subnet-group`,
    {
        subnetIds: [vpc.privateSubnet1.id, vpc.privateSubnet2.id],
        tags: {
            Name: `${config.stack}-db-subnet-group`,
        },
    },
    config.defaultProvider,
);

export const postgresDB = new aws.rds.Instance(
    `${config.stack}-db`,
    {
        engine: 'postgres',
        engineVersion: '16.4',
        instanceClass: aws.rds.InstanceType.T3_Micro,
        allocatedStorage: 20,
        storageType: 'gp2',
        dbName: `${config.stack}Db`,
        username: `${config.stack}User`,
        password: `${config.stack}Password`,
        skipFinalSnapshot: true,
        dbSubnetGroupName: rdsSubnetGroup.name,
        vpcSecurityGroupIds: [rdsSecurityGroup.id],
        publiclyAccessible: false,
        tags: {
            Name: `${config.stack}-db`,
        },
    },
    config.defaultProvider,
);
