{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    nixpkgs_unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, nixpkgs_unstable, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import nixpkgs) {
          inherit system;
          overlays = [ (import rust-overlay) ];
        };
        pkgs_unstable = (import nixpkgs_unstable) {
          inherit system;
        };
        rust_toolchain = pkgs.rust-bin.stable.latest;
        rust_targets = [ "wasm32-unknown-unknown" ];
        rust_minimal = rust_toolchain.minimal.override {
          targets = rust_targets;
        };
        nativeBuildInputs = with pkgs; [
          pkg-config
          pkgs_unstable.wasm-pack
          nodePackages.npm
          nodejs
          pkgs_unstable.wasm-bindgen-cli
        ];
        buildInputs = [ pkgs.openssl pkgs.binaryen ];
      in
      rec {
        devShell = pkgs.mkShell {
          inherit buildInputs;
          nativeBuildInputs = nativeBuildInputs ++ [
            (rust_toolchain.default.override {
              extensions = [ "rust-src" "rustfmt" "rust-analyzer" "clippy" ];
              targets = rust_targets;
            })
          ];
          WASM_PACK_PATH = "${pkgs_unstable.wasm-pack}/bin/wasm-pack";
        };
      }
    );
}
