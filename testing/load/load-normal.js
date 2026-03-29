import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "1m",
};

export default function () {
  const url = "http://contact-form-app-2-env.eba-pprh63cf.ap-south-1.elasticbeanstalk.com/api/contact";

  const payload = JSON.stringify({
    name: "Normal User",
    email: "test@example.com",
    message: "Normal load test",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 202": (r) => r.status === 202,
  });

  sleep(1);
}