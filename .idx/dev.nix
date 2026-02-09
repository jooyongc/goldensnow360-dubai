# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
    ];
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["bash" "-c" "cd /home/user/goldensnow360-dubai && npm run build && npx serve dist -s -l $PORT"];
          manager = "web";
        };
      };
    };
    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        npm-install = "cd /home/user/goldensnow360-dubai && npm install";
        default.openFiles = [ "src/App.jsx" "src/pages/HomePage.jsx" ];
      };
      # Runs when the workspace is (re)started
      onStart = {};
    };
  };
}
