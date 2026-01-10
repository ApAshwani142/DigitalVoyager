export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: "Invalid email format" };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.includes("..")) {
    return { valid: false, message: "Invalid email format" };
  }

  const parts = trimmedEmail.split("@");
  if (parts.length !== 2) {
    return { valid: false, message: "Invalid email format" };
  }

  const [localPart, domain] = parts;
  
  if (localPart.length === 0 || localPart.length > 64) {
    return { valid: false, message: "Invalid email format" };
  }

  if (domain.length === 0 || !domain.includes(".")) {
    return { valid: false, message: "Invalid email format" };
  }

  const domainParts = domain.split(".");
  if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { valid: false, message: "Invalid email format" };
  }

  return { valid: true, message: "" };
};

export const checkEmailDomain = async (email) => {
  try {
    const domain = email.split("@")[1];
    
    const invalidDomains = [
      "example.com",
      "test.com",
      "invalid.com",
      "fake.com",
      "temp.com"
    ];

    if (invalidDomains.includes(domain.toLowerCase())) {
      return { valid: false, message: "Invalid email domain" };
    }

    return { valid: true, message: "" };
  } catch (error) {
    return { valid: true, message: "" };
  }
};

