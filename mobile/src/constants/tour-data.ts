export interface TourLocation {
  city: string;
  dealer: string;
  venue: string;
  region: "ROS" | "ROSP";
}

export const CITIES_LIST: TourLocation[] = [
  { city: "Usta Muhammad", dealer: "Suzuki Jacobabad Motors", venue: "Grain Market Ground", region: "ROS" },
  { city: "Khairpur", dealer: "Pak Suzuki Sukkur City", venue: "Luqman Ground", region: "ROS" },
  { city: "Jamshoro", dealer: "Hyderabad Highway Motors", venue: "Kotri River Park", region: "ROS" },
  { city: "Umerkot", dealer: "Tharparkar Motors", venue: "Umerkot Bypass Ground", region: "ROS" },
  { city: "Badin", dealer: "Carachi Motors Badin", venue: "Shahnawaz Chowk Arena", region: "ROS" },
  { city: "Tando Muhammad Khan", dealer: "Zeeshan Autos TMK", venue: "TMK Stadium Ground", region: "ROS" },
  { city: "Dadu", dealer: "Mehran Autos Dadu", venue: "Allama Iqbal Park", region: "ROS" },
  { city: "Larkana", dealer: "Chandka Motors Larkana", venue: "VIP Road Pavilion", region: "ROS" },
  { city: "Sukkur", dealer: "Suzuki Sukkur Motors", venue: "Lab-e-Mehran Arena", region: "ROS" },
  { city: "Ghotki", dealer: "Mirpur Mathelo Motors", venue: "Public Stadium Ghotki", region: "ROS" },
  { city: "Rahim Yar Khan", dealer: "Suzuki RYK Motors", venue: "Chowk Bahadur Stadium", region: "ROSP" },
  { city: "Sadiqabad", dealer: "Sadiqabad Motor Works", venue: "Al-Rehman Ground", region: "ROSP" },
  { city: "Khanpur", dealer: "KPS Motors Khanpur", venue: "Grain Market Complex", region: "ROSP" },
  { city: "Bahawalpur", dealer: "Suzuki Bahawalpur Motors", venue: "Dring Stadium Grounds", region: "ROSP" },
  { city: "Lodhran", dealer: "Lodhran City Motors", venue: "Railway Club Ground", region: "ROSP" },
];

export const MARKETING_CHANNELS = [
  "Auto Rickshaw Banner",
  "Street Banner",
  "Facebook",
  "Dealership Calls",
  "Flyer",
  "Recorded Calls",
  "Youtube",
  "Television",
];
