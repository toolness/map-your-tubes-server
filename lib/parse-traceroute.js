function parseWin32(line) {
  var hop = parseInt(line.slice(0, 3));
  var hostinfo = line.slice(32).trim().match(/^([A-Za-z0-9\-_.]+)( \[([0-9.]+)\])?$/);

  if (isNaN(hop)) return;
  if (!hostinfo) return {hop: hop};
  if (hostinfo[3])
    return {
      hop: hop,
      hostname: hostinfo[1],
      ip: hostinfo[3]
    };
  return {hop: hop, ip: hostinfo[1]};
}

function parseUnix(line) {
  var hop = parseInt(line.slice(0, 2));
  var hostinfo = line.match(/([A-Za-z0-9\-_.]+) \(([0-9.]+)\)/);

  if (isNaN(hop)) return;
  if (!hostinfo) return {hop: hop};
  if (hostinfo[1] == hostinfo[2])
    return {
      hop: hop,
      ip: hostinfo[2]
    };
  return {
    hop: hop,
    hostname: hostinfo[1],
    ip: hostinfo[2]
  };
}

module.exports = function(platform, line) {
  if (platform == 'win32')
    return parseWin32(line);
  return parseUnix(line);
};
