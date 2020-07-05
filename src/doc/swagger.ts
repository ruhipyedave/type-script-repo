import { AUTH_TAG } from "../apis/auth/swagger";
import { ACCOUNTS_TAG } from "../apis/accounts/swagger";
import { USERS_TAG } from "../apis/users/swagger";
import { TRANSACTIONS_TAG } from "../apis/transactions/swagger";
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
        { name: AUTH_TAG.name },
        { name: ACCOUNTS_TAG.name },
        { name: USERS_TAG.name },
        { name: TRANSACTIONS_TAG.name }
    ],
    paths: {
        ...AUTH_TAG.paths,
        ...ACCOUNTS_TAG.paths,
        ...USERS_TAG.paths,
        ...TRANSACTIONS_TAG.paths
    }
}