
import { TRANSACTION } from "../transactions/model";
const transactionSchema = {
    type: "object",
    properties: {
        account: {
            type: "string",
            example: "5f0163bd3d51b727e790c0ba",
        },
        amount: {
            type: "number",
            example: 0,
        },
        type: {
            type: "number",
            example: TRANSACTION.type.credit,
        },
        status: {
            type: "number",
            example: TRANSACTION.status.success,
        },
        createdBy: {
            type: "staing",
            example: "5f01ee9f57f619750d4a852f",
        },
        updatedBy: {
            type: "staing",
            example: "5f01ee9f57f619750d4a852f",
        },
        _id: {
            type: "staing",
            example: "5f01ee9f57f619750d4a8530",
        },
        createdAt: {
            type: "staing",
            example: "2020-07-05T15:15:43.465Z",
        },
        updatedAt: {
            type: "staing",
            example: "2020-07-05T15:15:43.465Z",
        }
    },
}

export const TRANSACTIONS_TAG = {
    name: "Transaction",
    paths: {
        "/transactions": {
            post: {
                tags: ['Transaction'],
                description: "Create Transaction, mode is credit or debit, debit can be done by only customer, send email notification to customer after money is deducted",
                operationId: 'Create Transaction',
                security: [
                    {
                        bearerAuth: ["token"]
                    }
                ],
                requestBody: {
                    description: "Account payload",
                    required: true,
                    content: {
                        "application/json": {
                            schema:
                            {
                                type: "object",
                                properties: {
                                    accId: {
                                        type: 'string',
                                        description: 'Users id.',
                                        required: true,
                                        example: "5f0163bd3d51b727e790c0ba"
                                    },
                                    amount: {
                                        type: 'number',
                                        description: 'Amount in rupees',
                                        required: true,
                                        example: 1000
                                    },
                                    mode: {
                                        type: 'number',
                                        description: 'Transaction type',
                                        required: true,
                                        example: TRANSACTION.type.credit
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Retuen created account details.",
                        content: {
                            "application/json": {
                                schema:
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolen",
                                            example: true
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                message: "Transaction processed successfully."
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Transaction'],
                description: "List transactions",
                operationId: 'List transactions',
                security: [
                    {
                        bearerAuth: ["token"]
                    }
                ],
                parameters: [
                    {
                        name: "limit",
                        in: "query",
                        required: true,
                        description: "Number of rows",
                        type: "number",
                        example: 10
                    },
                    {
                        name: "offset",
                        in: "query",
                        required: true,
                        description: "Number of entries to skip",
                        type: "number",
                        example: 1
                    },
                    {
                        name: "filter",
                        in: "query",
                        required: true,
                        description: "multiple filters, key:value,key1:val2",
                        type: "number",
                        example: `type:${TRANSACTION.type.credit}`
                    }
                ],
                responses: {
                    "200": {
                        description: "Return customer list.",
                        content: {
                            "application/json": {
                                schema:
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolen",
                                            example: true
                                        },
                                        data: {
                                            type: "array",
                                            items: transactionSchema
                                        },
                                        count: {
                                            type: "number",
                                            example: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        "/transactions/{id}": {
            get: {
                tags: ['Transaction'],
                description: "Get Trsansaction details by id.",
                operationId: 'Get Trsansaction by id',
                security: [
                    {
                        bearerAuth: ["token"]
                    }
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Transaction id",
                        type: "number",
                        example: "5f01ee9f57f619750d4a8530"
                    }
                ],
                responses: {
                    "200": {
                        description: "Return trsansaction object.",
                        content: {
                            "application/json": {
                                schema:
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolen",
                                            example: true
                                        },
                                        data: {
                                            type: "object",
                                            properties: transactionSchema.properties
                                        },
                                        count: {
                                            type: "number",
                                            example: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}