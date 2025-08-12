"use client"

import { useContext, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, ArrowLeft } from "lucide-react"

import * as authService from "@/services/auth/auth.service"
import { toast } from "@/hooks/use-toast"
import { DEMO_USER_LOGIN } from "@/constants/user"
import { setCookie } from "cookies-next"
import { TOKEN } from "@/constants/cookie"
import { UserContext } from "@/contexts/user-context"
import GoogleLoginButton from "@/components/auth/provider/google.login.component"
import { EmailLoginPayload, GoogleOAuthLoginPayload, Provider } from "@/services/auth/auth.service.types"

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const isDevelopment = process.env.NODE_ENV === 'development'
  const userContext = useContext(UserContext)
  // Get return URL from query params, default to home
  const returnUrl = searchParams.get('returnUrl') || '/'
  const sessionId = searchParams.get('sessionId') || undefined

  const handleSignIn = async (provider: Provider, metaData: GoogleOAuthLoginPayload | EmailLoginPayload) => {
    setIsLoading(provider)
    try {
      const { data } = await authService.login({
        provider: provider,
        metaData: { ...metaData, sessionId: sessionId },
      })

      setCookie(TOKEN, JSON.stringify(data.tokens))
      userContext?.setUser(data.user)
      router.push(returnUrl)
    } catch (error : any) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in error",
        description: error.response.data.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/[0.08] px-8 py-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-white/60 hover:text-white/90 hover:bg-white/[0.04] -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white/95">Cursor for Infrastructure</h1>
            <p className="text-sm text-white/60">Sign in to continue</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-semibold text-white/95 mb-2">Welcome back</h2>
            <p className="text-white/60">Sign in to your account to continue building infrastructure</p>
          </div>

          <div className="space-y-4">
            {/* Google Sign In */}
            <GoogleLoginButton handleGoogleSuccess={(metadata : GoogleOAuthLoginPayload) => handleSignIn(Provider.GOOGLE, metadata)} handleGoogleFailure={() => {}} />
            {/* GitHub Sign In */}
            <Button
              onClick={() => console.log("github")}
              disabled={isLoading !== null}
              className="w-full h-12 bg-white/[0.08] text-white hover:bg-white/[0.12] border border-white/[0.12] font-medium text-sm rounded-lg flex items-center justify-center gap-3"
            >
              {isLoading === "github" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              )}
              Continue with GitHub
            </Button>

            {/* Demo User (Development Only) */}
            {isDevelopment && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/[0.08]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0a0a0a] px-2 text-white/40">Development Only</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleSignIn(Provider.EMAIL, {
                    email: DEMO_USER_LOGIN.email,
                    password: DEMO_USER_LOGIN.password,
                  })}
                  disabled={isLoading !== null}
                  className="w-full h-12 bg-white/[0.04] text-white/80 hover:bg-white/[0.08] border border-white/[0.08] font-medium text-sm rounded-lg flex items-center justify-center gap-3"
                >
                  {isLoading === "demo" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                  )}
                  Sign in as Demo User
                </Button>
              </>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/50">
              By signing in, you agree to our{" "}
              <a href="#" className="text-white/70 hover:text-white/90 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-white/70 hover:text-white/90 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignInFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
    </Suspense>
  )
}
