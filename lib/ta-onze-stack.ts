import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class MyProjectStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new dynamodb.Table(this, "TaOnze", {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING,
            },
            tableName: "TaOnze",
        });
    }
}
