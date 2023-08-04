# 🥕 상한당근(경매) 

###  ● Period : 23.07.25(화) ~ 23.08.04(금)
###  ● What I do : 
      [기능] 실시간 경매 입찰(Socketio), 소셜로그인(Kakao) 
      [기능 外] 부하테스트(Artiilery), 서버배포(Nginx, 고정IP) 
###  ● Homepage  : [상한당근](https://carrot-three.vercel.app/)
###  ● Pro. log  : [Notion](https://www.notion.so/TradeBiz-8f637592b0f8435197208a7a1625498f?pvs=4) 
###  ● Reference : 야후경매, 업비트, 당근마켓
###  ● 장치 사양 : RAM 8G, i5, 코어 4, HDD 219GB

<br>

## 👨‍👩‍👧‍👦Team Members

| Position      | Name          | Github                                            |
|:--------------|:--------------|:--------------------------------------------------|
| Frontend       | 김민석        | [minseok1109](https://github.com/minseok1109)         |
| Backend       | 권용재        | [backEndKwon](https://github.com/backEndKwon)     |

<br>

## 🏛️ Project AtoZ
### 주제 : 중고물품 실시간 경매 입찰 프로그램
### 의도 : 충분히 경험할만한 기술적 난제들을 스스로 정의해보고 풀어보기 
### 난제 : 1,000명 부터 부하로 인해 에러상황발생 및 db저장 실패 이슈발생
          → 10초동안 초당 5명/50명/100명/500명 실시간 입찰
### 이슈 및 해결방안:
<details>
  <summary> 이슈 및 해결방안 펼쳐보기 </summary>
해결하고싶다..
<div markdown="1">
<br>

# 📝Commit Convention 
<details>
  
<summary> Code Convention 펼쳐보기 </summary>

<div markdown="1">  

  <br>

  제목은 최대 50글자까지 아래에 작성: ex) feat: Add Key mapping

--- COMMIT END --- 

<타입> 리스트  
feat        : 기능 (새로운 기능)  
fix         : 버그 (버그 수정)  
refactor    : 리팩토링  
design      : CSS 등 사용자 UI 디자인 변경  
comment     : 필요한 주석 추가 및 변경  
style       : 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)  
docs        : 문서 수정 (문서 추가, 수정, 삭제, README)  
test        : 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)  
chore       : 기타 변경사항 (빌드 스크립트 수정, assets, 패키지 매니저 등)  
init        : 초기 생성  
rename      : 파일 혹은 폴더명을 수정하거나 옮기는 작업만 한 경우  
remove      : 파일을 삭제하는 작업만 수행한 경우 

</div>
</details>
