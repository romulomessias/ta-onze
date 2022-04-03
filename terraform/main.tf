terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  profile = "TaOnze"
  region  = "us-east-1"
}

//DYNAMO
resource "aws_dynamodb_table" "ta-onze" {
  name         = "TaOnze"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "ta-onze-info" {
  name         = "TaOnzeInfo"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "key"

  attribute {
    name = "key"
    type = "S"
  }

  ttl {
    attribute_name = "timeToLive"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "ta-onze-playlists-analisys" {
  name           = "TaOnzePlaylistsAnalisys"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "playlistId"

  attribute {
    name = "playlistId"
    type = "S"
  }

  tags = {
    Name        = "ta-onze-playlists-analisys"
    Environment = "production"
  }

}

resource "aws_dynamodb_table" "ta-onze-contributors" {
  name         = "TaOnzeContributors"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "ta-onze-playlists-analisys"
    Environment = "production"
  }

}

// S3
resource "aws_s3_bucket" "ta-onze-lambdas" {
  bucket = "ta-onze.lambdas"
  acl    = "public-read"
  policy = file("policies/s3.policy.json")

  # force_destroy = true
  tags = {
    Environment = "production"
  }
  cors_rule {
    allowed_headers = ["Authorization", "Content-Length"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

//SQS
resource "aws_sqs_queue" "ta-onze-update-contributors-queue" {
  name                        = "TaOnzeUpdateContributorsQueue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
}

//LAMBDA

resource "aws_iam_role" "ta-onze-iam-lambda" {
  name               = "TaOnzeIamLambda"
  assume_role_policy = file("policies/lambda.policy.json")
}

resource "aws_iam_role" "ta-onze-iam-role" {
  name               = "TaOnzeIamRole"
  assume_role_policy = file("roles/lambda.role.json")
}

resource "aws_lambda_function" "ta-onze-contributors-process-lambda" {
  function_name = "processContributorProfile"
  s3_bucket     = aws_s3_bucket.ta-onze-lambdas.bucket
  s3_key        = "processContributorProfile.js.zip"
  role          = aws_iam_role.ta-onze-iam-role.arn
  handler       = "processContributorProfile.handler"

  runtime = "nodejs14.x"
}
