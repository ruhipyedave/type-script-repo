export const createAccount = {
    tags: ['Account'],
    description: "Create Accounnt API",
    operationId: 'Create Accounnt',
    requestBody: {
        description: "Create Accounnt payload",
        required: true,
        content: {
            "application/ json:": {
                schema:
                {
                    type: "object",
                    properties: {
                        email: {
                            type: 'string',
                            description: 'Users email',
                            required: true
                        },
                        password: {
                            type: 'string',
                            description: 'Users password',
                            required: true
                        }
                    }
                }
            }
        }
    },
    responses: {
        "200": {
            description: "Object with auth token",
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
                                    token: {
                                        type: "string",
                                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWYwMDMyYTMyMTYxMTYyOWU0YWI5Nzk4IiwiZXhwIjoxNTkzOTM3ODk5LCJpYXQiOjE1OTM4NTE0OTl9.LUg-oZXQokABKIwyW5Q5DmCc3C2SPAwz8RipGM8CZYM"
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