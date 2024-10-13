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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisManager_1 = __importDefault(require("./redisManager"));
const express_1 = __importDefault(require("express"));
redisManager_1.default.getInstance();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/bid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log();
    const { playerId, bidderId, amnt } = req.body;
    const response = yield redisManager_1.default.getInstance().publish({
        playerId: playerId,
        bidderId: bidderId,
        amnt: amnt
    });
    res.json({ msg: response });
}));
app.listen(3000, () => {
    console.log("application started at 3000");
});
