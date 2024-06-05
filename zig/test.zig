const std = @import("std");
const fs = std.fs;
const len = std.mem.len;
const stderr = std.io.getStdErr().writer();
const stdout = std.io.getStdOut().writer();

const valid = "abcdefghijklmnopqrstuvwxyz" ++
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ++
              "0123456789 _";

export fn isValidUsername(username: [*:0]const u8) bool {
  _ = std.mem.indexOfNone(u8, username[0..len(username)], valid) orelse return true;
  return false;
}

export fn getAuth(username: [*:0]const u8, password: [*:0]const u8) bool {
  var buff: [256]u8 = undefined;

  var DB = fs.cwd().openDir("db", .{}) catch return false;
  defer DB.close();
  var udir = DB.openDir(username[0..len(username)], .{}) catch return false;
  defer udir.close();
  const file = udir.openFile(".password", .{}) catch return false;
  defer file.close();

  _ = file.read(&buff) catch return false;
  _ = std.mem.indexOfDiff(u8, password[0..len(password)], &buff) orelse return true;
  return false;
}

export fn createUser(username: [*:0]const u8, password: [*:0]const u8) bool {
  var DB = fs.cwd().openDir("db", .{}) catch return false;
  defer DB.close();

  if (@TypeOf(DB.openDir(username[0..len(username)], .{})) == @TypeOf(std.fs.Dir)) return false;

  DB.makeDir(username[0..len(username)]) catch return false;

  var udir = DB.openDir(username[0..len(username)], .{}) catch return false;
  defer udir.close();
  var file = udir.createFile(".password", .{}) catch return false;
  defer file.close();

  _ = file.write(password[0..len(password)]) catch return false;
  return true;
}

export fn changePass(username: [*:0]const u8, password: [*:0]const u8) bool {
  var DB = fs.cwd().openDir("db", .{}) catch return false;
  defer DB.close();
  var udir = DB.openDir(username[0..len(username)], .{}) catch return false;
  defer udir.close();
  var file = udir.createFile(".password", .{}) catch return false;
  defer file.close();

  _ = file.write(password[0..len(password)]) catch return false;
  return true;
}

export fn deleteUser(username: [*:0]const u8) bool {
  var DB = fs.cwd().openDir("db", .{}) catch return false;
  defer DB.close();

  DB.deleteTree(username[0..len(username)]) catch return false;
  return true;
}

