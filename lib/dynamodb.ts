import DynamoDB from "aws-sdk/clients/dynamodb";
const client = new DynamoDB.DocumentClient({
    region: 'us-east-1'
});

const dynamoClient = {
    get: (params: DynamoDB.DocumentClient.GetItemInput) =>
        client.get(params).promise(),
    getAll: (params: DynamoDB.DocumentClient.ScanInput) =>
        client.scan(params).promise(),
    put: (params: DynamoDB.DocumentClient.PutItemInput) =>
        client.put(params).promise(),
    query: (params: DynamoDB.DocumentClient.QueryInput) =>
        client.query(params).promise(),
    delete: (params: DynamoDB.DocumentClient.DeleteItemInput) =>
        client.delete(params).promise(),
};

export default dynamoClient;
