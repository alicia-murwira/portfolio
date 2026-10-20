from pathlib import Path
p = Path(__file__).parent / "dist" / "index.html"
text = p.read_text(encoding="utf-8")
for old, new in {
    "Your Name": "Alicia",
    "[your professional title]": "software developer",
    "[what you do and who you help]": "building thoughtful digital experiences for businesses",
    "Based in [your city], creating with purpose.": "Let’s bring your next project to life.",
    "I turn ideas into": "I turn your ideas into",
    "meaningful work.</span>": "digital experiences.</span>",
    "A LITTLE INTRODUCTION": "SOFTWARE DEVELOPER · FREELANCE PROJECTS",
    "Have something": "Have a project",
}.items():
    text = text.replace(old, new)
p.write_text(text, encoding="utf-8")
