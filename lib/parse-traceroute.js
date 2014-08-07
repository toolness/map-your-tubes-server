function parseWin32(line) {
  return {};
}

function parseUnix(line) {
  return {};
}

module.exports = function(platform, line) {
  if (platform == 'win32')
    return parseWin32(line);
  return parseUnix(line);
};
