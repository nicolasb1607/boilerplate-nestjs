import * as aws from '@pulumi/aws';
import * as config from './config';

//Create VPC
export const vpcStaging = new aws.ec2.Vpc(
    `vpc-${config.stack}`,
    {
        cidrBlock: '10.0.0.0/16',
        tags: {
            Name: `vpc-${config.stack}`,
        },
    },
    config.defaultProvider,
);

//Create an internet Gateway
export const igw = new aws.ec2.InternetGateway(
    `${config.stack}-igw`,
    {
        vpcId: vpcStaging.id,
        tags: {
            Name: `${config.stack}-igw`,
        },
    },
    config.defaultProvider,
);

//Create Subnets
export const publicSubnet1 = new aws.ec2.Subnet(
    `${config.stack}-public-subnet1`,
    {
        vpcId: vpcStaging.id,
        cidrBlock: '10.0.1.0/24',
        availabilityZone: 'eu-west-3a',
        mapPublicIpOnLaunch: true,
        tags: {
            Name: `${config.stack}-public-subnet1`,
            Type: 'Public',
        },
    },
    config.defaultProvider,
);

export const publicSubnet2 = new aws.ec2.Subnet(
    `${config.stack}-public-subnet2`,
    {
        vpcId: vpcStaging.id,
        cidrBlock: '10.0.2.0/24',
        availabilityZone: 'eu-west-3b',
        mapPublicIpOnLaunch: true,
        tags: {
            Name: `${config.stack}-public-subnet2`,
            Type: 'Public',
        },
    },
    config.defaultProvider,
);

export const privateSubnet1 = new aws.ec2.Subnet(
    `${config.stack}-private-subnet1`,
    {
        vpcId: vpcStaging.id,
        cidrBlock: '10.0.10.0/24',
        availabilityZone: 'eu-west-3a',
        tags: {
            Name: `${config.stack}-private-subnet1`,
            Type: 'Private',
        },
    },
    config.defaultProvider,
);

export const privateSubnet2 = new aws.ec2.Subnet(
    `${config.stack}-private-subnet2`,
    {
        vpcId: vpcStaging.id,
        cidrBlock: '10.0.11.0/24',
        availabilityZone: 'eu-west-3b',
        tags: {
            Name: `${config.stack}-private-subnet2`,
            Type: 'Private',
        },
    },
    config.defaultProvider,
);

//Create Route Table for Public subnet
export const publicRouteTable = new aws.ec2.RouteTable(
    `${config.stack}-public-rt`,
    {
        vpcId: vpcStaging.id,
        routes: [
            {
                cidrBlock: '0.0.0.0/0',
                gatewayId: igw.id,
            },
        ],
        tags: {
            Name: `${config.stack}-public-rt`,
        },
    },
    config.defaultProvider,
);

//Associate public route table to public subnet
export const publicRtAssoc = new aws.ec2.RouteTableAssociation(
    `${config.stack}-public-rt-association`,
    {
        subnetId: publicSubnet1.id,
        routeTableId: publicRouteTable.id,
    },
    config.defaultProvider,
);
