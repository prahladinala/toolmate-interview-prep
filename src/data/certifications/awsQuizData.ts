import { JutroQuestion } from "../jutroQuizData"

export const awsCertificationQuestions: JutroQuestion[] = [
  {
    id: "aws-1",
    question: "A company requires an object storage solution with 99.999999999% (11 9's) durability and immediate access, but objects are accessed infrequently after 30 days. Which Amazon S3 storage class offers the most cost-effective tier?",
    options: [
      "Amazon S3 Standard",
      "Amazon S3 Standard-Infrequent Access (S3 Standard-IA)",
      "Amazon S3 Glacier Flexible Retrieval",
      "Amazon S3 One Zone-IA"
    ],
    answer: [1],
    category: "Storage & Data Persistence",
    explanation: "S3 Standard-IA is designed for data that is accessed less frequently, but requires rapid access when needed, maintaining 11 9's durability across multiple AZs at a lower storage price per GB than S3 Standard.",
    isMultiSelect: false
  },
  {
    id: "aws-2",
    question: "Which of the following services provide automated multi-Region active-active database replication with single-digit millisecond latency?",
    options: [
      "Amazon DynamoDB Global Tables",
      "Amazon RDS Read Replicas",
      "Amazon DocumentDB Global Clusters",
      "Amazon Aurora Multi-Master"
    ],
    answer: [0],
    category: "Databases & Caching",
    explanation: "Amazon DynamoDB Global Tables provide fully managed, multi-Region, active-active replication with single-digit millisecond latency worldwide.",
    isMultiSelect: false
  },
  {
    id: "aws-3",
    question: "A Solutions Architect needs to protect a public-facing web application against Distributed Denial of Service (DDoS) attacks at Layers 3, 4, and 7. Which AWS services should be combined? (Select two)",
    options: [
      "AWS Shield Advanced",
      "AWS WAF",
      "Amazon GuardDuty",
      "AWS Secrets Manager",
      "Amazon Inspector"
    ],
    answer: [0, 1],
    category: "Security & Compliance",
    explanation: "AWS Shield Advanced provides comprehensive protection against Layer 3/4 DDoS attacks, while AWS WAF defends against Layer 7 web application exploits (SQL injection, XSS, HTTP flood).",
    isMultiSelect: true
  },
  {
    id: "aws-4",
    question: "An application requires serverless compute with execution duration up to 15 minutes and automated scaling from zero to thousands of concurrent requests. Which service should you choose?",
    options: [
      "AWS Lambda",
      "AWS Fargate with Amazon ECS",
      "Amazon EC2 Auto Scaling",
      "AWS Batch"
    ],
    answer: [0],
    category: "Compute & Serverless",
    explanation: "AWS Lambda executes code in response to triggers, automatically scales from zero, charges only for consumed compute time, and supports execution timeouts up to 15 minutes.",
    isMultiSelect: false
  },
  {
    id: "aws-5",
    question: "Which AWS networking component allows instances in a private subnet to securely initiate outbound traffic to the internet while preventing inbound connections from the internet?",
    options: [
      "NAT Gateway",
      "Internet Gateway",
      "VPC Peering Connection",
      "Transit Gateway"
    ],
    answer: [0],
    category: "Networking & VPC",
    explanation: "A NAT (Network Address Translation) Gateway located in a public subnet allows instances in private subnets to download updates or reach external APIs while blocking unsolicited inbound connections.",
    isMultiSelect: false
  },
  {
    id: "aws-6",
    question: "Which IAM entity should be attached to an Amazon EC2 instance to grant it temporary credentials to read from an Amazon S3 bucket without storing hardcoded API keys?",
    options: [
      "IAM Role with an Instance Profile",
      "IAM User Access Keys stored in instance user-data",
      "IAM Group Policy",
      "Root Account Credentials"
    ],
    answer: [0],
    category: "Security & Compliance",
    explanation: "Attaching an IAM Role via an Instance Profile to the EC2 instance allows AWS STS to issue rotating temporary credentials automatically via the instance metadata service (IMDSv2).",
    isMultiSelect: false
  },
  {
    id: "aws-7",
    question: "A decoupled distributed system processes order payments. If a worker component fails, the message must not be lost and must be retried. Which service provides message queuing with FIFO and Dead Letter Queue (DLQ) support?",
    options: [
      "Amazon SQS (Simple Queue Service)",
      "Amazon SNS (Simple Notification Service)",
      "Amazon Kinesis Data Firehose",
      "Amazon EventBridge"
    ],
    answer: [0],
    category: "Messaging & Integration",
    explanation: "Amazon SQS is a fully managed message queuing service offering standard and FIFO queues with visibility timeouts, retention up to 14 days, and Dead Letter Queues for failed deliveries.",
    isMultiSelect: false
  },
  {
    id: "aws-8",
    question: "Which of the following routing policies in Amazon Route 53 routes user traffic to the AWS Region that provides the lowest network latency for that specific user?",
    options: [
      "Latency Routing",
      "Geolocation Routing",
      "Geoproximity Routing",
      "Weighted Routing"
    ],
    answer: [0],
    category: "Networking & VPC",
    explanation: "Amazon Route 53 Latency-based routing dynamically directs DNS queries to the AWS Region that gives the user the fastest response based on real-time network latency measurements.",
    isMultiSelect: false
  },
  {
    id: "aws-9",
    question: "When deploying a high-availability relational database on Amazon RDS Multi-AZ, how is replication between the primary and standby instance handled?",
    options: [
      "Synchronous physical replication across Availability Zones",
      "Asynchronous logical replication via binary logs",
      "Snapshot restoration on failure",
      "Manual failover trigger required"
    ],
    answer: [0],
    category: "Databases & Caching",
    explanation: "Amazon RDS Multi-AZ deployments use synchronous physical replication to maintain an exact replica in a separate Availability Zone, ensuring zero data loss during an automated failover.",
    isMultiSelect: false
  },
  {
    id: "aws-10",
    question: "Which Well-Architected Framework pillar focuses on structuring cloud workloads to run continuously, withstand disruptions, and recover automatically from failures?",
    options: [
      "Reliability Pillar",
      "Performance Efficiency Pillar",
      "Operational Excellence Pillar",
      "Cost Optimization Pillar"
    ],
    answer: [0],
    category: "Architecture & Well-Architected",
    explanation: "The Reliability pillar encompasses foundational design principles such as automated recovery from failure, testing recovery procedures, and distributed scaling to mitigate single points of failure.",
    isMultiSelect: false
  }
]

export const awsCategories = Array.from(
  new Set(awsCertificationQuestions.map((q) => q.category))
)
