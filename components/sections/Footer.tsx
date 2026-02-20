export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">WizKlub</h3>
            <p className="text-sm">
              Empowering students with STEM skills and critical thinking for a future-ready generation.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-sm">
              <li>Coding & Robotics</li>
              <li>Computational Thinking</li>
              <li>Math & Science</li>
              <li>School Partnerships</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>support@wizklub.com</li>
              <li>+91 XXX XXX XXXX</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© 2024 WizKlub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
