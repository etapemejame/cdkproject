import { DeleteItemCommand, DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";



export async function deleteEmpl(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (event.queryStringParameters && ('id' in event.queryStringParameters)) {
        const emplId = event.queryStringParameters['id']!;

        const deleteItemResponse = await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': { S: emplId }
            },
            ReturnValues: "ALL_OLD"
        }))
        
        if (deleteItemResponse.Attributes) {
            const unmashalledItem = unmarshall(deleteItemResponse.Attributes)
            console.log({
                statusCode: 200,
                body: JSON.stringify(unmashalledItem)}
            )
            return {
                statusCode: 200,
                body: JSON.stringify(unmashalledItem)
            }
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify('something is wrong!')
    }
}