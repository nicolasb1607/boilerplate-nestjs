import * as aws from '@pulumi/aws';

//Create VPC
export const vpcStaging = new aws.ec2.Vpc('vpc-staging', {
  cidrBlock: '10.0.0.0/16',
  tags: {
    Name: 'vpc-staging',
  },
});

//Create an internet Gateway
export const igw = new aws.ec2.InternetGateway('staging-igw', {
  vpcId: vpcStaging.id,
  tags: {
    Name: 'staging-igw',
  },
});

//Create Subnets
export const publicSubnet1 = new aws.ec2.Subnet('public-subnet1', {
  vpcId: vpcStaging.id,
  cidrBlock: '10.0.1.0/24',
  availabilityZone: 'eu-west-3a',
  mapPublicIpOnLaunch: true,
  tags: {
    Name: 'staging-public-subnet',
    Type: 'Public',
  },
});

export const publicSubnet2 = new aws.ec2.Subnet('public-subnet2', {
  vpcId: vpcStaging.id,
  cidrBlock: '10.0.2.0/24',
  availabilityZone: 'eu-west-3b',
  mapPublicIpOnLaunch: true,
  tags: {
    Name: 'staging-public-subnet',
    Type: 'Public',
  },
});

export const privateSubnet1 = new aws.ec2.Subnet('private-subnet1', {
  vpcId: vpcStaging.id,
  cidrBlock: '10.0.10.0/24',
  availabilityZone: 'eu-west-3a',
  tags: {
    Name: 'staging-private-subnet',
    Type: 'Private',
  },
});

export const privateSubnet2 = new aws.ec2.Subnet('private-subnet2', {
  vpcId: vpcStaging.id,
  cidrBlock: '10.0.11.0/24',
  availabilityZone: 'eu-west-3b',
  tags: {
    Name: 'staging-private-subnet',
    Type: 'Private',
  },
});

//Create Route Table for Public subnet
export const publicRouteTable = new aws.ec2.RouteTable('public-rt', {
  vpcId: vpcStaging.id,
  routes: [
    {
      cidrBlock: '0.0.0.0/0',
      gatewayId: igw.id,
    },
  ],
  tags: {
    Name: 'staging-public-rt',
  },
});

//Associate public route table to public subnet
export const publicRtAssoc = new aws.ec2.RouteTableAssociation(
  'public-rt-association',
  {
    subnetId: publicSubnet1.id,
    routeTableId: publicRouteTable.id,
  },
);
