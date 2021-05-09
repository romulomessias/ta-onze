const suffix =
    process.env.NODE_ENV !== "production" ? `-${process.env.NODE_ENV}` : "";

export const tokenKey = "playOnze" + suffix;
export const refreshTokenKey = "replayPlayOnze" + suffix;
export const currentSprintKey = "currentSprint" + suffix;
