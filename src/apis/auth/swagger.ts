const logIn = {
    post: {
        tags: ['Auth'],
        description: "login API",
        operationId: 'logIn',
        requestBody: {
            description: "Login payload",
            required: true,
            content: {
                "application/json": {
                    schema:
                    {
                        type: "object",
                        properties: {
                            email: {
                                type: 'string',
                                description: 'Users email',
                                required: true,
                                example: "one@staff.com"
                            },
                            password: {
                                type: 'string',
                                description: 'Users password',
                                required: true,
                                example: "one@staff"
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
            },
            "400": {
                description: "Error",
                content: {
                    "application/json": {
                        schema:
                        {
                            type: "object",
                            properties: {
                                success: {
                                    type: "false",
                                    example: true
                                },
                                code: {
                                    type: "number",
                                    example: 400
                                },
                                error: {
                                    type: "object",
                                    properties: {
                                        key: {
                                            type: "string",
                                            example: "10003"
                                        },
                                        message: {
                                            type: "string",
                                            example: "Invalid login credentials."
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

const signUp = {
    post: {
        tags: ['Auth'],
        description: "Signup API",
        operationId: 'signup',
        requestBody: {
            description: "sign up payload",
            required: true,
            content: {
                "application/json": {
                    schema:
                    {
                        type: "object",
                        properties: {
                            email: {
                                type: 'string',
                                description: 'Users email',
                                required: true,
                                example: "one@customer.com"
                            },
                            password: {
                                type: 'string',
                                description: 'Users password',
                                required: true,
                                example: "one@customer"
                            },
                            name: {
                                type: 'string',
                                description: 'User name',
                                required: true,
                                example: "One Customer"
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
                                        message: {
                                            type: "string",
                                            example: "Please check your email inbox to verify your account."
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
            },
            "400": {
                description: "Error object",
                content: {
                    "application/json": {
                        schema:
                        {
                            type: "object",
                            properties: {
                                success: {
                                    type: "boolen",
                                    example: false
                                },
                                code: {
                                    type: "number",
                                    example: 400
                                },
                                error: {
                                    type: "object",
                                    properties: {
                                        key: {
                                            type: "string",
                                            example: "30004"
                                        },
                                        message: {
                                            type: "string",
                                            example: "Please verify your account."
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

const verify = {
    get: {
        tags: ['Auth'],
        description: "Verify user API",
        operationId: 'Verify user',
        parameters: [
            {
                name: "token",
                in: "query",
                required: true,
                description: "verify user token",
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWYwMDkyOGVmYmIwZjU3MjAyZjA3OTIyIiwiZXhwIjoxNTkzODc2NjM5LCJpYXQiOjE1OTM4NzMwMzl9.le61hFDN7qypBX5hp8-nHpcyw4ft_wpw7XTeGmNlo5A"
            },
        ],
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
                                        message: {
                                            type: "string",
                                            example: "Verfication is complete, Please login to start using the application."
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
            },
            "400": {
                description: "Error object",
                content: {
                    "application/json": {
                        schema:
                        {
                            type: "object",
                            properties: {
                                success: {
                                    type: "boolen",
                                    example: false
                                },
                                code: {
                                    type: "number",
                                    example: 400
                                },
                                error: {
                                    type: "object",
                                    properties: {
                                        key: {
                                            type: "string",
                                            example: "10005",
                                        },
                                        message: {
                                            type: "string",
                                            example: "Expired token."
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


export const AUTH_TAG = {
    name: "Auth",
    paths: {
        "/auth/login": logIn,
        "/auth/signup": signUp,
        "/auth/verify": verify
    }
}