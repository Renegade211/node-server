"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app_1 = __importDefault(require("firebase/app"));
require("firebase/database");
var cors = require('cors');
var cron = require('cron').CronJob;
var rp = require('request-promise-native');
var swaggerUi = require('swagger-ui-express');
require('dotenv').config();
app_1.default.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_ID,
    appId: process.env.APP_ID
});
var app = express_1.default();
function writeData(data, type) {
    var time = new Date();
    data.forEach(function (item) {
        app_1.default.database().ref("/" + type + "/" + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear()).set({
            rate: item.rate,
            source: item.source,
            target: item.target,
            time: item.time
        });
    });
}
var job = new cron('0 7 * * *', function () {
    return __awaiter(this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rp({
                            uri: "https://api.sandbox.transferwise.tech/v1/rates?source=USD&target=UYU",
                            headers: {
                                Authorization: "Bearer " + process.env.TOKEN,
                            },
                        })];
                case 1:
                    data = _a.sent();
                    writeData(JSON.parse(data), 'data');
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
job.start();
app.use(cors());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.post('/trm', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, source, target, data, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, source = _a.source, target = _a.target;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, rp({
                        uri: "https://api.sandbox.transferwise.tech/v1/rates?source=" + source + "&target=" + target,
                        headers: {
                            Authorization: "Bearer " + process.env.TOKEN,
                        },
                    })];
            case 2:
                data = _b.sent();
                writeData(JSON.parse(data), 'request');
                res.send("Success");
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                console.log(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/trm', function (req, res) {
    var data = [];
    app_1.default.database().ref('data/').on('value', function (snapshot) {
        data.push(snapshot.val());
    });
    res.send(data);
});
var options = {
    swagger: "2.0",
    info: {
        title: "TransferWise Express API",
        version: "1.0.0",
        description: "Simple Express API",
        contact: {
            name: "Vasyl Shponarskyi",
            email: "vasyl.shponarskyi@gmail.com"
        },
        license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html"
        }
    },
    servers: [
        {
            url: "http://localhost:3000/trm",
            description: "Local server"
        }
    ],
    tags: [
        {
            name: "GET"
        },
        {
            name: "POST"
        }
    ],
    paths: {
        "/trm": {
            get: {
                tags: ["GET"],
                description: "Get data from Firebase",
                operationId: "getData",
                responses: {
                    "200": {
                        description: "Successful request",
                        content: {
                            "application/json": {
                                schema: {
                                    type: 'array',
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ["POST"],
                description: "Request current rate",
                operationId: "request",
                consumes: ['application/json'],
                parameters: [
                    {
                        name: 'source',
                        in: 'body',
                        content: {
                            'text/plain': {
                                type: 'string'
                            }
                        }
                    },
                    {
                        name: 'target',
                        in: 'body',
                    }
                ],
                responses: {
                    "200": {
                        description: "Successful request",
                        content: {
                            "application/json": {
                                schema: {
                                    'text/plain': {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(options));
app.listen(3000, function () { return console.log('API on port 3000'); });
