'use strict';
const http = require('node:http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        if (req.url === '/') {
          res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケートフォーム</h1>' +
            '<a href="/enquetes">アンケート一覧</a>' +
            '</body></html>');
        } else if (req.url === '/enquetes') {
          res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケート一覧</h1><ul>' +
            '<li><a href="/enquetes/abe-ymgm">安倍晋三 or 山上徹也？</a></li>' +
            '<li><a href="/enquetes/jap-chong">どちらが死滅するべきですか？</a></li>' +
            '<li><a href="/enquetes/zozei-kento">岸田と言えば？</a></li>' +
            '</ul></body></html>');
        } else if (req.url === '/enquetes/abe-ymgm') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              title: '安倍晋三 or 山上徹也？',
              firstItem: '安倍晋三',
              secondItem: '山上徹也'
            })
          );
        } else if (req.url === '/enquetes/jap-chong') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              title: 'どちらが死滅するべきですか？',
              firstItem: 'ジャップ',
              secondItem: 'チョン'
            })
          );
        } else if (req.url === '/enquetes/zozei-kento') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              title: '岸田と言えば？',
              firstItem: '増税メガネ',
              secondItem: '検討士'
            })
          );
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
            console.info(`[${now}] ${body}`);
            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`
            );
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
