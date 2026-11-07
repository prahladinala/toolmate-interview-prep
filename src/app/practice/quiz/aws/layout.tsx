import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AWS Certified Solutions Architect & Cloud Practitioner Exam | ToolMate",
  description:
    "Proctored AWS certification practice test covering EC2, S3, RDS Multi-AZ, DynamoDB Global Tables, VPC, IAM, and the Well-Architected Framework.",
  alternates: {
    canonical: "/practice/quiz/aws",
  },
}

export default function AwsQuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
