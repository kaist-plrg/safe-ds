const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const stateName = path.join(__dirname, "state.json");
const outputName = path.join(__dirname, "output.json");
const resultName = path.join(__dirname, "ds-jalangi.result");
const tmpName = path.join(__dirname, "tmp-ds-jalangi.result");
const allCPFileName = path.join(__dirname, "allEntryControlPoints.result");
const cmdArr = [
  'node',
  path.join(__dirname, 'direct_vanilla.js')
].concat([...process.argv].slice(2));
const cmd = cmdArr.join(" ");

let count = 0;

(function () {
  var eof = "###EOF###";
  var net = require('net');

  var HOST = '127.0.0.1';
  var PORT = 8000;

  var bufString = "";
  var data = [];
  net.createServer(function(sock) {
      // We have a connection - a socket object is assigned to the connection automatically
      //console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
      
      // Add a 'data' event handler to this instance of socket
      sock.on('data', function(buf) {
        //console.log('DATA ' + sock.remoteAddress + ': ' + buf);
        // Write the data back to the socket, the client will receive it as data from the server

        if(buf.length === 1 && buf[0] === 10) return;
        bufString = buf.toString();
        data.push(bufString);
        if(bufString.endsWith(eof)){
          count++;

          data = data.join("");
          data = data.substring(0, data.length - eof.length);

          fs.writeFileSync("state.json", data);
          //fs.writeFileSync("state" + count + ".json", data);
          let startTime = new Date();
          try {
            console.warn(`TRIAL: ${count}`);
            const log = execSync(cmd, { timeout: 5000 });
            console.log(log.toString());

            let alarms = "";
            if(fs.existsSync(resultName)) {
              alarms = fs.readFileSync(resultName).toString();
            }
            const tmp = fs.readFileSync(tmpName).toString();
            const elapsed = (new Date() - startTime);
            const acc = (alarms + `\nTRIAL: ${count}\n` + tmp).trim();
            fs.writeFileSync(resultName, acc);
          } catch (e) {
            console.warn(`[TIMEOUT] 5 seconds`);
            console.warn();
            const input = JSON.parse(data);
            const allCPs = fs.readFileSync(allCPFileName).toString().split("\n");
            allCPs.pop();
            fs.writeFileSync(outputName, JSON.stringify({
              fid: input.fid,
              state: "__BOT__",
              visitedEntryControlPoints: [...new Set(allCPs)],
              traceParition: input.traceParition,
              timeout: true
            }));
            let alarms = "";
            if(fs.existsSync(resultName)) {
              alarms = fs.readFileSync(resultName).toString();
            }
            const elapsed = (new Date() - startTime);
            const acc = (alarms + `\nTRIAL: ${count}\nTIME: ${elapsed} ms`).trim();
            fs.writeFileSync(resultName, acc);
          }

          const output = fs.readFileSync(outputName).toString();
          //fs.writeFileSync("output" + count + ".json", output);
          sock.end(output + "\r\n");

          //if(++count === 2) process.exit();
          data = [];
        }
      });
      
      // Add a 'close' event handler to this instance of socket
      sock.on('close', function(data) {
        console.log('CLOSED');
      });
      
  }).listen(PORT, HOST);

  console.log('Server listening on ' + HOST +':'+ PORT);
})();
