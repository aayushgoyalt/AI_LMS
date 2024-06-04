const std = @import("std");

inline fn buildManager(b: *std.Build) *std.Build.step {
  const Manager = b.step("manager", "build the db manager");
  const exe = b.addExecutable(.{
    .name = "manager",
    .root_source_file = b.path("zig/manager.zig"),
    .target = b.host,
    .optimize = .ReleaseSafe,
  });
  const install_artifact = b.addInstallArtifact(exe, .{
    .dest_dir = .{ .override = .prefix },
  });
  Manager.dependOn(&install_artifact.step);
  return Manager;
}

inline fn buildServer(b: *std.Build) *std.Build.step {
  const Server = b.step("server", "build the go server");
  const go = b.addSystemCommand(&.{"go"});
  go.setCwd(b.path("go"));
  go.addArgs(&.{ "build", "-o" });
  const out = go.addOutputFileArg("server");
  
  Server.dependOn(&go.step);
  Server.dependOn(&b.addInstallFile(out, "server").step);
  return Server;
}

inline fn buildFrontEnd(b: *std.Build) *std.Build.step {
  const FrontEnd = b.step("fornt-end", "build front-end");
  const go = b.addSystemCommand(&.{"bun", "npm"});
  go.setCwd(b.path("js"));
  go.addArgs(&.{ "run", "build" });
  
  FrontEnd.dependOn(&b.addInstallFile(b.path("js", "dist"), "dist").step);
  return FrontEnd;
}

pub fn build(b: *std.Build) void {
  const server = buildServer(b);
  b.getInstallStep().dependOn(&server.step);
  const manager = buildManager(b);
  b.getInstallStep().dependOn(&manager.step);
  const frontend = buildManager(b);
  b.getInstallStep().dependOn(&frontend.step);
}
