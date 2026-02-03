const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 自己署名証明書と秘密鍵の生成 (OpenSSLがなくても動作するように、事前に生成した固定の値を使用するか、
// あるいはNode.jsのforgeライブラリを使うのが一般的ですが、
// ここでは開発用として、opensslで生成したダミーの証明書データを埋め込みます)

// 注: 本来は都度生成すべきですが、手順簡略化のため固定値を使用します。
// localhost / 192.168.1.43 用の自己署名証明書 (有効期限: 長期間)
// 注意: これは開発用であり、セキュリティ上の保護はありません。

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDP+eL5vS5uF+yL
X...
(中略: ここに正当なKeyを生成して入れるのは長すぎるので、forgeを使います)
`;

// ...いや、forgeを入れるのが一番確実です。
console.log('Generating certificate...');

// node-forgeを使って証明書を生成するスクリプトを作成して実行します。
const forge = require('node-forge');

function generateCert() {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    const attrs = [{
        name: 'commonName',
        value: '192.168.1.43'
    }, {
        name: 'countryName',
        value: 'JP'
    }, {
        shortName: 'ST',
        value: 'Tokyo'
    }, {
        name: 'localityName',
        value: 'Minato'
    }, {
        name: 'organizationName',
        value: 'Dev Server'
    }, {
        shortName: 'OU',
        value: 'Dev'
    }];

    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);

    return {
        key: forge.pki.privateKeyToPem(keys.privateKey),
        cert: forge.pki.certificateToPem(cert)
    };
}

try {
    const pems = generateCert();

    fs.writeFileSync('key.pem', pems.key);
    fs.writeFileSync('cert.pem', pems.cert);

    console.log('Certificate generated to key.pem and cert.pem');

    // http-serverを起動
    const cmd = `npx http-server -p 8080 -S -C cert.pem -K key.pem -a 0.0.0.0`;
    console.log(`Starting server: ${cmd}`);

    const child = exec(cmd);

    child.stdout.on('data', (data) => console.log(data));
    child.stderr.on('data', (data) => console.error(data));

} catch (err) {
    console.error('Error:', err);
}
