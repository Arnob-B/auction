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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class redisManager {
    constructor() {
        console.log("redis Manager instialization started");
        this.client = (0, redis_1.createClient)();
        this.publisher = (0, redis_1.createClient)();
        this.client.connect();
        this.publisher.connect();
        this.initiated = false;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("redis Manager instialization completed");
            this.initiated = true;
        });
    }
    static getInstance() {
        if (this.instance)
            return this.instance;
        else {
            this.instance = new redisManager();
            return this.instance;
        }
    }
    publish(_a) {
        return __awaiter(this, arguments, void 0, function* ({ playerId, bidderId, amnt }) {
            try {
                yield this.publisher.lPush("bid", JSON.stringify({
                    playerId: playerId,
                    bidderId: bidderId,
                    amnt: amnt
                }));
                return "success";
            }
            catch (err) {
                console.log(err);
                return "failed";
            }
        });
    }
}
exports.default = redisManager;
;
