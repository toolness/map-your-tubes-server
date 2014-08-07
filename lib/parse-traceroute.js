function parseWin32(line) {

}

function parseUnix(line) {

}

module.exports = function(platform, line) {
  if (platform == 'win32')
    return parseWin32(line);
  return parseUnix(line);
};
