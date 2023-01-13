{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.11";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import nixpkgs) {
          inherit system;
          overlays = [ (import rust-overlay) ];
        };
        rust_toolchain = pkgs.rust-bin.stable.latest;
        rust_targets = [ "wasm32-unknown-unknown" ];
        rust_minimal = rust_toolchain.minimal.override {
          targets = rust_targets;
        };
        nativeBuildInputs = [ pkgs.pkg-config pkgs.wasm-pack pkgs.nodePackages.npm pkgs.nodejs ];
        buildInputs = [ pkgs.openssl pkgs.binaryen ];
      in
      rec {
        devShell = pkgs.mkShell {
          inherit buildInputs;
          nativeBuildInputs = nativeBuildInputs ++ [
            (rust_toolchain.default.override {
              extensions = [ "rust-src" "rustfmt" "rls" "clippy" ];
              targets = rust_targets;
            })
          ];
        };
      }
    );
}
