module.exports = {
  expo: {
    ...require("./app.json").expo,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333/api",
    },
  },
};
