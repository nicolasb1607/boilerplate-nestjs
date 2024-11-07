import * as aws from '@pulumi/aws';
import * as bastion from './bastion';
import * as vpc from './vpc';

export const securityGroupEc2 = new aws.ec2.SecurityGroup('staging-ec2-sg', {
  description: 'Security group for Staging EC2 instances',
  vpcId: vpc.vpcStaging.id,
  ingress: [
    {
      protocol: 'tcp',
      fromPort: 22,
      toPort: 22,
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
    Name: 'staging-ec2-sg',
  },
});

export const instance = new aws.ec2.Instance('staging-ec2', {
  instanceType: aws.ec2.InstanceType.T2_Micro,
  ami: bastion.ami.id,
  subnetId: vpc.privateSubnet1.id,
  vpcSecurityGroupIds: [securityGroupEc2.id],
  keyName: bastion.ec2KeyPair.keyName,
  tags: {
    Name: 'staging-ec2',
  },
  userData: `#!/bin/bash
mkdir -p /home/ec2-user/.ssh
chmod 700 /home/ec2-user/.ssh
touch /home/ec2-user/.ssh/authorized_keys
chmod 600 /home/ec2-user/.ssh/authorized_keys
chown -R ec2-user:ec2-user /home/ec2-user/.ssh
echo '${bastion.publicKey}' >> /home/ec2-user/.ssh/authorized_keys
`,
});

//Create a Nat Gateway for private subnet $0.05/hour

//const eip = new Eip('nat-eip', {
//  tags: {
//    Name: 'staging-nat-eip'
//  }
//})
//const ngw = new NatGateway('nat-gateway',
//  {
//    allocationId: eip.id,
//    subnetId: publicSubnet.id,
//    tags: {
//      Name: 'staging-nat',
//    }
//  }
//)

//const privateRouteTable = new RouteTable('private-rt', {
//  vpcId: vpcStaging.id,
//  routes: [
//    {
//      cidrBlock: '0.0.0.0/0',
//      natGatewayId: ngw.id,
//    },
//  ],
//  tags: {
//    Name: 'staging-private-rt',
//  }
//})
