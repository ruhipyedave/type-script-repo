export const USERS_TAG = {
    name: "User",
    paths: {
        "/users/profile": {
            get: {
                tags: ['User'],
                description: "Get logged in users profile",
                operationId: 'Get User Profile',
                security: [
                    {
                        bearerAuth: ["token"]
                    }
                ],
                responses: {
                    "200": {
                        description: "Return created account details.",
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
                                                _id: {
                                                    type: "string",
                                                    example: "5f0163bd3d51b727e790c0ba"
                                                },
                                                name: {
                                                    type: "string",
                                                    example: "One Customer"
                                                },
                                                phone: {
                                                    type: "string",
                                                    example: "999999999"
                                                },
                                                email: {
                                                    type: "string",
                                                    example: "ruhi@customer.com"
                                                },
                                                role: {
                                                    type: "number",
                                                    example: 3
                                                },
                                                status: {
                                                    type: "number",
                                                    example: 2
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
        },
        "/users": {
            get: {
                tags: ['User'],
                description: "List users - only staff can view list of users",
                operationId: 'List customers',
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
                        description: "Number of Deployments",
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
                                            items: {
                                                _id: {
                                                    type: "string",
                                                    example: "5f0163bd3d51b727e790c0ba"
                                                },
                                                name: {
                                                    type: "string",
                                                    example: "One Customer"
                                                },
                                                phone: {
                                                    type: "string",
                                                    example: "999999999"
                                                },
                                                email: {
                                                    type: "string",
                                                    example: "ruhi@customer.com"
                                                },
                                                role: {
                                                    type: "number",
                                                    example: 3
                                                },
                                                status: {
                                                    type: "number",
                                                    example: 2
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


