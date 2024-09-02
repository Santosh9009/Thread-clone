import {
  HeartedIcon,
  SearchIcon,
  ProfileIcon,
  HomeIcon,
} from "../../public/assests/Images";

export const navLinks = [
  {
    label: "Home",
    img: HomeIcon,
    route: "/",
  },
  {
    label: "Search",
    img: SearchIcon,
    route: "/search",
  },
  {
    label: "Activity",
    img: HeartedIcon,
    route: "/activity",
  },
  {
    label: "Profile",
    img: ProfileIcon,
    route: "/profile",
  },
];

export const tabs = [
  { name: "Threads", defaultValue: `No Threads found` },
  { name: "Replies", defaultValue: `No Replies found` },
  { name: "Reposts", defaultValue: `No Reposts found` },
];

export const Peopletabs = [
  { name: "Followers", defaultValue: `No Followers found` },
  { name: "Following", defaultValue: `No Following found` },
];
