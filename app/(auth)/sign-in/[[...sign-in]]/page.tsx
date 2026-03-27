import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-black text-2xl font-bold">✦</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to NextFlow</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              card: "bg-[#1a1a1a] border border-white/10 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-white/5 border border-white/10 text-white hover:bg-white/10",
              dividerLine: "bg-white/10",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-300",
              formFieldInput:
                "bg-black/40 border-white/10 text-white placeholder-gray-600 focus:border-purple-500",
              formButtonPrimary:
                "bg-purple-600 hover:bg-purple-700 text-white",
              footerActionLink: "text-purple-400 hover:text-purple-300",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-purple-400",
            },
          }}
        />
      </div>
    </div>
  );
}