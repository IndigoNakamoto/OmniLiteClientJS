var LitecoinClient = require('litecoin').Client;

// TODO:
// Figure out why litecoin client methods are not being inherited
class LitecoinPromisesClient extends LitecoinClient {
  constructor(opts){
    super(opts)
  }

  callRpc(method, args){
    var client = this;
    var promise = null;
    var fn = args[args.length-1];
    if (typeof fn === 'function'){
      args.pop();
      this.rpc.call(method, args, function(){
        var args = [].slice.call(arguments);
        args.unshift(null);
        fn.apply(this, args);
      }, function(err){
        fn(err);
      });
    } else { 
      promise = new Promise(function(resolve, reject) {
        client.rpc.call(method, args, function(){
          var args = [].slice.call(arguments);
          args.unshift(null);
          resolve( args[1] );
        }, function(err){
          reject( err );
        });
      });
      return promise ;
    }
  } 
}

// This function is only called when it gets invoked by core methods?
// Invoked for core method getBlockCount: True
// Invoked for omni method omni_getinfo: False
(function() {
    let methods = Object.getOwnPropertyNames(LitecoinClient.prototype).filter(function(p) {
      return typeof LitecoinClient.prototype[p] === 'function' && p !== "cmd" && p!= "constructor";
    });
    // Augment them with callRPC
    for (let i = 0 ; i<methods.length ; i++ ) {
      let protoFn = methods[i];

      
      (function(protoFn) {
        // console.log(protoFn)
        LitecoinPromisesClient.prototype[protoFn] = function() {
          let args = [].slice.call(arguments);
          // TODO: Figure out why args never prints
          console.log("Method: ", protoFn)
          console.log('Arguments: ', arguments)
          
          return this.callRpc(protoFn.toLowerCase(), args);
        };
      })(protoFn);
    }
})();


// Manually include Omni and Litecoin Client Methods
const OmniClientCommands = {
    /*
    Blockchain
    */
   
    /*
    Wallet
    */
   signmessage: 'signmessage',

    /*
    Core Commands
    */
    getblockcount: 'getblockcount',
    getwalletinfo: 'getwalletinfo',
    listwalletdir: 'listwalletdir',
    listwallets: 'listwallets',
    /*
    Transaction creation
    https://github.com/OmniLite/OmniLite/blob/0.18.1/src/omnicore/doc/rpc-api.md#transaction-creation
    */
    omni_send: 'omni_send',
    omni_sendissuancefixed: 'omni_sendissuancefixed',
    omni_sendanydata: 'omni_sendanydata',
    /*
    Data Retrieval
    https://github.com/OmniLite/OmniLite/blob/0.18.1/src/omnicore/doc/rpc-api.md#data-retrieval
    */
    omni_getinfo: 'omni_getinfo',
    omni_getbalance: 'omni_getbalance',
    omni_getallbalancesforid: 'omni_getallbalancesforid',
    omni_getallbalancesforaddress: 'omni_getallbalancesforaddress',
    omni_getwalletbalances: 'omni_getwalletbalances',
    omni_getwalletaddressbalances: 'omni_getwalletaddressbalances',
    omni_gettransaction: 'omni_gettransaction',
    omni_listtransactions: 'omni_listtransactions',
    omni_listblocktransactions: 'omni_listblocktransactions',
    omni_listpendingtransactions: 'omni_listpendingtransactions',
    omni_listproperties: 'omni_listproperties',
    omni_getproperty: 'omni_getproperty',
    omni_getactivations: 'omni_getactivations',
    omni_getcurrentconsensushash: 'omni_getcurrentconsensushash',
    
};
  

class OmniClient extends LitecoinPromisesClient {
    constructor(opts) {
        super(opts);
    }
}


(function () {
    for (let method in OmniClientCommands) {
      (function(methodName) {
        OmniClient.prototype[methodName] = function() {
        let args = [].slice.call(arguments);
        return this.callRpc(OmniClientCommands[methodName], args);
        };
      })(method);
    }
})();


let omniClient = new OmniClient({
      host: 'localhost',
      port: 9332,
      user: 'user',
      pass: 'password',
      timeout: 30000,
      ssl: false/* true,
      sslStrict: true,
      sslCa: fs.readFileSync(__dirname + '/myca.cert')*/
    });


/*  ~~~~~~~ Works ~~~~~~~ */ 
// omniClient.getBlockCount().then(data => console.log(data))

// omniClient.omni_getinfo().then(data => console.log(data))

// omniClient.omni_getbalance("ME8Ae5SGUDjbfzSFQnJBzbv2m9r5zpqnQt",1)
//     .then(data => console.log(data))
//     .catch(error => console.error(error))

// omniClient.omni_gettransaction("d0558b1658d9bc417b139729c8f35bd15db319e8f1c00670a6202e593171f5e0")
//     .then(data => console.log(data))
//     .catch(error => console.error(error))

// omniClient.help().then(data => console.log(data))

// omniClient.omni_getproperty(265).then(data => console.log(data))

// omniClient.omni_getallbalancesforid(265).then(data => console.log(data))

// omniClient.omni_getactivations().then(data => console.log(data))

// omniClient.omni_getwalletbalances().then(data => console.log(data))

// omniClient.omni_getwalletaddressbalances().then(data => console.log(data))

// omniClient.omni_listpendingtransactions().then(data => console.log(data))

// omniClient.omni_sendissuancefixed("M8oGGVVBvSZGKd7r1rTjg1acRkYLe1UCFS", 1, 1, 0, "Image", "Profile Pic", "Indigo Nakamoto Profile Picture", "https://gateway.pinata.cloud/ipfs/QmX5Jwdrc41mG82KJW1is4LGQ3HrEFcT13Hjp8rYhXs8T4", "", "1") 