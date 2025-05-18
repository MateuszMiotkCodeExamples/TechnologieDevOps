// 2_using_dockerfile/index.js
console.log("Witaj z przykładowej aplikacji Node.js!");

const http = require('http');

const hostname = '0.0.0.0'; // Nasłuchuj na wszystkich interfejsach
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Witaj Świecie z Node.js działającego w kontenerze Docker zbudowanym przez Jenkins!\n');
});

server.listen(port, hostname, () => {
  console.log(`Serwer działa pod adresem http://${hostname}:${port}/`);
  console.log("Narzędzia dostępne w środowisku:");
  const { exec } = require('child_process');
  exec('npm run versions', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) console.log(`stdout:\n${stdout}`);
    if (stderr) console.error(`stderr:\n${stderr}`);
  });
});
