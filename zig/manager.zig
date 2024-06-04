const std = @import("std");
const fs = std.fs;
const stderr = std.io.getStdErr().writer();
const stdout = std.io.getStdOut().writer();

const valid = "abcdefghijklmnopqrstuvwxyz" ++
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ++
              "0123456789 _";

inline fn isValidUsername(username: [:0]const u8) !bool{
  const at = std.mem.indexOfNone(u8, username, valid) orelse return true;

  try stderr.print("\n{s}\n", .{username});
  for (0..at) |_| { try stderr.print("~", .{}); }
  try stderr.print("^", .{});
  for ((at+1)..username.len) |_| { try stderr.print("~", .{}); }
  try stderr.print("\n", .{});

  try stderr.print("Username cannot contain special characters\n", .{});
  return false;
}

inline fn getDir(parent: fs.Dir, username: [:0]const u8) ?fs.Dir {
  return parent.openDir(username, .{}) catch null;
}

inline fn getAuth(udir: fs.Dir, password: [:0]const u8, allocator: std.mem.Allocator) !void {
  const file = udir.openFile(".password", .{}) catch {
    return error.@"getAuth openFile error";
  };
  defer file.close();
  const file_pass = file.readToEndAlloc(allocator, 1000) catch {
    return error.@"getAuth readToEndAlloc error";
  };
  _ = std.mem.indexOfDiff(u8, password, file_pass) orelse {
    try stdout.print("Auth Success\n", .{});
  };
  try stdout.print("Invalid Password\n", .{});
}

inline fn createUser(db: fs.Dir, username: [:0]const u8, password: [:0]const u8) !void {
  if (@TypeOf(db.openDir(username, .{})) == @TypeOf(std.fs.Dir)) return error.@"user already present";
  db.makeDir(username) catch return error.@"createUser makedir error";
  var udir = db.openDir(username, .{}) catch return error.@"createUser openDir error";
  defer udir.close();
  var file = udir.createFile(".password", .{}) catch return error.@"createUser createFile error";
  defer file.close();
  _ = file.write(password) catch return error.@"createUser write error";
  try stdout.print("User Created\n", .{});
}

inline fn changePass(db: fs.Dir, username: [:0]const u8, password: [:0]const u8) !void {
  const udir = getDir(db, username) orelse return error.@"changePass getDir error";
  var file = udir.createFile(".password", .{}) catch return error.@"createUser createFile error";
  defer file.close();
  _ = file.write(password) catch return error.@"createUser write error";
  try stdout.print("Password Changed\n", .{});
}

inline fn deleteUser(db: fs.Dir, username: [:0]const u8) !void {
  db.deleteTree(username) catch return error.@"deleteUser deleteTree error";
}

pub fn main() !void{
  var buffer: [1024]u8 = undefined;
  var Allocator = std.heap.FixedBufferAllocator.init(&buffer);
  const allocator = Allocator.allocator();

  const DB = try fs.cwd().openDir("db", .{});
  var args = std.process.args();
  _ = args.skip();

  const username = args.next() orelse {
    try stderr.print("Usages:\n\tmanager username [password]\nUsername Not Present\n", .{});
    return error.@"no username";
  };
  if (!(try isValidUsername(username))) return stdout.print("Invalid Username\n", .{});
  
  const password = args.next() orelse return stdout.print("User Exists\n", .{});
  const command = args.next() orelse {
    const udir = getDir(DB, username) orelse return stdout.print("User Does Not Exist\n", .{});
    return getAuth(udir, password, allocator);
  };

  if (std.mem.eql(u8, command, "create")) return createUser(DB, username, password);
  if (std.mem.eql(u8, command, "change")) return changePass(DB, username, password);
  if (std.mem.eql(u8, command, "delete")) return deleteUser(DB, username);
}

