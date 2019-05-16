module.exports = {
  apps : [{
    name: 'ExpressVueBoard',
    script: './backend/bin/www', // 실행파일 위치 지정

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two', // 코드상에서 사용가능
    // instances: 1,
    // autorestart: true,
    // watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_pr: { //pm2 start --env pr로 실행
      NODE_ENV: 'production',
      PORT: 80
    }
  }],

  deploy : { //핵심, 서버에 보내는 정보
    production : {
      user : 'root',
      host : '133.186.159.89',
      key  : '~/keys/EVB_KEY.pem', 
      ref  : 'origin/master',
      repo : 'git@github.com:lqqokim/express-mongodb-vue.git',
      path : '/var/www/express-mongodb-vue',
      // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'post-deploy' : 'yarn pm2'
    }
  }
};
