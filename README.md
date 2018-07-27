# Memoapp #

Memoapp의 서버와 클라이언트 실행 방법을 설명한다. 모든 설명은 MacOS 기준이다.

### Prerequsite ###

- [yarn](https://yarnpkg.com/en/docs/install#mac-stable)
- mongodb
  -  `brew install mongodb`

### API ###

```sh
cd api
yarn install # 이미 install했다면 생략
mongod --dbpath ./data/db/ # mongodb 시작
PORT=3001 yarn start # localhost:3001에 API 서버 띄움
```

`localhost:3001` 에 브라우저로 접속해서 간단한 CRUD action을 실행해볼 수 있다.

![image-20180728084329562](docs/API-server-sample.png)

참고: [API 상세 스펙](api/README.md#api-specifications)

