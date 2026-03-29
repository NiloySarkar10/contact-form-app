import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "1s", target: 50 },   // instant spike
    { duration: "1m", target: 50 },   // hold
    { duration: "5s", target: 0 },    // drop
  ],
};

export default function () {
  const url = "http://contact-form-app-2-env.eba-pprh63cf.ap-south-1.elasticbeanstalk.com/api/contact";

  const payload = JSON.stringify({
    name: "Spike User",
    email: "test@example.com",
    message: "Spike load test",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 202": (r) => r.status === 202,
  });
}