const std = @import("std");

inline fn runInstallDeps(b: *std.Build, cmdJs: [] const u8) *std.Build.Step {
  const InstallDeps = b.step("install-deps", "install all dependencies");
  const js = b.addSystemCommand(&.{ cmdJs, "install" });
  js.setCwd(b.path("js"));
  InstallDeps.dependOn(&js.step);
  const go = b.addSystemCommand(&.{"go"});
  go.setCwd(b.path("go"));
  go.addArgs(&.{ "mod", "tidy" });
  InstallDeps.dependOn(&go.step);
  return InstallDeps;
}

inline fn forceUpdateInstallDeps(b: *std.Build, cmdJs: [] const u8) *std.Build.Step {
  const UpdateInstallDeps = b.step("force-update-deps", "install all dependencies");
  const js = b.addSystemCommand(&.{ cmdJs, "update" });
  js.setCwd(b.path("js"));
  UpdateInstallDeps.dependOn(&js.step);
  const go = b.addSystemCommand(&.{ "go", "get", "-u", "./..." });
  go.setCwd(b.path("go"));
  UpdateInstallDeps.dependOn(&go.step);
  return UpdateInstallDeps;
}

inline fn buildFrontEnd(b: *std.Build, cmdJs: [] const u8) *std.Build.Step {
  const FrontEnd = b.step("front-end", "build front-end");
  const js = b.addSystemCommand(&.{cmdJs, "run", "build", "--", "--minify", "terser", "--outDir", b.fmt("{s}/dist", .{b.install_prefix}) });
  js.setCwd(b.path("js"));
  FrontEnd.dependOn(&js.step);
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
  const go = b.addSystemCommand(&.{ "go", "build", "-o", b.fmt("{s}/server", .{b.install_prefix}) });
  go.setCwd(b.path("go"));
  Server.dependOn(&go.step);
  return Server;
}

pub fn build(b: *std.Build) void {
  const optionBun = b.option(bool, "bun", "use bun for building. (Default is npm)") orelse false;

  const options = b.addOptions();
  options.addOption(bool, "version", optionBun);

  var cmdJs = "npm";
  if (optionBun) cmdJs = "bun";

  _ = runInstallDeps(b, cmdJs);
  _ = forceUpdateInstallDeps(b, cmdJs);
  b.getInstallStep().dependOn(buildFrontEnd(b, cmdJs));
  b.getInstallStep().dependOn(buildManager(b));
  b.getInstallStep().dependOn(buildServer(b));
}

