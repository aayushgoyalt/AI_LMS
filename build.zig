const std = @import("std");

inline fn runInstallDeps(b: *std.Build, cmdJs: [] const u8) *std.Build.Step {
  const InstallDeps = b.step("install-deps", "install all dependencies");

  const js = b.addSystemCommand(&.{ cmdJs, "install" });
  js.setCwd(b.path("js"));
  const go = b.addSystemCommand(&.{ "go", "mod", "tidy" });
  go.setCwd(b.path("go"));

  InstallDeps.dependOn(&js.step);
  InstallDeps.dependOn(&go.step);

  return InstallDeps;
}

inline fn forceUpdateInstallDeps(b: *std.Build, cmdJs: [] const u8) *std.Build.Step {
  const UpdateInstallDeps = b.step("force-update-deps", "install all dependencies");

  const js = b.addSystemCommand(&.{ cmdJs, "update" });
  js.setCwd(b.path("js"));
  const go = b.addSystemCommand(&.{ "go", "get", "-u", "./..." });
  go.setCwd(b.path("go"));

  UpdateInstallDeps.dependOn(&js.step);
  UpdateInstallDeps.dependOn(&go.step);

  return UpdateInstallDeps;
}

inline fn buildFrontEnd(b: *std.Build, cmdJs: [] const u8, optionWatch :bool) *std.Build.Step {
  const FrontEnd = b.step("front-end", "build front-end");

  const js = b.addSystemCommand(&.{cmdJs, "run", "build", "--", "--emptyOutDir", "--minify", "terser", "--outDir", b.fmt("{s}/dist", .{b.install_prefix}) });
  js.setCwd(b.path("js"));

  if (optionWatch) js.addArg("--watch");

  FrontEnd.dependOn(&js.step);

  return FrontEnd;
}

inline fn buildServer(b: *std.Build, optionWatch :bool) *std.Build.Step {
  const Server = b.step("server", "build the go server");

  const go = b.addSystemCommand(&.{ "go", "build", "-o", b.fmt("{s}/server", .{b.install_prefix}) });
  go.setCwd(b.path("go"));

  Server.dependOn(&go.step);

  if (optionWatch) {
    const server = b.addSystemCommand(&.{ "./server" });
    server.setCwd(std.Build.LazyPath{ .path = b.install_prefix });
    Server.dependOn(&server.step);
  }

  return Server;
}

pub fn build(b: *std.Build) void {
  const optionBun = b.option(bool, "bun", "use bun for building. (Default is npm)") orelse false;

  const options = b.addOptions();
  options.addOption(bool, "version", optionBun);
  var cmdJs = "npm";
  if (optionBun) cmdJs = "bun";

  const optionWatch = b.option(bool, "watch", "rebuild front-end when files change") orelse false;
  b.addOptions().addOption(bool, "version", optionWatch);

  _ = runInstallDeps(b, cmdJs);
  _ = forceUpdateInstallDeps(b, cmdJs);
  b.getInstallStep().dependOn(buildFrontEnd(b, cmdJs, optionWatch));
  b.getInstallStep().dependOn(buildServer(b, optionWatch));
}

