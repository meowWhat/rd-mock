export const indexHtmlTemplate = `<html>
<head>
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
    integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
    crossorigin="anonymous"
  />
  <title>JSON Server</title>
</head>
<style>
  body {
    display: flex;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    flex-direction: column;
    padding: 0;
    margin: 0;
    color: #3b4252;
    letter-spacing: 0;
  }

  .container {
    max-width: 960px;
    margin: auto;
    padding: 1rem;
  }

  header {
    border-bottom: 1px solid #eee;
  }

  header a {
    color: inherit;
    text-decoration: none;
  }

  header a:hover {
    text-decoration: underline;
  }

  nav ul {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  nav li.title {
    flex-grow: 5;
    text-align: left;
    font-weight: bold;
    font-size: 1.4rem;
    color: #3b4252;
  }

  nav li {
    flex-grow: 1;
    align-self: center;
    text-align: right;
    color: #4c566a;
  }

  .fa-heart {
    color: deeppink;
  }

  main {
    flex: 1;
  }

  footer {
    margin-top: 4rem;
    border-top: 1px solid #eee;
  }

  h1 {
    margin-top: 4rem;
    font-weight: normal;
  }

  i {
    margin-right: 0.5rem;
  }

  a {
    color: #5e81ac;
  }

  a:hover {
    color: #81a1c1;
    text-decoration: underline;
  }

  table {
    margin-left: 0;
  }

  td {
    border: 0;
    padding: 0 1em 0.5em 0;
  }

  td:first-child {
    width: 1%;
    white-space: nowrap;
  }

  ul {
    list-style-position: inside;
    padding-left: 0;
  }

  li {
    list-style-type: none;
    margin-bottom: 0.2rem;
  }

  code {
    padding: 0.2rem;
    margin: 0rem 0.2rem;
    border-radius: 0.2rem;
    background: #e5e9f0;
  }
</style>
<body>
  <header>
    <div class="container">
      <nav>
        <ul>
          <li class="title">rd-mock</li>
          <li>
            <a href="https://github.com/meowWhat/rd-mock/">
              <i class="fas fa-heart"></i>GitHub
            </a>
          </li>
          <li>
            <a href="https://www.zhihu.com/people/chen-jia-hao-66-95">
              <i class="fas fa-burn"></i>Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <main>
    <div class="container">
      <h1>Congrats!</h1>
      <p>
        You're successfully running rd-mock
        <br />
        ✧*｡٩(ˊᗜˋ*)و✧*｡
      </p>
      <h1>Resources</h1>
      <div id="resources">
      #resources#
      </div>

      <p>To access and modify resources, you can use these HTTP method:</p>
      <p>
        <code>GET</code>
        <code>POST</code>
        <code>PUT</code>
        <code>DELETE</code>
      </p>

      <div id="custom-routes"></div>

      <h1>Documentation</h1>
      <p>
        <a href="https://github.com/meowWhat/rd-mock/"> README </a>
      </p>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>inspired by <code>json-serve</code> && <code>mockjs</code></p>
    </div>
  </footer>
</body>
</html>
`
