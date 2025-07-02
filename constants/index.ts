import add from "@/assets/icons/add.png";
import email from "@/assets/icons/email.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import profile from "@/assets/icons/profile.png";
import check from "@/assets/images/check.png";
import noResult from "@/assets/images/no-result.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import signUpImage from "@/assets/images/signUp.png";
import lock from "@/assets/icons/lock.png";

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  signUpImage,
  check,
  noResult,
};

export const icons = {
  add,
  email,
  google,
  home,
  list,
  out,
  person,
  profile,
  lock,
};

export const onboarding = [
  {
    id: 1,
    title: "Unlock Insights Instantly!",
    description:
      "Start your analytics journey here. Visualize your sales data and make informed decisions effortlessly.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "All Your Metrics in One Place",
    description:
      "Monitor performance, track trends, and discover opportunities with a comprehensive dashboard.",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Drive Growth with Data",
    description:
      "Analyze, strategize, and take action to boost your business using powerful analytics tools.",
    image: images.onboarding3,
  },
];

export const data = {
  onboarding,
};
