import { Funnel_Display } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata = {
  title: 'Insights & Ideas — Modern Blog Platform',
  description: 'Discover thoughtful articles on technology, lifestyle, business, travel, health, and education. Join our community of readers exploring ideas that shape our world.'
}

const funnel = Funnel_Display({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --background: 0 0% 2%;
              --foreground: 0 0% 98%;
              --card: 0 0% 4%;
              --card-foreground: 0 0% 98%;
              --primary: 217 91% 60%;
              --primary-foreground: 0 0% 100%;
              --secondary: 0 0% 8%;
              --secondary-foreground: 0 0% 98%;
              --muted: 0 0% 12%;
              --muted-foreground: 0 0% 60%;
              --accent: 217 91% 60%;
              --accent-foreground: 0 0% 100%;
              --destructive: 0 84% 60%;
              --destructive-foreground: 0 0% 100%;
              --border: 0 0% 15%;
              --input: 0 0% 15%;
              --ring: 217 91% 60%;
              --radius: 0.75rem;
            }
            * {
              box-sizing: border-box;
            }
            html, body {
              margin: 0;
              padding: 0;
              min-height: 100vh;
              background-color: hsl(0 0% 2%);
              color: hsl(0 0% 98%);
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            body {
              background-color: hsl(0 0% 2%);
              color: hsl(0 0% 98%);
            }
          `
        }} />
      </head>
      <body className={`${funnel.className} antialiased bg-background text-foreground`} suppressHydrationWarning={true}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}



