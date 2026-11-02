// ============================================================
// * SITE INFO: the one place for contact details and social links
// * Header, Footer and the Contact page all read from here.
// ============================================================

export const site = {
  // ! Check the spelling of the domain email
  email: "info@storyfellafilms.com",
  // ? Gmail still works for now. Use it as `email` until the domain email is set up and tested
  emailFallback: "storyfellafilms@gmail.com",

  phone: "+16047677892",
  phoneDisplay: "+1 (604) 767-7892",

  // ? No address on purpose. The Contact page shows no studio row

  instagram: { handle: "storyfellas_", url: "https://www.instagram.com/storyfellas_" },
  facebook: { url: "https://www.facebook.com/share/1GNSA6uBof/" },
  youtube: { url: "https://www.youtube.com/@Storyfellafilms" },
} as const;