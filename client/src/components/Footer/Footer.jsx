export default function Footer (){

    return (
         <footer className="border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500 mb-4 sm:mb-0">Made in India 🇮🇳</p>
          <div className="flex gap-6 text-sm text-neutral-600">
            <p className="text-sm text-neutral-500 mb-4 sm:mb-0">Made and Maintained by <a className="text-yellow-400 font-bold" href="https://www.linkedin.com/in/barathmsindia/"> Barath </a> & <a className="text-yellow-400 font-bold" href="https://www.linkedin.com/in/sagandheesh/"> Gandheesh</a></p>
            <a href="/privacypolicy" target="_blank" className="hover:text-neutral-900 transition-colors">Privacy Policy</a>
            <a href="/termsofservice" target="_blank" className="hover:text-neutral-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    );
}