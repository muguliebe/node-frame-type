import swaggerJSDoc from 'swagger-jsdoc'
import { getServerConfig } from './server'

const serverConfig = getServerConfig()

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node Frame Type API',
            version: '1.0.0',
            description: 'A comprehensive Node.js TypeScript API framework',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${serverConfig.port}`,
                description: 'Development server',
            },
            {
                url: 'https://api.example.com',
                description: 'Production server',
            },
        ],
        components: {
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Operation success status',
                        },
                        data: {
                            description: 'Response data',
                        },
                        message: {
                            type: 'string',
                            description: 'Response message',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Response timestamp',
                        },
                    },
                    required: ['success', 'timestamp'],
                },
                HealthResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['OK', 'ERROR'],
                            description: 'Health status',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                        },
                        uptime: {
                            type: 'number',
                            description: 'Server uptime in seconds',
                        },
                        version: {
                            type: 'string',
                            description: 'API version',
                        },
                        environment: {
                            type: 'string',
                            description: 'Runtime environment',
                        },
                        services: {
                            type: 'object',
                            properties: {
                                ping: {
                                    type: 'object',
                                    properties: {
                                        msg: {
                                            type: 'string',
                                        },
                                    },
                                },
                                mongodb: {
                                    type: 'boolean',
                                    description: 'MongoDB connection status',
                                },
                                postgresql: {
                                    type: 'boolean',
                                    description: 'PostgreSQL connection status',
                                },
                            },
                        },
                    },
                    required: ['status', 'timestamp', 'uptime', 'version', 'environment', 'services'],
                },
                PingResponse: {
                    type: 'object',
                    properties: {
                        msg: {
                            type: 'string',
                            example: 'pong',
                        },
                    },
                    required: ['msg'],
                },
                SampleInput: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Sample name',
                            example: 'test sample',
                        },
                    },
                    required: ['name'],
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message',
                        },
                        code: {
                            type: 'string',
                            description: 'Error code',
                        },
                    },
                    required: ['message'],
                },
            },
            responses: {
                BadRequest: {
                    description: 'Bad Request',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                InternalServerError: {
                    description: 'Internal Server Error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Health',
                description: 'System health and status endpoints',
            },
            {
                name: 'Ping',
                description: 'Ping and connectivity endpoints',
            },
            {
                name: 'Sample',
                description: 'Sample data operations',
            },
            {
                name: 'Users',
                description: 'User management operations',
            },
        ],
    },
    apis: ['./src/api/**/*.ts', './src/api/v1/**/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec
