'use strict';

const CHUNK_SIZE = 1024 * 1024;

const reconnectingWs = {
  ws: undefined,
  buffer: [],
  tempData: undefined,
  tempCallback: undefined,
  init: function(location) {
    this.ws = new WebSocket(location);
    this.ws.onmessage = (_) => {
      if (tempCallback) tempCallback(e);
      if (this.buffer.length !== 0) {
        const data = this.buffer.pop();
        this.tempData = data[0];
        this.tempCallback = data[1];
        this.ws.send(this.tempData);
      }
    };
    this.ws.onerror   = () => { this.ws.send(this.tempData); };
    this.ws.onclose   = () => { this.ws = new WebSocket(location); };
    this.ws.onconnect = () => {console.log(me, "Done", this);}
    this.ws.onerror   = () => {console.log(me, "Done", this);}
  },
  send: function(data, callback) {
    this.buffer.unshift([data, callback]);
    if (this.buffer.length !== 0) {
      const data = this.buffer.pop();
      this.ws.send(data[0]);
      this.tempCallback = data[1];
    }
  },
  deinit: function() {
    this.ws = undefined;
    this.buffer = [];
  },
}

export default RPC = {
  ws: undefined,
  init: function(location) { this.ws = reconnectingWs.init(location); },
  askText: function() { this.ws.send(JSON.stringify({C:-1,M:message})); },
  askJson: function() { this.ws.send(JSON.stringify({C:-2,M:message})); },
  clear: function() { this.ws.send(JSON.stringify({C:-2,M:""})); },
  addText: function(message) { this.ws.send(JSON.stringify({C:-1,M:message})); },
  addFile: function(file) {
    let reader = new FileReader();
    const filename = hash(file) + '\0';
    reader.onload = (e) => {

      const chunk = new Uint8Array(e.target.result);
      const data = new Uint8Array(filename.length + chunk.length);

      data.set(new TextEncoder().encode(filename));
      data.set(chunk, filename.length);
      this.ws.send(data);
      //console.log(data);
      if (reader.readyState === FileReader.DONE) { return; }
      reader.readAsArrayBuffer(file.slice(reader.result.length, reader.result.length + CHUNK_SIZE));
    };
    reader.readAsArrayBuffer(file.slice(0, CHUNK_SIZE));
  },
};

