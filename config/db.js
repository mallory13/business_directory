// create public connection string
module.exports = {

    // local
    // 'url': 'mongodb://localhost/test'

    // live on mLab
    'url' : 'mongodb://mallory:123456@ds042138.mlab.com:64748/businessDirectory',
    'githubClientId': '76abadef4cc2b1f55825',
    'githubClientSecret': '7b428cf081e0a2f29434d46a72116497ece36bb5',
    'githubCallbackUrl': 'http://localhost:3000/auth/github/callback'
    
};
