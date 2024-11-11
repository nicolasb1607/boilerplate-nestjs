import * as aws from '@pulumi/aws';
import * as tls from '@pulumi/tls';
import * as config from './config';
import * as vpc from './vpc';

export const ami = aws.ec2.getAmiOutput({
    filters: [
        {
            name: 'name',
            values: ['amzn2-ami-hvm-*-x86_64-gp2'],
        },
    ],
    owners: ['amazon'],
    mostRecent: true,
});

export const sshKey = new tls.PrivateKey(
    `${config.stack}-bastion-key`,
    {
        algorithm: 'RSA',
        rsaBits: 4096,
    },
    config.defaultProvider,
);

export const publicKey = sshKey.publicKeyOpenssh;

export const ec2KeyPair = new aws.ec2.KeyPair(
    `${config.stack}-bastion-key-pair`,
    {
        publicKey: publicKey,
    },
    config.defaultProvider,
);

export const securityGroupBastion = new aws.ec2.SecurityGroup(
    `${config.stack}-bastion-sg`,
    {
        description: 'Security group for Bastion SSH connection',
        vpcId: vpc.vpcStaging.id,
        ingress: [
            {
                protocol: 'tcp',
                fromPort: 22,
                toPort: 22,
                cidrBlocks: ['0.0.0.0/0'],
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
        tags: { Name: `${config.stack}-bastion-sg` },
    },
    config.defaultProvider,
);

export const bastionEc2 = new aws.ec2.Instance(
    `${config.stack}-bastion-ec2`,
    {
        instanceType: aws.ec2.InstanceType.T2_Micro,
        ami: ami.id,
        subnetId: vpc.publicSubnet1.id,
        vpcSecurityGroupIds: [securityGroupBastion.id],
        associatePublicIpAddress: true,
        tags: {
            Name: `${config.stack}-bastion-ec2`,
        },
        keyName: ec2KeyPair.keyName,
        userData: `#!/bin/bash
			mkdir -p /home/ec2-user/.ssh
			chmod 700 /home/ec2-user/.ssh
			touch /home/ec2-user/.ssh/authorized_keys
			chmod 600 /home/ec2-user/.ssh/authorized_keys
			chown -R ec2-user:ec2-user /home/ec2-user/.ssh
			echo '${publicKey}' >> /home/ec2-user/.ssh/authorized_keys
			`,
    },
    config.defaultProvider,
);
