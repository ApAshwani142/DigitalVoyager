export const hardcodedServices = [
  {
    _id: "60d5ec49f85e4d2d4c88e7d1",
    name: "Digital Evidence Recovery",
    description: "We specialize in recovering digital evidence from various devices, including computers, mobile phones, and storage media. Our expert team uses cutting-edge tools and methodologies to extract, analyze, and preserve digital evidence in a forensically sound manner.",
    price: 2500,
    images: [],
    features: ["Device Recovery", "Data Extraction", "Evidence Preservation", "Chain of Custody"],
    popular: true,
  },
  {
    _id: "60d5ec49f85e4d2d4c88e7d2",
    name: "Cybersecurity Investigations",
    description: "Our team conducts thorough investigations to identify and mitigate cybersecurity threats and breaches. We provide comprehensive analysis of security incidents, threat assessment, and actionable recommendations to strengthen your defenses.",
    price: 5000,
    images: [],
    features: ["Threat Analysis", "Breach Investigation", "Vulnerability Assessment", "Security Recommendations"],
    popular: false,
  },
  {
    _id: "60d5ec49f85e4d2d4c88e7d3",
    name: "Data Analysis and Reporting",
    description: "We provide detailed analysis and comprehensive reports that are admissible in court. Our forensic experts analyze digital evidence, create detailed timelines, and produce professional reports that meet legal standards.",
    price: 3000,
    images: [],
    features: ["Forensic Analysis", "Timeline Creation", "Court-Ready Reports", "Expert Documentation"],
    popular: false,
  },
  {
    _id: "60d5ec49f85e4d2d4c88e7d4",
    name: "Expert Testimony",
    description: "Our forensic experts are available to provide expert testimony and consultations for legal proceedings. We help legal teams understand complex digital evidence and present findings clearly in court.",
    price: 4000,
    images: [],
    features: ["Court Testimony", "Expert Consultation", "Evidence Explanation", "Legal Support"],
    popular: false,
  },
];

export const isHardcodedService = (id) => {
  return hardcodedServices.some(service => service._id === id);
};

export const getHardcodedService = (id) => {
  return hardcodedServices.find(service => service._id === id);
};

