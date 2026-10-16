const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'AgroMinds - Smart Agriculture Platform API',
    version: '1.0.0',
    description:
      'Backend REST API for AgroMinds: AI-assisted crop advisory, agricultural knowledge base, user profiles, and test-mode Razorpay payment integration.',
    contact: {
      name: 'Northcorp Software Engineering Team',
      email: 'support@agrominds.local'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide your Supabase JWT or development test token (e.g. demo_token)'
      }
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          timestamp: { type: 'string', example: '2026-10-16T15:00:00.000Z' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Detailed error explanation' },
          timestamp: { type: 'string', example: '2026-10-16T15:00:00.000Z' }
        }
      },
      AskAssistantRequest: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: {
            type: 'string',
            example: 'What is the ideal first irrigation schedule for wheat in alluvial soil?',
            maxLength: 1500
          },
          context: {
            type: 'object',
            properties: {
              crop: { type: 'string', example: 'Wheat' },
              soil: { type: 'string', example: 'Alluvial Loam' },
              location: { type: 'string', example: 'Haryana, India' },
              growingStage: { type: 'string', example: 'Crown Root Initiation (21 DAS)' }
            }
          },
          conversationId: {
            type: 'string',
            example: 'conv-demo-1'
          }
        }
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['planTier'],
        properties: {
          planTier: {
            type: 'string',
            enum: ['pro_agronomist', 'expert_soil_kit', 'enterprise_farm'],
            example: 'pro_agronomist'
          },
          notes: {
            type: 'object',
            example: { farmLocation: 'Karnal, Haryana' }
          }
        }
      },
      VerifyPaymentRequest: {
        type: 'object',
        required: ['orderId', 'paymentId'],
        properties: {
          orderId: { type: 'string', example: 'order_sim_123456' },
          paymentId: { type: 'string', example: 'pay_sim_789101' },
          signature: { type: 'string', example: '9a8b7c6d5e4f3a2b1c' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'System Health Check',
        description: 'Returns backend operational status, uptime, and integration readiness.',
        tags: ['System'],
        responses: {
          200: {
            description: 'System is healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
          }
        }
      }
    },
    '/agriculture/categories': {
      get: {
        summary: 'List Agricultural Topics',
        description: 'Retrieves knowledge categories (crops, soil, irrigation, pests, seasonal, practices).',
        tags: ['Agriculture Knowledge'],
        responses: {
          200: {
            description: 'Categories retrieved successfully'
          }
        }
      }
    },
    '/agriculture/records': {
      get: {
        summary: 'Search Agricultural Knowledge',
        description: 'Search and filter agricultural knowledge records by category or search term.',
        tags: ['Agriculture Knowledge'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Keyword search in title and summary' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } }
        ],
        responses: {
          200: { description: 'Records retrieved' }
        }
      }
    },
    '/agriculture/records/{slug}': {
      get: {
        summary: 'Get Agricultural Record by Slug',
        tags: ['Agriculture Knowledge'],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'wheat-cultivation-guide' }
        ],
        responses: {
          200: { description: 'Record details retrieved' },
          404: { description: 'Record not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/assistant/ask': {
      post: {
        summary: 'Ask the Agricultural AI Assistant',
        description: 'Sends query to Google Gemini (or designated fallback) with agricultural context.',
        tags: ['AI Assistant'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AskAssistantRequest' } } }
        },
        responses: {
          200: { description: 'Advisory successfully generated' },
          400: { description: 'Invalid prompt input' }
        }
      }
    },
    '/assistant/conversations': {
      get: {
        summary: 'List User Conversations',
        tags: ['AI Assistant'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'List of conversations' },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        summary: 'Create New Conversation Thread',
        tags: ['AI Assistant'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Winter Wheat Strategy' },
                  crop_context: { type: 'string', example: 'Wheat' },
                  soil_context: { type: 'string', example: 'Loam' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Conversation created' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Get Current User Profile',
        tags: ['Authentication & Profile'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Profile retrieved' },
          401: { description: 'Unauthorized' }
        }
      },
      put: {
        summary: 'Update User Profile',
        tags: ['Authentication & Profile'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  full_name: { type: 'string', example: 'Rajesh Kumar' },
                  phone: { type: 'string', example: '+91 98765 43210' },
                  farm_size_acres: { type: 'number', example: 10.5 },
                  primary_crops: { type: 'array', items: { type: 'string' }, example: ['Wheat', 'Mustard'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Profile updated' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/auth/dev-login': {
      post: {
        summary: 'Development Mode Session Helper',
        description: 'Issues demo token for quick local testing when Supabase Auth is unconfigured.',
        tags: ['Authentication & Profile'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'farmer.demo@agrominds.org' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Development session generated' }
        }
      }
    },
    '/payments/plans': {
      get: {
        summary: 'Get Available Service Plans',
        tags: ['Payments (Razorpay)'],
        responses: {
          200: { description: 'Plans list' }
        }
      }
    },
    '/payments/create-order': {
      post: {
        summary: 'Create Razorpay Order',
        tags: ['Payments (Razorpay)'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOrderRequest' } } }
        },
        responses: {
          201: { description: 'Order created' },
          400: { description: 'Invalid plan or options' }
        }
      }
    },
    '/payments/verify': {
      post: {
        summary: 'Verify Razorpay Payment Signature',
        description: 'Validates cryptographic HMAC SHA256 signature to prevent payment tampering.',
        tags: ['Payments (Razorpay)'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyPaymentRequest' } } }
        },
        responses: {
          200: { description: 'Payment verified' },
          400: { description: 'Signature mismatch or validation error' }
        }
      }
    },
    '/payments/history': {
      get: {
        summary: 'Get Payment Transaction History',
        tags: ['Payments (Razorpay)'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Payment logs' },
          401: { description: 'Unauthorized' }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
