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
  const file_pass = file.readToEndAlloc(allocator, 2048) catch {
    return error.@"getAuth readToEndAlloc error";
  };
  _ = std.mem.indexOfDiff(u8, password, file_pass) orelse {
    try stdout.print("Auth Success", .{});
  };
  try stdout.print("Invalid Password", .{});
}

inline fn createUser(db: fs.Dir, username: [:0]const u8, password: [:0]const u8) !void {
  db.makeDir(username) catch return error.@"createUser makedir error";
  var udir = db.openDir(username, .{}) catch return error.@"createUser openDir error";
  defer udir.close();
  var file = udir.createFile(".password", .{}) catch return error.@"createUser createFile error";
  defer file.close();
  _ = file.write(password) catch return error.@"createUser write error";
}

inline fn deleteUser(db: fs.Dir, username: [:0]const u8) !void {
  db.deleteTree(username) catch return error.@"deleteUser deleteTree error";
}

pub fn main() !void{
  var buffer: [4 << 10]u8 = undefined;
  const DB = try fs.cwd().openDir("db", .{});
  var Allocator = std.heap.FixedBufferAllocator.init(&buffer);
  var allocator = Allocator.allocator();
  _ = &allocator;
  var args = std.process.args();
  _ = args.skip();

  const username = args.next() orelse {
    try stderr.print("Usages:\n\tmanager username [password]\nUsername Not Present\n", .{});
    return error.@"no username";
  };
  if (!(try isValidUsername(username))) {
    try stdout.print("Invalid Username\n", .{});
    return ;
  }
  const udir = getDir(DB, username) orelse {
    try stdout.print("User Does Not Exist\n", .{});
    return ;
  };

  const password = args.next() orelse {
    try stdout.print("User Exists\n", .{});
    return ;
  };

  const command = args.next() orelse {
    return getAuth(udir, password, allocator);
  };

  if (std.mem.eql(u8, command, "create")) {
    try createUser(DB, username, password);
    try stdout.print("User Created");
    return ;
  }
  // return .{username, password};
  // try stderr.print("{s}\n{s}\n", .{x.@"0", x.@"1"});
}

