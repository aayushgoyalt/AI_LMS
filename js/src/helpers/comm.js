'use strict';

const CHUNK_SIZE = 1024*1024;
const FILENAME_LENGTH = 64;
const EMPTY_CALLBACK = ()=>{};


const reconnectingWs = {
  ws: undefined,
  buffer: [],
  tempData: undefined,
  tempCallback: undefined,
  sending: false,
  location: undefined,
  init: function(location) {
    this.location = location;
    this.ws = new WebSocket(location);
    this.ws.onmessage = (message) => {
      this.tempData = undefined;
      this.sending = false;
      const callback = this.tempCallback;
      this.asyncSend();
      if ( callback ) { callback(message) }
      else { console.log(message); } // For testing only
    };
    this.ws.onerror = () => { this.ws.send(this.tempData); };
    this.ws.onclose = () => { this.ws = new WebSocket(this.location); };
    return this;
  },
  send: function(data, callback) {
    this.buffer.unshift([data, callback]);
    this.asyncSend();
  },
  deinit: function() {
    this.ws = undefined;
    this.buffer = [];
  },
  asyncSend: async function (parent){
    if (!parent) { parent = this; }
    switch (parent.ws.readyState){
      case parent.ws.CONNECTING: setTimeout(()=>{parent.asyncSend(parent);}, 10); return;
      case parent.ws.CLOSED: parent.ws = new WebSocket(location); return
    }
    if (parent.sending) { return; }
    parent.sending = true;
    if (parent.tempData) { parent.ws.send(parent.tempData); return ; }
    if (parent.buffer.length !== 0) {
      const data = parent.buffer.pop();
      parent.tempData = data[0];
      parent.tempCallback = data[1];
      parent.ws.send(parent.tempData);
      return ;
    }
    parent.sending = false;
    //setTimeout(()=>{parent.asyncSend(parent);}, 10);
  }
}

function hash(file) {
  const encoder = new TextEncoder()
  function xorArrays(arr1, arr2) {
    const maxLength = Math.max(arr1.length, arr2.length);
    const result = new Uint8Array(maxLength);
    for (let i = 0; i < maxLength; i++) {
      result[i] = (arr1[i] || 0) ^ (arr2[i] || 0);
    }
    return result;
  }
  const preHash = xorArrays(
    xorArrays(encoder.encode(""+file.type), encoder.encode(""+file.webkitRelativePath)),
    xorArrays(encoder.encode(""+file.name), encoder.encode(""+file.size))
  );
  return btoa(preHash).padEnd(FILENAME_LENGTH, "0").substring(0,FILENAME_LENGTH);
}

export default {
  ws: undefined,
  init: function(location) { if (location) {this.ws = reconnectingWs.init(location)} else {this.init('/ws')}; return this; },
  askText: function(callback) { this.ws.send(JSON.stringify({C:-1,M:''}), callback); return this; },
  askJson: function(callback) { this.ws.send(JSON.stringify({C:-2,M:''}), callback); return this; },
  clear: function(callback) { this.ws.send(JSON.stringify({C:0,M:""}), callback); return this; },
  addText: function(message, callback) { this.ws.send(JSON.stringify({C:1,M:message}), callback); return this; },
  addFile: function(file, callback) {
    const reader = new FileReader();
    const ws = this.ws;
    const _hash = hash(file);
    const filename = (new TextEncoder()).encode(_hash + '\0');
    const data = new Uint8Array(FILENAME_LENGTH + 1 + CHUNK_SIZE);
    data.set(filename);
    var offset = 0;
    reader.onload = () => {
      const chunk = new Uint8Array(reader.result);
      offset = offset + chunk.length;
      let d = data;
      //console.log(chunk.length, chunk);
      if (chunk.length !== CHUNK_SIZE){
        d = new Uint8Array(FILENAME_LENGTH + 1 + chunk.length);
        d.set(filename);
      }
      d.set(chunk, FILENAME_LENGTH + 1);
      //console.log(d);
      if (offset < file.size) {
        //console.log(offset);
        ws.send(d, EMPTY_CALLBACK);
        reader.readAsArrayBuffer(file.slice(offset, offset + CHUNK_SIZE));
      } else { ws.send(d, callback); ws.send(JSON.stringify({C:2,M:_hash})); }
    };
    reader.readAsArrayBuffer(file.slice(0, CHUNK_SIZE));
    return this;
  },
};

