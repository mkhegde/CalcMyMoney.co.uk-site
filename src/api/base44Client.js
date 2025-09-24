// Standalone stub so the app builds without Base44's hosted SDK or redirects.
export const base44 = {
  auth: {
    currentUser: null,
    // no-op auth methods
    signIn: async () => null,
    signOut: async () => null,
  },
  functions: {
    // return empty forex map to avoid runtime crashes; update if you need real FX
    getForexRates: async () => ({ base: "GBP", rates: { GBP: 1 } }),
  },
  integrations: {
    Core: {
      // placeholders for previous integrations; do nothing
      InvokeLLM: async () => ({ ok: false }),
      SendEmail: async () => ({ ok: false }),
      UploadFile: async () => ({ ok: false }),
      GenerateImage: async () => ({ ok: false }),
      ExtractDataFromUploadedFile: async () => ({ ok: false }),
      CreateFileSignedUrl: async () => ({ ok: false }),
      UploadPrivateFile: async () => ({ ok: false }),
    },
  },
};
