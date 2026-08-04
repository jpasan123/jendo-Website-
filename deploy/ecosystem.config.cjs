module.exports = {
  apps: [
    {
      name: "jendo-landing",
      cwd: __dirname + "/..",
      script: "node_modules/next/dist/bin/next",
      args: "start -p " + (process.env.PORT || 3002),
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3002,
      },
      max_memory_restart: "768M",
    },
  ],
};
