import http from 'http';
import assert from 'assert';


describe('Server status', () => {
  it('server is running', done => {
    http.get('http://localhost:3000', res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});