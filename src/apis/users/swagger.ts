import { USER } from "./model";

const userSchema = {
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
            example: USER.roles.customer
        },
        status: {
            type: "number",
            example: USER.status.active
        }
    }
}

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
                                            properties: userSchema.properties
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
                        description: "Number of users",
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
                        example: `role:${USER.roles.customer},status:${USER.status.active}`
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
                                            items: userSchema
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


