/**
 * Footer Component
 * 
 * Shared footer component used across all pages.
 * Displays professional branding and disclaimer information.
 */
function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground">
        <p>Legal Strategy Council - MongoDB Hackathon Project</p>
        <p className="mt-1">Powered by Groq Llama 3.3 70B & MongoDB Atlas</p>
      </div>
    </footer>
  )
}

export default Footer

