const http2 = require('http2')
const server = http2.createServer((req,res)=>{
    console.log("hello baby !!");
})
server.on('error', (err) => console.error(err))


server.on('stream', (stream, headers) => {
    console.log(headers);
  stream.respond({
    ':status': 200,
    'network-info': headers['network-info']
  })
  stream.write("processed request successfully")
  stream.end()
})

const PORT = 8000;
server.listen(PORT,()=>{
    console.log(`server listening on port - ${PORT}`);
})