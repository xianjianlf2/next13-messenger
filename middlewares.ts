import { signIn } from 'next-auth/react'
import { withAuth } from 'next-auth/middleware'
export default withAuth({
  pages: {
    signIn: '/'
  }
})

export const config = {
  matcher: ['/user/:path*']
}
