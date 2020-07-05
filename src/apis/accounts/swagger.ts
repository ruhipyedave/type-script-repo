
import { ACCOUNT } from "../accounts/model";
const accountSchema = {
    type: "object",
    properties: {
        user: {
            type: "string",
            example: "5f0163bd3d51b727e790c0ba",
        },
        balance: {
            type: "number",
            example: 0,
        },
        type: {
            type: "number",
            example: ACCOUNT.type.current,
        },
        status: {
            type: "number",
            example: ACCOUNT.status.active,
        },
        createdBy: {
            type: "staing",
            example: "5f01ee9f57f619750d4a852f",
        },
        updatedBy: {
            type: "staing",
            example: "5f01ee9f57f619750d4a852f",
        },
        transactionInProgress: {
            type: "boolean",
            example: false,
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

export const ACCOUNTS_TAG = {
    name: "Account",
    paths: {
        "/accounts": {
            post: {
                tags: ['Account'],
                description: "Create Account API",
                operationId: 'Create Account',
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
                                    email: {
                                        type: 'string',
                                        description: 'Users id.',
                                        required: false,
                                        example: "ruhi@customer.com"
                                    },
                                    // balance: {
                                    //     type: 'number',
                                    //     description: 'Amount in rupees',
                                    //     required: false,
                                    //     example: 1000
                                    // },
                                    type: {
                                        type: 'number',
                                        description: 'Account type',
                                        required: true,
                                        example: 1
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
                                            type: "array",
                                            items: accountSchema,
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
            },
            get: {
                tags: ['Account'],
                description: "List accounts",
                operationId: 'List accounts',
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
                        description: "Number of accounts",
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
                        example: `type:${ACCOUNT.type.current}`
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
                                            items: accountSchema
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
        "/accounts/{id}": {
            patch: {
                tags: ['Account'],
                description: "Accept or reject or delete account application. send email notification to customer if account is deleted.",
                operationId: 'Change Status accounts',
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
                        description: "Account id",
                        type: "number",
                        example: "5f01ee9f57f619750d4a8530"
                    }
                ],
                requestBody: {
                    description: "Account payload, status 2 - activate, 3 - reject, 4 - delete account",
                    required: true,
                    content: {
                        "application/json": {
                            schema:
                            {
                                type: "object",
                                properties: {
                                    status: {
                                        type: 'number',
                                        description: 'Account status',
                                        required: true,
                                        example: ACCOUNT.status.active
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Return success message.",
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
                                                message: {
                                                    type: "string",
                                                    example: "Account activated accessfully."
                                                }
                                            }
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
            get: {
                tags: ['Account'],
                description: "Get account details by id.",
                operationId: 'Fet Account by id',
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
                        description: "Account id",
                        type: "number",
                        example: "5f01ee9f57f619750d4a8530"
                    }
                ],
                responses: {
                    "200": {
                        description: "Return success message.",
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
                                            properties: accountSchema.properties
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