import LoginPage from "@/components/login-page"

export default async function Home() {
  // For the mock version, we'll always show the login page
  // and let the client-side handle the redirect
  return <LoginPage />
}

