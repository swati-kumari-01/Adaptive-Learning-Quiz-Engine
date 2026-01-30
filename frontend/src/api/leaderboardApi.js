import api from "./axiosConfig";

export const getLeaderboard = async () => {
  const res = await api.get("/api/dashboard/leaderboard");
  return res.data;
};
