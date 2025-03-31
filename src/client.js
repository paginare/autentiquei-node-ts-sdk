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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutentiqueiSDK = void 0;
var axios_1 = require("axios");
var DEFAULT_BASE_URL = 'https://sua-api.com/api'; // <<< SUBSTITUA PELA SUA URL DE PRODUÇÃO >>>
var AutentiqueiSDK = /** @class */ (function () {
    function AutentiqueiSDK(config) {
        if (!config.apiKey || !config.apiKey.startsWith('autq_')) {
            throw new Error('Chave de API Autentiquei inválida ou não fornecida.');
        }
        this.apiKey = config.apiKey;
        this.apiClient = axios_1.default.create({
            baseURL: config.baseURL || DEFAULT_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer ".concat(this.apiKey),
            },
            timeout: 15000, // Timeout de 15 segundos
        });
    }
    /**
     * Formata erros da API Axios para um Error padrão.
     */
    AutentiqueiSDK.prototype.handleError = function (error) {
        var _a;
        var errorMessage = 'Erro desconhecido ao comunicar com a API Autentiquei.';
        if (axios_1.default.isAxiosError(error)) {
            var axiosError = error; // Tipar o erro Axios
            if (axiosError.response) {
                // Tenta pegar a mensagem de erro da API
                errorMessage = ((_a = axiosError.response.data) === null || _a === void 0 ? void 0 : _a.error) || "Erro ".concat(axiosError.response.status, ": ").concat(axiosError.response.statusText);
            }
            else if (axiosError.request) {
                // A requisição foi feita mas não houve resposta
                errorMessage = 'Não foi possível conectar à API Autentiquei. Verifique sua conexão.';
            }
            else {
                // Erro ao configurar a requisição
                errorMessage = "Erro ao configurar requisi\u00E7\u00E3o: ".concat(axiosError.message);
            }
        }
        else if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new Error(errorMessage);
    };
    /**
     * Envia um código de verificação.
     * @param params - Parâmetros para envio (phone, method).
     * @returns Promise com a resposta da API.
     */
    AutentiqueiSDK.prototype.sendCode = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apiClient.post('/verifications/send', params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _a.sent();
                        // Rejeita a promise com um erro formatado
                        throw this.handleError(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifica um código de verificação.
     * @param params - Parâmetros para verificação (hash, code).
     * @returns Promise com a resposta da API.
     */
    AutentiqueiSDK.prototype.verifyCode = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apiClient.post('/verifications/verify', params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _a.sent();
                        // Rejeita a promise com um erro formatado
                        throw this.handleError(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AutentiqueiSDK;
}());
exports.AutentiqueiSDK = AutentiqueiSDK;
