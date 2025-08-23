# why use microservice architechture ?
- the main goal is to make everything scalable 
    - multiple api server talking to engine 
- horizontal scalling of each component other than engine

# Backend

> we created the application to auction players so anywhere u see player that is actually an auctionable item



## api
### players
#### GET
- /getCurrentPlayer
#### POST
- /bid
### admin
#### POST
- /admin/addPlayer
- /admin/banUser
- /admin/sellPlayer
- /admin/chageNextPrice
- /admin/contorls

### redisManager
in order to talk to the engine we needed the RedisManager which puts the request to the queue

#### messages that are sent to the queue from the api
```js
type Message =
  | AddPlayerMsg
  | AddUserMsg
  | BanUserMsg
  | PlaceBidMsg
  | SellPlayerMsg
  | GetCurrentPlayerMsg
  | SetControlMsg
  | ChangeNextPriceMsg;
```
---
## database
listens redis queue for any new db operation
- NEW_PLAYER_LISTED -> this is item listed for auction
- BID_PLACED
- PLAYER_SOLD -> this is the item sold
- USER_BANNED

---
## engine
### engine manager
to orchestrate everything
- take snapshots
- publish to api
- descision making

### player manager
> this is the item we are auctioning
- maintaining base price 
- maintaining current price 
- maintaining next price 
- maintaining increments
- selling and listing

### redis manager
- pull/push to/from queue
- use pub sub
### user manager
- track all users
- track banned users




---
## websocket server
### subscription manager
- singleton class
- listens to redis pub-sub and waits for sub 
- forwards pub-sub messages to appropriate user groups (user manager)
    - NEW_PLAYER_LISTED
    - BID_PLACED
    - NEW_BID_PRIC
    - PLAYER_SOLD
    - USER_BANNED
    - CONTROL

### user managemer
- singleton class
- maps admins and players to their socket connections and pushes messages
---
# devops
Being on a budget we tested all the services in a single ec2 
## pm2 
this is a project manager which lets u run multiple projects in a single machine and allow u to see their logs , basically a multiplexer

[config](./devops/pm2Ecosystems/backend.conf.js) 

## nginx 
for reverse proxy in ec2 
as our build will be running in ports 3000 ,3003 and 3002 but we will be acessing from 80
[config](./devops/nginxConf/backendServer.conf)


## domain name and certificates
free domain name is pretty easy to get 
> go to duckdns

### generating certificates
use `certbot` and `python3-certbot-nginx`
uses `let's encrypt` certification authority under the hood to provide certs
