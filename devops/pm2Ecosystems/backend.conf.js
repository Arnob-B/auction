module.exports = {
  apps : [
          {
                  name:'api',
                  script: 'node api/build/index.js',
                  env:{
                          SUBSCRIBER_URL : "",
                          CLIENT_URL : ""
                  }
          },
          {
                  name:'engine',
                  script: 'cd engine && node build/index.js',
                  env:{
                          DATABASE_URL :"" ,
                          CLIENT_URL : "",
                          DBQUEUE_URL : "",
                          PUBLISH_URL : "",
                          MAX_HOLD: 3,
                          BUILD_BACKUP :1
                  },
                  autorestart:false
          },
          {
                  name:'wsServer',
                  script: 'node wsServer/build/index.js',
                  env:{
                          SUBCRIBER_URL : ""
                  }
          },
          {
                  name:'db',
                  script: 'node db/build/index.js',
                  env:{
                          DATABASE_URL:"",
                          CLIENT_URL : ""
                  },
                  autorestart:false
          },
  ],
};