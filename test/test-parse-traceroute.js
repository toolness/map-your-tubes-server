var should = require('should');

var parse = require('../lib/parse-traceroute');

describe('parse-traceroute', function() {
  describe('when given win32 output', function() {
    it('reports successful hops with hostnames', function() {
      parse('win32', '  6    10 ms     9 ms     7 ms  0.ae2.BR3.NYC4.ALTER.NET [140.222.229.99] ').should.eql({
        hop: 6,
        hostname: '0.ae2.BR3.NYC4.ALTER.NET',
        ip: '140.222.229.99'
      });
    });

    it('reports successful hops without hostnames', function() {
      parse('win32', '  7     8 ms     8 ms    11 ms  204.255.169.234 ').should.eql({
        hop: 7,
        ip: '204.255.169.234'
      });
    });

    it('reports unsuccessful hops', function() {
      parse('win32', ' 16     *        *        *     Request timed out.').should.eql({
        hop: 16
      });
    });

    it('ignores non-hop info', function() {
      should.not.exist(parse('win32', 'Trace complete.'));
    });
  });

  describe('when given non-win32 output', function() {
    it.skip('reports successful hops', function() {
      parse('linux', ' 1  104.131.223.253 (104.131.223.253)  5.123 ms  5.082 ms 104.131.223.254 (104.131.223.254)  0.201 ms').should.eql({
        hop: 1,
        ip: '104.131.223.253'
      });
    });

    it.skip('reports semi-successful hops', function() {
      parse('linux', ' 9  * 72.21.220.112 (72.21.220.112)  8.378 ms *').should.eql({
        hop: 9,
        ip: '72.21.220.112'
      });
    });

    it.skip('reports unsuccessful hops', function() {
      parse('darwin', '30  * * *').should.eql({
        hop: 30
      });
    });

    it('ignores non-hop info', function() {
      should.not.exist(parse('linux', 'traceroute to webmaker.org (54.221.248.83), 30 hops max, 60 byte packets'));
    });
  });
});
