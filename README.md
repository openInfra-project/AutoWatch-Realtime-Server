## **Synopsis**

---

WebRTC 연결을 위한 Node Signalling Server입니다

[**https://118.67.131.138:30010/**](https://118.67.131.138:30010/)

### Quick Start

```bash
git clone https://github.com/openInfra-project/AutoWatch-Realtime-Server
cd server
nodemon app.js
```

## 🎨Overview

![Untitled](https://user-images.githubusercontent.com/48875061/129440136-6ed59777-cd39-41fe-884e-804c141362e9.png)


### **💻 Development Stack**

- socket.io
- https
- nodemon

### 🖋Features

1. WebRTC를 위한 Socket 통신 연결
2. https 통신을 위한 SSL 

? replicas 를 통한 분산처리?

### 🐹API

1.WebRTC서버:: 실시간 영상 전송 서버 (socket)

2.WebRTC — Node Adapting Server

기본 url :: [https://118.67.131.138:30010](https://118.67.131.138:30010/)

`POST` / 방 입장 시 socket connection 설정 위한 offer 마다의 토큰 제공

`DEL` / 방 퇴장 시 socket connection 해제

`POST` / Join room id 중복검사 , 방(UserData) 입장

`POST`/ offer 요청한 연결, 나를 제외한 전체 사용자에게 연결 요청

`POST` / getoffer 요청 받은 연결, 나에게 들어온 연결 요청

`POST` /message 실시간 채팅을 위한 연결

`POST` / gazealert 실시간 부정행위 알람을 위한 연결

### 🙋‍♂️Role

@김준영 

- 채팅 및 화상통신 기반 [socket.io](http://socket.io) 통신
- *WebSocket token을 활용한 peer connection*
- *SSL 인증서 연결*

@김혜원 

- *NCP 쿠버네티스 NodePort를 이용한 https 배포*
