var http = require('http');
var url = require('url');
var qs = require('querystring'); // qs가 querystring이라는 node js가 갖고 있는 모듈을 가져온다

var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost', // MySQL 서버 호스트
    user: 'root',   // MySQL 사용자 이름
    password: '', // MySQL 사용자 비밀번호
    database: 'opentutorials', // 사용할 데이터베이스 이름
  }); //opentutorials에 있는 table수정하기(중요!!)
  db.connect();

var template = {
  HTML:function (title, body0, list, body1, body2) {
    return`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Logic Lab${title}</title>
        <style>
        
      
      a {
          text-decoration: underbar;
          color: #000;
      }
      ul{
          list-style: none;
      }
      
      .container {
          padding: 0 20px;
          margin: 0 auto;
          min-width: 1160px;
      }
      
      header {
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          box-sizing: border-box;
          border-bottom: 1px solid #ccc;
      }
      
      /*로고*/
      .header_logo {
          width: 20%;
          font-size: 30px;
          font-weight: 700;
          text-transform: uppercase;
      }
      
      /*네비게이션*/
      .header_menu {
          width: 60%;
          text-align: center;
      }
      
      .header_menu li {
          display: inline-block;
      }
      
      .header_menu li a { 
          padding: 13px 30px;
          margin: 0 5px;
          transition: background-color 0.3s;
      }
      
      .header_menu li:hover {
          background-color: #f1f1f1;
          border-radius: 5px;
      }
      
      
      
      /*셀렉터, 검색*/
      .select-form, .search-form {
          margin-top: 20px; /* 위 여백 설정 (원하는 여백 크기로 조정) */
          
          display: inline-block; /* 요소를 나란히 표시 */
          vertical-align: middle; /* 수직 가운데 정렬 */
          margin-right: 10px; /* 요소 간격 조절 */
      }
      
          
      /* 셀렉트 박스 스타일 */
      .select-form select {
          padding: 10px;
          border: 1px solid #ccc;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          font-size: 14px;
          width: 150px; /* 셀렉트 박스의 너비 조정 (원하는 크기로 설정) */
      }
      
      /* 검색 폼 스타일 */
      
      .search-form input[type="text"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 200px; /* 검색 입력 필드 너비 조정 (원하는 크기로 설정) */
          font-size: 14px;
      }
      .search-form button {
              padding: 10px 20px;
              background-color: rgb(0, 0, 0);
              color: #fff;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
      }
      
    

        </style>
      </head>
      <body>
          <div class="container">
              <header>
                <div class="header_logo">                       
                <h1><a href="/">Logiclab</a></h1>                     
                </div>

                <nav class="header_menu">
                    <ul>
                        <li><a href="/create">문제만들기</a></li>
                        <li><a href="ranking">랭킹</a></li>
                        <li><a href="login">로그인</a></li>
                        <li><a href="signup">회원가입</a></li>
                    </ul>           
                </nav>
              </header>                     
          </div>
        ${body0}
        ${list}
        ${body1}
        ${body2}
      </body>
      </html>
    `;
  }, list:function(topics) {
    var list = '<ul>';
    var i = 0;
    while(i < topics.length) {
      list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a> <p>${topics[i].description}</p></li>`;
      i += 1;
    }
    list += '</ul>';/*var list = `<ol><li><a href="/?id=!!!">!!!</a></li>; !!!자리에 database에서 가져온 data를 담는다 filelist에서 바꾸기*/
    return list;
  }
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  //console.log(queryData.id);
  

  if (pathname === '/') {
    if (queryData.id === undefined) {
      db.query(`SELECT * FROM topic`, function(err, topics){
        var title = ``;
        var body0 = `
        <div class="top-controls">
          <div class="select-form">
              <select>
                  <option value="">전체</option>
                  <option value="">수열</option>
                  <option value="">디지털 숫자</option>
                  <option value="">도형</option>
                  <option value="">영어</option>
                  <option value="">카드</option>
                  <option value="">함수</option>
              </select>
          </div>
          <div class="search-form">
              <input type="text" placeholder="문제 검색" />
              <button>search</button>
          </div>
        </div>        
        `;
        var list = template.list(topics); //topics에 들어있는 값은 객체로 들어있다
        var body1 = ``;
        var body2 = ``;
        var html = template.HTML(title, body0, list, body1, body2);
        console.log(topics);
        response.writeHead(200);
        response.end(html);
      })
    } else {
      db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
        var title = "-" + topic[0].title;
        var body0 = topic[0].title + `<p></p>` + topic[0].description;
        var list = ``; //template.list(topics); //topics에 들어있는 값은 객체로 들어있다
        var body1 = `  
          <p>      
          <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>
          </p>
          `;
        var body2 = ``;
        var html = template.HTML(title, body0, list, body1, body2);
        response.writeHead(200);
        response.end(html);
        })
      })
    }
  } else if (pathname === '/create') {
    //db.query(`SELECT * FROM topic`, function(err, topics){
      var title = "-문제 만들기";
      var body0 = `
      <h2><a href="/create">문제 만들기</a></h2>
      <form action="/create_process" method="post">                    

        <label for="question_title">제목:</label>
        <input type="text" id="question_title" name="question_title" placeholder="제목"required />

        <label for="question_file">첨부 파일:</label>
        <input type="file" id="question_file" name="question_file" accept=".pdf,.doc,.docx,.jpg,.png" />

        <label for="question_description">내용:</label>
        <textarea id="question_description" name="question_description" rows="5" placeholder="내용" required></textarea>

        <!-- <label for="question_answer">정답:</label> -->
        <!-- <input type="text" id="question_answer" name="question_answer" placeholder="정답" required /> -->
        
        <label for="question_user">글쓴이:</label>
        <input type="text" id="question_user" name="question_user" placeholder="글쓴이" required />

        <ul id="tag-list"></ul>

        <button type="submit" value="Submit">확인</button>
      </form>
      `;
      var list = ``;
      var body1 = ``;
      var body2 = ``;
      var html = template.HTML(title, body0, list, body1, body2);
      response.writeHead(200);
      response.end(html);
} else if (pathname === '/create_process') {
  let body = '';
  request.on('data', function (data) {
    body = body + data;
  });

  request.on('end', function(){
    var post = qs.parse(body);

    db.query(`
      INSERT INTO topic (title, description, created, author_id) 
        VALUES(?, ?, NOW(), ?)`,
      [post.question_title, post.question_description, 1], 
      function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${result.insertId}`}); //node js에 추가된 행에 대한 아이디 값으로 이동동
        response.end();
      }
    )
  });
} else if (pathname === '/update') {
    db.query('SELECT * FROM topic', function(error, topics){
      if(error){
        throw error;
      }
      db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
        if(error2){
          throw error2;
        }
    var title = "-문제 수정";
    var body0 = ``;
    var list = template.list(topics);
    var body1 = `
      <form action="/update_process" method="post">
      <input type="hidden" name="id" value="${topic[0].id}">
      <p>
        <input type="text" name="question_title" placeholder="question_title" value="${topic[0].title}">
      </p>
      <p>
        <textarea name="question_description" placeholder="question_description">${topic[0].description}</textarea>
      </p>
      <p>
        <input type="text" name="question_user" placeholder="question_user" value="${topic[0].author_id}">
      </p>
      <p>
        <input type="submit">
      </p>
      </form>
    `;
    var body2 = ``;
    var html = template.HTML(title, body0, list, body1, body2);
    response.writeHead(200);
    response.end(html);
    });
  });
} else if (pathname === '/update_process') {
  var body = '';
      request.on('data', function(data){
      body += data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?', [post.question_title, post.question_description, post.id], function(error, result){
          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();
        })
    });
} else if (pathname === '/ranking') {
    var title = '-랭킹';
    var body0 = `
    <h1>사용자 랭킹</h1>
    <table>
        <tr>
            <th>순위</th>
            <th>이름</th>
            <th>맞춘 문제</th>
            <th>제출한 문제수</th>
            <th>정답 비율</th>
        </tr>
        <!-- 데이터는 백엔드에서 동적으로 렌더링될 것입니다. -->
    </table>

    <script src="script.js"></script>
    <style>
        body {
            background-color: #f4f4f4;
            font-family: 'Arial', sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
        }

        h1 {
            color: #333;
            padding: 20px 0;
            font-size: 32px;
        }

        .container {
            width: 80%;
            margin: 0 auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        th, td {
            padding: 15px;
            text-align: center;
        }

        th {
            background-color: #333;
            color: #fff;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #e0e0e0;
        }
        a {
            text-decoration: none;
            color: #333; /* 사용자 이름에 대한 링크 색상 */
            font-weight: bolder;
        }
    </style>
    `;
    var list = ``;
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(title, body0, list, body1, body2);        
    response.writeHead(200);
    response.end(html);
} else if (pathname === '/login') {
    var title = '-로그인';
    var body0 = `
      <header>
        <h2>Login</h2>
        <style>
        header{
          display:flex;
          justify-content: center;
      }
      form{
          padding:10px;
      }
      .input-box{
          position:relative;
          margin:10px 0;
      }
      .input-box > input{
          background:transparent;
          border:none;
          border-bottom: solid 1px #ccc;
          padding:20px 0px 5px 0px;
          font-size:14pt;
          width:100%;
      }
      input::placeholder{
          color:transparent;
      }
      input:placeholder-shown + label{
          color:#aaa;
          font-size:14pt;
          top:15px;

      }
      input:focus + label, label{
          color:#8aa1a1;
          font-size:10pt;
          pointer-events: none;
          position: absolute;
          left:0px;
          top:0px;
          transition: all 0.2s ease ;
          -webkit-transition: all 0.2s ease;
          -moz-transition: all 0.2s ease;
          -o-transition: all 0.2s ease;
      }

      input:focus, input:not(:placeholder-shown){
          border-bottom: solid 1px #8aa1a1;
          outline:none;
      }
      input[type=submit]{
          background-color: #000000;
          border:none;
          color:white;
          border-radius: 5px;
          width:100%;
          height:35px;
          font-size: 14pt;
          margin-top:100px;
      }
      #forgot{
          text-align: right;
          font-size:12pt;
          color:rgb(164, 164, 164);
          margin:10px 0px;
          display: inline-block; /* 요소를 가로로 정렬합니다. */
          margin-right: 20px; /* 각 요소 사이의 간격을 조절합니다. */
      }
        </style>
      </header>

      <form action="" method="POST">
        <div class="input-box">
            <input id="username" type="text" name="username" placeholder="아이디">
            <label for="username">아이디</label>
        </div>

        <div class="input-box">
            <input id="password" type="password" name="password" placeholder="비밀번호">
            <label for="password">비밀번호</label>
        </div>
        <div id="forgot">아이디 찾기</div>
        <div id="forgot">비밀번호 찾기</div>
        <div id="forgot">회원가입</div>
        <input type="submit" value="로그인">
      </form>
    `;
    var list = ``;
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(title, body0, list, body1, body2);        
    response.writeHead(200);
    response.end(html);
  } else if (pathname === '/signup') {
    var title = '-회원가입';
    var body0 = `
      <!-- 프로필 이미지 -->
      <div>
        <h3 class="join_title">
            <label for="profile-image">프로필 이미지 업로드</label>
        </h3>
        
        <span class="box int_name">
            <!-- 기본 이미지 -->
            <img id="profile-preview" src="https://picpac.kr/common/img/default_profile.png" alt="프로필 이미지" width="100">
            
            <!-- 이미지 업로드 버튼 -->
            <input type="file" id="profile-image" accept="image/*">
        </span>
        <span class="error_next_box"></span>
      </div>   
                
      <!-- wrapper -->
      <div id="wrapper">

        <!-- content-->
        <div id="content">
          <!-- ID -->
          <div>
            <h3 class="join_title">
                <label for="id">아이디</label>
            </h3>
            
            <span class="box int_id">
              <input type="text" id="id" class="int" maxlength="20">
            </span>
                                
            <span class="error_next_box"></span>
          </div>

          <!-- PW1 -->
          <div>
              <h3 class="join_title"><label for="pswd1">비밀번호</label></h3>
              <span class="box int_pass">
                  <input type="text" id="pswd1" class="int" maxlength="20">                     
              </span>
              <span class="error_next_box"></span>
          </div>

          <!-- PW2 -->
          <div>
            <h3 class="join_title"><label for="pswd2">비밀번호 재확인</label></h3>
            <span class="box int_pass_check">
                <input type="text" id="pswd2" class="int" maxlength="20">                      
            </span>
            <span class="error_next_box"></span>
          </div>

          <!-- NAME -->
          <div>
            <h3 class="join_title"><label for="name">닉네임</label></h3>
            <span class="box int_name">
              <input type="text" id="name" class="int" maxlength="20">
            </span>
            <span class="error_next_box"></span>
          </div>

          <!-- BIRTH -->
          <div>
              <h3 class="join_title"><label for="yy">생년월일</label></h3>

              <div id="bir_wrap">
                  <!-- BIRTH_YY -->
                  <div id="bir_yy">
                      <span class="box">
                          <input type="text" id="yy" class="int" maxlength="4" placeholder="년(4자)">
                      </span>
                  </div>

                        <!-- BIRTH_MM -->
                        <div id="bir_mm">
                            <span class="box">
                                <select id="mm" class="sel">
                                    <option>월</option>
                                    <option value="01">1</option>
                                    <option value="02">2</option>
                                    <option value="03">3</option>
                                    <option value="04">4</option>
                                    <option value="05">5</option>
                                    <option value="06">6</option>
                                    <option value="07">7</option>
                                    <option value="08">8</option>
                                    <option value="09">9</option>                                    
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </span>
                        </div>

                        <!-- BIRTH_DD -->
                        <div id="bir_dd">
                            <span class="box">
                                <input type="text" id="dd" class="int" maxlength="2" placeholder="일">
                            </span>
                        </div>

                    </div>
                    <span class="error_next_box"></span>    
                </div>
                <div>
                    <h3 class="join_title"><label for="question">비밀번호 찾기 질문/</label></h3>
                        <span class="box">
                            <select id="q" class="sel">
                                <option>질문</option>
                                <option value="01">이메일 주소는?</option>
                                <option value="02">나의 보물 1호는?</option>
                                <option value="03">좋아하는 색깔은?</option>
                                <option value="04">좋아하는 음식은?</option>
                                <option value="05">기억에 남는 추억의 장소는?</option>

                            </select>
                        </span>
                </div>
                <div>
                    <h3 class="join_title"><label for="answer">답변</label></h3>
                    <span class="box int_name">
                        <input type="text" id="answer" class="int" maxlength="20">
                    </span>
                    <span class="error_next_box"></span>
                </div>
                <!-- JOIN BTN-->
                <div class="btn_area">
                    <button type="button" id="btnJoin">
                        <span>가입하기</span>
                    </button>
                </div>
            </div> 
        </div>
    `;
    var list = ``;
    var body1 = ``;
    var body2 = ``;
    var html = template.HTML(title, body0, list, body1, body2);        
    response.writeHead(200);
    response.end(html);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);