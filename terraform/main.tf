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

resource "aws_dynamodb_table" "ta-onze" {
  name         = "TaOnze"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "ta-onze-status" {
  name         = "TaOnzeInfo"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Key"

  attribute {
    name = "Key"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToLive"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "ta-onze-playlists-analisys" {
  name           = "TaOnzePlaylistsAnalisys"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "PlaylistId"

  attribute {
    name = "PlaylistId"
    type = "S"
  }

  tags = {
    Name        = "ta-onze-playlists-analisys"
    Environment = "production"
  }

}
