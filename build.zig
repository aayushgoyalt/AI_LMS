const std = @import("std");

inline fn runInstallDeps(b: *std.Build) *std.Build.Step {
  const InstallDeps = b.step("install-deps", "install all dependencies");
  const js = b.addSystemCommand(&.{"npm"});
  js.setCwd(b.path("js"));
  js.addArgs(&.{ "install" });
  InstallDeps.dependOn(&js.step);
  const go = b.addSystemCommand(&.{"go"});
  go.setCwd(b.path("go"));
  go.addArgs(&.{ "mod", "tidy" });
  InstallDeps.dependOn(&go.step);
  return InstallDeps;
}
inline fn forceUpdateInstallDeps(b: *std.Build) *std.Build.Step {
  const UpdateInstallDeps = b.step("force-update-deps", "install all dependencies");
  const js = b.addSystemCommand(&.{"npm"});
  js.setCwd(b.path("js"));
  js.addArgs(&.{ "update" });
  UpdateInstallDeps.dependOn(&js.step);
  const go = b.addSystemCommand(&.{"go"});
  go.setCwd(b.path("go"));
  go.addArgs(&.{ "get", "-u", "./..." });
  UpdateInstallDeps.dependOn(&go.step);
  return UpdateInstallDeps;
}

inline fn buildFrontEnd(b: *std.Build) *std.Build.Step {
  const FrontEnd = b.step("front-end", "build front-end");
  const js = b.addSystemCommand(&.{"npm"});
  js.setCwd(b.path("js"));
  js.addArgs(&.{ "run", "build" });
  FrontEnd.dependOn(&js.step);
  const dist: std.Build.Step.InstallDir.Options = .{
    .source_dir = b.path("js/dist"),
    .install_dir = .{ .prefix = undefined },
    .install_subdir = "dist",
  };
  FrontEnd.dependOn(&b.addInstallDirectory(dist).step);
  return FrontEnd;
}
inline fn buildManager(b: *std.Build) *std.Build.Step {
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
inline fn buildServer(b: *std.Build) *std.Build.Step {
  const Server = b.step("server", "build the go server");
  const go = b.addSystemCommand(&.{"go"});
  go.setCwd(b.path("go"));
  go.addArgs(&.{ "build", "-o" });
  const out = go.addOutputFileArg("server");
  Server.dependOn(&go.step);
  Server.dependOn(&b.addInstallFile(out, "server").step);
  return Server;
}


pub fn build(b: *std.Build) void {
  _ = runInstallDeps(b);
  _ = forceUpdateInstallDeps(b);

  b.getInstallStep().dependOn(buildFrontEnd(b));
  b.getInstallStep().dependOn(buildManager(b));
  b.getInstallStep().dependOn(buildServer(b));
}
