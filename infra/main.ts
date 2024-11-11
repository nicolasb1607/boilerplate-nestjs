import * as fs from 'fs';
import * as path from 'path';
import * as bastion from './bastion';
import * as ec2 from './ec2';
import * as rds from './rds';
import * as vpc from './vpc';
import * as config from './config';

export const vpcId = vpc.vpcStaging.tags;

//Bastion
export const bastionIp = bastion.bastionEc2.publicIp;
bastion.sshKey.privateKeyPem.apply((privateKey) => {
    const keyPath = path.join(process.cwd(), `${config.stack}-bastion.pem`);
    fs.writeFileSync(keyPath, privateKey);
    fs.chmodSync(keyPath, '600');
    console.log(`Private key saved to: ${keyPath}`);
    return privateKey;
});
export const keyPairPublicKey = bastion.ec2KeyPair.publicKey;

//Ec2 private subnet
export const ec2Ip = ec2.instance.privateIp;

//DB
export const rdsDbName = rds.postgresDB.dbName;
export const rdsUsername = rds.postgresDB.username;
export const rdsPassword = rds.postgresDB.password.apply((password) =>
    console.log(password),
);
