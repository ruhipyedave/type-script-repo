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
                                    userId: {
                                        type: 'string',
                                        description: 'Users id.',
                                        required: false,
                                        example: "5f008cef72cda66569e45e46"
                                    },
                                    balance: {
                                        type: 'number',
                                        description: 'Amount in rupees',
                                        required: false,
                                        example: 1000
                                    },
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
                                            type: "object",
                                            properties: {
                                                userId: {
                                                    type: "string",
                                                    example: "5f008cef72cda66569e45e46"
                                                },
                                                balance: {
                                                    type: "number",
                                                    example: 1000
                                                },
                                                type: {
                                                    type: "number",
                                                    example: 1
                                                },
                                                status: {
                                                    type: "number",
                                                    example: 1
                                                },
                                                createdBy: {
                                                    type: "string",
                                                    example: "5f008cef72cda66569e45e46"
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
            }
        }
    }
}





