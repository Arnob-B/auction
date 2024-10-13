import { WebSocket } from "ws";
import { Express } from "express";
import { createClient, RedisClientType } from "redis";
export default class subscriptionManager{
  private static instance:subscriptionManager;
  private subscription:RedisClientType;
  private initiated:boolean;
  private constructor(){
    this.subscription = createClient();
    this.subscription.connect();
    this.initiated = false;
    this.init();
  }
  public async init(){
    await this.subscription;
    this.initiated = true;
  }
};