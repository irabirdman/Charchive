export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout overrides the admin layout for the login page
  // No auth check needed here
  return <>{children}</>
}



