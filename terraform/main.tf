terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  cloud {
    organization = "taonze"

    workspaces {
      name = "ta-onze"
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

resource "aws_dynamodb_table" "ta-onze-playlist" {
  name         = "TaOnzePlaylists"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "createdAt"


  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "createdAt"
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
  range_key    = "display_name"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "display_name"
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

resource "aws_lambda_event_source_mapping" "ta-onze-contributors-event" {
  event_source_arn = aws_sqs_queue.ta-onze-update-contributors-queue.arn
  enabled          = true
  function_name    = aws_lambda_function.ta-onze-contributors-process-lambda.function_name
  batch_size       = 1
}

//LAMBDA

data "aws_iam_policy_document" "ses_bounces_lambda_role_iam_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ta-onze-labmda-role" {
  name               = "TaOnzeLambdaRole"
  assume_role_policy = data.aws_iam_policy_document.ses_bounces_lambda_role_iam_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_sqs_role_policy" {
  role       = aws_iam_role.ta-onze-labmda-role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

resource "aws_lambda_function" "ta-onze-contributors-process-lambda" {
  function_name = "processContributorProfile"
  s3_bucket     = aws_s3_bucket.ta-onze-lambdas.bucket
  s3_key        = "processContributorProfile.js.zip"
  role          = aws_iam_role.ta-onze-labmda-role.arn
  handler       = "processContributorProfile.handler"

  runtime = "nodejs14.x"
}
