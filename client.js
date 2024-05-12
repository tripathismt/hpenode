const http2 = require('http2');
const { setTimeout } = require('timers/promises');
const networkHeader = require('./network.json');

const session = http2.connect('http://localhost:8000');

session.on('error', (err) => {
  console.error('Session error:', err);
});

session.on('close', () => {
  console.log('Session closed');
});

let interval;
let requestsMade = 0;

const exponentialBackoff = (attempt) => {
  return Math.min(1000 * Math.pow(2, attempt), 30000); 
};

const servercall = async (attempt = 0) => {
  if (requestsMade >= 20) return; 

  const num = Math.floor(Math.random() * networkHeader.length);

  const options = {
    ":path": networkHeader[num][":path"],
    ":method": networkHeader[num][":method"],
    "Content-Type": "application/json",
    "network-info": JSON.stringify(networkHeader[num]["network-info"]),
  };

  const req = session.request(options);

  req.setEncoding("utf8");

  req.on("response", (headers) => {
    console.log('Response headers:', headers);
  });

  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    console.log('Request ended');
    requestsMade++;
    if (requestsMade >= 20) {
      clearInterval(interval); 
      session.close((err) => {
        if (err) {
          console.error('Error closing session:', err);
        }
      }); 
    }
  });

  req.on("error", async (err) => {
    console.error('Request error:', err);
    if (attempt < 5) {
      const delay = exponentialBackoff(attempt);
      console.log(`Retrying request in ${delay}ms (attempt ${attempt + 1})`);
      await setTimeout(delay);
      servercall(attempt + 1); 
    } else {
      console.error('Maximum retries reached. Unable to complete request.');
    }
  });

  req.on("close", () => {
    console.log('Stream closed');
  });

  req.end();
};

(async () => {
  interval = setInterval(async () => {
    await servercall();
  }, 1000); 
})();
