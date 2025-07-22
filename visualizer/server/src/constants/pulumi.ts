// This file consolidates Pulumi code from multiple files into a single string variable.

export const pulumiCode = `
// Sample Pulumi code for a complex architecture

// 1. Define a VPC
const vpc = new awsx.ec2.Vpc("my-vpc", {
  cidrBlock: "10.0.0.0/16",
  numberOfAvailabilityZones: 2,
  subnets: [
    { type: "public", name: "public" },
    { type: "private", name: "private" },
  ],
});

// 2. Create an EKS Cluster
const cluster = new awsx.eks.Cluster("my-cluster", {
  vpcId: vpc.vpcId,
  publicSubnetIds: vpc.publicSubnetIds,
  privateSubnetIds: vpc.privateSubnetIds,
  instanceType: "t3.medium",
  desiredCapacity: 2,
  minSize: 1,
  maxSize: 3,
});

// 3. Deploy a Kubernetes Deployment
const appLabels = { app: "my-app" };
const deployment = new k8s.apps.v1.Deployment("my-deployment", {
  metadata: { labels: appLabels },
  spec: {
    replicas: 2,
    selector: { matchLabels: appLabels },
    template: {
      metadata: { labels: appLabels },
      spec: {
        containers: [
          {
            name: "my-app",
            image: "nginx:latest",
            ports: [{ containerPort: 80 }],
          },
        ],
      },
    },
  },
}, { provider: cluster.provider });

// 4. Expose the Deployment via a Service
const service = new k8s.core.v1.Service("my-service", {
  metadata: { labels: appLabels },
  spec: {
    type: "LoadBalancer",
    ports: [{ port: 80, targetPort: 80 }],
    selector: appLabels,
  },
}, { provider: cluster.provider });

// 5. Output the Service URL
export const serviceUrl = service.status.loadBalancer.ingress[0].hostname;

// Additional Pulumi code for another component

// 6. Create an RDS Instance
const subnetGroup = new aws.rds.SubnetGroup("my-subnet-group", {
  subnetIds: vpc.privateSubnetIds,
  tags: {
    Name: "my-db-subnet-group",
  },
});

const dbInstance = new aws.rds.Instance("my-db", {
  engine: "mysql",
  instanceClass: "db.t3.micro",
  allocatedStorage: 20,
  dbName: "myappdb",
  username: "admin",
  password: "password123",
  skipFinalSnapshot: true,
  dbSubnetGroupName: subnetGroup.name,
  vpcSecurityGroupIds: [dbSecurityGroup.id],
});

// 7. Create a Security Group for RDS
const dbSecurityGroup = new aws.ec2.SecurityGroup("db-sg", {
  vpcId: vpc.vpcId,
  description: "Security group for RDS",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 3306,
      toPort: 3306,
      cidrBlocks: ["10.0.0.0/16"],
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
});

// 8. Output the Database Endpoint
export const dbEndpoint = dbInstance.endpoint;
`;
