module.exports = {
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "blip2",
          name: "picoencoders",
        },
      },
    },
  ],
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      config: {},
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {},
    },
  ],
};
