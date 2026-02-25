1) 	order.updated
n8n :
```
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "NH-WC-1000",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        -1168,
        352
      ],
      "id": "58c86e69-e001-4379-9ba9-d65a053b93ec",
      "name": "Webhook",
      "webhookId": "e7456000-0def-436a-99c2-5a5bc841198d"
    },
    {
      "parameters": {
        "operation": "update",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "users",
          "mode": "list",
          "cachedResultName": "users"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "email": "={{ $json.email }}",
            "balance": "={{ parseFloat($json.balance) + 1000/$('If sub').item.json.course }} \n"
          },
          "matchingColumns": [
            "email"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": true,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "email",
              "displayName": "email",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "name",
              "displayName": "name",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "role",
              "displayName": "role",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "balance",
              "displayName": "balance",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "deleted",
              "displayName": "deleted",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "boolean",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        1520,
        -368
      ],
      "id": "c19de358-045a-46bb-a442-3baf395aec61",
      "name": "update balance",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "users",
          "mode": "list",
          "cachedResultName": "users"
        },
        "where": {
          "values": [
            {
              "column": "email",
              "value": "={{ $json.body.billing.email }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        1072,
        -176
      ],
      "id": "41b32b75-858f-45b4-b1c9-153b2de52d09",
      "name": "get balance",
      "alwaysOutputData": true,
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const o = $input.first().json.body; \n\nreturn [{\n  json:{\n    orderId: o.id,\n    subId: o.line_items[0].product_id,\n    subEmail: o.billing.email\n  }\n}]"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1072,
        208
      ],
      "id": "15e06227-5383-454d-a543-a7342c7a41de",
      "name": "Get data"
    },
    {
      "parameters": {
        "mode": "combine",
        "combineBy": "combineByPosition",
        "options": {}
      },
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3.1,
      "position": [
        2032,
        192
      ],
      "id": "7c69bab1-7f0d-4a2e-9bc3-cf5f5e28e1de",
      "name": "Merge",
      "executeOnce": false
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://login.neuro-hub.pro/api/update-user",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "id",
              "value": "=neurohub_pro/{{$json.user.name}}"
            },
            {
              "name": "clientId",
              "value": "0a555e3b5c73db782801"
            },
            {
              "name": "clientSecret",
              "value": "5cce4d81f16db49069ba911790aafcfceb1615e9"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{$('New group').item.json.user}}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2400,
        192
      ],
      "id": "1638f0b6-b0b8-487c-9969-966296275700",
      "name": "Update User"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "440a19c1-df2b-4962-b72b-b36a88338ef2",
              "name": "email",
              "value": "={{ $('Map product').item.json.customer.email }}",
              "type": "string"
            },
            {
              "id": "007d5b0b-2755-4377-a6d2-73c06071e8c0",
              "name": "newGroup",
              "value": "={{ $('Map product').item.json.items.productId }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1552,
        208
      ],
      "id": "37ffc027-b0b1-4302-95c8-2ababaaeca86",
      "name": "Input email + group"
    },
    {
      "parameters": {
        "url": "=https://login.neuro-hub.pro/api/get-user",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "email",
              "value": "={{ $json.email }}"
            },
            {
              "name": "clientId",
              "value": "=0a555e3b5c73db782801"
            },
            {
              "name": "clientSecret",
              "value": "5cce4d81f16db49069ba911790aafcfceb1615e9"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1792,
        80
      ],
      "id": "569453f3-cd29-4c3a-890a-7b0df22557cd",
      "name": "Get User"
    },
    {
      "parameters": {
        "jsCode": "const map = { 16: 'neurohub_pro/Standard', 15: 'neurohub_pro/Profi', 13:'neurohub_pro/Start'};\n\nconst SubData = $('Get data').item.json;\nlet selectedId = 13;\nlet newbalance = 0.5;\nif (SubData.subId === 15) {\n  selectedId = 15;\n  newbalance = 1450;\n} \nelse if (SubData.subId === 16) {\n  selectedId = 16;\n  newbalance = 459;\n}\n\nreturn [{\n  json: {\n    customer: { email: SubData.subEmail },\n    items:    { productId: map[ selectedId ], CurBalance: newbalance },\n  },\n}];\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1328,
        208
      ],
      "id": "296d44d5-39e9-493d-8ced-38162ecdbf25",
      "name": "Map product"
    },
    {
      "parameters": {
        "jsCode": "const body = $input.first().json;\nconst user = body.data ?? body;             \nconst newGroup = $input.first().json.newGroup;\nconst ADMIN_GROUP   = 'neurohub_pro/openwebui-admin';\n\nif (!user.displayName || user.displayName.trim() === '') {\n  user.displayName = user.email;\n}\n\nuser.groups = user.groups || [];\nconst hasAdmin = user.groups.includes(ADMIN_GROUP);\nconst newGroups = [];\nif (hasAdmin) newGroups.push(ADMIN_GROUP);\nnewGroups.push(newGroup);\nuser.groups = [...new Set(newGroups)];\n\nreturn [{ json: { user } }];             \n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2224,
        192
      ],
      "id": "6fd71e5e-0f6c-4939-9c32-21fd568a66a7",
      "name": "New group"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "77208f7c-e17e-4c6b-810c-d064b24d7ef9",
              "leftValue": "={{ $('If order complete').item.json.body.line_items[0].product_id }}",
              "rightValue": "={{518}}",
              "operator": {
                "type": "number",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        832,
        32
      ],
      "id": "a5e7a1a4-530d-46bd-a726-944149e8ff87",
      "name": "If sub"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "3c04e22b-456d-4e39-95ec-950e372911e4",
              "leftValue": "={{ $json.body.status }}",
              "rightValue": "completed",
              "operator": {
                "type": "string",
                "operation": "equals",
                "name": "filter.operator.equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        -896,
        352
      ],
      "id": "cf324ae2-179a-4bd6-a698-225890c0246f",
      "name": "If order complete"
    },
    {
      "parameters": {
        "operation": "upsert",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "users",
          "mode": "list",
          "cachedResultName": "users"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "id": "={{ $json.user_id }}",
            "email": "={{ $json.email }}",
            "name": "={{ $json.email }}",
            "balance": "={{ 1000/$('If sub').item.json.course }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": true,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "email",
              "displayName": "email",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false
            },
            {
              "id": "name",
              "displayName": "name",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false
            },
            {
              "id": "role",
              "displayName": "role",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false,
              "removed": true
            },
            {
              "id": "balance",
              "displayName": "balance",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": false
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": false,
              "removed": true
            },
            {
              "id": "deleted",
              "displayName": "deleted",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "boolean",
              "canBeUsedToMatch": false,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        1744,
        -128
      ],
      "id": "64df2a0b-1d75-42a0-8448-213ae74f077a",
      "name": "update balance2",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "neurohub_users",
          "mode": "list",
          "cachedResultName": "neurohub_users"
        },
        "where": {
          "values": [
            {
              "column": "email",
              "value": "={{ $('If sub').item.json.body.billing.email }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        1520,
        -128
      ],
      "id": "13a80488-1790-4f01-8392-84b82c231488",
      "name": "pull user",
      "alwaysOutputData": false,
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "users",
          "mode": "list",
          "cachedResultName": "users"
        },
        "where": {
          "values": [
            {
              "column": "email",
              "value": "={{ $('New group').item.json.user.email }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        2608,
        192
      ],
      "id": "b6b5674c-db56-4c44-9698-9fc9095447d0",
      "name": "if user",
      "alwaysOutputData": true,
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "ac570289-3882-4ddc-bbe5-76ee2c79811a",
              "leftValue": "={{ Object.keys($json).length > 0 }}",
              "rightValue": "=[Object: {}]",
              "operator": {
                "type": "boolean",
                "operation": "true",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        2832,
        192
      ],
      "id": "4803259e-1a49-46a7-b447-ac0f502f9795",
      "name": "If1"
    },
    {
      "parameters": {
        "operation": "update",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "users",
          "mode": "list",
          "cachedResultName": "users"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "email": "={{ $('Map product').item.json.customer.email }}",
            "balance": "={{ ($('Map product').item.json.items.CurBalance)/$('If sub').item.json.course }}"
          },
          "matchingColumns": [
            "email"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": true,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "email",
              "displayName": "email",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "name",
              "displayName": "name",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "role",
              "displayName": "role",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "balance",
              "displayName": "balance",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "deleted",
              "displayName": "deleted",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "boolean",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        3040,
        48
      ],
      "id": "72f8dde8-242f-4525-afc9-a5998b44f524",
      "name": "update group balance",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "neurohub_users",
          "mode": "list",
          "cachedResultName": "neurohub_users"
        },
        "where": {
          "values": [
            {
              "column": "email",
              "value": "={{ $('New group').item.json.user.email }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        3040,
        352
      ],
      "id": "067ab511-9bf5-42ec-aeb3-c678680b8f75",
      "name": "pull user1",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "operation": "upsert",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "users",
          "mode": "list",
          "cachedResultName": "users"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "id": "={{ $json.user_id }}",
            "email": "={{ $json.email }}",
            "name": "={{ $json.email }}",
            "balance": "={{ ($('Map product').item.json.items.CurBalance)/$('If sub').item.json.course }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": true,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "email",
              "displayName": "email",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false
            },
            {
              "id": "name",
              "displayName": "name",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false
            },
            {
              "id": "role",
              "displayName": "role",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false,
              "removed": true
            },
            {
              "id": "balance",
              "displayName": "balance",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": false
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": false,
              "removed": true
            },
            {
              "id": "deleted",
              "displayName": "deleted",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "boolean",
              "canBeUsedToMatch": false,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        3280,
        352
      ],
      "id": "892d9c9f-d2d8-48a0-8660-df762d0742fc",
      "name": "update balance3",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "url": "http://api.exchangerate.host/live?access_key=4a0a08600e4a19759dc06d9aa58bfaa9&source=USD&currencies=RUB&format=1",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        128,
        192
      ],
      "id": "b0da4301-32fb-4903-b2b9-60d5e28f71c9",
      "name": "Get usd course"
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "course_USD2RUB",
          "mode": "list",
          "cachedResultName": "course_USD2RUB"
        },
        "where": {
          "values": [
            {
              "column": "id",
              "value": "1"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -624,
        80
      ],
      "id": "8699cd20-1e38-4155-892a-85122a33f28f",
      "name": "get old course",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "d7fbd71f-ac2f-47b4-80eb-4fe78ecfb47a",
              "leftValue": "={{ $json.are_equal }}",
              "rightValue": "={{ ($('If order complete').item.json.body.date_created.slice(0,1)).toString() }}",
              "operator": {
                "type": "boolean",
                "operation": "true",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        -128,
        32
      ],
      "id": "8b7b04b0-e217-4722-b200-504de9ff9258",
      "name": "If first day order"
    },
    {
      "parameters": {
        "operation": "update",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "course_USD2RUB",
          "mode": "list",
          "cachedResultName": "course_USD2RUB"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "id": 1,
            "usd2rub": "={{ $json.quotes.USDRUB }}",
            "mod_at": "={{ new Date($json.timestamp * 1000).toISOString().slice(0,10) }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true
            },
            {
              "id": "usd2rub",
              "displayName": "usd2rub",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true
            },
            {
              "id": "mod_at",
              "displayName": "mod_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        320,
        192
      ],
      "id": "3cabc64a-f2d4-4722-96ca-8e061ccbe0cc",
      "name": "update course",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "d97e2b3d-7f71-4a5a-9192-15927ae03787",
              "name": "headers",
              "value": "={{ $('If order complete').item.json.headers }}",
              "type": "object"
            },
            {
              "id": "b3901c34-dce9-485f-afc6-fae952825d14",
              "name": "body",
              "value": "={{ $('If order complete').item.json.body }}",
              "type": "object"
            },
            {
              "id": "e418df4b-b433-4e5f-a449-24dc34eba9ff",
              "name": "course",
              "value": "={{ $json.usd2rub }}",
              "type": "number"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        528,
        192
      ],
      "id": "4e65bf9f-fe83-4043-a88f-722a0dcf5ff4",
      "name": "actual order"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "dbae1c14-188b-4718-800c-b760162f54fb",
              "name": "headers",
              "value": "={{ $('If order complete').item.json.headers }}",
              "type": "object"
            },
            {
              "id": "31d0488d-5d26-4851-bfef-79b0d8087cbd",
              "name": "body",
              "value": "={{ $('If order complete').item.json.body }}",
              "type": "object"
            },
            {
              "id": "ef3a07bd-efd0-4fb6-9f91-716fb6cbfaf0",
              "name": "course",
              "value": "={{ $('get old course').item.json.usd2rub }}",
              "type": "number"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        320,
        -160
      ],
      "id": "284c9022-283a-4c2c-956b-32414d260e0e",
      "name": "actual order1"
    },
    {
      "parameters": {
        "jsCode": "return [\n  {\n    json: {\n      mod_at_slice: $json.mod_at.slice(0,10),\n      date_created_slice: $('If order complete').item.json.body.date_created.slice(0,10),\n      are_equal: $json.mod_at.slice(0,10) === $('If order complete').item.json.body.date_created.slice(0,10)\n    }\n  }\n];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -368,
        80
      ],
      "id": "df2867f3-42c9-48e9-a222-06f94b08d2d8",
      "name": "equal?"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "7796bfbd-e9de-4da4-97ab-e5cd593d1b86",
              "leftValue": "={{ Object.keys($json).length > 0 }}",
              "rightValue": "",
              "operator": {
                "type": "boolean",
                "operation": "true",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        1312,
        -176
      ],
      "id": "84d3b2b1-bc84-4990-823b-fc389658bec9",
      "name": "If user id"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "6da655d6-bb10-402c-ab48-bb9c3bdf0717",
              "leftValue": "={{ $json.body.coupon_lines[0].code }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "exists",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        -592,
        496
      ],
      "id": "48c603af-9bf1-4a11-8b29-be308b2ece9d",
      "name": "If coupone"
    },
    {
      "parameters": {
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "coupone users",
          "mode": "list",
          "cachedResultName": "coupone users"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "email": "={{ $('Webhook').item.json.body.billing.email }}",
            "coupone": "={{ $('Webhook').item.json.body.coupon_lines[0].code }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "email",
              "displayName": "email",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "coupone",
              "displayName": "coupone",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -272,
        496
      ],
      "id": "cd8a30cc-42d6-4c1d-83ec-08d625f418f9",
      "name": "update balance4",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "If order complete",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "update balance": {
      "main": [
        []
      ]
    },
    "get balance": {
      "main": [
        [
          {
            "node": "If user id",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get data": {
      "main": [
        [
          {
            "node": "Map product",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Merge": {
      "main": [
        [
          {
            "node": "New group",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update User": {
      "main": [
        [
          {
            "node": "if user",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Input email + group": {
      "main": [
        [
          {
            "node": "Get User",
            "type": "main",
            "index": 0
          },
          {
            "node": "Merge",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Get User": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Map product": {
      "main": [
        [
          {
            "node": "Input email + group",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "New group": {
      "main": [
        [
          {
            "node": "Update User",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If sub": {
      "main": [
        [
          {
            "node": "get balance",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Get data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If order complete": {
      "main": [
        [
          {
            "node": "get old course",
            "type": "main",
            "index": 0
          },
          {
            "node": "If coupone",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    },
    "pull user": {
      "main": [
        [
          {
            "node": "update balance2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "if user": {
      "main": [
        [
          {
            "node": "If1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If1": {
      "main": [
        [
          {
            "node": "update group balance",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "pull user1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "pull user1": {
      "main": [
        [
          {
            "node": "update balance3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get usd course": {
      "main": [
        [
          {
            "node": "update course",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "get old course": {
      "main": [
        [
          {
            "node": "equal?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If first day order": {
      "main": [
        [
          {
            "node": "actual order1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Get usd course",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "update course": {
      "main": [
        [
          {
            "node": "actual order",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "actual order": {
      "main": [
        [
          {
            "node": "If sub",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "actual order1": {
      "main": [
        [
          {
            "node": "If sub",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "equal?": {
      "main": [
        [
          {
            "node": "If first day order",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If user id": {
      "main": [
        [
          {
            "node": "update balance",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "pull user",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If coupone": {
      "main": [
        [
          {
            "node": "update balance4",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "Webhook": [
      {
        "headers": {
          "host": "venturecrew.app.n8n.cloud",
          "user-agent": "WooCommerce/10.2.1 Hookshot (WordPress/6.8.3)",
          "content-length": "3469",
          "accept": "*/*",
          "accept-encoding": "gzip, br",
          "cdn-loop": "cloudflare; loops=1; subreqs=1",
          "cf-connecting-ip": "2a02:4780:8:1118:0:884:c859:1",
          "cf-ew-via": "15",
          "cf-ipcountry": "NL",
          "cf-ray": "99258ca8c18eef9c-AMS",
          "cf-visitor": "{\"scheme\":\"https\"}",
          "cf-worker": "n8n.cloud",
          "content-type": "application/json",
          "x-forwarded-for": "2a02:4780:8:1118:0:884:c859:1, 104.23.166.4",
          "x-forwarded-host": "venturecrew.app.n8n.cloud",
          "x-forwarded-port": "443",
          "x-forwarded-proto": "https",
          "x-forwarded-server": "traefik-prod-users-gwc-9-7bb7d4c57c-flnmz",
          "x-is-trusted": "yes",
          "x-real-ip": "2a02:4780:8:1118:0:884:c859:1",
          "x-wc-webhook-delivery-id": "4a8d4394fa7b1c883747ad86babf922b",
          "x-wc-webhook-event": "updated",
          "x-wc-webhook-id": "16",
          "x-wc-webhook-resource": "order",
          "x-wc-webhook-signature": "4FK9qlcZ6lRhRRZCl5mIVBPVy3Fw4jvbA5aYWrj2ygU=",
          "x-wc-webhook-source": "https://neuro-hub.pro/",
          "x-wc-webhook-topic": "order.updated"
        },
        "params": {},
        "query": {},
        "body": {
          "id": 3080,
          "parent_id": 0,
          "status": "completed",
          "currency": "RUB",
          "version": "10.2.1",
          "prices_include_tax": false,
          "date_created": "2025-10-22T02:25:53",
          "date_modified": "2025-10-22T02:25:54",
          "discount_total": "1450.00",
          "discount_tax": "0.00",
          "shipping_total": "0.00",
          "shipping_tax": "0.00",
          "cart_tax": "0.00",
          "total": "0.00",
          "total_tax": "0.00",
          "customer_id": 1377,
          "order_key": "wc_order_v6AjnrmPEv36b",
          "billing": {
            "first_name": "",
            "last_name": "",
            "company": "",
            "address_1": "",
            "address_2": "",
            "city": "",
            "state": "",
            "postcode": "",
            "country": "RU",
            "email": "cp9@1.com",
            "phone": ""
          },
          "shipping": {
            "first_name": "",
            "last_name": "",
            "company": "",
            "address_1": "",
            "address_2": "",
            "city": "",
            "state": "",
            "postcode": "",
            "country": "RU",
            "phone": ""
          },
          "payment_method": "",
          "payment_method_title": "",
          "transaction_id": "",
          "customer_ip_address": "5.228.112.87",
          "customer_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
          "created_via": "checkout",
          "customer_note": "",
          "date_completed": "2025-10-22T02:25:54",
          "date_paid": "2025-10-22T02:25:54",
          "cart_hash": "126e498fcfa14c8a11c521fe5515410e",
          "number": "3080",
          "meta_data": [
            {
              "id": 8442,
              "key": "_wc_order_attribution_device_type",
              "value": "Desktop"
            },
            {
              "id": 8440,
              "key": "_wc_order_attribution_session_count",
              "value": "1"
            },
            {
              "id": 8437,
              "key": "_wc_order_attribution_session_entry",
              "value": "https://neuro-hub.pro/"
            },
            {
              "id": 8439,
              "key": "_wc_order_attribution_session_pages",
              "value": "4"
            },
            {
              "id": 8438,
              "key": "_wc_order_attribution_session_start_time",
              "value": "2025-10-22 02:25:13"
            },
            {
              "id": 8435,
              "key": "_wc_order_attribution_source_type",
              "value": "typein"
            },
            {
              "id": 8441,
              "key": "_wc_order_attribution_user_agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
            },
            {
              "id": 8436,
              "key": "_wc_order_attribution_utm_source",
              "value": "(direct)"
            },
            {
              "id": 8432,
              "key": "is_vat_exempt",
              "value": "no"
            }
          ],
          "line_items": [
            {
              "id": 469,
              "name": "Профи",
              "product_id": 15,
              "variation_id": 0,
              "quantity": 1,
              "tax_class": "",
              "subtotal": "1450.00",
              "subtotal_tax": "0.00",
              "total": "0.00",
              "total_tax": "0.00",
              "taxes": [],
              "meta_data": [],
              "sku": "NH-PRO",
              "global_unique_id": "",
              "price": 0,
              "image": {
                "id": "",
                "src": ""
              },
              "parent_name": null
            }
          ],
          "tax_lines": [],
          "shipping_lines": [],
          "fee_lines": [],
          "coupon_lines": [
            {
              "id": 470,
              "code": "maombi start",
              "discount": "1450",
              "discount_tax": "0",
              "meta_data": [
                {
                  "id": 4224,
                  "key": "coupon_info",
                  "value": "[3063,\"maombi start\",\"recurring_percent\",100,true]",
                  "display_key": "coupon_info",
                  "display_value": "[3063,\"maombi start\",\"recurring_percent\",100,true]"
                }
              ],
              "discount_type": "recurring_percent",
              "nominal_amount": 100,
              "free_shipping": true
            }
          ],
          "refunds": [],
          "payment_url": "https://neuro-hub.pro/checkout/order-pay/3080/?pay_for_order=true&key=wc_order_v6AjnrmPEv36b",
          "is_editable": false,
          "needs_payment": false,
          "needs_processing": true,
          "date_created_gmt": "2025-10-22T02:25:53",
          "date_modified_gmt": "2025-10-22T02:25:54",
          "date_completed_gmt": "2025-10-22T02:25:54",
          "date_paid_gmt": "2025-10-22T02:25:54",
          "currency_symbol": "₽",
          "_links": {
            "self": [
              {
                "href": "https://neuro-hub.pro/wp-json/wc/v3/orders/3080",
                "targetHints": {
                  "allow": [
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE"
                  ]
                }
              }
            ],
            "collection": [
              {
                "href": "https://neuro-hub.pro/wp-json/wc/v3/orders"
              }
            ],
            "email_templates": [
              {
                "embeddable": true,
                "href": "https://neuro-hub.pro/wp-json/wc/v3/orders/3080/actions/email_templates"
              }
            ],
            "customer": [
              {
                "href": "https://neuro-hub.pro/wp-json/wc/v3/customers/1377"
              }
            ]
          }
        },
        "webhookUrl": "https://venturecrew.app.n8n.cloud/webhook/NH-WC-1000",
        "executionMode": "production"
      }
    ]
  },
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "ccb655d891d6ee232f9fa5f437d19155cbfdcb47ae5b4a52820b3ea8bcdcf403"
  }
}
```
2) 	subscription.updated
n8n :
```
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "453d0f3e-1e93-4431-8389-27fce7be0a04",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        208,
        48
      ],
      "id": "fc5c1355-8017-40d3-8fb0-cf998b4e2cf4",
      "name": "Webhook",
      "webhookId": "453d0f3e-1e93-4431-8389-27fce7be0a04"
    },
    {
      "parameters": {
        "mode": "combine",
        "combineBy": "combineByPosition",
        "options": {}
      },
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3.1,
      "position": [
        1648,
        -144
      ],
      "id": "d69dc330-7797-4699-9784-33a0cf50410e",
      "name": "Merge",
      "executeOnce": false
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://login.neuro-hub.pro/api/update-user",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "id",
              "value": "=neurohub_pro/{{$json.user.name}}"
            },
            {
              "name": "clientId",
              "value": "0a555e3b5c73db782801"
            },
            {
              "name": "clientSecret",
              "value": "5cce4d81f16db49069ba911790aafcfceb1615e9"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{$('New group').item.json.user}}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2032,
        -144
      ],
      "id": "356f9b49-fceb-4bc3-aee7-f0b56a20b470",
      "name": "Update User"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "440a19c1-df2b-4962-b72b-b36a88338ef2",
              "name": "email",
              "value": "={{ $('Map product').item.json.customer.email }}",
              "type": "string"
            },
            {
              "id": "007d5b0b-2755-4377-a6d2-73c06071e8c0",
              "name": "oldGroup",
              "value": "={{ $('Map product').item.json.items.productId }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1168,
        -128
      ],
      "id": "0945e395-cdc9-4374-809f-357aecc32337",
      "name": "Input email + group"
    },
    {
      "parameters": {
        "url": "=https://login.neuro-hub.pro/api/get-user",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "email",
              "value": "={{ $json.email }}"
            },
            {
              "name": "clientId",
              "value": "=0a555e3b5c73db782801"
            },
            {
              "name": "clientSecret",
              "value": "5cce4d81f16db49069ba911790aafcfceb1615e9"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1408,
        -240
      ],
      "id": "72665b70-e1d2-4a25-a883-bce40e5a229b",
      "name": "Get User"
    },
    {
      "parameters": {
        "jsCode": "const map = { 16: 'neurohub_pro/Standard', 15: 'neurohub_pro/Profi', 13:'neurohub_pro/Start'};\n\nconst SubData = $('Get data').item.json;\nlet selectedId = 13;\nlet newbalance = 0.5;\nif (SubData.subId === 15) {\n  selectedId = 15;\n  newbalance = 1450;\n} \nelse if (SubData.subId === 16) {\n  selectedId = 16;\n  newbalance = 459;\n}\n\nreturn [{\n  json: {\n    customer: { email: SubData.subEmail },\n    items:    { productId: map[ selectedId ], CurBalance: newbalance },\n  },\n}];\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        944,
        -128
      ],
      "id": "4c241c0e-0c04-498e-a954-41d1de797d69",
      "name": "Map product"
    },
    {
      "parameters": {
        "jsCode": "const body = $input.first().json;\nconst user = body.data ?? body;             \nconst oldGroup = $input.first().json.oldGroup;\nconst ADMIN_GROUP   = 'neurohub_pro/openwebui-admin';\nconst START_GROUP = 'neurohub_pro/Start';\n\nif (!user.displayName || user.displayName.trim() === '') {\n  user.displayName = user.email;\n}\nuser.groups = user.groups || [];\n\nuser.groups = user.groups.filter(g => g !== oldGroup);\nif (\n  user.groups.length === 0 ||\n  (user.groups.length === 1 && user.groups[0] === ADMIN_GROUP)\n) {\n  // — добавляем стартовую\n  user.groups.push(START_GROUP);\n}\n\nreturn [{ json: { user } }];             \n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1840,
        -144
      ],
      "id": "bdde067b-f359-4d64-9947-dc096a356d09",
      "name": "New group"
    },
    {
      "parameters": {
        "jsCode": "const o = $input.first().json.body; \n\nreturn [{\n  json:{\n    orderId: o.id,\n    subId: o.line_items[0].product_id,\n    subEmail: o.billing.email\n  }\n}]"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        704,
        -128
      ],
      "id": "e0a17d47-8ab7-447f-b21e-53d3abd2a5e2",
      "name": "Get data"
    },
    {
      "parameters": {
        "operation": "update",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "users",
          "mode": "list",
          "cachedResultName": "users"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "email": "={{ $('Map product').item.json.customer.email }}",
            "balance": 0
          },
          "matchingColumns": [
            "email"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": true,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "email",
              "displayName": "email",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "name",
              "displayName": "name",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "role",
              "displayName": "role",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "balance",
              "displayName": "balance",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "deleted",
              "displayName": "deleted",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "boolean",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        2224,
        -144
      ],
      "id": "6c930754-e800-45a6-aade-837ff446545f",
      "name": "null balance",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "users",
          "mode": "list",
          "cachedResultName": "users"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "email": "={{ $('Map product1').item.json.customer.email }}",
            "balance": "={{ ($('Map product1').item.json.items.CurBalance)/$json.course }}"
          },
          "matchingColumns": [
            "email"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": true,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "email",
              "displayName": "email",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "name",
              "displayName": "name",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "role",
              "displayName": "role",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "balance",
              "displayName": "balance",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "deleted",
              "displayName": "deleted",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "boolean",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        3920,
        192
      ],
      "id": "3d9476c1-7f73-4936-b935-8e255d5a6830",
      "name": "update balance1",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const o = $input.first().json.body; \n\nreturn [{\n  json:{\n    orderId: o.id,\n    subId: o.line_items[0].product_id,\n    subEmail: o.billing.email\n  }\n}]"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        944,
        240
      ],
      "id": "0cf68c65-4913-4c91-84c6-03776bbbb3d5",
      "name": "Get data1"
    },
    {
      "parameters": {
        "mode": "combine",
        "combineBy": "combineByPosition",
        "options": {}
      },
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3.1,
      "position": [
        1904,
        224
      ],
      "id": "d5eaefc5-497f-4dee-ab84-e86a2f34d315",
      "name": "Merge1",
      "executeOnce": false
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://login.neuro-hub.pro/api/update-user",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "id",
              "value": "=neurohub_pro/{{$json.user.name}}"
            },
            {
              "name": "clientId",
              "value": "0a555e3b5c73db782801"
            },
            {
              "name": "clientSecret",
              "value": "5cce4d81f16db49069ba911790aafcfceb1615e9"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{$('New group1').item.json.user}}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2288,
        224
      ],
      "id": "c7511c69-9ca0-43dd-af88-f212edf5a23d",
      "name": "Update User1"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "440a19c1-df2b-4962-b72b-b36a88338ef2",
              "name": "email",
              "value": "={{ $('Map product1').item.json.customer.email }}",
              "type": "string"
            },
            {
              "id": "007d5b0b-2755-4377-a6d2-73c06071e8c0",
              "name": "newGroup",
              "value": "={{ $('Map product1').item.json.items.productId }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1424,
        240
      ],
      "id": "771e6531-1b8e-4bab-a489-dca55d484259",
      "name": "Input email + group1"
    },
    {
      "parameters": {
        "url": "=https://login.neuro-hub.pro/api/get-user",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "email",
              "value": "={{ $json.email }}"
            },
            {
              "name": "clientId",
              "value": "=0a555e3b5c73db782801"
            },
            {
              "name": "clientSecret",
              "value": "5cce4d81f16db49069ba911790aafcfceb1615e9"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1664,
        128
      ],
      "id": "373bcbc9-a4bf-4243-b3b6-c8c513118bfe",
      "name": "Get User1"
    },
    {
      "parameters": {
        "jsCode": "const map = { 16: 'neurohub_pro/Standard', 15: 'neurohub_pro/Profi', 13:'neurohub_pro/Start'};\n\nconst SubData = $('Get data1').item.json;\nlet selectedId = 13;\nlet newbalance = 0.5;\nif (SubData.subId === 15) {\n  selectedId = 15;\n  newbalance = 1450;\n} \nelse if (SubData.subId === 16) {\n  selectedId = 16;\n  newbalance = 459;\n}\n\nreturn [{\n  json: {\n    customer: { email: SubData.subEmail },\n    items:    { productId: map[ selectedId ], CurBalance: newbalance },\n  },\n}];\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1200,
        240
      ],
      "id": "84ab66f6-60a4-4aed-91d4-5aef58632cec",
      "name": "Map product1"
    },
    {
      "parameters": {
        "jsCode": "const body = $input.first().json;\nconst user = body.data ?? body;             \nconst newGroup = $input.first().json.newGroup;\nconst ADMIN_GROUP   = 'neurohub_pro/openwebui-admin';\n\nif (!user.displayName || user.displayName.trim() === '') {\n  user.displayName = user.email;\n}\n\nuser.groups = user.groups || [];\nconst hasAdmin = user.groups.includes(ADMIN_GROUP);\nconst newGroups = [];\nif (hasAdmin) newGroups.push(ADMIN_GROUP);\nnewGroups.push(newGroup);\nuser.groups = [...new Set(newGroups)];\n\nreturn [{ json: { user } }];             \n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2112,
        224
      ],
      "id": "d43936b3-f40e-470e-abfe-839dfcc10eef",
      "name": "New group1"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "e32ace3b-0300-4a44-8b51-6df9bac142ba",
              "leftValue": "={{ $json.body.status }}",
              "rightValue": "pending-cancel",
              "operator": {
                "type": "string",
                "operation": "equals",
                "name": "filter.operator.equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        432,
        48
      ],
      "id": "482d38cd-5a24-4763-8273-f585655de2c2",
      "name": "If sub cancel"
    },
    {
      "parameters": {
        "url": "http://api.exchangerate.host/live?access_key=4a0a08600e4a19759dc06d9aa58bfaa9&source=USD&currencies=RUB&format=1",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        3248,
        320
      ],
      "id": "d7746cd7-1e3c-4014-8150-a06684c4e76e",
      "name": "Get usd course"
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "course_USD2RUB",
          "mode": "list",
          "cachedResultName": "course_USD2RUB"
        },
        "where": {
          "values": [
            {
              "column": "id",
              "value": "1"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        2512,
        224
      ],
      "id": "7ce876c3-a7ce-4217-b3bc-8bf25bae5cb2",
      "name": "get old course",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "course_USD2RUB",
          "mode": "list",
          "cachedResultName": "course_USD2RUB"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "id": 1,
            "usd2rub": "={{ $json.quotes.USDRUB }}",
            "mod_at": "={{ new Date($json.timestamp * 1000).toISOString().slice(0,10) }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true
            },
            {
              "id": "usd2rub",
              "displayName": "usd2rub",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true
            },
            {
              "id": "mod_at",
              "displayName": "mod_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        3440,
        320
      ],
      "id": "f624c77d-defe-4d10-87fb-60432630c81a",
      "name": "update course",
      "credentials": {
        "postgres": {
          "id": "b8vUWqEjOPdrAcVH",
          "name": "NH-SB-OWui_monitor"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "d97e2b3d-7f71-4a5a-9192-15927ae03787",
              "name": "headers",
              "value": "={{ $('If reactivate').item.json.headers }}",
              "type": "object"
            },
            {
              "id": "b3901c34-dce9-485f-afc6-fae952825d14",
              "name": "body",
              "value": "={{ $('If reactivate').item.json.body }}",
              "type": "object"
            },
            {
              "id": "e418df4b-b433-4e5f-a449-24dc34eba9ff",
              "name": "course",
              "value": "={{ $json.usd2rub }}",
              "type": "number"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3648,
        320
      ],
      "id": "70417f55-93c3-4d02-9d74-e5131a2cf1b8",
      "name": "actual order"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "dbae1c14-188b-4718-800c-b760162f54fb",
              "name": "headers",
              "value": "={{ $('If reactivate').item.json.headers }}",
              "type": "object"
            },
            {
              "id": "31d0488d-5d26-4851-bfef-79b0d8087cbd",
              "name": "body",
              "value": "={{ $('If reactivate').item.json.body }}",
              "type": "object"
            },
            {
              "id": "ef3a07bd-efd0-4fb6-9f91-716fb6cbfaf0",
              "name": "course",
              "value": "={{ $('get old course').item.json.usd2rub }}",
              "type": "number"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3440,
        -16
      ],
      "id": "d68024b9-909b-415b-a9c3-30fd2e580efe",
      "name": "actual order1"
    },
    {
      "parameters": {
        "jsCode": "return [\n  {\n    json: {\n      are_equal: $input.first().json.mod_at.slice(0,10) === $('If reactivate').first().json.body.date_modified.slice(0,10)\n    }\n  }\n];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2768,
        224
      ],
      "id": "8bb3e323-a9f7-4e81-b1a2-f96f3639ba36",
      "name": "equal?"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "28372d71-347b-4c0c-af51-15a0ac98fa9a",
              "leftValue": "={{ $json.body.status }}",
              "rightValue": "active",
              "operator": {
                "type": "string",
                "operation": "equals",
                "name": "filter.operator.equals"
              }
            },
            {
              "id": "01bbaec5-b5ec-4356-873b-c1a5b2598e80",
              "leftValue": "={{ $json.body.meta_data.some(el => el.key === 'end_date_pre_cancellation') }}",
              "rightValue": true,
              "operator": {
                "type": "boolean",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        704,
        272
      ],
      "id": "2dfe96b5-957e-4e81-aab8-9cc77714152a",
      "name": "If reactivate"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "9c80f4df-f129-4fb7-8935-4746fb901ba2",
              "leftValue": "={{ $json.are_equal }}",
              "rightValue": "",
              "operator": {
                "type": "boolean",
                "operation": "true",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        2992,
        224
      ],
      "id": "387aee05-e601-4741-a218-f13c9e2e9ef7",
      "name": "If first day order"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "If sub cancel",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Merge": {
      "main": [
        [
          {
            "node": "New group",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update User": {
      "main": [
        [
          {
            "node": "null balance",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Input email + group": {
      "main": [
        [
          {
            "node": "Get User",
            "type": "main",
            "index": 0
          },
          {
            "node": "Merge",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Get User": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Map product": {
      "main": [
        [
          {
            "node": "Input email + group",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "New group": {
      "main": [
        [
          {
            "node": "Update User",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get data": {
      "main": [
        [
          {
            "node": "Map product",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get data1": {
      "main": [
        [
          {
            "node": "Map product1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Merge1": {
      "main": [
        [
          {
            "node": "New group1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update User1": {
      "main": [
        [
          {
            "node": "get old course",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Input email + group1": {
      "main": [
        [
          {
            "node": "Get User1",
            "type": "main",
            "index": 0
          },
          {
            "node": "Merge1",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Get User1": {
      "main": [
        [
          {
            "node": "Merge1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Map product1": {
      "main": [
        [
          {
            "node": "Input email + group1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "New group1": {
      "main": [
        [
          {
            "node": "Update User1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If sub cancel": {
      "main": [
        [
          {
            "node": "Get data",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "If reactivate",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get usd course": {
      "main": [
        [
          {
            "node": "update course",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "get old course": {
      "main": [
        [
          {
            "node": "equal?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "update course": {
      "main": [
        [
          {
            "node": "actual order",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "actual order": {
      "main": [
        [
          {
            "node": "update balance1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "actual order1": {
      "main": [
        [
          {
            "node": "update balance1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "equal?": {
      "main": [
        [
          {
            "node": "If first day order",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If reactivate": {
      "main": [
        [
          {
            "node": "Get data1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If first day order": {
      "main": [
        [
          {
            "node": "actual order1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Get usd course",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "Webhook": [
      {
        "headers": {
          "host": "venturecrew.app.n8n.cloud",
          "user-agent": "WooCommerce/9.8.5 Hookshot (WordPress/6.8.1)",
          "content-length": "4206",
          "accept": "*/*",
          "accept-encoding": "gzip, br",
          "cdn-loop": "cloudflare; loops=1; subreqs=1",
          "cf-connecting-ip": "2a02:4780:8:1118:0:884:c859:1",
          "cf-ew-via": "15",
          "cf-ipcountry": "NL",
          "cf-ray": "95174c4cb6e6a11d-AMS",
          "cf-visitor": "{\"scheme\":\"https\"}",
          "cf-worker": "n8n.cloud",
          "content-type": "application/json",
          "x-forwarded-for": "2a02:4780:8:1118:0:884:c859:1, 104.23.170.22",
          "x-forwarded-host": "venturecrew.app.n8n.cloud",
          "x-forwarded-port": "443",
          "x-forwarded-proto": "https",
          "x-forwarded-server": "traefik-prod-users-gwc-9-7bb7d4c57c-8ggrt",
          "x-is-trusted": "yes",
          "x-real-ip": "2a02:4780:8:1118:0:884:c859:1",
          "x-wc-webhook-delivery-id": "c03246040f718cd50e36eb6c3ad19955",
          "x-wc-webhook-event": "updated",
          "x-wc-webhook-id": "3",
          "x-wc-webhook-resource": "subscription",
          "x-wc-webhook-signature": "3JAjk0VX0dD276iTxkIp3sO+SdvpaTWY0ozHejFf6Og=",
          "x-wc-webhook-source": "https://neuro-hub.pro/",
          "x-wc-webhook-topic": "subscription.updated"
        },
        "params": {},
        "query": {},
        "body": {
          "id": 1780,
          "parent_id": 1779,
          "status": "active",
          "currency": "RUB",
          "version": "9.8.5",
          "prices_include_tax": false,
          "date_created": "2025-06-07T02:10:34",
          "date_modified": "2025-06-18T02:17:52",
          "discount_total": "0.00",
          "discount_tax": "0.00",
          "shipping_total": "0.00",
          "shipping_tax": "0.00",
          "cart_tax": "0.00",
          "total": "100.00",
          "total_tax": "0.00",
          "customer_id": 40,
          "order_key": "wc_order_zjvWJaRO10rg2",
          "billing": {
            "first_name": "",
            "last_name": "",
            "company": "",
            "address_1": "",
            "address_2": "",
            "city": "",
            "state": "",
            "postcode": "",
            "country": "RU",
            "email": "e@1.com",
            "phone": ""
          },
          "shipping": {
            "first_name": "",
            "last_name": "",
            "company": "",
            "address_1": "",
            "address_2": "",
            "city": "",
            "state": "",
            "postcode": "",
            "country": "RU",
            "phone": ""
          },
          "payment_method": "woocommerce_payments",
          "payment_method_title": "Cards",
          "customer_ip_address": "90.154.72.162",
          "customer_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
          "created_via": "checkout",
          "customer_note": "",
          "date_completed": "2025-06-18T02:17:47",
          "date_paid": "2025-06-18T02:17:52",
          "number": "1780",
          "meta_data": [
            {
              "id": 4887,
              "key": "_new_order_tracking_complete",
              "value": "yes"
            },
            {
              "id": 4880,
              "key": "_payment_method_id",
              "value": "pm_1RXBrrFfO2cxeYXqZNE0nX2T"
            },
            {
              "id": 4881,
              "key": "_stripe_customer_id",
              "value": "cus_SS63YPKD4VXCa8"
            },
            {
              "id": 4855,
              "key": "_subscription_renewal_order_ids_cache",
              "value": [
                1832,
                1820,
                1817,
                1798,
                1797,
                1796,
                1795,
                1794,
                1793,
                1791,
                1790
              ]
            },
            {
              "id": 4856,
              "key": "_subscription_resubscribe_order_ids_cache",
              "value": []
            },
            {
              "id": 4857,
              "key": "_subscription_switch_order_ids_cache",
              "value": []
            },
            {
              "id": 4858,
              "key": "_wc_order_attribution_device_type",
              "value": "Desktop"
            },
            {
              "id": 4859,
              "key": "_wc_order_attribution_session_count",
              "value": "1"
            },
            {
              "id": 4860,
              "key": "_wc_order_attribution_session_entry",
              "value": "https://neuro-hub.pro/"
            },
            {
              "id": 4861,
              "key": "_wc_order_attribution_session_pages",
              "value": "11"
            },
            {
              "id": 4862,
              "key": "_wc_order_attribution_session_start_time",
              "value": "2025-06-07 01:47:26"
            },
            {
              "id": 4863,
              "key": "_wc_order_attribution_source_type",
              "value": "typein"
            },
            {
              "id": 4864,
              "key": "_wc_order_attribution_user_agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
            },
            {
              "id": 4865,
              "key": "_wc_order_attribution_utm_source",
              "value": "(direct)"
            },
            {
              "id": 5154,
              "key": "_wcpay_fraud_meta_box_type",
              "value": "allow"
            },
            {
              "id": 5153,
              "key": "_wcpay_mode",
              "value": "test"
            },
            {
              "id": 5250,
              "key": "end_date_pre_cancellation",
              "value": "0"
            },
            {
              "id": 4866,
              "key": "is_vat_exempt",
              "value": "no"
            },
            {
              "id": 5251,
              "key": "trial_end_pre_cancellation",
              "value": "0"
            }
          ],
          "line_items": [
            {
              "id": 259,
              "name": "тест",
              "product_id": 1774,
              "variation_id": 0,
              "quantity": 1,
              "tax_class": "",
              "subtotal": "100.00",
              "subtotal_tax": "0.00",
              "total": "100.00",
              "total_tax": "0.00",
              "taxes": [],
              "meta_data": [],
              "sku": "",
              "price": 100,
              "image": {
                "id": "",
                "src": ""
              },
              "parent_name": null
            }
          ],
          "tax_lines": [],
          "shipping_lines": [],
          "fee_lines": [],
          "coupon_lines": [],
          "payment_url": "https://neuro-hub.pro/checkout/order-pay/1780/?pay_for_order=true&key=wc_order_zjvWJaRO10rg2",
          "is_editable": true,
          "needs_payment": false,
          "needs_processing": true,
          "date_created_gmt": "2025-06-07T02:10:34",
          "date_modified_gmt": "2025-06-18T02:17:52",
          "date_completed_gmt": "2025-06-18T02:17:47",
          "date_paid_gmt": "2025-06-18T02:17:52",
          "billing_period": "day",
          "billing_interval": "1",
          "trial_period": "",
          "suspension_count": 0,
          "requires_manual_renewal": false,
          "start_date_gmt": "2025-06-07T02:10:34",
          "trial_end_date_gmt": "",
          "next_payment_date_gmt": "2025-06-19T02:17:52",
          "payment_retry_date_gmt": "",
          "last_payment_date_gmt": "2025-06-18T02:17:44",
          "cancelled_date_gmt": "",
          "end_date_gmt": "",
          "resubscribed_from": "",
          "resubscribed_subscription": "",
          "removed_line_items": [],
          "_links": {
            "self": [
              {
                "href": "https://neuro-hub.pro/wp-json/wc/v3/subscriptions/1780",
                "targetHints": {
                  "allow": [
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE"
                  ]
                }
              }
            ],
            "collection": [
              {
                "href": "https://neuro-hub.pro/wp-json/wc/v3/subscriptions"
              }
            ],
            "email_templates": [
              {
                "embeddable": true,
                "href": "https://neuro-hub.pro/wp-json/wc/v3/subscriptions/1780/actions/email_templates"
              }
            ],
            "customer": [
              {
                "href": "https://neuro-hub.pro/wp-json/wc/v3/customers/40"
              }
            ],
            "up": [
              {
                "href": "https://neuro-hub.pro/wp-json/wc/v3/orders/1779"
              }
            ]
          }
        },
        "webhookUrl": "https://venturecrew.app.n8n.cloud/webhook/453d0f3e-1e93-4431-8389-27fce7be0a04",
        "executionMode": "production"
      }
    ]
  },
  "meta": {
    "instanceId": "ccb655d891d6ee232f9fa5f437d19155cbfdcb47ae5b4a52820b3ea8bcdcf403"
  }
}
```

