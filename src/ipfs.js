const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const data = $('#img').val();
const data2 = null;
ipfs.add(data,(err,hash) => {
    if(err){
        return console.log(err)
    }
    console.log('http://ipfs.infura.io/ipfs/'+hash)
    data2 = 'http://ipfs.infura.io/ipfs/'+hash;
})
