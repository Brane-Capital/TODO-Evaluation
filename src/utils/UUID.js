// UUID V4
// Adapted from: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
// TODO: change the rng from math random to something more reliable.
function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default UUID;
