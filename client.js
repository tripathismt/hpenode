const http2 = require('http2')
const session = http2.connect('https://hperepo.onrender.com');
const networkHeader = require('./network.json')

const options = {
  ":path": '/',
  ":method": 'POST',
  'Content-Type': 'application/JSON',
  'network-info': JSON.stringify(networkHeader) 
};


const req = session.request(options)



req.setEncoding('utf8')
req.on('response', (headers) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`)
  }
})
let data = ''
req.on('data', (chunk) => { data += chunk })

req.on('end', () => {
  console.log(`\n${data}`)
  session.close()
})
req.on('error',(err)=>{
  console.log(err);
})

req.end()