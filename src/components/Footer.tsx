export function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-gray-400">
              © 2025 Showcaise. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <a 
              href="/terms" 
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a 
              href="/privacy" 
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Privacy & Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}