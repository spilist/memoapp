# Memoapp #

Memoapp의 서버와 클라이언트 실행 방법을 설명한다. 모든 설명은 MacOS High Sierra 기준이다.

---

### Prerequsite ###

- [yarn](https://yarnpkg.com/en/docs/install#mac-stable)
- mongodb
  -  `brew install mongodb`

---

### API ###

```sh
cd api
yarn install # 이미 install했다면 생략
mongod --dbpath ./data/db/ # mongodb 시작
PORT=3001 yarn start # localhost:3001에 API 서버 띄움
```

`localhost:3001` 에 브라우저로 접속해서 간단한 CRUD action을 실행해볼 수 있다.

참고: [API 상세 스펙](api/README.md#api-specifications)

- 변경사항: [이슈를 참조](https://github.com/dramancompany/memoapp-api/issues/1)하여 labels route의 버그 수정.

---

### Client ###

##### How to run #####

```shell
yarn start
```

`localhost:3000` 에서 개발 모드로 웹서버가 실행된다.

##### How to build #####

```shell
yarn build
```

성능을 위해 최적화된 프로덕션 모드로 `build` 폴더에 앱을 빌드한다.  

빌드는 minify되고 hash를 파일명에 포함한다. 기본적으로 [service worker](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app)를 포함하기 때문에 로컬 캐시를 이용하게 된다.

##### How to test #####

```shell
yarn test # watch mode로 실행
# 'a' 를 눌러 전체 테스트 실행
# 'o' 를 눌러 변경된 파일에 대해서만 테스트 실행
```

`__tests__` 안에 있는 `*.test.js` 파일들에 대해서 `jest`와 `enzyme` 으로 테스트한다.

`/__mocks__/` 폴더에 특정 node_modules에 대한 mock implementation이 정의되어있으니 참고할 것.

##### 기술 스택 #####

- React 16으로 create-react-app 을 eject하여 개발했다.
  - eject한 이유: 파일 import시 경로 참조를 `~/` 를 통해 가능하게 했는데, CRA에서 eject하지 않으면 `jest` 의 moduleNameMapper를 설정할 수 없다.
- redux로 전역 상태 관리를 했고, redux-pender 를 middleware로 사용했다.
- styled component를 사용했고, 대부분의 소규모 컴포넌트는 antd와 reflexbox 를 가져다 썼다.
  - 아이콘은 font-awesome 사용.
  - 색깔은 open-color 사용.
- jest와 enzyme으로 테스트했다. 
  - memoList 관련 컨테이너와 모듈 로직, 그리고 핵심 리다이렉션 로직에 대한 테스트가 되어있는 상태다.
- 기타 사항
  - FontFaceObserver로 Spoqa Han Sans 폰트가 로드된 후 붙이도록 했다.
  - location pathname이 변경될 때마다 최상단으로 스크롤되도록 했다.
  - 액션이 대부분 url에 반영되어, url을 복사하면 그 상태가 그대로 보일 수 있게 했다.
    - 단, mongo의 id가 너무 길기 때문에 다중 선택시에는 url 반영을 하지 않았다.
  - url은 라벨과 메모 제목이 slug로 포함될 수 있게 했다.

##### 설계 #####

- 라우팅 구조를 설계한 뒤 Balsamiq으로 UI 기획을 한 다음 구현에 들어갔다.
- [설계 당시 문서](https://workflowy.com/s/F-eI.QvjY1wW3YG). 이대로 만들어지지는 않았다.
- UI 기획 파일은 [폴더](https://github.com/spilist/memoapp/tree/master/docs)에 있다.

##### 아쉬운 점들 #####

- 초반 구현은 TDD로 진행했으나 중반 이후 뷰 작업 위주로 하면서 TDD를 하지 않았다. 테스트 커버리지가 부족하다.
  - 특히 moxios로 PUT, DELETE method가 테스트되지 않아 고생하다가 이후부터는 테스트하지 않았다.
  - 하나의 모듈 파일에 redux 관련 로직이 다 들어있는 [ducks](https://medium.freecodecamp.org/scaling-your-redux-app-with-ducks-6115955638be) 변형 구조를 이용했는데, 이렇게 하니 리듀서가 너무 무거워져서 테스트를 간단히 하기 어려워졌다.
  - 테스트를 하기 더 쉬운, 또한 더 나은 구조로 리팩토링할 부분이 상당히 있어 보인다.
- API가 유연성이 떨어져서 클라이언트에서 filter, reduce 등을 많이 사용했다. 퍼포먼스 문제가 있을 수 있다. 
  - 페이징도 없이 한 번에 모든 메모와 라벨을 다 주기 때문에 더욱 그렇다.
- '아무 라벨이 없는 메모들'이라는 분류를 처음에는 기획했는데 API 유연성이 떨어지고 시간이 부족하여 하지 못했다.
- 편의 기능들 - 라벨과 메모의 검색 기능, 키보드 지원 및 드래드&드롭을 이용한 accessibility 증가도 욕심이 났으나 하지 못했다.
- 브라우저 크기별 대응을 하지 않고 max-width를 700px로 고정해뒀다.
- heroku 등에 바로바로 올려서 CI/CD를 하고 싶었는데 시도하지 못했다.

---

### TroubleShooting ###

- `yarn test` 시 에러가 발생한다.
  - FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
    - [참고 링크](https://github.com/facebook/jest/issues/1767#issuecomment-248883102)
    - 해결: watchman 버전 업그레이드하면 된다.
      - `brew install watchman`
  - TypeError: environment.teardown is not a function
    - CRA에서 jest를 manual 설치했을 때 생기는 문제.
    - [참고 링크 1](https://github.com/facebook/jest/issues/6393), [참고 링크 2](https://github.com/facebook/jest/issues/5119#issuecomment-356120965)
    - 해결: 설치한 jest를 package.json에서 지우고 다시 `yarn install`한다.