const std = @import("std");
const stderr = std.io.getStdErr().writer();
const stdio = std.io.getStdOut().writer();

const UP = struct{[:0]const u8, [:0]const u8};

const valid = "abcdefghijklmnopqrstuvwxyz" ++
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ++
              "0123456789 _";

inline fn isValidUsername(username: [:0]const u8) !void{
  const at = std.mem.indexOfNone(u8, username, valid) orelse return ;

  try stderr.print("\n{s}\n", .{username});
  for (0..at) |_| { try stderr.print("~", .{}); }
  try stderr.print("^", .{});
  for ((at+1)..username.len) |_| { try stderr.print("~", .{}); }
  try stderr.print("\n", .{});

  try stderr.print("Username cannot contain special characters", .{});
  return error.@"Invalid Username";
}

fn getUP() !UP {
  var args = std.process.args();
  _ = args.skip();
  const username = args.next() orelse {
    try stderr.print("Usages:\n\tmanager [username] [password]\nUsername Not Present", .{});
    return error.@"No Username";
  };
  try isValidUsername(username);

  const password = args.next() orelse {
    try stderr.print("Usages:\n\tmanager [username] [password]\nPassword Not Present", .{});
    return error.@"No Password";
  };
  return .{username, password};
}

pub fn main() !void{
  const x = try getUP();
  try stderr.print("{s}\n{s}\n", .{x.@"0", x.@"1"});
}

