import axios from "axios";

const API = "http://localhost:1235/api/quiz";

export const submitAnswer = async (payload) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `${API}/answer`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};

export const endQuiz = async (attemptId) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `${API}/end?attemptId=${attemptId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
