var litecoin = require('litecoin');

var client = new litecoin.Client({
  host: 'localhost',
  port: 9332,
  user: 'user',
  pass: 'password',
  timeout: 30000,
  ssl: false/* true,
  sslStrict: true,
  sslCa: fs.readFileSync(__dirname + '/myca.cert')*/
});

client.getNetworkHashPs(function(err, hashps) {
    if (err) console.error(err);
    console.log('Network Hash Rate: ' + hashps);
  });

client.getBalance('*', 6, function(err, balance) {
    if (err) console.error(err);
    console.log('Balance: ' + balance);
  });

client.getBlockCount(function(err, count){
    if (err) console.error(err)
    console.log('Block count: ' + count)
})
