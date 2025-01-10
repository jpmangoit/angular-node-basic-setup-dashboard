const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express APIs',
            version: '1.0.0',
            description: 'APIs for Role Based basic node application',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: []
        }],
        servers: [
            { url: '/api' } 
        ]
    },
    apis: [
        path.join(__dirname, '../modules/**/**/*-route.js'),
    ]
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
