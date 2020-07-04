import { AUTH_TAG } from "../apis/auth/swagger";
export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'APIs Document',
        description: 'Set Up Project',
        termsOfService: '',
        contact: {
            name: 'Ruhi Yedave',
            email: 'ruhipyedave@gmail.com'
        }
    },
    servers: [
        {
            url: `http://localhost:3002/api/v1`,
            description: 'Local Env'
        }
    ],
    components: {
        schemas: {},
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                in: "header",
                name: "Authorization"
            }
        }
    },
    tags: [
        {
            name: AUTH_TAG.name
        }
    ],
    paths: {
        ...AUTH_TAG.paths
    }
}