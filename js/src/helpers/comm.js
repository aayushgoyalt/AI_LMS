'use strict';

const CHUNK_SIZE = 1024 * 1024;

const reconnectingWs = {
  ws: undefined,
  buffer: [],
  tempData: undefined,
  tempCallback: undefined,
  init: function(location) {
    this.ws = new WebSocket(location);
    this.ws.onmessage = (message) => {
      console.log(this);
      if (this.tempCallback != undefined) { this.tempCallback(message) }
      else { console.log(message) } // For testing only
      if (this.buffer.length !== 0) {
        const data = this.buffer.pop();
        this.tempData = data[0];
        this.tempCallback = data[1];
        this.ws.send(this.tempData);
      }
    };
    this.ws.onerror = () => { this.ws.send(this.tempData); };
    this.ws.onclose = () => { this.ws = new WebSocket(location); };
    return this;
  },
  send: function(data, callback) {
    this.buffer.unshift([data, callback]);
    if (this.buffer.length !== 0) {
      const data = this.buffer.pop();
      this.tempData = data[0];
      this.tempCallback = data[1];
      this.ws.send(data[0]);
    }
  },
  deinit: function() {
    this.ws = undefined;
    this.buffer = [];
  },
}

export default {
  ws: undefined,
  init: function(location) { if (location) {this.ws = reconnectingWs.init(location)} else {this.init('/ws')}; return this; },
  askText: function(callback) { this.ws.send(JSON.stringify({C:-1,M:''}), callback); return this; },
  askJson: function(callback) { this.ws.send(JSON.stringify({C:-2,M:''}), callback); return this; },
  clear: function(callback) { this.ws.send(JSON.stringify({C:0,M:""}), callback); return this; },
  addText: function(message, callback) { this.ws.send(JSON.stringify({C:1,M:message}), callback); return this; },
  addFile: function(file, callback) {
    let reader = new FileReader();
    const filename = hash(file) + '\0';
    reader.onload = (e) => {
      const chunk = new Uint8Array(e.target.result);
      const data = new Uint8Array(filename.length + chunk.length);

      data.set(new TextEncoder().encode(filename));
      data.set(chunk, filename.length);
      if (reader.readyState === FileReader.DONE) { this.ws.send(data, callback);return; }
      this.ws.send(data, undefined);
      //console.log(data);
      reader.readAsArrayBuffer(file.slice(reader.result.length, reader.result.length + CHUNK_SIZE));
    };
    reader.readAsArrayBuffer(file.slice(0, CHUNK_SIZE));
    return this;
  },
};

